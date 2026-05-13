import { useState } from "react";
import { motion } from "motion/react";
import { Zap, ShieldCheck, Sparkles, Trophy, Box } from "lucide-react";

export default function FinalCTA({ onViewPortfolio }: { onViewPortfolio?: () => void }) {
  const [isJoined, setIsJoined] = useState(false);

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
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 px-4 py-1.5 rounded-full mb-8"
            >
              <Zap size={14} className="text-brand fill-brand" />
              <span className="text-brand text-[10px] font-black uppercase tracking-[0.3em]">Convite Premium</span>
            </motion.div>
            
            <h2 
              className="text-4xl md:text-7xl font-black tracking-tighter text-white mb-8 uppercase leading-none"
            >
              O DESIGN QUE VOCÊ <br/> 
              <span className="text-brand italic">SÓ ENCONTRA AQUI.</span>
            </h2>
            
            <p 
              className="text-white/50 text-lg md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-light"
            >
              Assim como um supercarro, um site de alta performance precisa de harmonia entre o que se vê e o que está por baixo. Na <span className="text-white font-bold tracking-tight">Techify</span>, unimos interfaces que encantam com uma engenharia de código que converte visitantes em lucros.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.05)" }}
                className="group relative flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand/30 transition-all duration-300"
              >
                <div className="p-3 rounded-lg bg-brand/5 border border-brand/10 group-hover:scale-110 transition-all duration-300">
                  <f.icon className="text-brand" size={24} />
                </div>
                <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest text-center">{f.text}</span>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <button 
              onClick={() => window.open("https://techify-ferrari.vercel.app", "_blank")}
              className="w-full md:w-auto bg-gradient-to-r from-purple-600 via-brand to-blue-600 text-white font-black uppercase tracking-widest px-12 py-5 rounded-2xl text-lg shadow-[0_0_40px_rgba(132,204,22,0.4)] flex items-center justify-center gap-3 border-2 border-white/20 transition-all group active:scale-95"
            >
              <Box size={24} />
              Experiência 3D
            </button>
          </motion.div>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
}
