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

const REQUIRED_FIELDS = ["nombre", "empresa", "cargo", "email", "telefono", "ubicacion", "servicio", "inquietud"];
const FIELD_LABELS = {
  nombre: "Nombre",
  empresa: "Empresa",
  cargo: "Cargo",
  email: "Email",
  telefono: "Telefono / WhatsApp",
  ubicacion: "Pais / ciudad",
  servicio: "Servicio de interes",
  inquietud: "Inquietud o necesidad"
};

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

function loadPortfolioContext() {
  const filePath = path.join(__dirname, "portfolio_text.txt");
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf8").slice(0, 45000);
}

function missingLeadFields(lead) {
  return REQUIRED_FIELDS.filter((key) => !String(lead[key] || "").trim());
}

function safeJsonParse(text) {
  const cleaned = String(text || "")
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  return JSON.parse(cleaned);
}

function leadEmailText(lead) {
  return [
    "Nuevo lead capturado desde el bot de Baker Tilly Colombia.",
    "",
    `Nombre: ${lead.nombre || ""}`,
    `Empresa: ${lead.empresa || ""}`,
    `Cargo: ${lead.cargo || ""}`,
    `Email: ${lead.email || ""}`,
    `Telefono / WhatsApp: ${lead.telefono || ""}`,
    `Pais / ciudad: ${lead.ubicacion || ""}`,
    `Servicio de interes: ${lead.servicio || ""}`,
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

async function converseWithOpenAI({ message, lead, history }) {
  if (!OPENAI_API_KEY) return null;

  const currentLead = lead || {};
  const portfolioContext = OPENAI_VECTOR_STORE_ID ? "" : loadPortfolioContext();
  const tools = OPENAI_VECTOR_STORE_ID
    ? [{ type: "file_search", vector_store_ids: [OPENAI_VECTOR_STORE_ID] }]
    : undefined;

  const conversation = Array.isArray(history)
    ? history.slice(-8).map((item) => `${item.role}: ${item.content}`).join("\n")
    : "";

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
        "Responde en espanol con tono corporativo, claro, consultivo y natural.",
        "Tu objetivo es conversar, orientar sobre servicios y captar clientes potenciales.",
        "Extrae datos aunque el usuario los entregue en frases naturales y conserva los datos ya conocidos.",
        "Debes recopilar estos campos: nombre, empresa, cargo, email, telefono, ubicacion, servicio, inquietud.",
        "Pregunta maximo dos datos faltantes por turno para que la conversacion no se sienta como formulario.",
        "Usa el portafolio de servicios como fuente principal para hablar de Baker Tilly Colombia.",
        "No inventes precios, promesas, tiempos ni condiciones no presentes en la informacion disponible.",
        "Cuando el caso requiera asesoria comercial o tecnica, ofrece canalizarlo con un asesor.",
        "Devuelve unicamente JSON valido sin markdown.",
        "Estructura exacta: {\"answer\":\"mensaje para el usuario\",\"lead\":{\"nombre\":\"\",\"empresa\":\"\",\"cargo\":\"\",\"email\":\"\",\"telefono\":\"\",\"ubicacion\":\"\",\"servicio\":\"\",\"inquietud\":\"\"},\"missingFields\":[\"campo\"],\"completed\":false}.",
        "En lead incluye solo campos conocidos o inferidos con confianza; no inventes datos personales.",
        "completed debe ser true solo cuando esten completos todos los campos requeridos."
      ].join(" "),
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: [
                portfolioContext ? `Portafolio de servicios:\n${portfolioContext}` : "",
                conversation ? `Conversacion reciente:\n${conversation}` : "",
                `Datos actuales del lead: ${JSON.stringify(currentLead)}`,
                `Campos requeridos: ${REQUIRED_FIELDS.map((key) => `${key} (${FIELD_LABELS[key]})`).join(", ")}`,
                `Mensaje del usuario: ${message}`
              ].filter(Boolean).join("\n\n")
            }
          ]
        }
      ],
      ...(tools ? { tools } : {})
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const parsed = safeJsonParse(data.output_text || "{}");
  const mergedLead = { ...currentLead, ...(parsed.lead || {}) };
  const missingFields = missingLeadFields(mergedLead);

  return {
    answer: parsed.answer || "Gracias. Para continuar, por favor comparteme un poco mas de informacion sobre tu necesidad.",
    lead: mergedLead,
    missingFields,
    completed: missingFields.length === 0
  };
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
      const missing = missingLeadFields(lead);
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
      const result = await converseWithOpenAI({
        message: body.message || "",
        lead: body.lead || {},
        history: body.history || []
      });
      if (!result) {
        send(res, 503, JSON.stringify({ ok: false, error: "OpenAI no configurado" }), { "Content-Type": "application/json" });
        return;
      }
      send(res, 200, JSON.stringify({ ok: true, ...result }), { "Content-Type": "application/json" });
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
