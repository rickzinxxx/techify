"use client";

import React from "react";
import { cn } from "@/lib/utils";

const INJECTED_STYLES = `
  /* Environment Overlays */
  .film-grain {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 50; opacity: 0.05; mix-blend-mode: overlay;
      background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  .bg-grid-theme {
      background-size: 60px 60px;
      background-image: 
          linear-gradient(to right, color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px, transparent 1px),
          linear-gradient(to bottom, color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  .text-silver-matte {
      background: linear-gradient(180deg, var(--color-foreground) 0%, color-mix(in srgb, var(--color-foreground) 40%, transparent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      filter: 
          drop-shadow(0px 10px 20px color-mix(in srgb, var(--color-foreground) 15%, transparent)) 
          drop-shadow(0px 2px 4px color-mix(in srgb, var(--color-foreground) 10%, transparent));
  }

  .premium-depth-card {
      background: linear-gradient(145deg, #0a0a0a 0%, #000000 100%);
      box-shadow: 
          0 40px 100px -20px rgba(0, 0, 0, 0.9),
          inset 0 1px 2px rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(132, 204, 22, 0.1);
      position: relative;
  }

  .iphone-bezel {
      background-color: #111;
      box-shadow: 
          inset 0 0 0 2px #52525B, 
          inset 0 0 0 7px #000, 
          0 40px 80px -15px rgba(0,0,0,0.9);
  }

  .btn-modern-light {
      background: linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%);
      color: #0F172A;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,1);
      transition: all 0.3s ease;
  }
  .btn-modern-light:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }

  .btn-modern-dark {
      background: linear-gradient(180deg, #27272A 0%, #18181B 100%);
      color: #FFFFFF;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.6);
      transition: all 0.3s ease;
  }
  .btn-modern-dark:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  }
`;

export interface CinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  brandName?: string;
  cardHeading?: string;
  cardDescription?: React.ReactNode;
  metricValue?: number;
  metricLabel?: string;
  ctaHeading?: string;
  ctaDescription?: string;
}

export function CinematicHero({ 
  brandName = "TECHIFY",
  cardHeading = "Somos Únicos.",
  cardDescription = <>Na <span className="text-brand font-semibold">Techify</span>, criamos ecossistemas digitais que não apenas funcionam, mas encantam. Somos diferentes porque unimos alta performance bruta com uma imersão que converte visitantes em clientes fiéis.</>,
  metricValue = 100,
  metricLabel = "Score Performance",
  ctaHeading = "Converta agora.",
  ctaDescription = "Entre em contato e descubra como podemos transformar sua presença digital com tecnologia de ponta e design impecável.",
  className, 
  ...props 
}: CinematicHeroProps) {
  
  return (
    <div
      className={cn("relative w-full py-12 overflow-hidden flex flex-col items-center justify-center bg-black text-white font-sans antialiased gap-12", className)}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-30" aria-hidden="true" />

      {/* Main Card Section */}
      <div className="relative z-10 w-full max-w-7xl px-4">
        <div className="premium-depth-card w-full rounded-[32px] md:rounded-[40px] p-8 md:p-12 lg:p-16 overflow-hidden">
          <div className="absolute inset-0 bg-brand/5 opacity-20 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-12">
            <div className="space-y-6">
              <h3 className="text-white text-3xl md:text-6xl font-black uppercase tracking-tighter leading-tight">
                {brandName} <br />
                <span className="text-brand/80">{cardHeading}</span>
              </h3>
              <p className="text-gray-400 text-lg md:text-2xl font-normal leading-relaxed max-w-3xl mx-auto">
                {cardDescription}
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center border border-brand/20">
                      <span className="text-brand font-bold text-xl">{metricValue}</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white text-sm font-bold tracking-tight">{metricLabel}</p>
                      <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">Tecnologia Core</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                      <span className="text-indigo-400 text-xl">🚀</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white text-sm font-bold tracking-tight">Imersão Total</p>
                      <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">WebGL Engine</p>
                    </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center opacity-80 hover:opacity-100 transition-opacity duration-500">
               <div className="relative w-[280px] h-[500px] md:w-[320px] md:h-[600px] rounded-[3rem] iphone-bezel p-3 bg-black flex flex-col scale-75 md:scale-90">
                  <div className="flex-1 bg-[#050914] rounded-[2.5rem] overflow-hidden relative flex flex-col p-6 items-center justify-start text-center">
                      <div className="absolute top-2 w-20 h-6 bg-black rounded-full" />
                      
                      <div className="mt-8 mb-6">
                        <div className="w-24 h-24 rounded-full border-4 border-brand/30 border-t-brand flex flex-col items-center justify-center mx-auto">
                          <span className="text-3xl font-black text-white">{metricValue}</span>
                          <span className="text-[8px] font-black text-brand uppercase">MS LOAD</span>
                        </div>
                      </div>

                      <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-tight">Performance Core</h4>
                      <p className="text-gray-500 text-[10px] mb-6">Métricas de otimização em tempo real</p>
                      
                      <div className="w-full h-16 bg-white/5 rounded-xl border border-white/10 mb-6 relative overflow-hidden">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40">
                          <path d="M0 35 Q 20 10, 40 30 T 80 10 L 100 25" fill="none" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                          <path d="M0 35 Q 20 10, 40 30 T 80 10 L 100 25 V 40 H 0 Z" fill="var(--color-brand)" opacity="0.1" />
                        </svg>
                        <div className="absolute bottom-2 left-3 flex items-center gap-1">
                           <div className="w-1 h-1 rounded-full bg-brand animate-pulse" />
                           <span className="text-[8px] text-gray-400 font-bold">LIVE SYNC</span>
                        </div>
                      </div>

                      <div className="w-full space-y-2">
                         {[
                           { label: "Otimização de Assets", val: "99%", color: "bg-brand/20" },
                           { label: "Tempo de Resposta", val: "12ms", color: "bg-indigo-500/20" },
                           { label: "SEO Score", val: "100", color: "bg-orange-500/20" }
                         ].map((item, i) => (
                           <div key={i} className="h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between px-3">
                              <div className="flex items-center">
                                <div className={cn("w-6 h-6 rounded-lg mr-3", item.color)} />
                                <span className="text-white text-[10px] font-bold">{item.label}</span>
                              </div>
                              <span className="text-brand text-[10px] font-black">{item.val}</span>
                           </div>
                         ))}
                      </div>

                      <div className="mt-6 pt-6 border-t border-white/5 w-full">
                         <div className="flex justify-between items-center mb-2">
                           <span className="text-gray-500 text-[8px] font-black uppercase">Traffic Origin</span>
                           <span className="text-white text-[8px] font-bold">Global</span>
                         </div>
                         <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-brand w-[85%] rounded-full" />
                         </div>
                      </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-10">
        <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter text-silver-matte uppercase">
          {ctaHeading}
        </h2>
        <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          {ctaDescription}
        </p>
        <div className="flex justify-center">
          <button className="btn-modern-light flex items-center justify-center gap-3 px-12 py-6 rounded-[1.5rem] group min-w-[280px]">
            <span className="text-2xl font-black uppercase tracking-widest">Ver Cases de Sucesso</span>
          </button>
        </div>
      </div>
    </div>
  );
}
