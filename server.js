const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 3000);
const LEADS_EMAIL = process.env.LEADS_EMAIL || "dtnieto@bakertilly.co";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "Bot Baker Tilly <onboarding@resend.dev>";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_VECTOR_STORE_ID = process.env.OPENAI_VECTOR_STORE_ID || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

const publicFiles = {
  "/": "index.html",
  "/index.html": "index.html",
  "/styles.css": "styles.css",
  "/app.js": "app.js"
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) req.destroy();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function leadEmailText(lead) {
  return [
    "Nuevo lead capturado desde el bot de Baker Tilly Colombia.",
    "",
    `Nombre: ${lead.nombre || ""}`,
    `Empresa: ${lead.empresa || ""}`,
    `Cargo: ${lead.cargo || ""}`,
    `Email: ${lead.email || ""}`,
    `Teléfono / WhatsApp: ${lead.telefono || ""}`,
    `País / ciudad: ${lead.ubicacion || ""}`,
    `Servicio de interés: ${lead.servicio || ""}`,
    `Inquietud o necesidad: ${lead.inquietud || ""}`,
    "",
    `Fecha: ${lead.createdAt || new Date().toISOString()}`
  ].join("\n");
}

async function sendLeadEmail(lead) {
  if (!RESEND_API_KEY) return { skipped: true };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [LEADS_EMAIL],
      subject: `Nuevo lead Baker Tilly Colombia - ${lead.empresa || lead.nombre || "Sin nombre"}`,
      text: leadEmailText(lead)
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend error ${response.status}: ${text}`);
  }

  return response.json();
}

async function answerWithOpenAI(message, lead) {
  if (!OPENAI_API_KEY || !OPENAI_VECTOR_STORE_ID) {
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      instructions: [
        "Eres el asistente corporativo de Baker Tilly Colombia.",
        "Responde en español, con tono corporativo, claro y consultivo.",
        "Usa el portafolio de servicios como fuente principal.",
        "No inventes precios, promesas, tiempos ni condiciones no presentes en la información disponible.",
        "Cuando el caso requiera asesoría comercial o técnica, solicita continuar el contacto con un asesor.",
        "Si falta información documental, dilo con prudencia y ofrece canalizar el requerimiento."
      ].join(" "),
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Datos del lead: ${JSON.stringify(lead)}\n\nPregunta o inquietud: ${message}`
            }
          ]
        }
      ],
      tools: [
        {
          type: "file_search",
          vector_store_ids: [OPENAI_VECTOR_STORE_ID]
        }
      ]
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI error ${response.status}: ${text}`);
  }

  const data = await response.json();
  return data.output_text || null;
}

function saveLead(lead) {
  const dataDir = path.join(__dirname, "data");
  const filePath = path.join(dataDir, "leads.json");
  fs.mkdirSync(dataDir, { recursive: true });
  const existing = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, "utf8")) : [];
  existing.push(lead);
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
}

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/api/leads") {
    try {
      const lead = await readJson(req);
      const required = ["nombre", "empresa", "cargo", "email", "telefono", "ubicacion", "servicio", "inquietud"];
      const missing = required.filter((key) => !String(lead[key] || "").trim());
      if (missing.length) {
        send(res, 400, JSON.stringify({ ok: false, missing }), { "Content-Type": "application/json" });
        return;
      }

      const savedLead = { ...lead, createdAt: lead.createdAt || new Date().toISOString() };
      saveLead(savedLead);
      const email = await sendLeadEmail(savedLead);
      send(res, 200, JSON.stringify({ ok: true, email }), { "Content-Type": "application/json" });
    } catch (error) {
      send(res, 500, JSON.stringify({ ok: false, error: error.message }), { "Content-Type": "application/json" });
    }
    return;
  }

  if (req.method === "POST" && req.url === "/api/chat") {
    try {
      const body = await readJson(req);
      const answer = await answerWithOpenAI(body.message || "", body.lead || {});
      if (!answer) {
        send(res, 503, JSON.stringify({ ok: false, error: "OpenAI no configurado" }), { "Content-Type": "application/json" });
        return;
      }
      send(res, 200, JSON.stringify({ ok: true, answer }), { "Content-Type": "application/json" });
    } catch (error) {
      send(res, 500, JSON.stringify({ ok: false, error: error.message }), { "Content-Type": "application/json" });
    }
    return;
  }

  if (req.method === "GET" && publicFiles[req.url]) {
    const filePath = path.join(__dirname, publicFiles[req.url]);
    const ext = path.extname(filePath);
    const type = ext === ".css" ? "text/css" : ext === ".js" ? "text/javascript" : "text/html";
    send(res, 200, fs.readFileSync(filePath), { "Content-Type": `${type}; charset=utf-8` });
    return;
  }

  send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
});

server.listen(PORT, () => {
  console.log(`Bot Baker Tilly disponible en http://localhost:${PORT}`);
});
