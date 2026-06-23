# Bot Baker Tilly Colombia

Prototipo de bot para captar clientes potenciales del portafolio de servicios de Baker Tilly Colombia.

## Qué hace

- Recopila nombre, empresa, cargo, email, teléfono/WhatsApp, país/ciudad, servicio de interés e inquietud.
- Responde con orientación corporativa basada en el portafolio de servicios 2026.
- Prepara un correo con los datos del lead desde la versión estática.
- Con servidor Node, guarda los leads en `data/leads.json`.
- Con `RESEND_API_KEY`, envía automáticamente el lead por correo.
- Con `OPENAI_API_KEY` y `OPENAI_VECTOR_STORE_ID`, responde usando IA real y el PDF indexado.

## Probar localmente

Abrir `index.html` en el navegador funciona como demo estática.

Para probar con backend local:

```bash
node server.js
```

Luego abrir:

```text
http://localhost:3000
```

## Envío automático de correo

Configurar estas variables de entorno en el hosting:

```text
LEADS_EMAIL=dtnieto@bakertilly.co
RESEND_API_KEY=clave_de_resend
FROM_EMAIL=Bot Baker Tilly <bot@tudominio.com>
```

Sin `RESEND_API_KEY`, el servidor guarda el lead en `data/leads.json` pero no envía correo automático.

Para pruebas rápidas con Resend puedes usar temporalmente:

```text
FROM_EMAIL=Bot Baker Tilly <onboarding@resend.dev>
```

Para producción conviene verificar un dominio propio en Resend y usar un remitente como `bot@bakertilly.co`.

## Qué se necesita para compartirlo con hosting

Para un enlace público de pruebas necesitas:

1. Un hosting que ejecute Node.js, por ejemplo Render, Railway, Fly.io, DigitalOcean App Platform o un VPS.
2. Un repositorio o carpeta con estos archivos.
3. Variables de entorno para el correo.
4. Un dominio o subdominio opcional, por ejemplo `bot.tuempresa.com`.
5. Un servicio de email transaccional, por ejemplo Resend, SendGrid, Mailgun o SMTP corporativo.

En Render:

- Build Command: dejar vacío o usar `npm install`
- Start Command: `npm start`
- Environment: Node

Variables mínimas para el primer despliegue:

```text
LEADS_EMAIL=dtnieto@bakertilly.co
RESEND_API_KEY=pegar_en_render_no_en_github
FROM_EMAIL=Bot Baker Tilly <onboarding@resend.dev>
```

No subas claves a GitHub. La clave de Resend debe ir únicamente en las variables de entorno del servicio en Render.

Para integrarlo luego en WordPress hay dos caminos:

- Insertarlo como iframe apuntando al hosting del bot.
- Convertirlo en widget/plugin de WordPress que consuma el mismo backend.

## Próximo paso para IA real con PDFs

Este MVP usa una base de conocimiento local derivada del portafolio cuando no hay backend de IA configurado. Para activar IA real con lectura de PDFs:

1. Crear un backend con OpenAI Responses API.
2. Subir el PDF a un vector store.
3. Usar `file_search` para responder con base en documentos.
4. Mantener la captura de leads antes o durante la conversación.

Variables necesarias:

```text
OPENAI_API_KEY=tu_api_key
OPENAI_VECTOR_STORE_ID=vs_xxxxxxxxx
OPENAI_MODEL=gpt-4.1-mini
```

El archivo `server.js` ya incluye el endpoint `/api/chat` para usar OpenAI cuando esas variables existan.
