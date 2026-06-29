'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      setIsMobileMenuOpen(false);

      if (href.startsWith('/#')) {
        const hash = href.slice(2);
        if (pathname === '/') {
          e.preventDefault();
          scrollToHash(hash);
          window.history.pushState(null, '', `/#${hash}`);
        }
      }
    },
    [pathname]
  );

  const isActive = (href: string) => {
    if (href === '/#servicios') {
      return pathname.startsWith('/servicio');
    }
    return pathname === '/' && window.location.hash === href.slice(1);
  };

  const navLinks = [
    {name: 'Inicio', href: '/#inicio'},
    {name: 'Servicios', href: '/#servicios'},
    {name: 'Portafolio', href: '/#portafolio'},
    {name: 'Contacto', href: '/#contacto'},
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled || isMobileMenuOpen
          ? 'bg-[#171810]/95 backdrop-blur-md border-[#2a2c1f] py-4'
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 flex items-center justify-between">
        <Link
          href="/#inicio"
          className="flex items-center group transition-transform hover:scale-105"
          onClick={(e) => handleNavClick(e, '/#inicio')}
        >
          <img
            src="/logos/ScaleSystemsLogo250.png"
            alt="Scale Systems Logo"
            className="h-7 md:h-9 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-[#03fa6e]'
                      : 'text-[#a1a1aa] hover:text-[#03fa6e]'
                  }`}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#contacto"
            className="bg-[#03fa6e] hover:bg-[#02d65e] text-[#171810] font-semibold px-6 py-2.5 rounded-full text-sm transition-all duration-300 shadow-[0_0_15px_rgba(3,250,110,0.3)] hover:shadow-[0_0_25px_rgba(3,250,110,0.5)] transform hover:-translate-y-0.5"
            onClick={(e) => handleNavClick(e, '/#contacto')}
          >
            Solicitar Presupuesto
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-scale-text"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{opacity: 0, y: -10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            transition={{duration: 0.2}}
            className="md:hidden absolute top-full left-0 right-0 bg-[#171810] border-b border-[#2a2c1f] py-4 px-6 flex flex-col gap-4 shadow-xl"
          >
            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-base font-medium text-[#a1a1aa] hover:text-[#03fa6e] transition-colors block"
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/#contacto"
              className="bg-[#03fa6e] text-[#171810] font-semibold px-6 py-3 rounded-full text-center transition-all duration-300 hover:bg-[#02d65e] mt-2 shadow-[0_0_15px_rgba(3,250,110,0.2)]"
              onClick={(e) => handleNavClick(e, '/#contacto')}
            >
              Solicitar Presupuesto
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
