'use client';

import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

const SCROLL_KEY = 'scrollRestore';

function scrollToHash(hash: string) {
  let attempts = 0;
  const tryScroll = () => {
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'start'});
      return;
    }
    if (attempts < 20) {
      attempts++;
      requestAnimationFrame(tryScroll);
    }
  };
  tryScroll();
}

export default function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      scrollToHash(hash.slice(1));
      return;
    }

    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved) {
      const {path, y} = JSON.parse(saved);
      if (path === pathname) {
        requestAnimationFrame(() => {
          window.scrollTo(0, y);
        });
      }
      sessionStorage.removeItem(SCROLL_KEY);
      return;
    }

    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http')) return;

      sessionStorage.setItem(
        SCROLL_KEY,
        JSON.stringify({path: pathname, y: window.scrollY})
      );
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [pathname]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        scrollToHash(hash.slice(1));
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return null;
}
