import { ArrowRight, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import ParticleEffectForHero from '@/components/ui/particle-effect-for-hero';
import { Typewriter } from '@/components/ui/typewriter-text';

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#171810]"
    >
      {/* Interactive Particle Effect */}
      <ParticleEffectForHero />

      {/* Background Tech Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#03fa6e] rounded-full mix-blend-screen filter blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#02d65e] rounded-full mix-blend-screen filter blur-[200px] animate-float"></div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 relative z-10 grid lg:grid-cols-2 gap-12 items-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-start gap-6 sm:gap-8 max-w-2xl pointer-events-auto"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#03fa6e]/30 bg-[#03fa6e]/10 text-[#03fa6e] text-xs sm:text-sm font-medium tracking-wide"
          >
            <Cpu size={16} className="shrink-0" />
            <span>Agencia de Automatización en Venezuela</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-white min-h-[140px] sm:min-h-[160px] md:min-h-[180px] lg:min-h-[200px]">
            <Typewriter 
              text="Escala tu empresa en Venezuela con Inteligencia Artificial y Automatización."
              speed={50}
              renderText={(text) => {
                const targetSubstring = "Inteligencia Artificial";
                const targetIndex = "Escala tu empresa en Venezuela con ".length;
                
                if (text.length <= targetIndex) {
                   return text;
                }
                
                const beforeTarget = text.substring(0, targetIndex);
                const duringTarget = text.substring(targetIndex, targetIndex + targetSubstring.length);
                const afterTarget = text.substring(targetIndex + targetSubstring.length);
                
                return (
                  <>
                    {beforeTarget}
                    <span className="text-[#03fa6e]">{duringTarget}</span>
                    {afterTarget}
                  </>
                );
              }}
            />
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#a1a1aa] leading-relaxed max-w-xl">
            Dejamos atrás los procesos manuales. Diseñamos sistemas que trabajan por ti las 24 horas, optimizando tiempo, reduciendo costos y escalando tus ventas.
          </p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mt-4"
          >
            <a
              href="#contacto"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#03fa6e] hover:bg-[#02d65e] text-[#171810] font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 shadow-[0_0_20px_rgba(3,250,110,0.4)] hover:shadow-[0_0_30px_rgba(3,250,110,0.6)] hover:-translate-y-1"
            >
              Solicitar Presupuesto
              <ArrowRight size={20} />
            </a>
            <a
              href="#servicios"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent border border-[#2a2c1f] hover:border-[#03fa6e]/50 text-white font-medium px-8 py-4 rounded-full text-lg transition-all duration-300"
            >
              Ver Servicios
            </a>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="hidden lg:flex justify-center items-center relative pointer-events-auto"
        >
          {/* Abstract Tech Visual */}
          <div className="relative w-full aspect-square max-w-md">
            <div className="absolute inset-0 border border-[#2a2c1f] rounded-3xl transform rotate-3 transition-transform duration-700 hover:rotate-6"></div>
            <div className="absolute inset-0 border border-[#03fa6e]/30 rounded-3xl transform -rotate-3 transition-transform duration-700 hover:-rotate-6"></div>
            <div className="absolute inset-4 glass-card rounded-2xl flex flex-col p-8 justify-between shadow-2xl overflow-hidden glow-border">
              <div className="flex justify-between items-center border-b border-[#2a2c1f] pb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-[#03fa6e]/50"></div>
                </div>
                <div className="text-xs font-mono text-[#a1a1aa]">sys.status: ONLINE</div>
              </div>
              <div className="flex-1 py-6 flex flex-col gap-4">
                <div className="h-2 w-3/4 bg-[#2a2c1f] rounded-full overflow-hidden">
                  <div className="h-full bg-[#03fa6e] w-full animate-[pulse_2s_ease-in-out_infinite]"></div>
                </div>
                <div className="h-2 w-1/2 bg-[#2a2c1f] rounded-full"></div>
                <div className="h-2 w-5/6 bg-[#2a2c1f] rounded-full"></div>
                
                <div className="mt-auto flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-[#03fa6e] flex items-center justify-center text-[#03fa6e] shadow-[0_0_15px_rgba(3,250,110,0.2)]">
                    <Cpu size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">AI Core Active</div>
                    <div className="text-xs text-[#03fa6e] font-mono">Processing data...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
