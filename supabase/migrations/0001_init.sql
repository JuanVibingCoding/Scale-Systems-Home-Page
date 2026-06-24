-- ─── 0001_init.sql — Fase 1: Infraestructura CRM ──────────────────
-- Tablas: leads, lead_events, service_catalog
-- RLS: INSERT anon en leads, SELECT/UPDATE authenticated, service_role en lead_events
-- Trigger: on lead insert → pg_net → Edge Function generate-ai-summary

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ─── SERVICE CATALOG ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.service_catalog (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ─── LEADS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  service TEXT REFERENCES public.service_catalog(id),
  budget_range TEXT,
  message TEXT NOT NULL,
  source TEXT,
  ai_summary TEXT,
  ai_score INT,
  ai_tags TEXT[],
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'won', 'lost')),
  ip_country TEXT,
  user_agent TEXT,
  CONSTRAINT leads_email_key UNIQUE (email)
);

-- ─── LEAD EVENTS (auditoría) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lead_events (
  id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('inserted', 'summarized', 'emailed', 'error')),
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────
ALTER TABLE public.service_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_events ENABLE ROW LEVEL SECURITY;

-- Service catalog: anyone can read active services
CREATE POLICY "anon_can_select_active_services"
  ON public.service_catalog
  FOR SELECT
  TO anon
  USING (active = TRUE);

-- Leads: anonymous users can INSERT only
CREATE POLICY "anon_can_insert_leads"
  ON public.leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Leads: authenticated users can SELECT
CREATE POLICY "authenticated_can_select_leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Leads: authenticated users can UPDATE
CREATE POLICY "authenticated_can_update_leads"
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Lead events: only service_role (no anon, no authenticated)
CREATE POLICY "service_role_can_all_lead_events"
  ON public.lead_events
  FOR ALL
  TO service_role
  USING (true);

-- ─── TRIGGER: async AI summary via pg_net ─────────────────────────
CREATE OR REPLACE FUNCTION public.notify_lead_inserted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://stmoqvvpulspnffqviyq.functions.supabase.co/generate-ai-summary',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object('record_id', NEW.id)
  );
  PERFORM net.http_post(
    url := 'https://stmoqvvpulspnffqviyq.functions.supabase.co/send-lead-email',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object('record_id', NEW.id)
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_lead_inserted
  AFTER INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_lead_inserted();

-- ─── SEED: service_catalog ────────────────────────────────────────
INSERT INTO public.service_catalog (id, label, description) VALUES
  ('automation', 'Automatización de Procesos', 'Optimización de flujos de trabajo con IA y RPA'),
  ('ai-agents', 'Agentes de IA', 'Asistentes inteligentes y chatbots personalizados'),
  ('web-dev', 'Desarrollo Web', 'Landing pages, portales y apps web modernas'),
  ('consulting', 'Consultoría en IA', 'Estrategia y roadmap de adopción de IA empresarial'),
  ('analytics', 'Analítica e Insights', 'Dashboards y análisis predictivo con IA')
ON CONFLICT (id) DO NOTHING;

-- ─── POST-CREATION: REVOKE direct function execution ──────────────
REVOKE EXECUTE ON FUNCTION public.notify_lead_inserted() FROM PUBLIC, anon, authenticated;

-- ─── POST-CREATION: INDEXES ───────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_lead_events_lead_id ON public.lead_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_leads_service ON public.leads(service);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
