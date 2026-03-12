import { Code2, Settings, Bot, ArrowRight } from 'lucide-react';
import { BlurredStagger } from './ui/blurred-stagger-text';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Services() {
  const services = [
    {
      id: 'diseno-web',
      icon: <Code2 className="w-10 h-10 text-scale-bg" />,
      title: 'Diseño Web Vanguardista',
      description: 'Tu vitrina digital optimizada para convertir.',
      details: 'Creamos sitios web ultrarrápidos, con diseño premium y enfocados en la experiencia del usuario. No más plantillas aburridas; construimos máquinas de ventas.',
    },
    {
      id: 'automatizacion',
      icon: <Settings className="w-10 h-10 text-scale-bg" />,
      title: 'Automatización Pro',
      description: 'Elimina el error humano y acelera tu crecimiento.',
      details: 'Conectamos tus herramientas (CRM, Email, WhatsApp) para que trabajen solas. Desde la captura del lead hasta la factura, todo en piloto automático.',
    },
    {
      id: 'chatbots',
      icon: <Bot className="w-10 h-10 text-scale-bg" />,
      title: 'AI Chatbots',
      description: 'Atención instantánea que cierra ventas por ti.',
      details: 'Entrenamos agentes de IA con la información de tu empresa para responder dudas, agendar citas y vender 24/7 en WhatsApp, Instagram y tu web.',
    },
  ];

  return (
    <section id="servicios" className="py-16 sm:py-32 bg-scale-bg relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-scale-border to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-scale-accent/30 bg-scale-accent/10 text-scale-accent text-xs sm:text-sm font-medium tracking-wide mb-4 sm:mb-6">
            <span>Nuestras Soluciones</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            <BlurredStagger text="El sistema operativo para" className="inline-block" /> <br className="hidden sm:block" />
            <BlurredStagger text="escalar tu negocio" className="text-scale-accent inline-block" />
          </h2>
          <div className="text-base sm:text-xl text-scale-muted">
            <BlurredStagger text="Implementamos tecnología de punta para que dejes de apagar incendios y empieces a dirigir tu empresa." className="inline-block" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 cursor-pointer">
          {services.map((service, index) => (
            <Link to={`/servicio/${service.id}`} key={index}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative bg-scale-card border border-scale-border rounded-3xl p-8 sm:p-10 overflow-hidden h-full shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(3,250,110,0.15)]"
              >
                {/* Hover Glow */}
                <div className="absolute -inset-px bg-gradient-to-b from-scale-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-20 h-20 rounded-2xl bg-scale-accent flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(3,250,110,0.4)]">
                    {service.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-scale-text group-hover:text-scale-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-lg font-medium text-scale-text mb-4">
                    {service.description}
                  </p>
                  <p className="text-scale-muted leading-relaxed flex-grow">
                    {service.details}
                  </p>
                  
                  <div className="mt-8 flex items-center gap-2 text-scale-accent font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    Saber más <ArrowRight size={18} />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
