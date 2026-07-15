import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { createRateLimiter, getClientIp } from '@/lib/rate-limit';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'contacto@resend.scalesystems.dev';
const NO_REPLY_EMAIL = 'no-reply@resend.scalesystems.dev';
const CONTACT_EMAIL = 'contacto@scalesystems.dev';
const NOTIFY_EMAILS = (process.env.NOTIFY_EMAILS || 'ventas@scalesystems.dev')
  .split(',')
  .map((e) => e.trim());

const serviceLabels: Record<string, string> = {
  'web-dev': 'Desarrollo Web',
  automation: 'Automatización de Procesos',
  'ai-agents': 'Agentes de IA',
  consulting: 'Consultoría en IA',
  analytics: 'Analítica e Insights',
};

function buildLeadEmailHtml(props: {
  name: string; email: string; company?: string; phone?: string;
  service?: string; message: string; source?: string;
}) {
  const serviceLabel = props.service ? (serviceLabels[props.service] || props.service) : 'No especificado';
  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="background-color:#171810;font-family:Inter,ui-sans-serif,system-ui,sans-serif;padding:40px 24px;color:#e4e4e7;margin:0">
<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background-color:#1f2017;border-radius:16px;border:1px solid #2a2c1f;overflow:hidden;width:100%">
<tr><td style="padding:32px 32px 0;border-bottom:1px solid #2a2c1f">
<div style="display:inline-block;background-color:#03fa6e;color:#171810;font-size:12px;font-weight:700;padding:4px 12px;border-radius:999px;text-transform:uppercase;letter-spacing:0.05em">Nuevo Lead</div>
<h1 style="font-size:24px;font-weight:700;color:#ffffff;margin:12px 0 4px">Nueva solicitud de presupuesto</h1>
<p style="font-size:14px;color:#a1a1aa;margin:0 0 24px">${props.name} ha enviado una solicitud a trav\u00e9s de scalesystems.dev</p>
</td></tr>
<tr><td style="padding:0 32px">
<p style="font-size:11px;font-weight:600;color:#63635d;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">Nombre Completo</p>
<p style="font-size:15px;color:#e4e4e7;margin:0 0 16px;line-height:1.5">${props.name}</p>
<p style="font-size:11px;font-weight:600;color:#63635d;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">Correo Electr\u00f3nico</p>
<p style="font-size:15px;color:#e4e4e7;margin:0 0 16px;line-height:1.5">${props.email}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:16px"><tr>
<td style="width:50%;padding-right:6px"><div style="background-color:#171810;border-radius:8px;padding:12px">
<p style="font-size:11px;font-weight:600;color:#63635d;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px">Empresa</p>
<p style="font-size:14px;color:#e4e4e7;margin:0">${props.company || '\u2014'}</p>
</div></td>
<td style="width:50%;padding-left:6px"><div style="background-color:#171810;border-radius:8px;padding:12px">
<p style="font-size:11px;font-weight:600;color:#63635d;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px">Tel\u00e9fono</p>
<p style="font-size:14px;color:#e4e4e7;margin:0">${props.phone || '\u2014'}</p>
</div></td>
</tr></table>
<p style="font-size:11px;font-weight:600;color:#63635d;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">Servicio de Inter\u00e9s</p>
<p style="font-size:15px;color:#e4e4e7;margin:0 0 16px;line-height:1.5">${serviceLabel}</p>
</td></tr>
<tr><td><hr style="height:1px;background-color:#2a2c1f;border:none;margin:0 32px 24px"></td></tr>
<tr><td style="padding:0 32px">
<p style="font-size:11px;font-weight:600;color:#63635d;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">Mensaje</p>
<div style="background-color:#171810;border-radius:12px;padding:16px 20px;border-left:4px solid #03fa6e;margin-bottom:16px">
<p style="font-size:14px;color:#a1a1aa;line-height:1.6;margin:0;white-space:pre-wrap">${props.message}</p>
</div>
</td></tr>
${props.source ? `<tr><td><hr style="height:1px;background-color:#2a2c1f;border:none;margin:0 32px 24px"></td></tr>
<tr><td style="padding:0 32px">
<p style="font-size:11px;font-weight:600;color:#63635d;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">Fuente</p>
<p style="font-size:13px;color:#63635d;margin:0 0 16px">${props.source}</p>
</td></tr>` : ''}
  <tr><td style="padding:24px 32px 32px;border-top:1px solid #2a2c1f;font-size:12px;color:#63635d;text-align:center;line-height:1.6">
  <p style="margin:0 0 8px">Scale Systems &mdash; Automatizaci\u00f3n e IA para empresas en Venezuela</p>
  <a href="https://scalesystems.dev" style="color:#03fa6e;text-decoration:underline">scalesystems.dev</a>
  </td></tr>
</table>
</body></html>`;
}

function buildConfirmationEmailHtml(props: {
  name: string; service?: string;
}) {
  const firstName = props.name.trim().split(/\s+/)[0] || props.name;
  const serviceLabel = props.service ? (serviceLabels[props.service] || props.service) : 'Automatizaci\u00f3n e IA';
  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="background-color:#171810;font-family:Inter,ui-sans-serif,system-ui,sans-serif;padding:40px 24px;color:#e4e4e7;margin:0">
<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background-color:#1f2017;border-radius:16px;border:1px solid #2a2c1f;overflow:hidden;width:100%">
<tr><td style="padding:32px 32px 0;border-bottom:1px solid #2a2c1f">
<div style="display:inline-block;background-color:#03fa6e;color:#171810;font-size:12px;font-weight:700;padding:4px 12px;border-radius:999px;text-transform:uppercase;letter-spacing:0.05em">Solicitud Recibida</div>
<h1 style="font-size:24px;font-weight:700;color:#ffffff;margin:12px 0 4px">\u00a1Gracias, ${firstName}!</h1>
<p style="font-size:14px;color:#a1a1aa;margin:0 0 24px">Hemos recibido tu solicitud y te contactaremos en menos de 24 horas h\u00e1biles.</p>
</td></tr>
  <tr><td style="padding:0 32px">
  <p style="font-size:15px;color:#e4e4e7;margin:24px 0 16px;line-height:1.6">Nuestro equipo de especialistas en <strong style="color:#03fa6e">${serviceLabel}</strong> ya est\u00e1 revisando los detalles de tu proyecto para preparar una propuesta a la medida de tu empresa.</p>
  <div style="background-color:#171810;border-radius:12px;padding:18px 20px;border-left:4px solid #03fa6e;margin-bottom:24px">
  <p style="font-size:14px;color:#a1a1aa;line-height:1.6;margin:0 0 8px">Este es un correo autom\u00e1tico de confirmaci\u00f3n, por lo que no puedes responderlo directamente.</p>
  <p style="font-size:14px;color:#a1a1aa;line-height:1.6;margin:0">Si necesitas compartir m\u00e1s informaci\u00f3n o tienes alguna duda, escr\u00edbenos a <a href="mailto:${CONTACT_EMAIL}" style="color:#03fa6e;text-decoration:underline">${CONTACT_EMAIL}</a>.</p>
  </div>
  </td></tr>
<tr><td style="padding:24px 32px 32px;border-top:1px solid #2a2c1f;font-size:12px;color:#63635d;text-align:center;line-height:1.6">
<p style="margin:0 0 8px">Scale Systems &mdash; Automatizaci\u00f3n e IA para empresas en Venezuela</p>
<a href="https://scalesystems.dev" style="color:#03fa6e;text-decoration:underline">scalesystems.dev</a>
</td></tr>
</table>
</body></html>`;
}

const LeadBodySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(200),
  email: z.string().email('Correo electrónico inválido').max(200),
  company: z.string().max(200).optional().default(''),
  phone: z.string().max(30).optional().default(''),
  service: z.string().max(100).optional().default(''),
  budget_range: z.string().max(100).optional().default(''),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres').max(5000),
  _hp: z.literal('').optional(),
  utm_source: z.string().max(200).optional().default(''),
  utm_medium: z.string().max(200).optional().default(''),
  utm_campaign: z.string().max(200).optional().default(''),
  utm_term: z.string().max(200).optional().default(''),
  utm_content: z.string().max(200).optional().default(''),
  source: z.string().max(500).optional().default(''),
});

const rateLimit = createRateLimiter(60_000, 5);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ip = getClientIp(request);

    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.' },
        { status: 429 }
      );
    }

    const parsed = LeadBodySchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          error: 'Datos inválidos.',
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      _hp,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      source: bodySource,
      ...leadData
    } = parsed.data;

    // Build source string from UTM params
    const utmParts = [utm_source, utm_medium, utm_campaign, utm_term, utm_content].filter(Boolean);
    const source = bodySource || (utmParts.length > 0 ? utmParts.join(' / ') : '');

    const user_agent = request.headers.get('user-agent') || '';
    const ip_country = request.headers.get('x-vercel-ip-country') || null;

    const { error } = await supabase.from('leads').insert({
      name: leadData.name,
      email: leadData.email,
      company: leadData.company || null,
      phone: leadData.phone || null,
      service: leadData.service || null,
      budget_range: leadData.budget_range || null,
      message: leadData.message,
      source: source || null,
      ip_country,
      user_agent,
    });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Este correo ya fue registrado. Te contactaremos pronto.' },
          { status: 409 }
        );
      }
      console.error('Error inserting lead in Supabase:', error);
      return NextResponse.json(
        { error: 'Error al enviar la solicitud. Intenta de nuevo.' },
        { status: 500 }
      );
    }

    try {
      await resend.emails.send({
        from: `Scale Systems <${FROM_EMAIL}>`,
        replyTo: [leadData.email],
        to: NOTIFY_EMAILS,
        subject: `Nuevo lead: ${leadData.name}${leadData.service ? ` - ${leadData.service}` : ''}`,
        html: buildLeadEmailHtml({
          name: leadData.name,
          email: leadData.email,
          company: leadData.company || undefined,
          phone: leadData.phone || undefined,
          service: leadData.service || undefined,
          message: leadData.message,
          source: source || undefined,
        }),
      });

      await resend.emails.send({
        from: `Scale Systems <${NO_REPLY_EMAIL}>`,
        replyTo: CONTACT_EMAIL,
        to: [leadData.email],
        subject: `Hemos recibido tu solicitud, ${leadData.name.split(' ')[0] || leadData.name}`,
        html: buildConfirmationEmailHtml({
          name: leadData.name,
          service: leadData.service || undefined,
        }),
      });
    } catch (emailErr) {
      console.error('Error sending email notification:', emailErr);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Lead handler catch error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
