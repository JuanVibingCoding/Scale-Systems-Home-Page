'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Cpu, Send, X, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ParticleEffectForHero from '@/components/ui/particle-effect-for-hero';
import { Typewriter } from '@/components/ui/typewriter-text';
import { sendMessage } from '@/lib/chat-api';
import ReactMarkdown from 'react-markdown';

const ChatWindow = lazy(() => import('./ChatWindow'));

const HeroCard = ({ onClick }: { onClick: () => void }) => {
  const mousePos = useGlobalMouse();
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !cardRef.current) return;
    const container = containerRef.current;
    const card = cardRef.current;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Invert rotation direction slightly for a natural tilt feel
    // Use a larger divisor for a much softer & elegant effect
    const rotateX = (centerY - y) / 35;
    const rotateY = (x - centerX) / 35;

    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.setProperty('--x', `50%`);
    card.style.setProperty('--y', `50%`);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full relative group"
      style={{ perspective: 1000 }}
    >
      <div
        ref={cardRef}
        onClick={onClick}
        className="w-full bg-[#1c1d16] border border-[#03fa6e]/20 rounded-2xl p-5 sm:p-8 cursor-pointer shadow-[0_0_40px_rgba(3,250,110,0.05)] hover:shadow-[0_0_60px_rgba(3,250,110,0.1)] relative group"
        style={{ transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s ease', transformStyle: 'preserve-3d' }}
      >
        <div 
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden"
        >
          <div 
            className="absolute -inset-px transition-all duration-75"
            style={{
              background: `radial-gradient(600px circle at var(--x, 50%) var(--y, 50%), rgba(3, 250, 110, 0.12), transparent 40%)`
            }}
          />
        </div>
        
        <div style={{ transform: 'translateZ(30px)' }} className="relative z-10 pointer-events-none">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="pointer-events-auto">
            {/* Top bar */}
        <div className="flex items-center justify-between mb-5 sm:mb-8 border-b border-white/5 pb-3 sm:pb-4">
          <div className="flex space-x-1.5 sm:space-x-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="font-mono text-[10px] sm:text-xs text-gray-400 uppercase">
            sys.status: <span className={isReady ? "text-[#03fa6e]" : "text-[#ffbd2e]"}>{isReady ? "ONLINE" : "BOOTING"}</span>
          </div>
        </div>

        {/* Progress bars */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-10">
          <div className="h-2 w-full bg-[#2a2c24] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#03fa6e]"
              initial={{ width: "0%" }}
              animate={{ width: isReady ? "100%" : "65%" }}
              transition={{ duration: isReady ? 0.5 : 2.5, ease: "easeOut" }}
            />
          </div>
          <div className="h-2 w-1/2 bg-[#2a2c24] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#03fa6e]/50"
              initial={{ width: "0%" }}
              animate={{ width: isReady ? "100%" : "40%" }}
              transition={{ duration: isReady ? 0.6 : 2.5, ease: "easeOut", delay: 0.1 }}
            />
          </div>
          <div className="h-2 w-3/4 bg-[#2a2c24] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#03fa6e]/30"
              initial={{ width: "0%" }}
              animate={{ width: isReady ? "100%" : "85%" }}
              transition={{ duration: isReady ? 0.4 : 2.5, ease: "easeOut", delay: 0.2 }}
            />
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex items-center space-x-4 sm:space-x-5">
          <div className="relative flex-shrink-0">
            <div className={`absolute inset-0 bg-[#03fa6e] blur-xl rounded-full transition-opacity duration-500 ${isReady ? 'opacity-40 group-hover:opacity-60' : 'opacity-10 group-hover:opacity-20'}`} />
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-[#03fa6e]/30 flex items-center justify-center relative z-10 bg-[#171810]">
              <RobotIcon mousePos={mousePos} className="w-7 h-7 sm:w-10 sm:h-10" />
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold text-base sm:text-lg tracking-wide">
              {isReady ? "Neural Engine Ready" : "AI Core Active"}
            </h3>
            <div className="text-[#03fa6e] font-mono text-xs sm:text-sm mt-1 flex items-center h-5">
              <AnimatePresence mode="wait">
                {isReady ? (
                  <motion.span 
                    key="ready"
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center"
                  >
                    ✨ Asistente Listo
                  </motion.span>
                ) : (
                  <motion.div key="loading" className="flex items-center" exit={{ opacity: 0 }}>
                    Processing data
                    <span className="flex ml-0.5 w-4">
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}>.</motion.span>
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}>.</motion.span>
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}>.</motion.span>
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isReady && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-[#03fa6e]/10 text-center"
            >
              <p className="text-[#a1a1aa] text-[13px] sm:text-sm px-2">
                Habla con nuestro agente experto en atención al cliente.
              </p>
              <p className="text-[#03fa6e] text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-2 group-hover:scale-105 transition-transform duration-300 inline-block pointer-events-auto">
                Haz clic aquí para probarlo
              </p>
            </motion.div>
          )}
        </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const StickyIcon = ({ onClick }: { onClick: () => void }) => {
  const mousePos = useGlobalMouse();
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end"
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: 20 }}
      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
    >
      {/* Tooltip Message */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8, transition: { duration: 0.3 } }}
            transition={{ delay: 0.4, type: "spring", bounce: 0.4 }}
            className="mb-2 mr-1 bg-[#2a2c24] border border-[#03fa6e]/30 text-white text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl rounded-br-sm shadow-lg pointer-events-none origin-bottom-right"
          >
            👋 ¿En qué te ayudo?
          </motion.div>
        )}
      </AnimatePresence>

      <div
        onClick={onClick}
        className="w-12 h-12 sm:w-16 sm:h-16 bg-[#03fa6e] rounded-xl sm:rounded-2xl cursor-pointer shadow-[0_0_30px_rgba(3,250,110,0.3)] flex items-center justify-center hover:scale-105 transition-transform"
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <RobotIcon mousePos={mousePos} className="w-7 h-7 sm:w-10 sm:h-10" isDark={true} />
        </motion.div>
      </div>
    </motion.div>
  );
};


  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;
    
    const userText = input.trim();
    const newMsg = { id: Date.now(), text: userText, sender: 'user' };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const history = messages.map((msg) => ({
        role: msg.sender as 'user' | 'ai',
        text: msg.text,
      }));
      const reply = await sendMessage(userText, history);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: reply,
        sender: 'ai',
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'Ups, algo falló. Intenta de nuevo en un momento. 🙏',
        sender: 'ai',
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <motion.div
      className="fixed sm:bottom-8 sm:right-8 inset-0 sm:inset-auto w-full sm:w-[380px] h-[100dvh] sm:h-[600px] sm:max-h-[80vh] bg-[#1c1d16] sm:border border-[#03fa6e]/30 sm:rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[100] flex flex-col overflow-hidden sm:origin-bottom-right"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
    >
      <motion.div 
        className="flex flex-col h-full"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#171810]">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-[#03fa6e]/10 rounded-xl flex items-center justify-center border border-[#03fa6e]/20">
                <RobotIcon mousePos={mousePos} className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#03fa6e] rounded-full border-2 border-[#171810]" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">Scale Assistant</h3>
              <p className="text-[#03fa6e] text-xs font-mono">sys.status: ONLINE</p>
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 chat-messages-area scrollbar-thin scrollbar-thumb-[#03fa6e]/40 scrollbar-track-transparent">
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-[#03fa6e] text-[#171810] rounded-br-sm font-medium' 
                    : 'bg-[#2a2c24] text-gray-200 rounded-bl-sm border border-white/5'
                }`}
              >
                <ReactMarkdown 
                  components={{
                    p: ({node, ...props}) => <p className="mb-0" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc ml-4 mt-2" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex justify-start"
              >
                <div className="bg-[#2a2c24] border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                  <motion.span
                    className="w-2 h-2 rounded-full bg-[#03fa6e]/70"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: 0 }}
                  />
                  <motion.span
                    className="w-2 h-2 rounded-full bg-[#03fa6e]/70"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
                  />
                  <motion.span
                    className="w-2 h-2 rounded-full bg-[#03fa6e]/70"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/5 bg-[#171810]">
          <form onSubmit={handleSend} className="relative flex items-end gap-2">
            <div className="relative flex-1">
              <Terminal className="absolute left-4 top-4 text-[#03fa6e]/50 w-4 h-4" />
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Inicia la secuencia..."
                rows={1}
                className="w-full bg-[#2a2c24] text-white text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-[#03fa6e]/50 placeholder-gray-500 font-mono border border-white/5 resize-none min-h-[52px] max-h-[120px] transition-all scrollbar-thin scrollbar-thumb-white/10"
                style={{ height: 'auto' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />
            </div>
            <button 
              type="submit"
              disabled={!input.trim()}
              className="p-3.5 bg-[#03fa6e] text-[#171810] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#02d65e] transition-colors flex-shrink-0"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Hero() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 250);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="inicio"
      className="relative min-h-[100dvh] flex items-center justify-center pt-24 pb-12 sm:pt-28 sm:pb-16 overflow-hidden bg-[#171810]"
    >
      {/* Interactive Particle Effect */}
      <ParticleEffectForHero />

      {/* Background Tech Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#03fa6e] rounded-full mix-blend-screen filter blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#02d65e] rounded-full mix-blend-screen filter blur-[200px] animate-float"></div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center pointer-events-none pt-10 sm:pt-0">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center lg:items-start lg:text-left gap-6 sm:gap-8 max-w-2xl mx-auto lg:mx-0 pointer-events-auto"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#03fa6e]/30 bg-[#03fa6e]/10 text-[#03fa6e] text-[11px] sm:text-sm font-medium tracking-wide"
          >
            <Cpu size={14} className="shrink-0 sm:w-4 sm:h-4" />
            <span>Agencia de Automatización en Venezuela</span>
          </motion.div>

          <h1 className="text-[2.5rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white min-h-[220px] sm:min-h-[160px] md:min-h-[180px] lg:min-h-[200px]">
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

          <p className="text-[15px] sm:text-lg md:text-xl text-[#a1a1aa] leading-relaxed max-w-xl px-4 lg:px-0">
            Dejamos atrás los procesos manuales. Diseñamos sistemas que trabajan por ti las 24 horas, optimizando tiempo, reduciendo costos y escalando tus ventas.
          </p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full px-4 lg:px-0 mt-2 sm:mt-4"
          >
            <a
              href="#contacto"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#03fa6e] hover:bg-[#02d65e] text-[#171810] font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-base sm:text-lg transition-all duration-300 shadow-[0_0_20px_rgba(3,250,110,0.4)] hover:shadow-[0_0_30px_rgba(3,250,110,0.6)] hover:-translate-y-1"
            >
              Solicitar Presupuesto
              <ArrowRight size={18} className="sm:w-5 sm:h-5" />
            </a>
            <a
              href="#servicios"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#03fa6e]/50 hover:bg-[#03fa6e]/5 text-white font-medium px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-base sm:text-lg transition-all duration-300 hover:-translate-y-1"
            >
              Ver Servicios
            </a>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex justify-center items-center relative pointer-events-auto w-full px-2 sm:px-0 mt-6 lg:mt-0"
        >
          {/* New Interactive Hero Card */}
          <div className="relative w-full max-w-[340px] sm:max-w-md aspect-square flex items-center justify-center">
            <AnimatePresence>
              {!isChatOpen && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <HeroCard onClick={() => setIsChatOpen(true)} />
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Fixed Elements */}
      <AnimatePresence>
        {isScrolled && !isChatOpen && (
          <StickyIcon onClick={() => setIsChatOpen(true)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChatOpen && (
          <Suspense fallback={null}>
            <ChatWindow onClose={() => setIsChatOpen(false)} />
          </Suspense>
        )}
      </AnimatePresence>
    </section>
  );
}
