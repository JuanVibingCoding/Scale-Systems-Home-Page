import { useEffect } from 'react';

const SITE_URL = 'https://scalesystems.com.ve';

interface SEOProps {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function SEO({ title, description, ogImage, ogType, canonical }: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} — Scale Systems`;
    document.title = fullTitle;

    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonical ?? SITE_URL);
    upsertMeta('property', 'og:type', ogType ?? 'website');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);

    const img = ogImage ?? '/og-default.svg';
    const absImg = img.startsWith('http') ? img : `${SITE_URL}${img}`;
    upsertMeta('property', 'og:image', absImg);
    upsertMeta('name', 'twitter:image', absImg);

    if (canonical) {
      upsertLink('canonical', canonical);
    }
  }, [title, description, ogImage, ogType, canonical]);

  return null;
}
