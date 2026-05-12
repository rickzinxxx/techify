import { HeroScrub } from "./ui/hero-scrub";
import { CheckCircle2, Paintbrush, MousePointer2, Zap } from "lucide-react";

export default function DesignerFeature() {
  const benefits = [
    { icon: Paintbrush, text: "Estética Futurista" },
    { icon: MousePointer2, text: "Interatividade Fluida" },
    { icon: Zap, text: "Conversão Extrema" },
    { icon: CheckCircle2, text: "UX de Alta Performance" },
  ];

  return (
    <section id="designer" className="relative pb-32 overflow-hidden">
      <HeroScrub
        frameCount={300}
        frameUrl={(i) =>
          `https://raw.githubusercontent.com/duthiljean/ferrari-hero-demo/main/${String(i + 1).padStart(4, "0")}.webp`
        }
        titleTop="DESIGN QUE"
        titleBottom="CONVERTE"
        accentHex="#84cc16"
      />
      
      <div className="container mx-auto px-4 relative z-20 pb-24">
        <div className="bg-black/90 backdrop-blur-[80px] border border-brand/20 rounded-[3rem] p-8 md:p-16 lg:p-24 max-w-7xl mx-auto text-center shadow-[0_80px_150px_-40px_rgba(132,204,22,0.3)] relative overflow-hidden group/card">
           {/* Decorative Noise and Light */}
           <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
           <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-brand/10 blur-[120px] rounded-full pointer-events-none group-hover/card:bg-brand/20 transition-all duration-1000" />

           <div className="relative z-10">
             <div className="inline-flex items-center gap-3 bg-brand/10 border border-brand/30 px-6 py-2 rounded-full mb-12 hover:scale-105 transition-transform duration-500">
               <Zap size={20} className="text-brand fill-brand animate-pulse" />
               <span className="text-brand text-sm font-black tracking-[0.4em] uppercase">Padrão Elite Techify</span>
             </div>
             
             <h3 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-12 leading-[0.8] md:leading-[0.9]">
               O DESIGN QUE <br/> 
               <span className="text-brand italic drop-shadow-[0_0_20px_rgba(132,204,22,0.3)]">MATA A CONCORRÊNCIA.</span>
             </h3>
             
             <p className="text-white/50 text-xl md:text-3xl max-w-5xl mx-auto mb-20 leading-tight font-light transition-colors hover:text-white/70">
               "Sites comuns informam. <span className="text-white font-bold">Designs Techify</span> dominam a atenção e forçam a <span className="text-brand font-bold italic">conversão imediata</span>."
             </p>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
               {benefits.map((b, i) => (
                 <div key={i} className="group relative flex flex-col items-center gap-6 p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-brand/50 hover:bg-brand/5 transition-all duration-500 hover:-translate-y-2">
                   <div className="p-6 rounded-2xl bg-brand/5 border border-brand/10 group-hover:bg-brand/10 group-hover:scale-110 transition-all duration-500">
                     <b.icon className="text-brand" size={40} />
                   </div>
                   <div className="text-center">
                     <span className="text-xl font-black text-white uppercase tracking-[0.15em]">{b.text}</span>
                     <p className="text-white/30 text-sm mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-y-0 translate-y-4 leading-snug">Engenharia aplicada <br/>à estética de luxo.</p>
                   </div>
                 </div>
               ))}
             </div>

             <div className="flex flex-col md:flex-row items-center justify-center gap-6">
               <button className="w-full md:w-auto bg-brand hover:bg-brand-dark text-black font-black px-12 py-6 rounded-full text-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_15px_60px_rgba(132,204,22,0.4)]">
                 TRANSFORMAR AGORA
               </button>
               <button className="w-full md:w-auto bg-transparent border-2 border-white/10 hover:border-brand/40 text-white font-bold px-12 py-6 rounded-full text-xl transition-all hover:bg-brand/5 group">
                 Falar com <span className="text-brand group-hover:italic font-black">Estrategista</span>
               </button>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}
