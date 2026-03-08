import { Clock, Globe, MessageSquareWarning } from 'lucide-react';

export default function PainPoints() {
  const painPoints = [
    {
      icon: <Globe className="w-8 h-8 text-scale-accent" />,
      title: 'Webs obsoletas que no venden',
      description: 'Tu sitio web actual es un folleto digital sin vida. No capta leads, no genera confianza y ahuyenta a tus clientes potenciales hacia la competencia.',
    },
    {
      icon: <MessageSquareWarning className="w-8 h-8 text-scale-accent" />,
      title: 'Atención al cliente lenta que pierde ventas',
      description: 'Responder tarde a un mensaje de WhatsApp o Instagram significa perder una venta. Tus clientes exigen respuestas inmediatas, 24/7.',
    },
    {
      icon: <Clock className="w-8 h-8 text-scale-accent" />,
      title: 'Procesos manuales que consumen tu tiempo',
      description: 'Pasas horas copiando datos, enviando correos manuales y gestionando tareas repetitivas en lugar de enfocarte en hacer crecer tu negocio.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-scale-bg relative border-t border-scale-border/50">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-6">
            El mercado venezolano cambió. <br className="hidden sm:block" />
            <span className="text-scale-muted">¿Tu empresa se quedó atrás?</span>
          </h2>
          <p className="text-base sm:text-lg text-scale-muted">
            Si te identificas con alguno de estos problemas, estás perdiendo dinero todos los días.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className="bg-scale-card border border-scale-border rounded-2xl p-8 transition-all duration-300 hover:border-scale-accent/30 hover:-translate-y-2 group"
            >
              <div className="w-16 h-16 rounded-xl bg-scale-bg flex items-center justify-center mb-6 border border-scale-border group-hover:border-scale-accent/50 transition-colors">
                {point.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-scale-text">{point.title}</h3>
              <p className="text-scale-muted leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
