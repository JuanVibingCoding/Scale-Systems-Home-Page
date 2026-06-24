import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const blogDir = join(root, 'src', 'content', 'blog');

const SITE_URL = 'https://scalesystems.com.ve';

const staticRoutes = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/blog', priority: '0.8', changefreq: 'weekly' },
  { loc: '/servicio/diseno-web', priority: '0.7', changefreq: 'monthly' },
  { loc: '/servicio/automatizacion', priority: '0.7', changefreq: 'monthly' },
  { loc: '/servicio/chatbots', priority: '0.7', changefreq: 'monthly' },
];

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const frontmatter = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    frontmatter[key] = value;
  }
  return frontmatter;
}

function getBlogPosts() {
  if (!existsSync(blogDir)) return [];
  return readdirSync(blogDir)
    .filter(f => f.endsWith('.md'))
    .map(filename => {
      const slug = filename.replace(/\.md$/, '');
      const raw = readFileSync(join(blogDir, filename), 'utf-8');
      const fm = parseFrontmatter(raw);
      return {
        slug,
        date: fm.date || '',
      };
    });
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildSitemap() {
  const blogPosts = getBlogPosts();
  const allRoutes = [...staticRoutes];

  for (const post of blogPosts) {
    allRoutes.push({
      loc: `/blog/${post.slug}`,
      priority: '0.6',
      changefreq: 'monthly',
      lastmod: post.date || undefined,
    });
  }

  const urls = allRoutes.map(r => {
    const lastmod = r.lastmod ? `\n    <lastmod>${r.lastmod}</lastmod>` : '';
    return `  <url>\n    <loc>${SITE_URL}${escapeXml(r.loc)}</loc>${lastmod}\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

const xml = buildSitemap();
writeFileSync(join(publicDir, 'sitemap.xml'), xml, 'utf-8');
console.log(`✓ sitemap.xml generated with ${staticRoutes.length} static + ${getBlogPosts().length} blog routes`);
