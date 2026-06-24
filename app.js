const leadFields = [
  { key: "nombre", label: "Nombre", prompt: "Para iniciar, por favor indícame tu nombre completo." },
  { key: "empresa", label: "Empresa", prompt: "Gracias. ¿Cuál es el nombre de tu empresa?" },
  { key: "cargo", label: "Cargo", prompt: "¿Qué cargo ocupas actualmente?" },
  { key: "email", label: "Email", prompt: "¿Cuál es tu correo corporativo?" },
  { key: "telefono", label: "Teléfono / WhatsApp", prompt: "¿A qué teléfono o WhatsApp podemos contactarte?" },
  { key: "ubicacion", label: "País / ciudad", prompt: "¿En qué país y ciudad se encuentra tu empresa o necesidad?" },
  { key: "servicio", label: "Servicio de interés", prompt: "¿Sobre qué servicio de Baker Tilly Colombia deseas orientación?" },
  { key: "inquietud", label: "Inquietud o necesidad", prompt: "Cuéntame brevemente tu inquietud, necesidad o situación actual." }
];

const serviceKnowledge = [
  {
    name: "Auditoría y Aseguramiento",
    keywords: ["auditoria", "auditoría", "aseguramiento", "revisoria", "revisoría", "fiscal", "control", "externa", "interna", "legal", "salud", "la/ft"],
    summary: "Baker Tilly brinda confiabilidad y seguridad en la información para la toma de decisiones y el cumplimiento de objetivos empresariales, bajo normas internacionales de aseguramiento y estándares rigurosos de calidad.",
    services: ["Revisoría Fiscal", "Auditoría Externa", "Auditoría Interna", "Auditoría Digital", "Auditorías Especiales", "Auditoría Legal", "Auditoría en Salud", "Procedimientos Previamente Acordados", "Auditoría de Sistemas de Administración de Riesgos LA/FT"]
  },
  {
    name: "Outsourcing Contable",
    keywords: ["outsourcing", "contable", "administrativo", "nomina", "nómina", "recursos humanos", "sg-sst", "laboral", "niif"],
    summary: "Los servicios de Outsourcing permiten administrar funciones de back office para incrementar la eficiencia operativa y la rentabilidad del negocio, con equipos especializados por sector.",
    services: ["Outsourcing Contable", "Outsourcing Administrativo", "Outsourcing de Recursos Humanos", "Administración de Recursos Humanos", "Liquidación de Nómina y Seguridad Social", "Relaciones Laborales y Movilidad Global", "Diseño e implementación SG-SST", "NIIF"]
  },
  {
    name: "Consultoría de Negocios",
    keywords: ["consultoria", "consultoría", "grc", "gobierno", "riesgo", "cumplimiento", "procesos", "automatizacion", "automatización", "ia", "inteligencia artificial", "tecnologia", "tecnología"],
    summary: "La práctica de Consultoría de Negocios presta servicios de alto valor agregado en Gobierno, Riesgo y Cumplimiento, apoyada en metodología GRCMaX para diagnosticar madurez y desarrollar planes de optimización.",
    services: ["Modelos integrados de GRC", "Arquitectura Empresarial", "Gobierno Corporativo", "Alineación Estratégica", "Procesos y automatización", "Gestión integral de riesgos y controles", "Cumplimiento normativo", "Aseguramiento de tecnología", "Auditoría Interna enfocada en resultados", "Sostenibilidad", "Inteligencia Artificial"]
  },
  {
    name: "Sostenibilidad",
    keywords: ["sostenibilidad", "esg", "ambiental", "social", "gobernanza", "climatico", "climático", "materialidad", "reporte"],
    summary: "La línea de Sostenibilidad integra conocimiento y metodologías ESG para ayudar a las organizaciones a mejorar su desempeño, mitigar riesgos climáticos y regulatorios, y fortalecer su reputación.",
    services: ["Aseguramiento a informes de sostenibilidad", "Diagnóstico ESG", "Gestión de procesos y controles de datos ESG", "Integración de Auditoría Interna en ESG", "Capacitación ESG", "Estrategia de sostenibilidad", "Materialidad ESG", "Evaluación de riesgos ESG"]
  },
  {
    name: "Servicios Tributarios",
    keywords: ["tributario", "tributaria", "impuestos", "tax", "renta", "medios magneticos", "medios magnéticos", "transferencia", "controversia"],
    summary: "Baker Tilly Tax provee soluciones integrales para cumplimiento, optimización y mejoramiento de cargas tributarias según el negocio del cliente.",
    services: ["Consultoría Tributaria Nacional e Internacional", "Estructuración Tributaria", "Outsourcing Tributario", "Auditoría Tributaria", "Precios de Transferencia", "Declaración de renta", "Información exógena", "Controversia tributaria"]
  },
  {
    name: "Servicios Legales",
    keywords: ["legal", "legales", "societario", "contratos", "laboral", "migratorio", "inmobiliario", "liquidacion", "liquidación"],
    summary: "Baker Tilly Colombia Legal Services Ltda. presta asesoría y consultoría legal para operaciones empresariales dentro de marcos legales adecuados.",
    services: ["Derecho societario", "Contratos", "Derecho laboral", "Migratorio", "Propiedad inmobiliaria", "Liquidación voluntaria", "Auditorías legales, societarias e inmobiliarias"]
  },
  {
    name: "Prevención de Lavado de Activos y Auditoría Forense",
    keywords: ["lavado", "activos", "pla", "sagrilaft", "sarlaft", "financiero", "forense", "fraude", "riesgos"],
    summary: "Baker Tilly P.L.A. reúne profesionales especializados para apoyar a empresas nacionales e internacionales en prevención de lavado de activos y mitigación de riesgos asociados a delitos financieros.",
    services: ["Implementación SAGRILAFT y SARLAFT", "Auditorías a sistemas de prevención de riesgos", "Matrices de riesgos y controles", "Manuales y procedimientos", "Capacitaciones", "Auditoría Forense"]
  },
  {
    name: "Consultoría en Salud",
    keywords: ["salud", "ips", "eps", "habilitacion", "habilitación", "sar", "datos", "tecnologia salud"],
    summary: "La práctica de Salud ofrece servicios especializados de alto impacto para entidades del sector, buscando eficiencia, competitividad y minimización de riesgos.",
    services: ["Asesoría en habilitación de servicios de salud", "Sistema de Administración de Riesgos", "Auditoría y modelos de control", "Tecnología en salud y análisis de datos", "Enfoque estratégico e innovador en servicios de salud"]
  },
  {
    name: "Finanzas Corporativas y Valoración",
    keywords: ["valoracion", "valoración", "finanzas", "banca", "inversion", "inversión", "intangibles", "niif", "us gaap", "actuarial"],
    summary: "Baker Tilly Value apoya a empresarios en valoración, banca de inversión y reportes financieros, incluyendo NIIF y US GAAP.",
    services: ["Banca de Inversión", "Valoración de empresas", "Valoración de intangibles", "Valoración para reportes financieros NIIF", "Conversiones a NIIF & US GAAP", "Cálculos actuariales"]
  },
  {
    name: "Empresa Familiar y Patrimonio",
    keywords: ["familia", "familiar", "patrimonio", "sucesion", "sucesión", "holding", "protocolo", "planeacion", "planeación"],
    summary: "Baker Tilly acompaña a familias empresarias en la estructuración, gobierno y sostenibilidad del patrimonio familiar.",
    services: ["Estructuración patrimonial y legal", "Planeación tributaria patrimonial", "Gobierno familiar", "Protocolos de familia", "Sucesión y continuidad empresarial"]
  },
  {
    name: "Consultoría en Desarrollo Corporativo",
    keywords: ["desarrollo corporativo", "estrategia", "crecimiento", "transformacion", "transformación", "organizacion", "organización", "modelo operativo"],
    summary: "La consultoría en Desarrollo Corporativo se enfoca en alcanzar sostenibilidad empresarial mediante análisis, estrategia y fortalecimiento organizacional.",
    services: ["Diagnóstico empresarial", "Estrategia corporativa", "Modelos operativos", "Fortalecimiento organizacional", "Planes de transformación y crecimiento"]
  }
];

const state = {
  lead: {},
  fieldIndex: 0,
  completed: false,
  history: [],
  leadSubmitted: false
};

const messages = document.querySelector("#messages");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const leadSummary = document.querySelector("#leadSummary");
const resetButton = document.querySelector("#resetButton");
const emailButton = document.querySelector("#emailButton");
const downloadButton = document.querySelector("#downloadButton");

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function addMessage(role, text) {
  const node = document.createElement("div");
  node.className = `message ${role}`;
  node.textContent = text;
  messages.appendChild(node);
  messages.scrollTop = messages.scrollHeight;
}

function renderLead() {
  leadSummary.innerHTML = "";
  leadFields.forEach((field) => {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const desc = document.createElement("dd");
    term.textContent = field.label;
    desc.textContent = state.lead[field.key] || "Pendiente";
    row.append(term, desc);
    leadSummary.appendChild(row);
  });
}

function persistLead() {
  renderLead();
}

function nextMissingField() {
  return leadFields.findIndex((field) => !state.lead[field.key]);
}

function validateField(key, value) {
  if (key === "email") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  if (key === "telefono") {
    return value.replace(/\D/g, "").length >= 7;
  }
  return value.trim().length >= 2;
}

function cleanValue(value) {
  return String(value || "")
    .replace(/^[\s,.:;-]+|[\s,.:;-]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCaseName(value) {
  return cleanValue(value)
    .split(/\s+/)
    .map((word) => word.length > 2 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word)
    .join(" ");
}

function extractWithPatterns(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) return cleanValue(match[1]);
  }
  return "";
}

function stopAtNextField(value) {
  return cleanValue(value.split(/\b(?:mi correo|correo|email|e-mail|telefono|teléfono|whatsapp|celular|empresa|compania|compañia|compañía|cargo|ciudad|pais|país|servicio|necesito|busco|quiero|requiero|inquietud)\b/i)[0]);
}

function looksLikeName(value) {
  const cleaned = cleanValue(value);
  const normalized = normalize(cleaned);
  if (!cleaned || cleaned.length > 60) return false;
  if (/[?@]|\d/.test(cleaned)) return false;
  if (/\b(necesito|quiero|busco|requiero|servicio|auditoria|auditoría|tributario|legal|outsourcing|consultoria|consultoría|correo|telefono|teléfono|whatsapp|empresa|cargo|ciudad|pais|país|gerente|director|jefe|contador|abogado|socio|consultor|analista|coordinador|administrador|presidente)\b/i.test(cleaned)) return false;
  return normalized.split(/\s+/).filter(Boolean).length <= 5;
}

function extractLeadData(text, preferredKey) {
  const raw = cleanValue(text);
  const normalized = normalize(raw);
  const data = {};
  const email = raw.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phone = raw.match(/(?:\+?\d[\d\s().-]{6,}\d)/);
  const service = bestServiceMatch(raw);

  if (email) data.email = email[0];
  if (phone) data.telefono = cleanValue(phone[0]);
  if (service && !normalized.includes("no se") && !normalized.includes("no estoy seguro")) {
    data.servicio = service.name;
  }

  const name = extractWithPatterns(raw, [
    /\b(?:me llamo|mi nombre es)\s+([^,.;\n]+?)(?=\s+(?:y|de|en|mi|trabajo|laboro|correo|email|telefono|teléfono|whatsapp|necesito|busco|quiero|requiero)\b|[,.;\n]|$)/i
  ]);
  if (name) data.nombre = titleCaseName(name);

  const company = extractWithPatterns(raw, [
    /\b(?:empresa es|compania es|compañia es|compañía es|trabajo en|laboro en|represento a|soy de)\s+([^,.;\n]+?)(?=\s+(?:y|como|mi|correo|email|telefono|teléfono|whatsapp|necesito|busco|quiero|requiero)\b|[,.;\n]|$)/i,
    /\b(?:empresa|compania|compañia|compañía):\s*([^,.;\n]+)/i
  ]);
  if (company) data.empresa = stopAtNextField(company);

  const role = extractWithPatterns(raw, [
    /\b(?:mi cargo es|cargo es|soy el|soy la)\s+([^,.;\n]+?)(?=\s+(?:de|en|para|y mi|mi correo|correo|email|telefono|teléfono|whatsapp|necesito|busco|quiero|requiero)\b|[,.;\n]|$)/i,
    /\b(?:cargo):\s*([^,.;\n]+)/i
  ]);
  if (role) data.cargo = stopAtNextField(role);

  const location = extractWithPatterns(raw, [
    /\b(?:estoy en|ubicado en|ubicada en|ciudad es|pais es|país es|en la ciudad de|desde)\s+([^,.;\n]+?)(?=\s+(?:y|mi|correo|email|telefono|teléfono|whatsapp|servicio|necesito|busco|quiero|requiero)\b|[,.;\n]|$)/i,
    /\b(?:pais\/ciudad|país\/ciudad|ubicacion|ubicación|ciudad):\s*([^,.;\n]+)/i
  ]);
  if (location) data.ubicacion = stopAtNextField(location);

  const need = extractWithPatterns(raw, [
    /\b(?:necesito|busco|quiero|me interesa|quisiera|requiero|mi inquietud es|la inquietud es)\s+(.+)$/i
  ]);
  if (need) data.inquietud = cleanValue(need);

  if (preferredKey && !data[preferredKey]) {
    if (preferredKey === "nombre") {
      const possibleName = raw.replace(/^(me llamo|mi nombre es|soy)\s+/i, "");
      if (looksLikeName(possibleName)) data.nombre = titleCaseName(possibleName);
    }
    if (preferredKey === "empresa") data.empresa = stopAtNextField(raw.replace(/^(mi empresa es|empresa es|trabajo en|laboro en|represento a)\s+/i, ""));
    if (preferredKey === "cargo") data.cargo = stopAtNextField(raw.replace(/^(mi cargo es|cargo es|soy el|soy la|soy)\s+/i, ""));
    if (preferredKey === "email" && email) data.email = email[0];
    if (preferredKey === "telefono" && phone) data.telefono = cleanValue(phone[0]);
    if (preferredKey === "ubicacion") data.ubicacion = stopAtNextField(raw.replace(/^(estoy en|ubicado en|ubicada en|ciudad es|pais es|país es|desde)\s+/i, ""));
    if (preferredKey === "servicio") data.servicio = service ? service.name : raw;
    if (preferredKey === "inquietud") data.inquietud = raw;
  }

  return Object.fromEntries(Object.entries(data).filter(([, value]) => cleanValue(value).length > 0));
}

function mergeExtractedLead(extracted) {
  let changed = false;
  for (const field of leadFields) {
    const value = extracted[field.key];
    if (value && validateField(field.key, value)) {
      state.lead[field.key] = value;
      changed = true;
    }
  }
  if (changed) persistLead();
  return changed;
}

function missingFieldsText() {
  return leadFields
    .filter((field) => !state.lead[field.key])
    .map((field) => field.label)
    .join(", ");
}

function bestServiceMatch(text) {
  const query = normalize(text);
  const ranked = serviceKnowledge
    .map((service) => {
      const score = service.keywords.reduce((total, keyword) => {
        return total + (query.includes(normalize(keyword)) ? 1 : 0);
      }, 0);
      return { service, score };
    })
    .sort((a, b) => b.score - a.score);
  return ranked[0].score > 0 ? ranked[0].service : null;
}

function serviceList() {
  return serviceKnowledge.map((service) => `• ${service.name}`).join("\n");
}

function localAnswerQuestion(text) {
  const match = bestServiceMatch(`${text} ${state.lead.servicio || ""} ${state.lead.inquietud || ""}`);
  if (!match) {
    return "Con base en el portafolio, puedo orientarte en estas líneas de servicio:\n\n" + serviceList() + "\n\nSi tu inquietud corresponde a una de estas áreas, indícame cuál y te doy una respuesta más precisa. Si se requiere detalle comercial, dejaré el caso listo para contacto por un asesor.";
  }

  return `${match.name}\n\n${match.summary}\n\nServicios relacionados:\n${match.services.map((item) => `• ${item}`).join("\n")}\n\nCon la información registrada, el equipo comercial puede revisar tu caso y contactarte para profundizar en alcance, tiempos y propuesta.`;
}

async function answerQuestion(text) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, lead: state.lead })
    });
    if (response.ok) {
      const data = await response.json();
      if (data.answer) return data.answer;
    }
  } catch (error) {
    // Static demos and local file previews do not have a backend.
  }

  return localAnswerQuestion(text);
}

async function chatWithAI(text) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        lead: state.lead,
        history: state.history.slice(-8)
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      addMessage("bot", error.error || "No pude conectar con el motor de IA. Revisa que OPENAI_API_KEY este configurada en Render y vuelve a desplegar.");
      return true;
    }
    const data = await response.json();
    if (!data.answer) {
      addMessage("bot", "La IA no devolvio una respuesta valida. Intenta de nuevo en unos segundos.");
      return true;
    }

    state.lead = { ...state.lead, ...(data.lead || {}) };
    state.fieldIndex = nextMissingField();
    state.completed = Boolean(data.completed) || state.fieldIndex === -1;
    persistLead();

    state.history.push({ role: "user", content: text });
    state.history.push({ role: "assistant", content: data.answer });
    addMessage("bot", data.answer);

    if (state.completed && !state.leadSubmitted) {
      const saved = await submitLeadToServer();
      state.leadSubmitted = saved;
      if (saved) {
        addMessage("bot", "He enviado tus datos al equipo de Baker Tilly Colombia para seguimiento.");
      }
    }

    return true;
  } catch (error) {
    addMessage("bot", "No pude conectar con el motor de IA. Si estas en Render, revisa el deploy y las variables de entorno.");
    return true;
  }
}

async function submitLeadToServer() {
  const payload = {
    ...state.lead,
    source: "Bot Baker Tilly Colombia",
    createdAt: new Date().toISOString()
  };

  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function finishLead() {
  state.completed = true;
  persistLead();
  const saved = await submitLeadToServer();
  const intro = saved
    ? "He registrado tus datos y la inquietud para seguimiento."
    : "Ya tengo los datos principales. En esta versión local puedo preparar el correo de seguimiento; en hosting con backend se enviará automáticamente.";
  const answer = await answerQuestion(state.lead.inquietud);
  addMessage("bot", `${intro}\n\n${answer}\n\nPuedes seguir preguntando sobre los servicios del portafolio.`);
}

async function handleFieldAnswer(value) {
  const field = leadFields[state.fieldIndex];
  const extracted = extractLeadData(value, field.key);
  mergeExtractedLead(extracted);
  state.fieldIndex = nextMissingField();

  if (state.fieldIndex === -1) {
    finishLead();
    return;
  }

  if (!extracted[field.key] && !state.lead[field.key]) {
    if (extracted.servicio || extracted.inquietud) {
      const answer = await answerQuestion(value);
      addMessage("bot", answer);
    }
    addMessage("bot", field.key === "email" ? "Por favor ingresa un correo válido para continuar." : "Para canalizar tu solicitud con el equipo adecuado, necesito completar primero este dato.");
    addMessage("bot", field.prompt);
    return;
  }

  addMessage("bot", `Gracias, he actualizado los datos detectados. Aún necesito: ${missingFieldsText()}.`);
  addMessage("bot", leadFields[state.fieldIndex].prompt);
}

function composeEmailBody() {
  return leadFields.map((field) => `${field.label}: ${state.lead[field.key] || ""}`).join("\n");
}

function prepareEmail() {
  const subject = encodeURIComponent(`Nuevo lead Baker Tilly Colombia - ${state.lead.empresa || state.lead.nombre || "Sin nombre"}`);
  const body = encodeURIComponent(`${composeEmailBody()}\n\nFuente: Bot de captación Baker Tilly Colombia\nFecha: ${new Date().toLocaleString("es-CO")}`);
  window.location.href = `mailto:dtnieto@bakertilly.co?subject=${subject}&body=${body}`;
}

function downloadLead() {
  const blob = new Blob([JSON.stringify(state.lead, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `lead-baker-tilly-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = chatInput.value.trim();
  if (!value) return;
  addMessage("user", value);
  chatInput.value = "";

  chatWithAI(value);
});

resetButton.addEventListener("click", () => {
  state.lead = {};
  state.fieldIndex = 0;
  state.completed = false;
  state.history = [];
  state.leadSubmitted = false;
  messages.innerHTML = "";
  renderLead();
  addMessage("bot", "Hola, soy el asistente virtual Bety de Baker Tilly Colombia. Cuéntame qué necesitas y, mientras conversamos, tomaré los datos necesarios para que un asesor pueda dar seguimiento.");
});

emailButton.addEventListener("click", prepareEmail);
downloadButton.addEventListener("click", downloadLead);

renderLead();
state.fieldIndex = nextMissingField();
state.completed = state.fieldIndex === -1;
addMessage("bot", "Hola, soy el asistente virtual Bety de Baker Tilly Colombia. Cuéntame qué necesitas y, mientras conversamos, tomaré los datos necesarios para que un asesor pueda dar seguimiento.");
