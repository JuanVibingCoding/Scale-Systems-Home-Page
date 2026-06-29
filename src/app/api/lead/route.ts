import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createRateLimiter, getClientIp } from '@/lib/rate-limit';
import { supabase } from '@/lib/supabase';

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

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Lead handler catch error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
