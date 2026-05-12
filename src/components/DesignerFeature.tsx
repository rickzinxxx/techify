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
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-16 max-w-6xl mx-auto text-center shadow-2xl relative overflow-hidden group/card mt-12">
           {/* Decorative Elements */}
           <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
           <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />

           <div className="relative z-10">
             <div className="inline-flex items-center gap-3 bg-brand/10 border border-brand/20 px-5 py-2 rounded-full mb-10">
               <Zap size={18} className="text-brand fill-brand" />
               <span className="text-brand text-xs font-black tracking-[0.3em] uppercase">Padrão Techify de Design</span>
             </div>
             
             <h3 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-10 leading-[0.9]">
               O DESIGN QUE <br/> 
               <span className="text-brand italic">SÓ ENCONTRA AQUI.</span>
             </h3>
             
             <p className="text-white/50 text-lg md:text-2xl max-w-4xl mx-auto mb-16 leading-relaxed font-light">
               Assim como um supercarro, um site de alta performance precisa de harmonia entre o que se vê e o que está por baixo. Na <span className="text-white font-bold">Techify</span>, unimos interfaces que encantam com uma engenharia de código que converte visitantes em lucros.
             </p>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
               {benefits.map((b, i) => (
                 <div key={i} className="group relative flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-brand/40 transition-all duration-500">
                   <div className="p-4 rounded-xl bg-brand/5 border border-brand/10 group-hover:scale-110 transition-all duration-500">
                     <b.icon className="text-brand" size={32} />
                   </div>
                   <span className="text-xs md:text-sm font-black text-white uppercase tracking-widest text-center">{b.text}</span>
                 </div>
               ))}
             </div>

             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <button className="w-full sm:w-auto bg-brand hover:bg-brand-dark text-black font-black px-10 py-5 rounded-full text-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand/20">
                 TRANSFORMAR MEU NEGÓCIO
               </button>
               <button className="w-full sm:w-auto bg-transparent border border-white/10 hover:border-brand/40 text-white font-bold px-10 py-5 rounded-full text-lg transition-all hover:bg-brand/5">
                 Falar com Especialista
               </button>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}
