'use client';

import {MessageCircle} from 'lucide-react';
import {motion} from 'motion/react';
import {GlowingEffect} from '@/components/ui/glowing-effect';
import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';

interface ServiceLandingPageProps {
  id: string;
  title: string;
  subtitle: string;
  desc: string[];
  whatsappText: string;
}

export default function ServiceLandingPage({
  id,
  title,
  subtitle,
  desc,
  whatsappText,
}: ServiceLandingPageProps) {
  const wppLink = `https://wa.me/584121234567?text=${encodeURIComponent(whatsappText)}`;

  return (
    <>
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        exit={{opacity: 0, y: -20}}
        transition={{duration: 0.5, ease: 'easeOut'}}
        className="flex flex-col min-h-screen"
      >
        <main className="flex-grow pt-32 pb-24 md:pt-40 md:pb-32 px-5 sm:px-6 md:px-12 max-w-7xl mx-auto w-full relative">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[400px] bg-scale-accent/5 rounded-full blur-[120px] pointer-events-none -z-10" />

          <Link
            href="/#servicios"
            className="inline-flex items-center gap-2 text-scale-muted hover:text-scale-accent transition-colors mb-12"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Volver a Servicios</span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-scale-accent/30 bg-scale-accent/10 text-scale-accent text-xs sm:text-sm font-medium tracking-wide mb-6">
                <span>Servicio Premium</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
                {title}
              </h1>

              <p className="text-xl sm:text-2xl font-semibold text-scale-accent mb-8">
                {subtitle}
              </p>

              <div className="space-y-6 text-scale-muted text-lg leading-relaxed mb-12">
                {desc.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="relative group perspective-1000">
              <div className="relative bg-scale-card border border-scale-border rounded-3xl p-8 shadow-2xl overflow-hidden transform transition-all duration-700 hover:rotate-y-12">
                <GlowingEffect
                  spread={80}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={2}
                />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-scale-accent/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(3,250,110,0.5)]">
                    <MessageCircle size={36} className="text-scale-accent" />
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-white">
                    ¿Te interesa este servicio?
                  </h3>
                  <p className="text-scale-muted mb-8 max-w-sm">
                    Habla directamente con nuestro equipo por WhatsApp y recibe
                    una consulta personalizada para tu negocio.
                  </p>

                  <a
                    href={wppLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20BE5C] text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] group-hover:scale-105"
                  >
                    <MessageCircle size={24} />
                    Contactar por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </motion.div>
    </>
  );
}
