import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { createRateLimiter, getClientIp } from './_lib/rate-limit';
import { supabase } from './_lib/supabase';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const ip = getClientIp(req);

  if (!rateLimit(ip)) {
    return res.status(429).json({ error: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.' });
  }

  const parsed = LeadBodySchema.safeParse(req.body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return res.status(400).json({
      error: 'Datos inválidos.',
      details: fieldErrors,
    });
  }

  const { _hp, utm_source, utm_medium, utm_campaign, utm_term, utm_content, source: bodySource, ...leadData } = parsed.data;

  // Build source string from UTM params
  const utmParts = [utm_source, utm_medium, utm_campaign, utm_term, utm_content].filter(Boolean);
  const source = bodySource || (utmParts.length > 0 ? utmParts.join(' / ') : '');

  const user_agent = (req.headers['user-agent'] as string) || '';
  const ip_country = (req.headers['x-vercel-ip-country'] as string) || null;

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
      return res.status(409).json({ error: 'Este correo ya fue registrado. Te contactaremos pronto.' });
    }
    console.error('Error inserting lead:', error);
    return res.status(500).json({ error: 'Error al enviar la solicitud. Intenta de nuevo.' });
  }

  return res.status(200).json({ success: true });
}
