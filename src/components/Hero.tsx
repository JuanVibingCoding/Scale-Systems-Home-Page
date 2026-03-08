import { ArrowRight, Cpu } from 'lucide-react';

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden"
    >
      {/* Background Tech Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-scale-accent rounded-full mix-blend-screen filter blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-900 rounded-full mix-blend-screen filter blur-[200px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-start gap-6 sm:gap-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-scale-accent/30 bg-scale-accent/10 text-scale-accent text-xs sm:text-sm font-medium tracking-wide">
            <Cpu size={16} className="shrink-0" />
            <span>Agencia de Automatización en Venezuela</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            Escala tu empresa en Venezuela con <span className="text-scale-accent">Inteligencia Artificial</span> y Automatización.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-scale-muted leading-relaxed max-w-xl">
            Dejamos atrás los procesos manuales. Diseñamos sistemas que trabajan por ti las 24 horas, optimizando tiempo, reduciendo costos y escalando tus ventas.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <a
              href="#contacto"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-scale-accent hover:bg-scale-accent-hover text-scale-bg font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 shadow-[0_0_20px_rgba(3,250,110,0.4)] hover:shadow-[0_0_30px_rgba(3,250,110,0.6)] hover:-translate-y-1"
            >
              Solicitar Presupuesto
              <ArrowRight size={20} />
            </a>
            <a
              href="#servicios"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent border border-scale-border hover:border-scale-accent/50 text-scale-text font-medium px-8 py-4 rounded-full text-lg transition-all duration-300"
            >
              Ver Servicios
            </a>
          </div>
        </div>

        <div className="hidden lg:flex justify-center items-center relative">
          {/* Abstract Tech Visual */}
          <div className="relative w-full aspect-square max-w-md">
            <div className="absolute inset-0 border border-scale-border rounded-3xl transform rotate-3 transition-transform duration-700 hover:rotate-6"></div>
            <div className="absolute inset-0 border border-scale-accent/30 rounded-3xl transform -rotate-3 transition-transform duration-700 hover:-rotate-6"></div>
            <div className="absolute inset-4 bg-scale-card border border-scale-border rounded-2xl flex flex-col p-8 justify-between shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center border-b border-scale-border pb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-scale-accent/50"></div>
                </div>
                <div className="text-xs font-mono text-scale-muted">sys.status: ONLINE</div>
              </div>
              <div className="flex-1 py-6 flex flex-col gap-4">
                <div className="h-2 w-3/4 bg-scale-border rounded-full overflow-hidden">
                  <div className="h-full bg-scale-accent w-full animate-[pulse_2s_ease-in-out_infinite]"></div>
                </div>
                <div className="h-2 w-1/2 bg-scale-border rounded-full"></div>
                <div className="h-2 w-5/6 bg-scale-border rounded-full"></div>
                
                <div className="mt-auto flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-scale-accent flex items-center justify-center text-scale-accent shadow-[0_0_15px_rgba(3,250,110,0.2)]">
                    <Cpu size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-scale-text">AI Core Active</div>
                    <div className="text-xs text-scale-accent font-mono">Processing data...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
