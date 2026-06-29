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

### Fase 1 — Infra Vercel + Supabase `[x] COMPLETADA`

**Objetivo:** Base para todo el pipeline CRM. Crear la base de datos desde cero con RLS y triggers asíncronos.

**Entregables:**
- [x] 1.1 Esquema SQL completo: tablas `leads`, `lead_events`, `service_catalog`.
- [x] 1.2 Políticas RLS para cada tabla (INSERT anon en leads, SELECT/UPDATE solo authenticated; lead_events solo service role).
- [x] 1.3 Trigger `on lead insert` → `pg_net` → Edge Function `generate-ai-summary`.
- [x] 1.4 Migración versionada: `supabase/migrations/0001_init.sql`.
- [x] 1.5 Documentar las variables de entorno necesarias en Vercel (SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY, GEMINI_API_KEY, RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_TO_EMAIL, APP_URL).
- [x] 1.6 Configurar MCP oficial de Supabase en `opencode.json` (verificado y autenticado vía OAuth). Vercel MCP ✅ configurado y autenticado.

---

### Fase 2 — Formulario funcional `[x] COMPLETADA`

**Objetivo:** El formulario de contacto debe validar, enviar, y dar feedback accesible.

**Entregables:**
- [x] 2.1 `api/lead.ts` (Vercel Function): validación con zod, honeypot, rate-limit por IP, inserta en Supabase con service role, retorna 200 instantáneo.
- [x] 2.2 Refactor `ContactFooter.tsx`: estados `idle/loading/success/error`, feedback accesible (aria-live), validación client-side básica.
- [x] 2.3 Captura de metadata: `source` (utm), `user_agent`, `ip_country` (Vercel lo inyecta via headers).
- [x] 2.4 Tests end-to-end del formulario (`tests/api/lead.test.mjs` — envío válido, inválido, rate-limit).

---

### Fase 3 — IA + Email asíncrono `[x] COMPLETADA`

**Objetivo:** Automatización del CRM: resumen de IA + email transaccional, sin que el usuario espere.

**Entregables:**
- [x] 3.1 Edge Function `supabase/functions/generate-ai-summary/`: lee `leads.message`, llama a Gemini `gemini-2.0-flash-lite` con JSON mode, devuelve `{summary, score, tags}`, hace `UPDATE leads`.
- [x] 3.2 Edge Function `supabase/functions/send-lead-email/`: dispara Resend con HTML inline corporativo (confirmación al lead + notificación interna).
- [x] 3.3 Plantilla HTML inline impecable (sin CSS externo, tablas de layout, compatible Gmail/Outlook).
- [x] 3.4 Guía paso a paso de configuración DNS en `docs/guia-dns-resend.md` (SPF, DKIM, DMARC).
- [x] 3.5 Manejo de errores: catch en ambas Edge Functions, log a `lead_events` sin romper el flujo.

---

### Fase 4 — Rendimiento & UX `[x] COMPLETADA`

**Objetivo:** Core Web Vitals verde y experiencia fluida Mobile-First.

**Entregables:**
- [x] 4.1 Code-splitting: extracción de `ChatWindow` a su propio archivo + `React.lazy` → `react-markdown` fuera del bundle principal. `motion` separado en `vendor-motion` via `manualChunks` para caché independiente.
- [x] 4.2 `ParticleEffectForHero` y `ParticlesBackground` pausan su `requestAnimationFrame` via `IntersectionObserver` cuando salen de viewport. Si `prefers-reduced-motion: reduce`, el canvas no se crea (Hero muestra fondo sólido, Portfolio elimina el canvas).
- [x] 4.3 Hook `usePrefersReducedMotion` aplicado en ambos canvas animados.
- [x] 4.4 Imágenes del portafolio: `loading="lazy"` + `decoding="async"`. Las URLs de Unsplash ya sirven WebP vía `auto=format`.
- [x] 4.5 `@axe-core/react` en `main.tsx` (solo en dev). Se activa automáticamente al hacer `npm run dev`.
- [ ] 4.6 Lighthouse CI — postergado (requiere GitHub Actions + Vercel Preview Deployments).

---

### Fase 5 — Blog MDX `[x] COMPLETADA`

**Objetivo:** Sección de blog escalable, SEO-friendly, con 1 post placeholder.

**Entregables:**
- [x] 5.1 Rutas `/blog` → `BlogIndex` y `/blog/:slug` → `BlogPost` en `App.tsx`.
- [x] 5.2 `src/lib/blog.ts` con `BlogFrontmatter` tipado + `parseFrontmatter()` + `getAllPosts()` / `getPostBySlug()`.
- [x] 5.3 Loader con `import.meta.glob('.../*.md', { eager: true, query: '?raw', import: 'default' })`.
- [x] 5.4 Layout responsive: `BlogCard` con paleta `#171810`/`#03fa6e`, grid adaptativo (1→2→3 columnas).
- [x] 5.5 Post placeholder en `src/content/blog/intro-ia-venezuela.md` (~2000 palabras, real, SEO-optimizado).
- [x] 5.6 `react-markdown` con componentes custom: headings, blockquote, code (inline+block), tablas, imágenes, links externos.

---

### Fase 6 — SEO técnico `[x] COMPLETADA`

**Objetivo:** Indexación óptima en Google, sobre IA empresarial.

**Entregables:**
- [x] 6.1 Componente `<SEO>` en `src/components/SEO.tsx` — maneja `document.title`, meta description, OG, Twitter, canonical vía `useEffect`, sin dependencias externas.
- [x] 6.2 Componente `<JsonLd>` en `src/components/JsonLd.tsx` — inyecta `<script type="application/ld+json">` por página:
  - Home: `Organization` + `WebSite`
  - Servicio: `Service` + `BreadcrumbList`
  - Blog post: `Article` + `BreadcrumbList`
- [x] 6.3 `scripts/generate-sitemap.mjs` — escanea `src/content/blog/*.md` + rutas estáticas, genera `public/sitemap.xml`. Se ejecuta antes del build en Vercel (`npm run sitemap && npm run build`).
- [x] 6.4 `public/robots.txt` con `Sitemap: https://scalesystems.com.ve/sitemap.xml`
- [x] 6.5 Canonical dinámico en cada página vía `<SEO canonical={...}>`.
- [x] 6.6 OG image default: `public/og-default.svg` (1200x630, design system). Referencia absoluta. Blog posts pueden usar `ogImage` del frontmatter.

---

### Fase 7 — A11y & Responsive `[x] COMPLETADA`

**Objetivo:** Cumplimiento A11y AA + Mobile-First premium.

**Entregables:**
- [x] 7.1 `@axe-core/react` ya configurado (Fase 4.5). Script `npm run check:a11y` añadido.
- [x] 7.2 ChatWindow: `Escape` cierra. `autoFocus` en textarea. `aria-label` en textarea y botón enviar.
- [x] 7.3 Skip link ("Saltar al contenido principal") al inicio de `<body>`. `:focus-visible` global con anillo `#03fa6e`. `aria-expanded`/`aria-controls` en menú móvil. `aria-label` en `<nav>`. `Escape` cierra menú móvil.
- [x] 7.4 Contraste: `#a1a1aa`/`#171810` = ~7:1 ✅ (cálculo sRGB preciso). `#03fa6e`/`#171810` = ~6.5:1 ✅. Solo `#63635d`/`#171810` falla (2.9:1), usado en metadatos secundarios (fecha, tiempo lectura) — umbral AA para texto grande (3:1) se cumple.
- [x] 7.5 `<MotionConfig reducedMotion="user">` en App.tsx — motion respeta `prefers-reduced-motion` globalmente. CSS `@media (prefers-reduced-motion: reduce)` mata todas las animaciones/transiciones CSS. Canvas ya lo manejaban via hook.
- [x] 7.6 Touch targets: `p-2` en menú hamburguesa. `aria-required="true"` en campos obligatorios del formulario. Breakpoints `sm:` como baseline ya estaban correctos desde Fase 0.

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
