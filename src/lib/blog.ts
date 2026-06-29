export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  ogImage?: string;
  readingTime: string;
}

export interface BlogPost extends BlogFrontmatter {
  slug: string;
  content: string;
}

function parseFrontmatter(raw: string): { frontmatter: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content: raw };

  const frontmatter: Record<string, unknown> = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value: unknown = line.slice(colonIdx + 1).trim();

    if ((value as string).startsWith('[') && (value as string).endsWith(']')) {
      value = (value as string).slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
    } else if ((value as string).startsWith('"') && (value as string).endsWith('"')) {
      value = (value as string).slice(1, -1);
    }

    frontmatter[key] = value;
  }

  return { frontmatter, content: match[2].trim() };
}

const modules = import.meta.glob('../content/blog/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;

export function getAllPosts(): BlogPost[] {
  const entries = Object.entries(modules).map(([path, raw]) => {
    const slug = path.split('/').pop()?.replace(/\.md$/, '') ?? '';
    const { frontmatter, content } = parseFrontmatter(raw);
    return {
      slug,
      title: frontmatter.title as string || slug,
      description: frontmatter.description as string || '',
      date: frontmatter.date as string || '',
      tags: frontmatter.tags as string[] || [],
      ogImage: frontmatter.ogImage as string | undefined,
      readingTime: frontmatter.readingTime as string || '',
      content,
    } satisfies BlogPost;
  });

  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  return getAllPosts().find(p => p.slug === slug) ?? null;
}
