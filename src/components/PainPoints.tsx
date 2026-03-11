import { Clock, Globe, MessageSquareWarning } from 'lucide-react';
import { motion } from 'motion/react';
import { BlurredStagger } from './ui/blurred-stagger-text';

export default function PainPoints() {
  const painPoints = [
    {
      icon: Globe,
      colorClasses: {
        icon: 'text-[#0375fa]',
        cardHover: 'hover:border-[#0375fa]/30',
        iconBgHover: 'group-hover:border-[#0375fa]/50',
        glowBg: 'bg-[#0375fa]/5',
        glowBorder: 'before:from-[#0375fa]/50',
      },
      animation: 'group-hover:-rotate-6',
      title: 'Webs obsoletas que no venden',
      description: 'Tu sitio web actual es un folleto digital sin vida. No capta leads, no genera confianza y ahuyenta a tus clientes potenciales hacia la competencia.',
    },
    {
      icon: MessageSquareWarning,
      colorClasses: {
        icon: 'text-[#fadc03]',
        cardHover: 'hover:border-[#fadc03]/30',
        iconBgHover: 'group-hover:border-[#fadc03]/50',
        glowBg: 'bg-[#fadc03]/5',
        glowBorder: 'before:from-[#fadc03]/50',
      },
      animation: 'group-hover:rotate-6',
      title: 'Atención al cliente lenta que pierde ventas',
      description: 'Responder tarde a un mensaje de WhatsApp o Instagram significa perder una venta. Tus clientes exigen respuestas inmediatas, 24/7.',
    },
    {
      icon: Clock,
      colorClasses: {
        icon: 'text-[#fa0303]',
        cardHover: 'hover:border-[#fa0303]/30',
        iconBgHover: 'group-hover:border-[#fa0303]/50',
        glowBg: 'bg-[#fa0303]/5',
        glowBorder: 'before:from-[#fa0303]/50',
      },
      animation: 'group-hover:-rotate-12',
      title: 'Procesos manuales que consumen tu tiempo',
      description: 'Pasas horas copiando datos, enviando correos manuales y gestionando tareas repetitivas en lugar de enfocarte en hacer crecer tu negocio.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#171810] relative border-t border-[#2a2c1f]/50">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-6 text-white">
            <BlurredStagger text="El mercado venezolano cambió." className="inline-block" /> <br className="hidden sm:block" />
            <BlurredStagger text="¿Tu empresa se quedó atrás?" className="text-[#a1a1aa] inline-block" />
          </h2>
          <div className="text-base sm:text-lg text-[#a1a1aa]">
            <BlurredStagger text="Si te identificas con alguno de estos problemas, estás perdiendo dinero todos los días." className="inline-block" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {painPoints.map((point, index) => {
            const Icon = point.icon;
            return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.2, ease: "easeOut" } }}
              className={`glass-card rounded-2xl p-8 transition-colors duration-300 group relative overflow-hidden before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:p-[1px] before:bg-gradient-to-br before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 ${point.colorClasses.glowBorder} ${point.colorClasses.cardHover}`}
            >
              <div className={`w-16 h-16 rounded-xl bg-[#171810] flex items-center justify-center mb-6 border border-[#2a2c1f] transition-colors duration-300 z-10 relative ${point.colorClasses.iconBgHover}`}>
                <Icon className={`w-8 h-8 transition-transform duration-300 group-hover:scale-110 ${point.colorClasses.icon} ${point.animation}`} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white z-10 relative">{point.title}</h3>
              <p className="text-[#a1a1aa] leading-relaxed z-10 relative">{point.description}</p>
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${point.colorClasses.glowBg}`}></div>
            </motion.div>
          )})}
        </div>
      </div>
    </section>
  );
}
