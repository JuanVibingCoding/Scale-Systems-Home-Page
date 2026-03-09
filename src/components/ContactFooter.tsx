import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { GlowingEffect } from './ui/glowing-effect';
export default function ContactFooter() {
  return (
    <footer id="contacto" className="bg-scale-bg py-16 sm:py-32 relative border-t border-scale-border">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 grid lg:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-6 sm:mb-8">
            ¿Listo para <span className="text-scale-accent">escalar?</span>
          </h2>
          <p className="text-base sm:text-xl text-scale-muted mb-8 sm:mb-12 max-w-lg leading-relaxed">
            Deja de perder tiempo en tareas manuales y empieza a construir una empresa que funcione sin ti. Agenda una llamada de diagnóstico gratuita.
          </p>

          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-4 text-scale-muted hover:text-scale-accent transition-colors">
              <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full border border-scale-border flex items-center justify-center bg-scale-card">
                <Mail size={18} className="sm:w-5 sm:h-5" />
              </div>
              <span className="text-base sm:text-lg font-medium break-all">hola@scalesystems.com.ve</span>
            </div>
            <div className="flex items-center gap-4 text-scale-muted hover:text-scale-accent transition-colors">
              <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full border border-scale-border flex items-center justify-center bg-scale-card">
                <Phone size={18} className="sm:w-5 sm:h-5" />
              </div>
              <span className="text-base sm:text-lg font-medium">+58 412 123 4567</span>
            </div>
            <div className="flex items-center gap-4 text-scale-muted">
              <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full border border-scale-border flex items-center justify-center bg-scale-card">
                <MapPin size={18} className="sm:w-5 sm:h-5" />
              </div>
              <span className="text-base sm:text-lg font-medium">Caracas, Venezuela</span>
            </div>
          </div>
        </div>

        <div className="relative rounded-3xl border border-scale-border shadow-2xl p-[1.5px] md:p-[2px]">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} className="z-0" />
          <div className="relative z-10 bg-scale-card rounded-[calc(1.5rem-2px)] p-6 sm:p-10 overflow-hidden h-full pointer-events-auto">
            {/* Subtle Glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-scale-accent rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>
            
            <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Solicitar Presupuesto</h3>
            
            <form className="space-y-4 sm:space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-scale-muted">Nombre Completo</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-scale-bg border border-scale-border rounded-xl px-4 py-3 text-scale-text focus:outline-none focus:border-scale-accent focus:ring-1 focus:ring-scale-accent transition-all"
                    placeholder="Ej. Carlos Pérez"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium text-scale-muted">Empresa</label>
                  <input
                    type="text"
                    id="company"
                    className="w-full bg-scale-bg border border-scale-border rounded-xl px-4 py-3 text-scale-text focus:outline-none focus:border-scale-accent focus:ring-1 focus:ring-scale-accent transition-all"
                    placeholder="Tu empresa C.A."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-scale-muted">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-scale-bg border border-scale-border rounded-xl px-4 py-3 text-scale-text focus:outline-none focus:border-scale-accent focus:ring-1 focus:ring-scale-accent transition-all"
                  placeholder="carlos@empresa.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="service" className="text-sm font-medium text-scale-muted">¿Qué necesitas?</label>
                <select
                  id="service"
                  className="w-full bg-scale-bg border border-scale-border rounded-xl px-4 py-3 text-scale-text focus:outline-none focus:border-scale-accent focus:ring-1 focus:ring-scale-accent transition-all appearance-none"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="web">Diseño Web Vanguardista</option>
                  <option value="automation">Automatización Pro</option>
                  <option value="chatbot">AI Chatbots</option>
                  <option value="all">Consultoría Integral</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-scale-accent hover:bg-scale-accent-hover text-scale-bg font-bold px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg transition-all duration-300 shadow-[0_0_20px_rgba(3,250,110,0.3)] hover:shadow-[0_0_30px_rgba(3,250,110,0.5)] mt-4"
              >
                Enviar Solicitud
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 mt-16 sm:mt-32 pt-8 border-t border-scale-border flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="text-2xl font-bold tracking-tighter text-scale-text">
          Scale<span className="text-scale-accent">Systems</span>
        </div>
        <p className="text-sm text-scale-muted">
          © {new Date().getFullYear()} Scale Systems. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
