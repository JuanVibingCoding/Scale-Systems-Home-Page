# Plan de Refactorización — Scale Systems

> Documento vivo. Marca el estado de cada fase a medida que avanza el proceso.
> Fuente: auditoría del repositorio + decisiones acordadas con el cliente.

---

## Contexto del proyecto

- **Producto:** Landing/Portafolio corporativo de Scale Systems (agencia de automatización e IA, Valencia, Venezuela).
- **Tech stack real:** Vite 6 + React 19 + TypeScript + Tailwind CSS v4 + react-router-dom v7 + motion (Framer) + lucide-react + react-markdown.
- **Despliegue:** Vercel (Edge Network) — SPA estática (`dist/`) + Vercel Functions en `/api`.
- **Backend/DB:** Supabase (PostgreSQL + Auth + Edge Functions + RLS).
- **Email transaccional:** Resend.
- **LLM:** Google Gemini (`gemini-2.5-flash` para chat, `gemini-2.0-flash-lite` para `ai_summary`).
- **Blog:** MDX local + Vite (`import.meta.glob`).

## Decisiones de arquitectura

### Topología de despliegue

```
[Cliente SPA]  ──HTTP──►  /api/*  ──►  Vercel Functions (Node runtime)
                                       │
                                       ├── /api/chat   → proxy a Gemini (chatbot)
                                       └── /api/lead   → inserta lead + dispara webhooks
                                                          │
                                                          ▼
                                              Trigger pg_net (async) en Supabase
                                                          │
                                            ┌───────────────┴───────────────┐
                                            ▼                               ▼
                                  Edge Function                  Edge Function
                                  generate-ai-summary            send-lead-email
                                  (Gemini flash-lite)            (Resend HTML inline)
                                            │                               │
                                            ▼                               ▼
                                    UPDATE leads.             SMTP vía Resend
                                    ai_summary/                  (confirmación
                                    ai_score/ai_tagsg                  al lead +
                                             notificación
                                             interna)
```

- **El usuario nunca espera a la IA ni al email.** El endpoint `/api/lead` retorna 200 inmediatamente; el resto es asíncrono.
- Las claves (`GEMINI_API_KEY`, `SUPABASE_SECRET_KEY`, `RESEND_API_KEY`) viven **solo en el servidor** (Vercel Functions / Edge Functions / Supabase). Nunca en el bundle del cliente.

### Supabase — esquema objetivo

```
leads                              lead_events (auditoría)
─────────────T                     ────────────────────
id uuid pk                          id uuid pk
created_at timestamptz              lead_id fk → leads
name text                           event_type text
email text  (unique)                     (inserted|summarized|
company text                                emailed|error)
phone text                          payload jsonb
service text                        created_at timestamptz
budget_range text
message text
source text (utm/origin)
ai_summary text    ← Edge Fn
ai_score int                  ← Edge Fn
ai_tags text[]                ← Edge Fn
status text  (new|contacted|won|lost)
ip_country text
user_agent text

service_catalog (catálogo, opcional)
─────────────
id text pk
label text
description text
active bool
```

- **RLS obligatoria** en cada tabla. Ni una expuesta sin política.
- **Trigger `on lead insert`:** invoca `pg_net` → Edge Function `generate-ai-summary`. Asíncrono, no bloquea al usuario.
- **Edge Function `generate-ai-summary`:** lee el mensaje, llama a Gemini (`gemini-2.0-flash-lite`, JSON mode), devuelve `{summary, score 0-100, tags[]}`, hace `UPDATE leads SET ai_summary=...`. Si falla, registra en `lead_events` y no rompe el flujo.
- **Edge Function `send-lead-email`:** dispara Resend con HTML inline corporativo (confirmación al lead + notificación interna a `CONTACT_TO_EMAIL`).

### Pipeline de contacto (flujo end-to-end)

```
[Form] → POST /api/lead
           (valida con zod + honeypot + rate-limit por IP)
              ↓
           INSERT leads (RLS: anon INSERT only)
              ↓ trigger pg_net (async)
              ↓
   ┌────────────────┬───────────────────┐
   EdgeFn             EdgeFn                VercelFn retorna
   ai_summary (Gemini) send-lead-email   200 al cliente
                                        (instantáneo)
```

### Blog (MDX local + Vite)

- `src/content/blog/*.mdx` con frontmatter: `title, description, date, tags, ogImage, readingTime`.
- Cargados con `import.meta.glob('./content/blog/*.mdx', { eager: true })`.
- Rutas: `/blog` (índice), `/blog/[slug]` (post).
- Render con `react-markdown` + componentes custom.
- Cada post genera `<meta>` OG, canonical, JSON-LD `Article`.
- Sitemap dinámico generado en build (`scripts/generate-sitemap.ts`).
- Placeholder inicial: 1 post "La adopción de IA en la empresa venezolana: por dónde empezar".

### Configuración de correo corporativo (Resend)

- DNS (en el panel de tu dominio `scalesystems.com.ve`):
  - **SPF:** `v=spf1 include:_spf.resend.com ~all`
  - **DKIM:** Resend proporciona 3 claves CNAME al configurar el dominio.
  - **DMARC:** `v=DMARC1; p=quarantine; rua=mailto:postmaster@scalesystems.com.ve; adkim=s; aspf=s`
- FROM corporativo: `hola@scalesystems.com.ve`.
- Notificación interna a: `ventas@scalesystems.com.ve`.

### MCPs en OpenCode (oficiales, no de terceros)

> **Corregido tras verificar docs oficiales:** el MCP de Supabase ya NO es un comando `npx` local con `--access-token` (approach deprecado). Ahora es un **servidor remoto HTTP** en `https://mcp.supabase.com/mcp` con **OAuth 2.1** (opencode abre el navegador, te logueas a Supabase, guarda el token en `~/.local/share/opencode/mcp-auth.json` y se auto-refresca). El Personal Access Token no se necesita para este flujo (queda disponible para el CLI de Supabase).

```jsonc
// opencode.json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "supabase": {
      "type": "remote",
      "url": "https://mcp.supabase.com/mcp?project_ref=stmoqvvpulspnffqviyq&read_only=false&features=database,docs,development,functions,debugging",
      "oauth": {},
      "enabled": true,
      "timeout": 10000
    }
  }
}
```

- `project_ref=stmoqvvpulspnffqviyq` → scope al proyecto (no toca otros proyectos de la cuenta).
- `read_only=false` → necesario para `apply_migration` y `deploy_edge_function` durante la construcción del esquema y Edge Functions.
- `features=database,docs,development,functions,debugging` → solo lo que se usa (omito `account`, `storage`, `branching`).
- **Estado:** ✅ configurado y autenticado (verificado con `opencode mcp list` y `opencode mcp debug supabase`).

**Vercel MCP** ✅ configurado y autenticado. Servidor remoto HTTP en `https://mcp.vercel.com` con OAuth 2.1 (mismo patrón que Supabase). Proporciona herramientas para gestionar deployments, proyectos, variables de entorno y logs. A pesar de que la doc de Vercel lista clientes "aprobados" y OpenCode no aparece, el flujo OAuth con Dynamic Client Registration funciona correctamente.

**Skills MCP de terceros descartadas** (CRM, A11y, scoring de leads):
- Mayoría son proyectos personales sin SLA, mantenimiento nulo, y tocan datos sensibles de leads (GDPR/LOPD).
- Para A11y: axe-core en CI + Lighthouse CI (no-MCP, consolidado).
- Scoring de leads: código propio versionado en la Edge Function.

---

## Fases del plan

> Estado: `[ ]` pendiente · `[~]` en curso · `[x]` completada

### Fase 0 — Parches críticos `[x] COMPLETADA`

**Objetivo:** Eliminar deuda técnica bloqueante y fugas de seguridad antes de añadir nada nuevo.

| Tarea | Estado | Notas |
|-------|--------|-------|
| 0a. Eliminar `new_hero/`, `chat_agent/`, 5 scripts de debug (`check-env.ts`, `list-models.ts`, `test-ai*.ts`), `Scale Systems Logos.zip` | `[x]` | Eran código muerto o doc de otro proyecto (Reserbot). `new_hero/` no aportaba estética (no tenía design system). |
| 0b. Limpiar `package.json`: fuera `better-sqlite3`, `express`, `@types/express`, `dotenv`, `tsx`. Añadir `zod`, `@vercel/node`, `rimraf` | `[x]` | `react-markdown` movido a dep real (se usa en el chatbot). |
| 0c. Fix `vite.config.ts`: eliminar `define` con `GEMINI_API_KEY` (fuga de API key al bundle) | `[x]` | Añadido `build.target=es2022`, `cssMinify`, naming de assets con hash. |
| 0d. SEO base en `index.html`: `lang=es`, title real, meta description, OG, Twitter, canonical, JSON-LD `Organization`, preload de font, `theme-color` | `[x]` | |
| 0e. Crear `api/chat.ts` (Vercel Function proxy a Gemini con rate-limit 15 req/min/IP y validación zod) | `[x]` | System prompt extraído a `src/lib/chat-config.ts` (DRY cliente/servidor). |
| 0f. Refactor `src/lib/chat-agent.ts`: fetch a `/api/chat`, sin `@google/genai` en el cliente | `[x]` | `@google/genai` solo en `api/chat.ts` (server). Verificado: no aparece en el bundle cliente. |
| 0g. `vercel.json` + `api/tsconfig.json` + actualizar `.env.example` | `[x]` | rewrites SPA, headers de cache inmutable para `assets/` y `fonts/`, security headers. |
| 0h. `npm install` + `tsc --noEmit` + `vite build` de verificación | `[x]` | Typecheck limpio (cliente + API). Build OK. Bundle: 580KB → 184KB gzip. |

**Hallazgos de la auditoría inicial (preservados para referencia):**

1. 🔴 **Fuga de API Key:** `vite.config.ts:11` inyectaba `GEMINI_API_KEY` en el bundle cliente vía `define`. Corregido en Fase 0c.
2. 🔴 **Formulario de contacto inerte:** `ContactFooter.tsx:45` hacía `on.preventDefault()` y nada más. Se aborda en Fase 2.
3. 🟠 **SEO inexistente:** `index.html` tenía `<title>My Google AI Studio App</title>`. Corregido en Fase 0d.
4. 🟠 **Fuentes bloqueaban el render:** `@import url(googleapis...)` al inicio de `index.css`. Corregido en Fase 0 (movido a `<link>` con `preconnect`).
5. 🟠 **Dependencias zombi:** `better-sqlite3`, `express`, `dotenv`, `tsx` en target SPA. Corregido en Fase 0b.
6. 🟡 **`new_hero/` y `chat_agent/`** eran artefactos de iteración. Eliminados en Fase 0a.
7. 🟡 **No había sitemap, ni `robots.txt`, ni assets optimizados** (WebP/AVIF). Se aborda en Fase 6.

**Notas operativas de la Fase 0:**

- Para dev local: usar `vercel dev` (no `vite dev` solo) — las Functions solo se sirven con el runtime de Vercel.
- Variables de entorno en Vercel: `GEMINI_API_KEY` (sin prefijo `VITE_`) en dashboard → Settings → Environment Variables.
- Pendiente: generar **Personal Access Token** de Supabase en `https://supabase.com/dashboard/account/tokens` (distinto al service role key) para configurar el MCP de Supabase en `opencode.json`.

---

### Fase 1 — Infra Vercel + Supabase `[ ]`

**Objetivo:** Base para todo el pipeline CRM. Crear la base de datos desde cero con RLS y triggers asíncronos.

**Entregables:**
- [ ] 1.1 Esquema SQL completo: tablas `leads`, `lead_events`, `service_catalog`.
- [ ] 1.2 Políticas RLS para cada tabla (INSERT anon en leads, SELECT/UPDATE solo authenticated; lead_events solo service role).
- [ ] 1.3 Trigger `on lead insert` → `pg_net` → Edge Function `generate-ai-summary`.
- [ ] 1.4 Migración versionada: `supabase/migrations/0001_init.sql`.
- [ ] 1.5 Documentar las variables de entorno necesarias en Vercel (SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY, GEMINI_API_KEY, RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_TO_EMAIL, APP_URL).
- [x] 1.6 Configurar MCP oficial de Supabase en `opencode.json` (verificado y autenticado vía OAuth). Vercel MCP ✅ configurado y autenticado.

---

### Fase 2 — Formulario funcional `[ ]`

**Objetivo:** El formulario de contacto debe validar, enviar, y dar feedback accesible.

**Entregables:**
- [ ] 2.1 `api/lead.ts` (Vercel Function): validación con zod, honeypot, rate-limit por IP, inserta en Supabase con service role, retorna 200 instantáneo.
- [ ] 2.2 Refactor `ContactFooter.tsx`: estados `idle/loading/success/error`, feedback accesible (aria-live), validación client-side básica.
- [ ] 2.3 Captura de metadata: `source` (utm), `user_agent`, `ip_country` (Vercel lo inyecta via headers).
- [ ] 2.4 Tests end-to-end del formulario (envío válido, envío inválido, rate-limit).

---

### Fase 3 — IA + Email asíncrono `[ ]`

**Objetivo:** Automatización del CRM: resumen de IA + email transaccional, sin que el usuario espere.

**Entregables:**
- [ ] 3.1 Edge Function `supabase/functions/generate-ai-summary/`: lee `leads.message`, llama a Gemini `gemini-2.0-flash-lite` con JSON mode, devuelve `{summary, score, tags}`, hace `UPDATE leads`.
- [ ] 3.2 Edge Function `supabase/functions/send-lead-email/`: dispara Resend con HTML inline corporativo (confirmación al lead + notificación interna).
- [ ] 3.3 Plantilla HTML inline impecable (sin CSS externo, tablas de layout compatibles con Gmail/Outlook).
- [ ] 3.4 Guía paso a paso de configuración DNS: SPF (`include:_spf.resend.com`), DKIM (3 CNAME de Resend), DMARC (`p=quarantine`).
- [ ] 3.5 Manejo de errores: si Gemini o Resend fallan, registrar en `lead_events` y no romper el flujo del usuario.

---

### Fase 4 — Rendimiento & UX `[ ]`

**Objetivo:** Core Web Vitals verde y experiencia fluida Mobile-First.

**Entregables:**
- [ ] 4.1 Code-splitting: `motion` y `react-markdown` con `React.lazy` en el chatbot (no cargarlos hasta que se abre el chat).
- [ ] 4.2 Laze-load de `ParticleEffectForHero` y `ParticlesBackground` (canvas es carato en mobile) — idealmente con `requestIdleCallback` o al entrar en viewport.
- [ ] 4.3 Auditar y reducir animaciones en mobile (`prefers-reduced-motion`).
- [ ] 4.4 Imágenes del portafolio (`ProjectCard`) desde Unsplash — convertir a local + WebP/AVIF, servir desde Vercel con optimización.
- [ ] 4.5 Configurar `axe-core` en CI (script `npm run check:a11y`).
- [ ] 4.6 Lighthouse CI en build con umbrales: LCP < 2.5s, CLS < 0.1, INP < 200ms.

---

### Fase 5 — Blog MDX `[ ]`

**Objetivo:** Sección de blog escalable, SEO-friendly, con 1 post placeholder.

**Entregables:**
- [ ] 5.1 Estructura de rutas: `/blog` (índice) y `/blog/[slug]` (post) en `App.tsx`.
- [ ] 5.2 `src/content/blog/` con MDX + frontmatter tipado (`BlogFrontmatter`).
- [ ] 5.3 Loader con `import.meta.glob('./content/blog/*.mdx', { eager: true })`.
- [ ] 5.4 Layout responsive + diseño coherente con el design system (paleta `#171810`/`#03fa6e`).
- [ ] 5.5 1 post placeholder: "La adopción de IA en la empresa venezolana: por dónde empezar".
- [ ] 5.6 Render MDX con `react-markdown` + componentes custom (Heading, Code, Image).

---

### Fase 6 — SEO técnico `[ ]`

**Objetivo:** Indexación óptima en Google, sobre IA empresarial.

**Entregables:**
- [ ] 6.1 Meta tags dinámicos por ruta (Title, Description, OG) — implementar un `<SEO>` component + `react-helmet`-like (o `document.title` manipulation en routes).
- [ ] 6.2 JSON-LD por página: `Organization` (home), `Service` (servicio/[id]), `Article` (blog/[slug]), `BreadcrumbList`.
- [ ] 6.3 `sitemap.xml` generado en build (`scripts/generate-sitemap.ts`) — incluye todas las rutas estáticas + posts del blog.
- [ ] 6.4 `public/robots.txt` con sitemap referenciado.
- [ ] 6.5 Canonical en cada página.
- [ ] 6.6 Open Graph image por servicio y por post (generar con sharp desde un template, o usar una imagen estática por sección).

---

### Fase 7 — A11y & Responsive `[ ]`

**Objetivo:** Cumplimiento A11y AA + Mobile-First premium.

**Entregables:**
- [ ] 7.1 axe-core en CI (script `npm run check:a11y`).
- [ ] 7.2 Auditoría focus-trap del `ChatWindow` en mobile (cierra con Esc, foco se queda dentro).
- [ ] 7.3 Navegación por teclado: skips link, focus visible en todos los interactivos.
- [ ] 7.4 Contraste AA: verificar pares `#a1a1aa`/`#171810`, `#03fa6e`/`#171810`.
- [ ] 7.5 `prefers-reduced-motion` en todas las animaciones de motion + canvas.
- [ ] 7.6 Revisión Mobile-First: breakpoints `sm:` en lugar de `md:` por defecto, tipografía fluida (`clamp`), touch targets >= 44px.

---

## Estética preservada (design system)

> El refactor NO debe romper el look-and-feel actual. Estos elementos son la firma del sitio y se mantienen (o se refinan sin degradarlos):

- **Paleta:** `#171810` (bg), `#03fa6e` (accent), `#a1a1aa` (muted), `#1f2017` (card), `#2a2c1f` (border).
- **Tipografías:** Inter (body, Google Fonts) + 29LT Bukra Bold (logo/títulos de portafolio, self-hosted en `/public/fonts/`).
- **Efectos signature:**
  - `GlowingEffect` (`src/components/ui/glowing-effect.tsx`) — borde radial que sigue el mouse.
  - `ParticleEffectForHero` (`src/components/ui/particle-effect-for-hero.tsx`) — canvas con físicas de partículas.
  - `BlurredStagger` (`src/components/ui/blurred-stagger-text.tsx`) — texto que aparece con blur-letter-stagger.
  - `Typewriter` (`src/components/ui/typewriter-text.tsx`) — máquina de escribir en el H1.
  - `HolographicCard` (`src/components/ui/holographic-card.tsx`) — card 3D con tilt.
- **Estilo terminal-card:** el HeroCard con "sys.status: ONLINE", barras de progreso, robot SVG con ojos que siguen el mouse. Es la firma de la marca, se mantiene.
- **ChatWindow:** fullscreen en mobile (`inset-0`), floating en desktop, header con `RobotIcon` + status ONLINE.
- **Portafolio:** scroll horizontal con `useScroll` de motion, track sticky, `ProjectCard` con glow-border.

**Principio:** cualquier mejora estética debe (a) mantener la paleta, (b) no añadir dependencies nuevas de animación, (c) no comprometer LCP/CLS.

---

## Reglas de oro (aplicables a todas las fases)

1. **DRY & Clean:** código modular, SOLID, sin deuda técnica.
2. **Cero alucinaciones:** toda solución basada en docs oficial vigente (Vite 6, React 19, Supabase, Resend, Vercel Functions).
3. **Seguridad:** ninguna clave en el bundle cliente. RLS en cada tabla de Supabase. Validación server-side siempre.
4. **Mobile-First:** cada sección se valida en mobile (375px) antes de desktop.
5. **Performance:** cada fase debe pasar Lighthouse con Core Web Vitals verde antes de darla por buena.
6. **No se añaden comments al código** salvo que el cliente lo pida.
7. **No se commite nada** salvo que el cliente lo pida explícitamente.
