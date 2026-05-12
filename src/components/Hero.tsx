import { motion } from "motion/react";
import { Calendar, Play, GraduationCap, Sparkles } from "lucide-react";
import { CosmicParallaxBg } from "./ui/parallax-cosmic-background";

export default function Hero() {
  const badges = [
    { text: "Cursos Grátis", icon: "🎓" },
    { text: "8 Idiomas", icon: "🌍" },
    { text: "IA Tutora 24/7", icon: "🤖" },
    { text: "Massagem", icon: "💆" },
    { text: "Programação", icon: "💻" },
    { text: "Certificados", icon: "🏆" },
  ];

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden pt-12 md:pt-20">
      {/* Cosmic Parallax Background */}
      <CosmicParallaxBg 
        head="Transforme Seu" 
        text="Negócio Digital, Resultados Reais, Inovação, Techify" 
        loop={true}
        className="absolute inset-0 z-0"
      />

      <div className="container mx-auto px-4 relative z-20 text-center pointer-events-none flex flex-col items-center">
        {/* Logo emblem */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 relative inline-block pointer-events-auto"
        >
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-black/40 border-2 border-brand/30 flex flex-col items-center justify-center relative shadow-[0_0_80px_rgba(132,204,22,0.3)] backdrop-blur-md">
            <div className="absolute inset-0 bg-brand/5"></div>
            <div className="relative">
               <svg viewBox="0 0 24 24" className="w-12 h-12 md:w-16 md:h-16 text-brand fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.5,18.5L9.5,12.5L13.5,16.5L22,6.92L20.59,5.5L13.5,13.5L9.5,9.5L2,17L3.5,18.5Z" />
                  <path d="M22,12V6H16L18.29,8.29L22,12Z" opacity="0.8" />
               </svg>
            </div>
            <span className="text-sm md:text-md font-black tracking-widest mt-1 text-white">TECHIFY</span>
          </div>
        </motion.div>

        {/* Floating badge */}
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="px-5 py-1.5 rounded-full border border-brand/30 bg-brand/10 text-brand mb-12 flex items-center gap-2 pointer-events-auto backdrop-blur-md"
        >
          <Sparkles size={14} className="text-brand" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Inovação Digital</span>
        </motion.div>

        {/* Animated Title Section */}
        <div className="w-full flex flex-col items-center py-8">
           <h2 id="title">TRANSFORME SEU</h2>
           <div id="subtitle-container">
              <span className="subtitle-part-1">NEGÓCIO DIGITAL</span>
              <span className="subtitle-part-2">RESULTADOS REAIS</span>
              <span className="subtitle-part-3">INOVAÇÃO ATIVA</span>
              <span className="subtitle-part-4">TECHIFY</span>
           </div>
        </div>

        <div className="pointer-events-auto w-full max-w-4xl mt-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-gray-100 mb-10 leading-relaxed font-semibold drop-shadow-lg"
          >
            Criamos plataformas web e identidade visual que geram resultados reais. <br />
            <span className="text-brand">Da ideia ao lançamento, sua visão ganha vida.</span>
          </motion.p>

          {/* Feature Badges */}
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.5 }}
             className="flex flex-wrap justify-center gap-4 mb-16 max-w-4xl mx-auto"
          >
            {badges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand/90 hover:bg-white/10 transition-colors backdrop-blur-md">
                <span>{badge.icon}</span>
                {badge.text}
              </div>
            ))}
          </motion.div>

          {/* Main CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <button className="h-14 px-10 rounded-xl bg-brand text-black font-bold flex items-center gap-2 hover:bg-brand/90 transition-all shadow-[0_0_20px_rgba(132,204,22,0.4)] group">
              <Calendar size={20} />
              Agendar Consulta
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                →
              </motion.span>
            </button>
            
            <button className="h-14 px-10 rounded-xl bg-white text-black font-bold border border-brand/20 hover:bg-white/90 transition-all">
              Ver Portfólio
            </button>

            <button className="h-14 px-10 rounded-xl bg-white text-brand font-bold border border-brand/20 hover:bg-white/90 transition-all flex items-center gap-2">
              <GraduationCap size={20} className="text-purple-500" />
              <span className="text-purple-600">Academia Grátis</span>
            </button>
          </motion.div>

          {/* Scroll indicator */}
          <div className="flex flex-col items-center gap-4">
            <span className="text-xs uppercase tracking-widest text-brand font-bold">Role para explorar</span>
            <div className="w-6 h-10 border-2 border-brand/50 rounded-full flex justify-center p-1">
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-1.5 h-1.5 bg-brand rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
