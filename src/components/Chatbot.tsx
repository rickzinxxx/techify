import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, User, Bot, Sparkles } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "Olá! 👋 Sou a **Techify IA**, sua tutora de tecnologia! Estou aqui para explicar qualquer dúvida sobre programação, desenvolvimento web, design e muito mais. Pode perguntar à vontade! 🚀" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;
    
    setMessages(prev => [...prev, { role: "user", content: trimmedText }]);
    setInput("");
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Você é Techify IA, uma tutora de tecnologia amigável e especialista. 
        Ajude o usuário com dúvidas sobre programação, design e carreira. 
        Use emojis e formatação markdown. 
        Responda de forma concisa e útil em português.
        Pergunta: ${trimmedText}`,
      });

      const responseText = response.text || "Desculpe, não consegui processar sua mensagem.";

      setMessages(prev => [...prev, { role: "bot", content: responseText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "bot", content: "Ops, tive um probleminha aqui. Pode tentar de novo?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    { text: "O que é React?", icon: <Sparkles size={14} /> },
    { text: "Explique Tailwind", icon: <Sparkles size={14} /> },
    { text: "Carreira em Dev", icon: <Sparkles size={14} /> },
    { text: "Design UI/UX", icon: <Sparkles size={14} /> }
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(132, 204, 22, 0.4)" }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-brand text-black flex items-center justify-center shadow-2xl cursor-pointer group"
      >
        <MessageCircle size={32} className="group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50, x: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30, x: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] h-[520px] bg-neutral-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-5 bg-white/5 border-b border-white/10 flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-brand flex items-center justify-center text-black rotate-3 shadow-lg shadow-brand/20">
                    <Bot size={26} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-brand rounded-full border-2 border-neutral-900" />
                </div>
                <div>
                   <h3 className="font-bold text-base tracking-tight text-white">Techify <span className="text-brand">IA</span></h3>
                   <div className="flex items-center gap-1.5">
                     <span className="text-[10px] font-medium text-brand/80">Especialista em Tecnologia</span>
                   </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"
            >
              <AnimatePresence mode="popLayout">
                {messages.map((msg, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center mt-1 ${
                      msg.role === 'bot' 
                        ? 'bg-brand/10 text-brand border border-brand/20' 
                        : 'bg-white/5 text-white/50 border border-white/10'
                    }`}>
                      {msg.role === 'bot' ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.role === 'bot' 
                        ? 'bg-neutral-800 text-white border border-white/5' 
                        : 'bg-brand text-black font-medium'
                    }`}>
                      <div className="markdown-body">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-brand/10 text-brand border border-brand/20 flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="bg-neutral-800 p-4 rounded-2xl flex gap-1.5 border border-white/5">
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="w-1.5 h-1.5 bg-brand rounded-full"
                    />
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, delay: 0.2, repeat: Infinity }}
                      className="w-1.5 h-1.5 bg-brand rounded-full"
                    />
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, delay: 0.4, repeat: Infinity }}
                      className="w-1.5 h-1.5 bg-brand rounded-full"
                    />
                  </div>
                </motion.div>
              )}

              {/* Suggestions */}
              {messages.length === 1 && !isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="pt-4 grid grid-cols-2 gap-2"
                >
                  {suggestions.map((suggestion, i) => (
                    <motion.button 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      onClick={() => sendMessage(suggestion.text)}
                      className="flex items-center gap-2 text-[11px] font-bold px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:bg-brand/10 hover:text-brand hover:border-brand/30 transition-all cursor-pointer group"
                    >
                      <span className="text-brand group-hover:scale-110 transition-transform">
                        {suggestion.icon}
                      </span>
                      {suggestion.text}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-5 bg-black border-t border-white/10">
              <div className="relative group">
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage(input))}
                  placeholder="Pergunte sobre tecnologia..."
                  className="w-full bg-neutral-800/50 border border-white/5 rounded-2xl px-4 py-3.5 pr-12 outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/20 transition-all resize-none text-sm h-14 no-scrollbar placeholder:text-gray-600"
                />
                <button 
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all ${
                    input.trim() && !isTyping 
                      ? 'bg-brand text-black shadow-lg shadow-brand/20 hover:scale-110 cursor-pointer' 
                      : 'text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="mt-3 text-center flex items-center justify-center gap-2">
                <div className="w-1 h-1 bg-gray-700 rounded-full" />
                <span className="text-[10px] font-medium text-gray-600 uppercase tracking-widest">Techify AI Assistant</span>
                <div className="w-1 h-1 bg-gray-700 rounded-full" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

