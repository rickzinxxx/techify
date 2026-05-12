import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, Mic, Volume2, Maximize2, User, Bot } from "lucide-react";
import { GoogleGenAI } from "@google/genai";

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
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Você é Techify IA, uma tutora de tecnologia amigável e especialista. 
        Ajude o usuário com dúvidas sobre programação, design e carreira. 
        Use emojis e formatação markdown. 
        Responda em português.
        Pergunta: ${text}`,
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
    "Como funciona o HTML?",
    "O que é CSS?",
    "Para que serve o JavaScript?",
    "Como criar um site do zero?"
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-brand text-black flex items-center justify-center shadow-lg shadow-brand/20 cursor-pointer"
      >
        <MessageCircle size={32} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, x: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20, x: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-24 right-6 z-50 w-[320px] max-w-[calc(100vw-48px)] h-[480px] bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-black">
                  <Bot size={24} />
                </div>
                <div>
                   <h3 className="font-bold text-sm">Techify IA</h3>
                   <div className="flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse"></div>
                     <span className="text-[10px] text-gray-400">Online</span>
                   </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <X size={24} className="hover:text-white cursor-pointer" onClick={() => setIsOpen(false)} />
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar"
            >
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'bot' ? 'bg-brand text-black' : 'bg-white/10 text-white'}`}>
                    {msg.role === 'bot' ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'bot' 
                    ? 'bg-neutral-800 text-white' 
                    : 'bg-brand text-black font-medium'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand text-black flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="bg-neutral-800 p-3 rounded-2xl flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {suggestions.map((suggestion) => (
                    <button 
                      key={suggestion}
                      onClick={() => sendMessage(suggestion)}
                      className="text-[10px] font-bold px-3 py-2 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black border-t border-white/10">
              <div className="relative group">
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage(input))}
                  placeholder="Mensagem..."
                  className="w-full bg-neutral-800 border border-transparent rounded-2xl px-4 py-3 pr-12 outline-none focus:border-brand/50 transition-all resize-none text-sm h-12 no-scrollbar"
                />
                <button 
                  onClick={() => sendMessage(input)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand hover:text-white transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="mt-2 text-center">
                <span className="text-[9px] text-gray-600">IA pode cometer erros</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

