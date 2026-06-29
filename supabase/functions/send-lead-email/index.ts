import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface LeadData {
  id: string;
  name: string;
  email: string;
  company: string | null;
  service: string | null;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.json().catch(() => ({}));
  const recordId = body.record_id;
  if (!recordId) {
    return new Response(JSON.stringify({ error: "record_id required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { data: lead, error: fetchError } = await supabase
    .from("leads")
    .select("id, name, email, company, service, message")
    .eq("id", recordId)
    .single();

  if (fetchError || !lead) {
    console.error("Error fetching lead:", fetchError);
    return new Response(JSON.stringify({ error: "Lead not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await sendConfirmationEmail(lead);
    await sendNotificationEmail(lead);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Resend error:", msg);
    await logEvent(supabase, lead.id, "error", { stage: "send_email", error: msg });
    return new Response(JSON.stringify({ error: msg }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  await logEvent(supabase, lead.id, "emailed", { to: lead.email });

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
});

async function sendConfirmationEmail(lead: LeadData) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) throw new Error("RESEND_API_KEY no configurada");

  const from = Deno.env.get("RESEND_FROM_EMAIL") || "hola@scalesystems.com.ve";
  const appUrl = Deno.env.get("APP_URL") || "https://scalesystems.com.ve";
  const serviceLabel = getServiceLabel(lead.service);

  const html = buildConfirmationHtml({
    name: lead.name,
    service: serviceLabel,
    appUrl,
  });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: [lead.email],
      subject: "Hemos recibido tu solicitud — Scale Systems",
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Resend confirmation error:", text);
    throw new Error("Error al enviar correo de confirmacion");
  }
}

async function sendNotificationEmail(lead: LeadData) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) throw new Error("RESEND_API_KEY no configurada");

  const from = Deno.env.get("RESEND_FROM_EMAIL") || "hola@scalesystems.com.ve";
  const to = Deno.env.get("RESEND_TO_EMAIL") || "ventas@scalesystems.com.ve";

  const html = buildNotificationHtml(lead);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Nuevo lead: ${lead.name}${lead.company ? ` — ${lead.company}` : ""}`,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Resend notification error:", text);
    throw new Error("Error al enviar notificacion interna");
  }
}

function getServiceLabel(service: string | null): string {
  const labels: Record<string, string> = {
    "web-dev": "Desarrollo Web",
    "automation": "Automatizacion de Procesos",
    "ai-agents": "Agentes de IA",
    "consulting": "Consultoria en IA",
    "analytics": "Analitica e Insights",
  };
  return service ? (labels[service] || service) : "No especificado";
}

function buildConfirmationHtml(params: {
  name: string;
  service: string;
  appUrl: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#171810;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#171810;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#1f2017;border-radius:16px;border:1px solid #2a2c1f;">
          <tr>
            <td style="padding:40px 32px;text-align:center;">
              <img src="${params.appUrl}/logos/ScaleSystemsLogo250.png" alt="Scale Systems" width="180" style="display:block;margin:0 auto 24px;" />
              <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0 0 8px;">¡Hola, ${params.name}!</h1>
              <p style="color:#a1a1aa;font-size:16px;line-height:1.6;margin:0 0 24px;">
                Hemos recibido tu solicitud de presupuesto${params.service !== "No especificado" ? ` para <strong style="color:#03fa6e;">${params.service}</strong>` : ""}.
                Nuestro equipo la revisara y te contactara en las proximas 24-48 horas.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#171810;border-radius:12px;padding:20px;margin-bottom:24px;">
                <tr>
                  <td style="text-align:center;">
                    <p style="color:#a1a1aa;font-size:14px;margin:0 0 8px;">Mientras tanto, puedes conocer mas sobre nosotros:</p>
                    <a href="${params.appUrl}" target="_blank" style="display:inline-block;background-color:#03fa6e;color:#171810;font-weight:700;font-size:16px;padding:14px 32px;border-radius:12px;text-decoration:none;">
                      Visitar nuestro sitio
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color:#53534a;font-size:13px;line-height:1.5;margin:0;">
                 Scale Systems — Automatizacion e IA para empresas<br>
                 Valencia, Venezuela<br>
                <a href="mailto:hola@scalesystems.com.ve" style="color:#03fa6e;text-decoration:none;">hola@scalesystems.com.ve</a>
              </p>
            </td>
          </tr>
        </table>
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;margin-top:16px;">
          <tr>
            <td style="text-align:center;padding:16px;">
              <p style="color:#53534a;font-size:12px;margin:0;">
                Si no solicitaste este contacto, ignora este mensaje.<br>
                &copy; ${new Date().getFullYear()} Scale Systems. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildNotificationHtml(lead: LeadData): string {
  const serviceLabel = getServiceLabel(lead.service);

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#171810;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#171810;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#1f2017;border-radius:16px;border:1px solid #2a2c1f;">
          <tr>
            <td style="padding:40px 32px;">
              <h1 style="color:#03fa6e;font-size:22px;font-weight:700;margin:0 0 24px;">Nuevo Lead Recibido</h1>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="120" style="color:#a1a1aa;font-size:14px;padding:8px 0;vertical-align:top;">Nombre</td>
                  <td style="color:#ffffff;font-size:14px;padding:8px 0;"><strong>${lead.name}</strong></td>
                </tr>
                ${lead.company ? `<tr><td style="color:#a1a1aa;font-size:14px;padding:8px 0;vertical-align:top;">Empresa</td><td style="color:#ffffff;font-size:14px;padding:8px 0;">${lead.company}</td></tr>` : ""}
                <tr>
                  <td style="color:#a1a1aa;font-size:14px;padding:8px 0;vertical-align:top;">Email</td>
                  <td style="color:#ffffff;font-size:14px;padding:8px 0;">
                    <a href="mailto:${lead.email}" style="color:#03fa6e;text-decoration:none;">${lead.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="color:#a1a1aa;font-size:14px;padding:8px 0;vertical-align:top;">Servicio</td>
                  <td style="color:#ffffff;font-size:14px;padding:8px 0;">${serviceLabel}</td>
                </tr>
                <tr>
                  <td style="color:#a1a1aa;font-size:14px;padding:8px 0;vertical-align:top;">Mensaje</td>
                  <td style="color:#ffffff;font-size:14px;padding:8px 0;">${escapeHtml(lead.message)}</td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                <tr>
                  <td style="text-align:center;">
                    <a href="${Deno.env.get("SUPABASE_URL")}/project/stmoqvvpulspnffqviyq" target="_blank" style="display:inline-block;background-color:#03fa6e;color:#171810;font-weight:700;font-size:14px;padding:12px 24px;border-radius:12px;text-decoration:none;">
                      Ver en Supabase
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function logEvent(
  supabase: ReturnType<typeof createClient>,
  leadId: string,
  eventType: string,
  payload: Record<string, unknown>,
) {
  await supabase.from("lead_events").insert({
    lead_id: leadId,
    event_type: eventType,
    payload,
  });
}
