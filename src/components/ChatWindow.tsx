import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, X, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { sendMessage } from '@/lib/chat-agent';
import { useGlobalMouse } from '@/lib/use-global-mouse';
import { RobotIcon } from '@/components/ui/robot-icon';

interface ChatWindowProps {
  onClose: () => void;
}

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const mousePos = useGlobalMouse();
  const [messages, setMessages] = useState([
    { id: 1, text: "👋 Hola, soy Scale, el asistente virtual de Scale Systems. ¿En qué puedo ayudarte hoy?", sender: 'ai' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    textareaRef.current?.focus();
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const newMsg = { id: Date.now(), text: userText, sender: 'user' };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const reply = await sendMessage(userText);
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
                ref={textareaRef}
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
                aria-label="Mensaje del chat"
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
              aria-label="Enviar mensaje"
              className="p-3.5 bg-[#03fa6e] text-[#171810] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#02d65e] transition-colors flex-shrink-0"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
