# Auditoría SEO — ScaleSystems.dev

**Fecha:** 2026-06-29
**Auditor:** opencode (SEO Audit Skill)
**Stack:** Next.js 15, Tailwind CSS, Supabase, Vercel
**Dominio:** scalesystems.dev
**Última actualización:** 2026-06-29 (post-fase 2)

---

## Resumen Ejecutivo

**Salud General: ALTA** — Fase 1 y 2 completadas. Dominio conectado, schemas implementados, internal linking activo.

### Estado de Correcciones

| # | Tarea | Estado |
|---|-------|--------|
| 1 | Eliminar `ssr: false` de componentes indexables | ✅ Hecho |
| 2 | Crear `src/app/sitemap.ts` dinámico | ✅ Hecho |
| 3 | Crear `src/app/robots.ts` dinámico | ✅ Hecho |
| 4 | Eliminar archivos estáticos `public/sitemap.xml` y `public/robots.txt` | ✅ Hecho |
| 5 | Agregar Organization schema al homepage (layout.tsx) | ✅ Hecho |
| 6 | Agregar Article schema a blog posts | ✅ Hecho |
| 7 | Mejorar title tag del homepage (keyword-rich) | ✅ Hecho |
| 8 | Auto-host fonts con `next/font` (Inter) | ✅ Hecho |
| 9 | Eliminar duplicate JSON-LD en ServiceLandingPage | ✅ Hecho |
| 10 | Agregar `publishedTime`/`tags` a OpenGraph de blog | ✅ Hecho |
| 11 | Eliminar variables `SITE_URL` muertas | ✅ Hecho |
| 12 | Agregar noindex al 404 | ✅ Hecho |
| 13 | Mejorar alt text de imágenes (logo) | ✅ Hecho |
| 14 | Configurar `images.formats` para WebP/AVIF | ✅ Hecho |
| 15 | Conectar dominio scalesystems.dev | ✅ Hecho |
| 16 | Configurar redirect www → apex (301) | ✅ Hecho |
| 17 | Actualizar fallback URLs a scalesystems.dev | ✅ Hecho |
| 18 | Agregar WebSite schema con SearchAction | ✅ Hecho |
| 19 | Agregar BreadcrumbList schema | ✅ Hecho |
| 20 | Internal linking blog ↔ servicios | ✅ Hecho |

### Pendiente (Fase 3)

| # | Tarea | Notas |
|---|-------|-------|
| 21 | Integrar Google Search Console | Cuenta no creada aún |
| 22 | Expandir contenido en páginas de servicio | FAQs, proceso de trabajo, resultados |
| 23 | Crear más blog posts (topical cluster IA + Venezuela) | 3 posts planificados |
| 24 | Convertir `<img>` a `<Image>` de next/image | Lazy loading automático |

---

## Detalle de Cambios Implementados

### 1. Rendering SSR — ✅ CORREGIDO

**Componentes ahora server-rendered** (contenido indexable por Google):
- ✅ `PainPoints` — Puntos de dolor ( SEO-critical)
- ✅ `Services` — Servicios (SEO-critical)
- ✅ `TrustBanner` — Banner de confianza
- ✅ `ContactFooter` — Formulario de contacto

**Componentes que mantienen `ssr: false`** (decorativos, requieren `window`):
- ⚠️ `Hero` — Particle effects, typewriter animation
- ⚠️ `PortfolioSection` — Horizontal scroll, particles
- ⚠️ `Navbar` — Accede a `window.location.hash` durante render

**Archivos modificados:**
- `src/components/HomeContent.tsx` — `ssr: false` solo en Hero y PortfolioSection
- `src/components/ClientLayout.tsx` — `ssr: false` solo en Navbar
- `src/components/Navbar.tsx` — Guard `typeof window === 'undefined'` en `isActive()`
- `src/components/portfolio/PortfolioSection.tsx` — State inicializado sin `window.innerWidth`

---

### 2. Sitemap Dinámico — ✅ CORREGIDO

**Eliminado:** `public/sitemap.xml` (estático, incompleto, solo 4 URLs)
**Creado:** `src/app/sitemap.ts` (dinámico, incluye todas las páginas)

El sitemap ahora incluye:
- Homepage (priority 1.0, weekly)
- Blog index (priority 0.9, weekly)
- 3 páginas de servicio (priority 0.8, monthly)
- Todos los blog posts (priority 0.7, monthly, con `lastModified` real)

---

### 3. Robots.txt Dinámico — ✅ CORREGIDO

**Eliminado:** `public/robots.txt` (estático)
**Creado:** `src/app/robots.ts` (dinámico)

---

### 4. Structured Data — ✅ PARCIALMENTE CORREGIDO

| Schema | Ubicación | Estado |
|--------|-----------|--------|
| Organization | `src/app/layout.tsx` | ✅ Visible en todas las páginas |
| Article | `src/app/blog/[slug]/page.tsx` | ✅ En cada post |
| Service | `src/app/servicio/[id]/page.tsx` | ✅ Existente |
| WebSite | — | ⏸ Pendiente fase 2 |
| BreadcrumbList | — | ⏸ Pendiente fase 2 |

---

### 5. Title Tags — ✅ CORREGIDO

**Homepage:**
- Antes: `Inicio | Scale Systems` (22 chars, genérico)
- Ahora: `Automatización e IA para Empresas en Venezuela | Scale Systems` (61 chars, keyword-rich)

---

### 6. next/font — ✅ CORREGIDO

**Eliminado:** `<link>` render-blocking de Google Fonts en `<head>`
**Implementado:** `next/font/google` con Inter (self-hosted, optimal loading)

---

### 7. Duplicate JSON-LD — ✅ CORREGIDO

**Eliminado:** `<script type="application/ld+json">` duplicado de `src/components/ServiceLandingPage.tsx`
**Mantenido:** Solo en `src/app/servicio/[id]/page.tsx`

---

### 8. OpenGraph Blog — ✅ CORREGIDO

Agregados `publishedTime` y `tags` al OpenGraph de blog posts.

---

### 9. Variables Muertas — ✅ CORREGIDO

Eliminadas variables `const SITE_URL = 'https://scalesystems.com.ve'` de:
- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`

---

### 10. Noindex 404 — ✅ CORREGIDO

Agregado `robots: { index: false, follow: false }` al metadata de `src/app/not-found.tsx`.

---

### 11. Alt Text — ✅ CORREGIDO

- Navbar logo: `"Scale Systems - Agencia de Automatización e IA en Venezuela"`
- ContactFooter logo: `"Scale Systems - Agencia de Automatización e IA en Venezuela"`
- OpenGraph image: `"Logo de Scale Systems - Agencia de Automatización e IA en Venezuela"`

---

### 12. Image Formats — ✅ CORREGIDO

Agregado `formats: ['image/avif', 'image/webp']` en `next.config.ts`.

---

## Archivos Modificados (Resumen)

| Archivo | Cambios |
|---------|---------|
| `src/app/layout.tsx` | next/font, title mejorado, Organization schema |
| `src/app/page.tsx` | OpenGraph title mejorado |
| `src/app/sitemap.ts` | **NUEVO** — Sitemap dinámico |
| `src/app/robots.ts` | **NUEVO** — Robots dinámico |
| `src/app/not-found.tsx` | Noindex agregado |
| `src/app/blog/page.tsx` | Variable muerta eliminada |
| `src/app/blog/[slug]/page.tsx` | Article schema, publishedTime, variable muerta eliminada |
| `src/components/HomeContent.tsx` | SSR selectively enabled |
| `src/components/ClientLayout.tsx` | SSR selectively enabled |
| `src/components/Navbar.tsx` | Guard window, alt text mejorado |
| `src/components/ContactFooter.tsx` | Alt text mejorado |
| `src/components/ServiceLandingPage.tsx` | Duplicate JSON-LD eliminado |
| `src/components/portfolio/PortfolioSection.tsx` | State initialization fix |
| `next.config.ts` | Image formats (WebP/AVIF) |
| `public/sitemap.xml` | **ELIMINADO** |
| `public/robots.txt` | **ELIMINADO** |

---

## Plan de Accion

### Fase 1 — Completada ✅
Todas las correcciones on-page implementadas y verificadas con `npm run build`.

### Fase 2 — Completada ✅
1. ✅ Conectar dominio scalesystems.dev
2. ✅ Configurar redirect www → apex (301)
3. ✅ Actualizar fallback URLs a scalesystems.dev
4. ✅ Agregar WebSite schema con SearchAction
5. ✅ Agregar BreadcrumbList schema a servicios y blog
6. ✅ Internal linking blog ↔ servicios

### Fase 3 — Pendiente
1. ⏸ Integrar Google Search Console
2. ⏸ Expandir contenido en páginas de servicio (FAQs, comparaciones)
3. ⏸ Crear más blog posts (topical cluster IA + Venezuela)
4. ⏸ Convertir `<img>` a `<Image>` de next/image
