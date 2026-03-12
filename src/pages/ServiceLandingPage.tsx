import { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ContactFooter from '../components/ContactFooter';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { GlowingEffect } from '../components/ui/glowing-effect';

const servicesData: Record<string, { title: string, subtitle: string, desc: string[], whatsappText: string }> = {
  'diseno-web': {
    title: 'Diseño Web Vanguardista',
    subtitle: 'Tu vitrina digital optimizada para convertir',
    desc: [
      'Creamos sitios web ultrarrápidos, con diseño premium y enfocados en la experiencia del usuario.',
      'No más plantillas aburridas; construimos verdaderas máquinas de ventas diseñadas a la medida de tu negocio.',
      'Con un enfoque absoluto en conversiones y posicionamiento, tu nueva web destacará entre la competencia y atraerá clientes potenciales constantemente.'
    ],
    whatsappText: '¡Hola! Quiero cotizar un Diseño Web Vanguardista.',
  },
  'automatizacion': {
    title: 'Automatización Pro',
    subtitle: 'Elimina el error humano y acelera tu crecimiento',
    desc: [
      'Conectamos tus herramientas (CRM, Email, WhatsApp) para que trabajen de forma sincronizada y sin intervención humana.',
      'Desde la captura del lead hasta el cobro de la factura, configuramos todo en piloto automático para escalar sin esfuerzo.',
      'Ahorra horas en tareas repetitivas cada semana y permite que tu equipo se concentre verdaderamente en lo importante: cerrar ventas y aportar valor.'
    ],
    whatsappText: '¡Hola! Me interesa la Automatización Pro para mi empresa.',
  },
  'chatbots': {
    title: 'AI Chatbots',
    subtitle: 'Atención instantánea que cierra ventas por ti',
    desc: [
      'Entrenamos agentes de Inteligencia Artificial utilizando la información de tu empresa, documentos, manuales y casos de uso específicos.',
      'Tu chatbot personalizado será capaz de responder dudas, agendar citas y cerrar ventas 24/7 en plataformas como WhatsApp, Instagram y tu sitio web.',
      'Ofrece una experiencia de cliente superior mientras reduces costos operativos drásticamente.'
    ],
    whatsappText: '¡Hola! Necesito un Chatbot con IA para mi negocio.',
  }
};

export default function ServiceLandingPage() {
  const { id } = useParams<{ id: string }>();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!id || !servicesData[id]) {
    return <Navigate to="/" />;
  }

  const data = servicesData[id];
  const wppLink = `https://wa.me/584121234567?text=${encodeURIComponent(data.whatsappText)}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col min-h-screen"
    >
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 md:pt-40 md:pb-32 px-5 sm:px-6 md:px-12 max-w-7xl mx-auto w-full relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[400px] bg-scale-accent/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-scale-muted hover:text-scale-accent transition-colors mb-12"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Volver a Soluciones</span>
        </Link>
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-scale-accent/30 bg-scale-accent/10 text-scale-accent text-xs sm:text-sm font-medium tracking-wide mb-6">
              <span>Servicio Premium</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
              {data.title}
            </h1>
            
            <p className="text-xl sm:text-2xl font-semibold text-scale-accent mb-8">
              {data.subtitle}
            </p>
            
            <div className="space-y-6 text-scale-muted text-lg leading-relaxed mb-12">
              {data.desc.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          
          <div className="relative group perspective-1000">
            <div className="relative bg-scale-card border border-scale-border rounded-3xl p-8 shadow-2xl overflow-hidden transform transition-all duration-700 hover:rotate-y-12">
              <GlowingEffect spread={80} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-scale-accent/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(3,250,110,0.5)]">
                  <MessageCircle size={36} className="text-scale-accent" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-white">¿Te interesa este servicio?</h3>
                <p className="text-scale-muted mb-8 max-w-sm">
                  Habla directamente con nuestro equipo por WhatsApp y recibe una consulta personalizada para tu negocio.
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
      
      {/* El formulario está aquí al final */}
      <ContactFooter />
    </motion.div>
  );
}
