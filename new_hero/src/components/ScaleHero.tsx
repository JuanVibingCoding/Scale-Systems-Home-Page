import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Terminal } from 'lucide-react';

const useGlobalMouse = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return mousePos;
};

const RobotIcon = ({ mousePos, className = "", isDark = false }: { mousePos: {x: number, y: number}, className?: string, isDark?: boolean }) => {
  const eyeOffsetX = mousePos.x * 4;
  const eyeOffsetY = mousePos.y * 4;

  const color = isDark ? "#171810" : "#03fa6e";
  const bgColor = isDark ? "#03fa6e" : "transparent";

  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Antenna */}
      <path d="M24 14V8H28" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Head */}
      <rect x="10" y="14" width="28" height="22" rx="6" stroke={color} strokeWidth="3" fill={bgColor} />
      
      {/* Ears */}
      <path d="M6 25H10" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M38 25H42" stroke={color} strokeWidth="3" strokeLinecap="round" />
      
      {/* Eyes */}
      <motion.rect 
        x={18} y={21} width="3" height="8" rx="1.5" fill={color}
        animate={{ x: eyeOffsetX, y: eyeOffsetY }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />
      <motion.rect 
        x={27} y={21} width="3" height="8" rx="1.5" fill={color}
        animate={{ x: eyeOffsetX, y: eyeOffsetY }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />
    </svg>
  );
};

const HeroCard = ({ onClick, mousePos }: { onClick: () => void, mousePos: {x: number, y: number} }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2500); // 2.5 seconds loading time
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      onClick={onClick}
      className="w-full max-w-[500px] bg-[#1c1d16] border border-[#03fa6e]/20 rounded-2xl p-8 cursor-pointer shadow-[0_0_40px_rgba(3,250,110,0.05)] hover:shadow-[0_0_60px_rgba(3,250,110,0.1)] transition-shadow relative overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="font-mono text-xs text-gray-400">
            sys.status: <span className={isReady ? "text-[#03fa6e]" : "text-[#ffbd2e]"}>{isReady ? "ONLINE" : "BOOTING"}</span>
          </div>
        </div>

        {/* Progress bars */}
        <div className="space-y-4 mb-10">
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
        <div className="flex items-center space-x-5">
          <div className="relative flex-shrink-0">
            <div className={`absolute inset-0 bg-[#03fa6e] blur-xl rounded-full transition-opacity duration-500 ${isReady ? 'opacity-40 group-hover:opacity-60' : 'opacity-10 group-hover:opacity-20'}`} />
            <div className="w-16 h-16 rounded-full border border-[#03fa6e]/30 flex items-center justify-center relative z-10 bg-[#171810]">
              <RobotIcon mousePos={mousePos} className="w-10 h-10" />
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg tracking-wide">
              {isReady ? "Neural Engine Ready" : "AI Core Active"}
            </h3>
            <div className="text-[#03fa6e] font-mono text-sm mt-1 flex items-center h-5">
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
      </motion.div>
    </motion.div>
  );
};

const StickyIcon = ({ onClick, mousePos }: { onClick: () => void, mousePos: {x: number, y: number} }) => {
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50 flex flex-col items-end"
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: 20 }}
      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
    >
      {/* Tooltip Message */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.4, type: "spring", bounce: 0.4 }}
        className="mb-3 mr-2 bg-[#2a2c24] border border-[#03fa6e]/30 text-white text-sm px-4 py-2 rounded-2xl rounded-br-sm shadow-lg pointer-events-none origin-bottom-right"
      >
        👋 ¿En qué te ayudo?
      </motion.div>

      <div
        onClick={onClick}
        className="w-16 h-16 bg-[#03fa6e] rounded-2xl cursor-pointer shadow-[0_0_30px_rgba(3,250,110,0.3)] flex items-center justify-center hover:scale-105 transition-transform"
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <RobotIcon mousePos={mousePos} className="w-10 h-10" isDark={true} />
        </motion.div>
      </div>
    </motion.div>
  );
};

const ChatWindow = ({ onClose, mousePos }: { onClose: () => void, mousePos: {x: number, y: number} }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hola, soy el asistente de Scale Systems. ¿En qué puedo ayudarte a escalar hoy?", sender: 'ai' }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    
    const newMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, newMsg]);
    setInput("");

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "Interesante. Nuestro Neural Engine puede optimizar ese proceso. ¿Quieres saber más?", 
        sender: 'ai' 
      }]);
    }, 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <motion.div
      className="fixed bottom-8 right-8 w-[380px] h-[600px] max-h-[80vh] bg-[#1c1d16] border border-[#03fa6e]/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50 flex flex-col overflow-hidden origin-bottom-right"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
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
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-[#03fa6e]/20 scrollbar-track-transparent">
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
                {msg.text}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/5 bg-[#171810]">
          <form onSubmit={handleSend} className="relative flex items-center">
            <Terminal className="absolute left-4 text-[#03fa6e]/50 w-4 h-4" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inicia la secuencia..."
              className="w-full bg-[#2a2c24] text-white text-sm rounded-xl pl-11 pr-12 py-3.5 focus:outline-none focus:ring-1 focus:ring-[#03fa6e]/50 placeholder-gray-500 font-mono border border-white/5"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 p-2 bg-[#03fa6e] text-[#171810] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#02d65e] transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function ScaleHero() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const globalMousePos = useGlobalMouse();

  useEffect(() => {
    const handleScroll = () => {
      // Configuramos el umbral de scroll a 250px.
      // Cuando el usuario baja más de 250px, el Hero desaparece y aparece el StickyIcon.
      setIsScrolled(window.scrollY > 250);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-[200vh] bg-[#171810] text-white font-sans selection:bg-[#03fa6e] selection:text-black">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-32 px-4">
        {/* Background effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#03fa6e]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#03fa6e]/5 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-b from-transparent via-[#03fa6e]/5 to-transparent opacity-50" />
        </div>

        <div className="z-10 text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-[#2a2c24] border border-[#03fa6e]/20 px-4 py-1.5 rounded-full mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#03fa6e] animate-pulse" />
            <span className="text-xs font-mono text-[#03fa6e]">v2.0 Neural Engine Live</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter mb-6"
          >
            Scale <span className="text-[#03fa6e]">Systems</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-gray-400 text-lg md:text-2xl max-w-2xl mx-auto font-light"
          >
            Inteligencia Artificial de próxima generación para escalar tus operaciones a niveles insospechados.
          </motion.p>
        </div>

        {/* Hero Card Container */}
        <div className="w-full max-w-[500px] h-[280px] z-20 flex items-center justify-center relative">
           <AnimatePresence>
             {!isChatOpen && (
               <div className="absolute inset-0 flex items-center justify-center">
                 <HeroCard onClick={() => setIsChatOpen(true)} mousePos={globalMousePos} />
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>

      {/* Fixed Elements */}
      <AnimatePresence>
        {isScrolled && !isChatOpen && (
          <StickyIcon onClick={() => setIsChatOpen(true)} mousePos={globalMousePos} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChatOpen && (
          <ChatWindow onClose={() => setIsChatOpen(false)} mousePos={globalMousePos} />
        )}
      </AnimatePresence>
    </div>
  );
}
