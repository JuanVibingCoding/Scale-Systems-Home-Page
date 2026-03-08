import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-scale-bg/90 backdrop-blur-md border-b border-scale-border py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 flex items-center justify-between">
        <a href="#inicio" className="text-2xl font-bold tracking-tighter text-scale-text">
          Scale<span className="text-scale-accent">Systems</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-scale-muted hover:text-scale-text transition-colors"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contacto"
            className="bg-scale-accent hover:bg-scale-accent-hover text-scale-bg font-semibold px-6 py-2.5 rounded-full text-sm transition-all duration-300 shadow-[0_0_15px_rgba(3,250,110,0.3)] hover:shadow-[0_0_25px_rgba(3,250,110,0.5)]"
          >
            Solicitar Presupuesto
          </a>
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
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-scale-bg border-b border-scale-border py-4 px-6 flex flex-col gap-4 shadow-xl">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="text-base font-medium text-scale-muted hover:text-scale-text transition-colors block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contacto"
            className="bg-scale-accent text-scale-bg font-semibold px-6 py-3 rounded-full text-center transition-colors mt-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Solicitar Presupuesto
          </a>
        </div>
      )}
    </header>
  );
}
