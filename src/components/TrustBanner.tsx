import { ShieldCheck } from 'lucide-react';
import { BlurredStagger } from './ui/blurred-stagger-text';
import { GlowingEffect } from './ui/glowing-effect';

export default function TrustBanner() {
  return (
    <section className="py-16 sm:py-24 bg-scale-card relative border-y border-scale-border overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(var(--color-scale-accent) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-scale-accent/30 bg-scale-bg text-scale-accent text-xs sm:text-sm font-semibold tracking-wide mb-4 sm:mb-6 shadow-[0_0_15px_rgba(3,250,110,0.2)]">
            <ShieldCheck size={18} className="sm:w-5 sm:h-5 shrink-0" />
            <span>Garantía de Resultados</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
            <BlurredStagger text="Tecnología de nivel global adaptada al" className="inline-block" />{" "}
            <BlurredStagger text="mercado venezolano." className="text-scale-accent inline-block" />
          </h2>
          <div className="text-base sm:text-lg text-scale-muted max-w-2xl">
            <BlurredStagger text="Entendemos los retos de operar en Venezuela. Por eso, diseñamos sistemas resilientes, rápidos y enfocados en generar ventas reales, sin importar las condiciones del entorno." className="inline-block" />
          </div>
        </div>
        
        <div className="flex-1 flex w-full justify-center md:justify-end">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="relative h-full rounded-2xl border border-scale-border p-[1.5px] md:p-[2px]">
              <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} className="z-0" />
              <div className="relative z-10 bg-scale-bg rounded-[15px] p-4 sm:p-6 text-center h-full flex flex-col justify-center overflow-hidden pointer-events-none">
                <div className="text-3xl sm:text-4xl font-bold text-scale-accent mb-1 sm:mb-2">24/7</div>
                <div className="text-xs sm:text-sm text-scale-muted font-medium">Operación Continua</div>
              </div>
            </div>
            
            <div className="relative h-full rounded-2xl border border-scale-border p-[1.5px] md:p-[2px]">
              <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} className="z-0" />
              <div className="relative z-10 bg-scale-bg rounded-[15px] p-4 sm:p-6 text-center h-full flex flex-col justify-center overflow-hidden pointer-events-none">
                <div className="text-3xl sm:text-4xl font-bold text-scale-accent mb-1 sm:mb-2">10x</div>
                <div className="text-xs sm:text-sm text-scale-muted font-medium">Velocidad de Respuesta</div>
              </div>
            </div>
            
            <div className="relative h-full rounded-2xl border border-scale-border p-[1.5px] md:p-[2px] col-span-2">
              <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} className="z-0" />
              <div className="relative z-10 bg-scale-bg rounded-[15px] p-4 sm:p-6 text-center h-full flex flex-col justify-center overflow-hidden pointer-events-none">
                <div className="text-3xl sm:text-4xl font-bold text-scale-accent mb-1 sm:mb-2">100%</div>
                <div className="text-xs sm:text-sm text-scale-muted font-medium">Enfoque en Conversión</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
