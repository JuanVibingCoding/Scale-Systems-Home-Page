'use client';

import {motion, AnimatePresence} from 'motion/react';
import {GlowingEffect} from '@/components/ui/glowing-effect';
import {RobotIcon} from '@/components/ui/robot-icon';
import {useGlobalMouse} from '@/lib/use-global-mouse';
import Link from 'next/link';
import {ArrowLeft, MessageCircle, Zap, XCircle, Lock, Smartphone, Shield, BarChart3, Search} from 'lucide-react';
import {cn} from '@/lib/utils';
import {useState, useEffect, lazy, Suspense} from 'react';

const ChatWindow = lazy(() => import('./ChatWindow'));

const painPoints = [
  {
    icon: <BarChart3 className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Dependes del algoritmo',
    desc: 'Un día tu alcance orgánico cae, y no hay nadie a quien reclamarle. La plataforma decide, no tú.',
  },
  {
    icon: <XCircle className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Tus seguidores no son tuyos',
    desc: 'Son de la plataforma. Si tu cuenta se cae, se bloquea o decides irte, ese "activo" desaparece contigo.',
  },
  {
    icon: <Lock className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Meta restringe la venta directa a WhatsApp',
    desc: 'Cada vez es más difícil convertir un seguidor en cliente sin fricción usando solo campañas pagas.',
  },
  {
    icon: <Smartphone className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Compites en el mismo feed',
    desc: 'Justo al lado de tu publicación, el algoritmo le muestra a tu cliente potencial la oferta de tu competencia.',
  },
  {
    icon: <Shield className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'No hay marca, hay perfil',
    desc: 'Es difícil transmitir seriedad ante clientes corporativos cuando tu única presencia digital es una cuenta de red social.',
  },
  {
    icon: <Zap className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'No hay datos, no hay CRM',
    desc: 'No puedes construir una base de clientes real, ni automatizar seguimiento, ni conectar un chatbot a tu propio sistema.',
  },
];

const benefits = [
  {
    icon: <Zap className="w-5 h-5 text-scale-accent" />,
    title: 'Velocidad real, no promesas',
    desc: 'Sitios optimizados para cargar en segundos. Cada segundo de más cuesta visitantes y ventas.',
  },
  {
    icon: <Smartphone className="w-5 h-5 text-scale-accent" />,
    title: 'Diseño a la medida, cero plantillas',
    desc: 'Cada proyecto se diseña desde cero, pensado para tu negocio y tu cliente ideal, no un tema genérico reciclado.',
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-scale-accent" />,
    title: 'Enfocado en conversión, no solo estética',
    desc: 'Cada botón, formulario y página está pensada para guiar al visitante hacia una acción: comprar, agendar o escribir.',
  },
  {
    icon: <MessageCircle className="w-5 h-5 text-scale-accent" />,
    title: 'Se integra con IA y automatización',
    desc: 'Conectamos tu web con tu chatbot, tu CRM y tu sistema de facturación, para que trabajen como un solo sistema.',
  },
  {
    icon: <Shield className="w-5 h-5 text-scale-accent" />,
    title: 'Seguridad y disponibilidad',
    desc: 'Infraestructura confiable, para que tu sitio esté disponible incluso en los momentos de mayor tráfico.',
  },
  {
    icon: <Search className="w-5 h-5 text-scale-accent" />,
    title: 'SEO pensado para Venezuela',
    desc: 'Optimizamos para que te encuentren en Google cuando alguien busca lo que tú vendes, en tu ciudad.',
  },
];

const serviceModes = [
  {
    tag: 'Desde cero',
    title: 'Diseño Web desde Cero',
    desc: 'Para negocios que quieren construir su primer terreno propio, o dejar atrás una plantilla genérica que no representa su marca.',
    items: ['Arquitectura y diseño 100% a la medida', 'Ecommerce, corporativo o landing de conversión', 'Optimizado para velocidad y SEO desde el día uno'],
    featured: false,
  },
  {
    tag: 'Más solicitado',
    title: 'Rediseño de Sitios Existentes',
    desc: 'Tu web ya existe, pero no convierte, se ve anticuada o carga lento. La auditamos y reconstruimos sin perder lo que ya funciona.',
    items: ['Auditoría de velocidad, UX y SEO', 'Conservamos tu posicionamiento acumulado', 'Nueva estructura enfocada en conversión'],
    featured: true,
  },
  {
    tag: 'Continuo',
    title: 'Mantenimiento y Actualización',
    desc: 'Planes para mantener tu sitio actualizado, seguro y funcionando, sin que tengas que pensarlo tú.',
    items: ['Actualizaciones y respaldos periódicos', 'Monitoreo de seguridad y disponibilidad', 'Ajustes de contenido bajo demanda'],
    featured: false,
  },
];

const processSteps = [
  {num: '01', title: 'Diagnóstico', desc: 'Entendemos tu negocio, tu cliente y qué te está costando tu web actual (o no tener una).'},
  {num: '02', title: 'Diseño', desc: 'Prototipo visual a la medida, con foco en marca y conversión. Apruebas antes de escribir una sola línea de código.'},
  {num: '03', title: 'Desarrollo', desc: 'Construcción con tecnología moderna, optimizada para velocidad, seguridad y SEO desde el primer día.'},
  {num: '04', title: 'Lanzamiento y soporte', desc: 'Publicamos, medimos y seguimos optimizando. Tu web nunca queda "terminada y olvidada".'},
];

const faqs = [
  {
    q: 'Ya tengo una página en Instagram o Facebook, ¿de verdad necesito una web?',
    a: 'Las redes sociales son excelentes para conectar y mostrar tu marca, pero no reemplazan un canal de ventas propio. Un sitio web te da control total sobre tus datos, tu diseño y tu experiencia de compra, algo que ninguna plataforma externa te puede garantizar.',
  },
  {
    q: 'Ya tengo una web pero no me trae clientes, ¿qué hacen distinto?',
    a: 'Empezamos con una auditoría real: velocidad, experiencia de usuario y estructura de conversión. La mayoría de las webs que "no funcionan" tienen buen contenido pero una arquitectura que no guía al visitante hacia la compra. Rediseñamos sobre esa base, sin perder tu posicionamiento acumulado.',
  },
  {
    q: '¿Cuánto tiempo toma tener mi sitio funcionando?',
    a: 'Depende de la complejidad del proyecto: no es lo mismo una landing page que un ecommerce completo. En el diagnóstico inicial te entregamos un cronograma claro, sin sorpresas ni promesas genéricas.',
  },
  {
    q: '¿Se integra con WhatsApp y mis chatbots?',
    a: 'Sí. Como también diseñamos sistemas de automatización y chatbots con IA, tu sitio puede conectarse directamente con tu atención por WhatsApp, tu agendamiento y tu CRM, funcionando como un solo sistema.',
  },
  {
    q: '¿Y si mi negocio es pequeño todavía?',
    a: 'Precisamente por eso conviene empezar temprano. Un sitio bien construido crece contigo: hoy puede ser una landing de conversión simple, y en el futuro escalar a un ecommerce completo, sin rehacer todo desde cero.',
  },
];

function LandDiagram() {
  return (
    <svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Comparación entre construir tu negocio en una red social (terreno alquilado) y en tu propio sitio web (terreno propio)" className="w-full h-auto">
      <defs>
        <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#03fa6e" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#03fa6e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="30" y1="230" x2="870" y2="230" stroke="#383a2c" strokeWidth="2" />
      <g>
        <rect x="60" y="150" width="300" height="80" fill="none" stroke="#5a5c48" strokeWidth="1.5" strokeDasharray="6 6" />
        <rect x="150" y="120" width="120" height="60" fill="none" stroke="#5a5c48" strokeWidth="2" />
        <path d="M145 120 L210 90 L275 120" fill="none" stroke="#5a5c48" strokeWidth="2" strokeLinejoin="round" />
        <rect x="195" y="150" width="30" height="30" fill="none" stroke="#5a5c48" strokeWidth="1.5" />
        <g transform="translate(190,50)">
          <rect x="0" y="14" width="40" height="28" rx="4" fill="none" stroke="#5a5c48" strokeWidth="2" />
          <path d="M8 14v-4a12 12 0 0124 0v4" fill="none" stroke="#5a5c48" strokeWidth="2" />
          <circle cx="20" cy="28" r="3" fill="#5a5c48" />
        </g>
        <text x="210" y="255" textAnchor="middle" fill="#9a9c87" fontFamily="JetBrains Mono, monospace" fontSize="13" fontWeight="600">RED SOCIAL</text>
        <text x="210" y="272" textAnchor="middle" fill="#6a6c58" fontFamily="JetBrains Mono, monospace" fontSize="11">terreno alquilado</text>
      </g>
      <line x1="450" y1="70" x2="450" y2="230" stroke="#383a2c" strokeWidth="1" strokeDasharray="4 6" />
      <g>
        <rect x="540" y="230" width="300" height="6" fill="url(#glow)" />
        <rect x="560" y="140" width="260" height="90" fill="none" stroke="#03fa6e" strokeWidth="2" />
        <rect x="640" y="105" width="140" height="65" fill="none" stroke="#03fa6e" strokeWidth="2.5" />
        <path d="M632 105 L710 65 L788 105" fill="none" stroke="#03fa6e" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="695" y="140" width="30" height="30" fill="#03fa6e" opacity="0.9" />
        <rect x="655" y="120" width="18" height="18" fill="none" stroke="#03fa6e" strokeWidth="1.5" />
        <rect x="747" y="120" width="18" height="18" fill="none" stroke="#03fa6e" strokeWidth="1.5" />
        <line x1="710" y1="65" x2="710" y2="35" stroke="#03fa6e" strokeWidth="2" />
        <path d="M710 35 L740 42 L710 49 Z" fill="#03fa6e" />
        <path d="M600 230 L590 250 M650 230 L645 252 M770 230 L775 252 M820 230 L830 250" stroke="#03fa6e" strokeWidth="1.5" opacity="0.5" />
        <text x="690" y="255" textAnchor="middle" fill="#f3f2e8" fontFamily="JetBrains Mono, monospace" fontSize="13" fontWeight="700">TU SITIO WEB</text>
        <text x="690" y="272" textAnchor="middle" fill="#03fa6e" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="600">terreno propio</text>
      </g>
    </svg>
  );
}

function FAQItem({q, a}: {q: string; a: string}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-scale-border py-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center gap-5 text-left font-semibold text-base text-scale-text cursor-pointer"
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className={cn('text-scale-accent font-mono text-xl flex-shrink-0 transition-transform duration-200', open && 'rotate-45')}>+</span>
      </button>
      {open && (
        <motion.p
          initial={{opacity: 0, height: 0}}
          animate={{opacity: 1, height: 'auto'}}
          className="text-scale-muted text-base mt-3.5 max-w-[680px]"
        >
          {a}
        </motion.p>
      )}
    </div>
  );
}

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
  const isDisenoWeb = id === 'diseno-web';
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 250);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, y: -20}}
      transition={{duration: 0.5, ease: 'easeOut'}}
      className="flex flex-col min-h-screen"
    >
      <main className="flex-grow">
        {isDisenoWeb ? (
          <>
            {/* BACK NAV */}
            <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 pt-24 sm:pt-28">
              <Link
                href="/#servicios"
                className="inline-flex items-center gap-2 text-scale-muted hover:text-scale-accent transition-colors font-mono text-sm"
              >
                <ArrowLeft size={16} />
                Volver a Servicios
              </Link>
            </div>

            {/* HERO */}
            <section className="pt-6 md:pt-8 pb-20 md:pb-24">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                    <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                    Diseño & Desarrollo Web
                  </div>
                  <h1 className="text-[clamp(34px,4.6vw,54px)] font-bold leading-[1.15] tracking-tight mb-5">
                    Tu sitio web no es una vitrina. Es tu <span className="text-scale-accent">mejor vendedor</span>, trabajando 24 horas al día.
                  </h1>
                  <p className="text-lg text-scale-muted max-w-[540px] mb-8">
                    Diseñamos y desarrollamos sitios ultrarrápidos, hechos a la medida de tu negocio, para que dejes de depender del algoritmo y empieces a controlar cómo te encuentran, te conocen y te compran.
                  </p>
                  <div className="flex gap-4 flex-wrap mb-7">
                    <a href="#contacto" className="inline-flex items-center gap-2.5 px-7 py-[15px] rounded-full font-semibold text-sm bg-scale-accent text-[#0c1008] hover:translate-y-[-2px] hover:shadow-[0_10px_30px_-8px_rgba(3,250,110,0.28)] transition-all duration-150">
                      Solicita tu Diagnóstico Gratuito
                    </a>
                    <a href="#proceso" className="inline-flex items-center gap-2.5 px-7 py-[15px] rounded-full font-semibold text-sm bg-transparent border border-scale-border text-scale-text hover:border-scale-accent hover:text-scale-accent transition-all duration-150">
                      Ver cómo trabajamos
                    </a>
                  </div>
                  <p className="font-mono text-sm text-scale-muted">
                    <span className="text-scale-text font-bold">+25 años</span> diseñando y desarrollando sitios web, ecommerce y plataformas digitales en Venezuela.
                  </p>
                </div>
                <div className="relative bg-scale-card border border-scale-border rounded-[20px] p-6 overflow-hidden" aria-hidden="true">
                  <div className="absolute inset-0 pointer-events-none" style={{backgroundImage: 'linear-gradient(#2a2c1f 1px, transparent 1px), linear-gradient(90deg, #2a2c1f 1px, transparent 1px)', backgroundSize: '26px 26px', opacity: 0.25}} />
                  <div className="flex gap-[6px] mb-4 relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-scale-border" />
                    <span className="w-2.5 h-2.5 rounded-full bg-scale-border" />
                    <span className="w-2.5 h-2.5 rounded-full bg-scale-border" />
                  </div>
                  <div className="h-2.5 rounded bg-scale-border mb-2.5 w-2/5 relative" />
                  <div className="h-2.5 rounded bg-scale-border mb-2.5 w-4/5 relative" />
                  <div className="h-2.5 rounded bg-scale-border mb-2.5 w-3/5 relative" />
                  <div className="h-[34px] w-[44%] rounded-full bg-scale-accent mt-[18px] relative" />
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-[#1d1f15] border border-scale-border rounded-[10px] h-16" />
                    <div className="bg-[#1d1f15] border border-scale-border rounded-[10px] h-16" />
                  </div>
                </div>
              </div>
            </section>

            {/* STATS BAR */}
            <div className="border-y border-scale-border py-8">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="font-mono text-[clamp(26px,3vw,36px)] font-bold text-scale-accent">25+</div>
                  <div className="text-sm text-scale-muted mt-1.5 leading-[1.4]">Años de experiencia en desarrollo web y ecommerce</div>
                </div>
                <div>
                  <div className="font-mono text-[clamp(26px,3vw,36px)] font-bold text-scale-accent">125%</div>
                  <div className="text-sm text-scale-muted mt-1.5 leading-[1.4]">Creció el comercio electrónico en Venezuela durante 2025 (Cavecom-e)</div>
                </div>
                <div>
                  <div className="font-mono text-[clamp(26px,3vw,36px)] font-bold text-scale-accent">80%</div>
                  <div className="text-sm text-scale-muted mt-1.5 leading-[1.4]">De los venezolanos se conecta a internet desde su celular</div>
                </div>
                <div>
                  <div className="font-mono text-[clamp(26px,3vw,36px)] font-bold text-scale-accent">24/7</div>
                  <div className="text-sm text-scale-muted mt-1.5 leading-[1.4]">Tu sitio vende y atiende, incluso cuando tú no estás conectado</div>
                </div>
              </div>
            </div>

            {/* PAIN SECTION */}
            <section className="py-20 md:py-24 bg-[#1d1f15]">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="max-w-[760px] mb-5">
                  <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                    <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                    La realidad del mercado
                  </div>
                  <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold leading-[1.15] tracking-tight mb-4">El peligro de construir tu negocio en terreno ajeno</h2>
                  <p className="text-[17.5px] text-scale-muted mb-4">
                    Cada publicación que subes a Instagram, cada catálogo que armas en tu perfil de Facebook, cada seguidor que ganas con esfuerzo: <strong className="text-scale-text">no es tuyo.</strong> Estás construyendo tu negocio sobre terreno alquilado, y el dueño del terreno puede cambiar las reglas cuando quiera.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-[18px_32px] my-10">
                  {painPoints.map((p, i) => (
                    <div key={i} className="flex gap-[14px]">
                      <div className="flex-shrink-0 w-[34px] h-[34px] rounded-[9px] bg-[rgba(3,250,110,0.14)] border border-[rgba(3,250,110,0.28)] flex items-center justify-center">
                        {p.icon}
                      </div>
                      <div>
                        <h4 className="text-base font-bold mb-1">{p.title}</h4>
                        <p className="text-base text-scale-muted">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-scale-card border border-scale-border border-l-[3px] border-l-scale-accent rounded-[14px] p-[26px_28px] my-12">
                  <span className="block font-mono text-xs tracking-[0.1em] text-scale-accent uppercase font-bold mb-2.5">La realidad venezolana</span>
                  <p className="text-base">A esto se suma algo que todo empresario en Venezuela conoce de primera mano: la atención al cliente lenta y la falta de sitios web que realmente vendan están entre las quejas más comunes del consumidor local. Mensajes sin responder, catálogos desactualizados en un PDF de WhatsApp, páginas que tardan más de lo que un visitante está dispuesto a esperar. El resultado: negocios con buenos productos que pierden ventas por una experiencia digital que no está a la altura, justo cuando el ecommerce venezolano crece a un ritmo histórico.</p>
                </div>

                <div className="my-14">
                  <LandDiagram />
                  <p className="text-center font-mono text-sm text-scale-muted mt-3.5 tracking-[0.03em]">Lo que construyes sobre terreno alquilado puede desaparecer. Lo que construyes sobre terreno propio, se queda contigo.</p>
                </div>

                <div className="overflow-x-auto border border-scale-border rounded-[14px] mt-2.5">
                  <table className="min-w-[640px] w-full">
                    <caption className="text-left font-mono text-sm text-scale-muted p-[14px_20px_0]">Comparación: presencia en redes sociales vs. sitio web propio</caption>
                    <thead>
                      <tr>
                        <th scope="col" className="font-mono text-sm uppercase tracking-[0.06em] text-scale-muted bg-[#1d1f15] font-semibold p-[15px_20px] text-left">Aspecto</th>
                        <th scope="col" className="font-mono text-sm uppercase tracking-[0.06em] text-scale-muted bg-[#1d1f15] font-semibold p-[15px_20px] text-left">Red social (terreno alquilado)</th>
                        <th scope="col" className="font-mono text-sm uppercase tracking-[0.06em] text-scale-accent bg-[#1d1f15] font-semibold p-[15px_20px] text-left">Tu sitio web (terreno propio)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Propiedad de tus datos y clientes', 'La plataforma es dueña', 'Tuya, para siempre'],
                        ['Control del diseño y la marca', 'Limitado a la plantilla de la app', 'Total, a tu medida'],
                        ['Dependencia del algoritmo', 'Alta: decide quién te ve', 'Ninguna: tú decides quién te encuentra'],
                        ['Riesgo de suspensión o bloqueo', 'Real y fuera de tu control', 'No existe'],
                        ['Venta 24/7 sin publicar constantemente', 'Requiere contenido constante', 'Automática, siempre activa'],
                        ['Integración con CRM, pagos y automatizaciones', 'Muy limitada', 'Total'],
                        ['Posicionamiento en Google a largo plazo (SEO)', 'Prácticamente nulo', 'Se construye y compone con el tiempo'],
                        ['Primera impresión ante clientes corporativos', 'Informal', 'Profesional'],
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-[rgba(255,255,255,0.02)]">
                          <td className="p-[15px_20px] text-base border-b border-scale-border text-left">{row[0]}</td>
                          <td className="p-[15px_20px] text-base border-b border-scale-border text-left text-scale-muted"><span className="mr-2 text-scale-border">—</span>{row[1]}</td>
                          <td className="p-[15px_20px] text-base border-b border-scale-border text-left font-semibold"><span className="text-scale-accent mr-2 font-bold">✓</span>{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* BENEFITS */}
            <section id="solucion" className="py-20 md:py-24">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                  <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                  La solución
                </div>
                <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold leading-[1.15] tracking-tight max-w-[720px]">Una web que no es un folleto digital: es un sistema de ventas</h2>
                <p className="text-scale-muted text-[17px] max-w-[620px] mt-4">Como agencia de IA y automatización, no diseñamos páginas aisladas. Construimos el canal digital que conecta con el resto de tu negocio: tu chatbot, tu CRM, tu facturación.</p>

                <div className="grid md:grid-cols-3 gap-[22px] mt-11">
                  {benefits.map((b, i) => (
                    <div key={i} className="bg-scale-card border border-scale-border rounded-[14px] p-[26px] hover:border-[rgba(3,250,110,0.28)] hover:-translate-y-[3px] transition-all duration-200">
                      <div className="w-[42px] h-[42px] rounded-[11px] bg-[rgba(3,250,110,0.14)] border border-[rgba(3,250,110,0.28)] flex items-center justify-center mb-4">
                        {b.icon}
                      </div>
                      <h3 className="text-base font-bold mb-2">{b.title}</h3>
                      <p className="text-base text-scale-muted">{b.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SERVICES BREAKDOWN */}
            <section className="py-20 md:py-24 bg-[#1d1f15]">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                  <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                  Cómo trabajamos contigo
                </div>
                <h2 className="text-[clamp(26px,3.2vw,36px)] font-bold max-w-[640px]">Tres formas de empezar, según dónde estés hoy</h2>

                <div className="grid md:grid-cols-3 gap-[22px] mt-11">
                  {serviceModes.map((s, i) => (
                    <div key={i} className={cn('border rounded-[14px] p-[30px_26px] flex flex-col', s.featured ? 'border-scale-accent shadow-[inset_0_0_0_1px_#03fa6e] bg-scale-card' : 'border-scale-border bg-[#1d1f15]')}>
                      <span className="font-mono text-xs text-scale-accent uppercase tracking-[0.08em] font-bold mb-3.5">{s.tag}</span>
                      <h3 className="text-[19px] font-bold mb-2.5">{s.title}</h3>
                      <p className="text-base text-scale-muted mb-[18px] flex-grow">{s.desc}</p>
                      <ul>
                        {s.items.map((item, j) => (
                          <li key={j} className="text-sm text-scale-muted pl-[18px] relative mb-2 before:content-['→'] before:absolute before:left-0 before:text-scale-accent">{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* EXPERIENCE / STACK */}
            <section className="py-20 md:py-24">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 grid md:grid-cols-2 gap-14 items-start">
                <div>
                  <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                    <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                    Experiencia
                  </div>
                  <h2 className="text-[clamp(26px,3.2vw,34px)] font-bold">Más de 25 años construyendo lo que tu negocio necesita</h2>
                  <p className="text-scale-muted text-base mt-4">Desde tiendas en línea hasta plataformas de aprendizaje y sitios corporativos, hemos diseñado y desarrollado para prácticamente todo tipo de negocio.</p>
                  <div className="grid grid-cols-2 gap-3.5 mt-6">
                    <div className="border border-scale-border rounded-lg p-[14px_16px] text-base text-scale-muted"><b className="block text-scale-text text-sm mb-[3px]">Ecommerce</b>Tiendas en línea completas, con pagos y logística integrados.</div>
                    <div className="border border-scale-border rounded-lg p-[14px_16px] text-base text-scale-muted"><b className="block text-scale-text text-sm mb-[3px]">Plataformas de aprendizaje</b>Sistemas LMS para cursos y contenido educativo.</div>
                    <div className="border border-scale-border rounded-lg p-[14px_16px] text-base text-scale-muted"><b className="block text-scale-text text-sm mb-[3px]">Webs corporativas</b>Presencia institucional seria, para negocios B2B.</div>
                    <div className="border border-scale-border rounded-lg p-[14px_16px] text-base text-scale-muted"><b className="block text-scale-text text-sm mb-[3px]">Landing pages</b>Páginas de alta conversión para campañas específicas.</div>
                  </div>
                </div>
                <div>
                  <div className="font-mono text-xs text-scale-muted uppercase tracking-[0.08em] mb-4">Tecnologías con las que trabajamos</div>
                  <div className="flex flex-wrap gap-2.5">
                    {['WordPress', 'WooCommerce', 'Shopify', 'Wix', 'PHP', 'Next.js', 'Python'].map((tech) => (
                      <span key={tech} className="font-mono text-xs px-4 py-[9px] rounded-full border border-scale-border text-scale-muted">{tech}</span>
                    ))}
                  </div>
                  <p className="text-scale-muted text-base mt-5">Elegimos la tecnología según lo que tu negocio realmente necesita, no según lo que nos resulte más cómodo a nosotros. Un ecommerce mediano no necesita lo mismo que una plataforma a medida con lógica de negocio compleja.</p>
                </div>
              </div>
            </section>

            {/* PROCESS */}
            <section id="proceso" className="py-20 md:py-24 bg-[#1d1f15]">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                  <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                  Nuestro proceso
                </div>
                <h2 className="text-[clamp(26px,3.2vw,36px)] font-bold max-w-[600px]">Cómo trabajamos, de principio a fin</h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[22px] mt-12">
                  {processSteps.map((step, i) => (
                    <div key={i} className="pt-2">
                      <div className="font-mono text-3xl text-scale-accent font-bold mb-3.5">{step.num}</div>
                      <h4 className="text-base font-bold mb-2">{step.title}</h4>
                      <p className="text-base text-scale-muted">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="py-20 md:py-24">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                  <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                  Preguntas frecuentes
                </div>
                <h2 className="text-[clamp(26px,3.2vw,34px)] font-bold">Resolvemos tus dudas antes de que las tengas</h2>

                <div className="mt-10 max-w-[820px]">
                  {faqs.map((faq, i) => (
                    <FAQItem key={i} q={faq.q} a={faq.a} />
                  ))}
                </div>
              </div>
            </section>

            {/* FINAL CTA */}
            <section id="contacto" className="pb-20 md:pb-24">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="text-center bg-scale-card border border-[rgba(3,250,110,0.28)] rounded-[20px] py-[70px] px-[40px] sm:px-10">
                  <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                    <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                    Empecemos
                  </div>
                  <h2 className="text-[clamp(26px,3.4vw,38px)] font-bold mb-4">
                    Deja de alquilar tu presencia digital.<br />Empieza a construir sobre terreno propio.
                  </h2>
                  <p className="text-scale-muted text-base max-w-[560px] mx-auto mb-8">
                    Una conversación cara a cara, sin compromiso. Te decimos qué necesita tu negocio, no lo que es más fácil vendernos a nosotros.
                  </p>
                  <a href={wppLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 px-7 py-[15px] rounded-full font-semibold text-sm bg-scale-accent text-[#0c1008] hover:translate-y-[-2px] hover:shadow-[0_10px_30px_-8px_rgba(3,250,110,0.28)] transition-all duration-150">
                    Solicita tu Diagnóstico Gratuito
                  </a>
                  <p className="font-mono text-xs text-scale-muted mt-5">Respuesta en menos de 24 horas · Servicio personalizado · Valencia y Caracas</p>
                </div>
              </div>
            </section>

            {/* CHATBOT */}
            <AnimatePresence>
              {isScrolled && !isChatOpen && (
                <motion.div
                  className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end"
                  initial={{opacity: 0, scale: 0.5, y: 20}}
                  animate={{opacity: 1, scale: 1, y: 0}}
                  exit={{opacity: 0, scale: 0.5, y: 20}}
                  transition={{type: 'spring', bounce: 0.25, duration: 0.5}}
                >
                  <div
                    onClick={() => setIsChatOpen(true)}
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-scale-accent rounded-xl sm:rounded-2xl cursor-pointer shadow-[0_0_30px_rgba(3,250,110,0.3)] flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <RobotIcon mousePos={{x: 0, y: 0}} className="w-7 h-7 sm:w-10 sm:h-10" isDark={true} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isChatOpen && (
                <Suspense fallback={null}>
                  <ChatWindow onClose={() => setIsChatOpen(false)} />
                </Suspense>
              )}
            </AnimatePresence>
          </>
        ) : (
          <>
            {/* ORIGINAL LAYOUT FOR OTHER SERVICES */}
            <div className="pt-32 pb-24 md:pt-40 md:pb-32 px-5 sm:px-6 md:px-12 max-w-7xl mx-auto w-full relative">
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
            </div>
          </>
        )}
      </main>
    </motion.div>
  );
}
