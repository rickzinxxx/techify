import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, ShieldCheck, Sparkles, Trophy } from "lucide-react";

export default function FinalCTA() {
  const [isJoined, setIsJoined] = useState(false);

  const handleStart = () => {
    setIsJoined(true);
    setTimeout(() => setIsJoined(false), 5000);
  };

  const features = [
    { text: "Estética Futurista", icon: Zap },
    { text: "Interatividade Fluida", icon: Sparkles },
    { text: "Conversão Extrema", icon: Trophy },
    { text: "UX de Alta Performance", icon: ShieldCheck },
  ];

  return (
    <section className="relative pt-24 pb-12 bg-black overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 px-4 py-1.5 rounded-full mb-8"
            >
              <Zap size={14} className="text-brand fill-brand" />
              <span className="text-brand text-[10px] font-black uppercase tracking-[0.3em]">Convite Premium</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-black tracking-tighter text-white mb-8 uppercase leading-none"
            >
              O DESIGN QUE VOCÊ <br/> 
              <span className="text-brand italic">SÓ ENCONTRA AQUI.</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/50 text-lg md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-light"
            >
              Assim como um supercarro, um site de alta performance precisa de harmonia entre o que se vê e o que está por baixo. Na <span className="text-white font-bold tracking-tight">Techify</span>, unimos interfaces que encantam com uma engenharia de código que converte visitantes em lucros.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="group relative flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand/30 transition-all duration-300"
              >
                <div className="p-3 rounded-lg bg-brand/5 border border-brand/10 group-hover:scale-110 transition-all duration-300">
                  <f.icon className="text-brand" size={24} />
                </div>
                <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest text-center">{f.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="relative w-full md:w-auto">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="w-full md:w-auto bg-brand text-black font-black uppercase tracking-widest px-12 py-5 rounded-2xl text-lg shadow-[0_0_40px_rgba(132,204,22,0.3)] flex items-center justify-center gap-3 border border-brand/50 group relative overflow-hidden"
              >
                <Zap size={20} className="fill-black shrink-0" />
                <span className="relative z-10 whitespace-nowrap">COMEÇAR AGORA</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-2xl overflow-hidden pointer-events-none opacity-20" />
              </motion.button>

              <AnimatePresence>
                {isJoined && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute -top-16 left-0 right-0 bg-brand text-black p-3 rounded-xl font-bold text-sm text-center shadow-2xl"
                  >
                    🚀 Bem-vindo! Redirecionando...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="w-full md:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-12 py-5 rounded-2xl text-lg transition-all whitespace-nowrap">
              Ver Cases de Sucesso
            </button>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-brand/5 blur-[80px] rounded-full pointer-events-none" />
    </section>
  );
}
