import fs from 'fs';
import path from 'path';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  ogImage?: string;
  readingTime: string;
  content: string;
}

interface Frontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: string;
  ogImage?: string;
}

function parseFrontmatter(raw: string): { frontmatter: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content: raw };

  const frontmatter: Record<string, unknown> = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value: unknown = line.slice(colonIdx + 1).trim();

    if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
    } else if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }

    frontmatter[key] = value;
  }

  return { frontmatter, content: match[2].trim() };
}

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

function readAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
  const posts: BlogPost[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
    const slug = file.replace(/\.md$/, '');
    const { frontmatter, content } = parseFrontmatter(raw);
    const fm = frontmatter as unknown as Frontmatter;

    posts.push({
      slug,
      title: fm.title || slug,
      description: fm.description || '',
      date: fm.date || '',
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      ogImage: fm.ogImage,
      readingTime: fm.readingTime || '',
      content,
    });
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllPosts(): BlogPost[] {
  return readAllPosts();
}

export function getPostBySlug(slug: string): BlogPost | null {
  return readAllPosts().find(p => p.slug === slug) ?? null;
}
