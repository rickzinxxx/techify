"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Canvas } from "@react-three/fiber";
import { ShaderPlane, MeshGradient, DotOrbit, EnergyRing } from "./background-paper-shaders";
import { 
  Video, 
  Calendar as CalendarIcon, 
  Image as ImageIcon, 
  Camera, 
  Mail, 
  FileText, 
  Clock as ClockIcon, 
  Mic2, 
  ListTodo, 
  Tv, 
  AppWindow, 
  MapPin, 
  Heart, 
  Home as HomeIcon, 
  Wallet, 
  Settings,
  Phone,
  Compass,
  MessageSquare,
  Music,
  CloudSun,
  Battery,
  Wifi,
  Signal,
  LineChart,
  LocateFixed,
  BookOpen,
  Star,
  Activity,
  Watch,
  Users,
  Languages,
  Folder,
  SquareStack,
  LayoutGrid,
  Pencil,
  Book,
  Lightbulb,
  ShoppingBag,
  Music2,
  Presentation,
  BarChart3,
  Search,
  MousePointer2,
  Zap,
  Sparkles
} from "lucide-react";
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
      background-color: #0c0c0c;
      box-shadow: 
          inset 0 0 0 1px rgba(255,255,255,0.1),
          inset 0 0 0 3px #1a1a1a,
          0 0 0 4px #262626,
          0 40px 80px -15px rgba(0,0,0,0.8);
      border: 1px solid rgba(255,255,255,0.05);
  }

  .ios-app-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      padding: 16px;
  }

  .ios-app-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      cursor: pointer;
  }

  .ios-icon-bg {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ios-app-label {
      font-size: 10px;
      color: white;
      font-weight: 500;
  }

  .ios-widget {
      background: rgba(0,0,0,0.4);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid rgba(255,255,255,0.05);
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
  
  const [activeApp, setActiveApp] = useState<string | null>(null);

  useEffect(() => {
    if (activeApp) {
      const timer = setTimeout(() => setActiveApp(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [activeApp]);

  const appIcons = [
    { label: "Weather", icon: CloudSun, color: "bg-[#4FB7F4]" },
    { label: "Stocks", icon: LineChart, color: "bg-black" },
    { label: "Find My", icon: LocateFixed, color: "bg-[#2ECC71]" },
    { label: "Home", icon: HomeIcon, color: "bg-white", iconColor: "text-[#F39C12]" },
    
    { label: "Books", icon: BookOpen, color: "bg-[#E67E22]" },
    { label: "iTunes Store", icon: Star, color: "bg-[#9B59B6]" },
    { label: "Fitness", icon: Activity, color: "bg-black", iconColor: "text-[#2ECC71]" },
    { label: "Watch", icon: Watch, color: "bg-black" },

    { label: "Contacts", icon: Users, color: "bg-[#ECF0F1]", iconColor: "text-[#2C3E50]" },
    { label: "Translate", icon: Languages, color: "bg-[#2980B9]" },
    { label: "Files", icon: Folder, color: "bg-white", iconColor: "text-[#3498DB]" },
    { label: "Shortcuts", icon: SquareStack, color: "bg-[#8E44AD]" },

    { label: "Utilities", icon: LayoutGrid, color: "bg-[#34495E]/40" },
    { label: "Freeform", icon: Pencil, color: "bg-white", iconColor: "text-[#3498DB]" },
    { label: "Journal", icon: Book, color: "bg-white", iconColor: "text-[#8E44AD]" },
    { label: "Tips", icon: Lightbulb, color: "bg-[#F1C40F]" },

    { label: "Apple Store", icon: ShoppingBag, color: "bg-white", iconColor: "text-[#3498DB]" },
    { label: "Clips", icon: Video, color: "bg-[#4FB7F4]" },
    { label: "GarageBand", icon: Music2, color: "bg-white", iconColor: "text-[#E67E22]" },
    { label: "iMovie", icon: Star, color: "bg-[#9B59B6]" },

    { label: "Keynote", icon: Presentation, color: "bg-[#3498DB]" },
    { label: "Numbers", icon: BarChart3, color: "bg-[#2ECC71]" },
    { label: "Pages", icon: FileText, color: "bg-[#E67E22]" },
  ];

  const dockIcons = [
    { label: "Phone", icon: Phone, color: "bg-green-500" },
    { label: "Safari", icon: Compass, color: "bg-white", iconColor: "text-blue-500" },
    { label: "Messages", icon: MessageSquare, color: "bg-green-500" },
    { label: "Music", icon: Music, color: "bg-red-500" },
  ];

  const techQualifications = [
    { 
      label: "Performance Brutal", 
      desc: "Sites que carregam em menos de 100ms.", 
      icon: Zap, 
      pos: "top-0 left-[-160px] lg:left-[-200px]",
      delay: 2.2
    },
    { 
      label: "Design Autoral", 
      desc: "Interfaces únicas, sem templates.", 
      icon: Sparkles, 
      pos: "top-[120px] right-[-160px] lg:right-[-200px]",
      delay: 2.4
    },
    { 
      label: "SEO Avançado", 
      desc: "Estrutura pronta para o topo do Google.", 
      icon: BarChart3, 
      pos: "bottom-[160px] left-[-160px] lg:left-[-200px]",
      delay: 2.6
    },
    { 
      label: "UX de Elite", 
      desc: "Foco total em conversão e usabilidade.", 
      icon: MousePointer2, 
      pos: "bottom-[40px] right-[-160px] lg:right-[-200px]",
      delay: 2.8
    },
  ];

  return (
    <div
      className={cn("relative w-full py-12 overflow-hidden flex flex-col items-center justify-center font-sans antialiased gap-12", className)}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      
      {/* Three.js Background Shader */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }} alpha={true}>
          <Suspense fallback={null}>
            <fog attach="fog" args={["#000000", 5, 20]} />
            <MeshGradient colors={["#000000", "#1a1a1a", "#051505", "#84cc16"]} speed={0.4} />
            <DotOrbit dotColor="#ffffff" speed={0.5} intensity={1.5} />
            <ShaderPlane position={[0, 0, -2]} color1="#84cc16" color2="#000000" />
            <EnergyRing radius={5} color="#84cc16" position={[0, 0, -1]} />
          </Suspense>
        </Canvas>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

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

            <div className="relative flex justify-center opacity-90 hover:opacity-100 transition-opacity duration-500">
               
               {/* Qualifications around the phone */}
               {techQualifications.map((q, i) => (
                 <motion.div
                   key={i}
                   initial={{ opacity: 0, scale: 0.8, x: i % 2 === 0 ? -20 : 20 }}
                   animate={{ opacity: 1, scale: 1, x: 0 }}
                   transition={{ duration: 0.8, delay: q.delay }}
                   className={cn(
                     "absolute z-50 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 w-40 md:w-48 shadow-2xl hidden lg:block",
                     q.pos
                   )}
                 >
                   <div className="flex flex-col gap-2 text-left">
                     <div className="p-2 rounded-lg bg-brand/20 w-fit">
                       <q.icon size={16} className="text-brand" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-brand">{q.label}</span>
                     <p className="text-[10px] text-gray-400 leading-tight font-medium">{q.desc}</p>
                   </div>
                 </motion.div>
               ))}

               <div className="relative w-[300px] h-[610px] md:w-[340px] md:h-[680px] rounded-[3.5rem] iphone-bezel p-[10px] bg-black flex flex-col scale-75 md:scale-90 shadow-2xl">
                  {/* Silent Switch */}
                  <div className="absolute left-[-2px] top-24 w-[2px] h-8 bg-gray-600 rounded-l-md" />
                  {/* Volume Buttons */}
                  <div className="absolute left-[-2px] top-36 w-[2px] h-12 bg-gray-600 rounded-l-md" />
                  <div className="absolute left-[-2px] top-52 w-[2px] h-12 bg-gray-600 rounded-l-md" />
                  {/* Power Button */}
                  <div className="absolute right-[-2px] top-40 w-[2px] h-20 bg-gray-600 rounded-r-md" />

                  <div className="flex-1 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2564&ixlib=rb-4.0.3')] bg-cover bg-center rounded-[3rem] overflow-hidden relative flex flex-col items-stretch">
                      
                      {/* Top Bar / Status Bar */}
                      <div className="h-10 flex items-center justify-between px-8 pt-6 z-30">
                        <span className="text-[10px] font-bold text-white">4:59</span>
                        <div className="flex items-center gap-1.5 text-white">
                          <Signal size={12} />
                          <Wifi size={12} />
                          <Battery size={14} className="rotate-90" />
                        </div>
                      </div>

                      {/* Dynamic Island */}
                      <motion.div 
                        initial={false}
                        animate={{ 
                          width: activeApp ? 160 : 96,
                          height: activeApp ? 30 : 26,
                          borderRadius: activeApp ? 15 : 13,
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute top-2 left-1/2 -translate-x-1/2 bg-black z-40 flex items-center justify-between px-3 overflow-hidden shadow-lg border border-white/5"
                      >
                         <AnimatePresence mode="wait">
                            {activeApp ? (
                              <motion.div 
                                key="active"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="w-full flex items-center justify-between"
                              >
                                  <div className="w-4 h-4 rounded-full bg-brand/20 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                                  </div>
                                  <span className="text-[9px] font-black tracking-tight text-white/90 uppercase">{activeApp}</span>
                                  <div className="flex gap-0.5">
                                    {[1,2,3].map(i => <div key={i} className="w-0.5 h-2 bg-brand/40 rounded-full" />)}
                                  </div>
                              </motion.div>
                            ) : (
                              <motion.div 
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full flex items-center justify-end"
                              >
                                <div className="w-2 h-2 rounded-full bg-blue-900/60" />
                              </motion.div>
                            )}
                         </AnimatePresence>
                      </motion.div>

                      {/* Content Area (IOS Home Screen) */}
                      <div className="flex-1 px-4 pt-8 overflow-hidden flex flex-col no-scrollbar overflow-y-auto">
                        
                        {/* App Grid */}
                        <div className="ios-app-grid relative">
                          {appIcons.map((app, i) => (
                            <motion.div 
                              key={i} 
                              className="ios-app-icon"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setActiveApp(app.label)}
                            >
                              <div className={cn("ios-icon-bg shadow-lg flex items-center justify-center", app.color)}>
                                <app.icon size={26} className={app.iconColor || "text-white"} />
                              </div>
                              <span className="ios-app-label drop-shadow-md">{app.label}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Search Pill */}
                      <div className="mx-auto mb-2">
                        <div className="flex items-center gap-1 px-3 py-0.5 bg-black/20 backdrop-blur-md rounded-full border border-white/10">
                          <Search size={10} className="text-white/60" />
                          <span className="text-[9px] font-medium text-white/80">Search</span>
                        </div>
                      </div>

                      {/* Dock */}
                      <div className="h-20 bg-white/20 backdrop-blur-2xl m-4 mt-0 rounded-[2.5rem] flex items-center justify-around px-4 border border-white/10 shadow-2xl">
                        {dockIcons.map((app, i) => (
                          <motion.div 
                            key={i} 
                            className="w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-lg cursor-pointer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setActiveApp(app.label)}
                          >
                            <div className={cn("w-full h-full rounded-[1.2rem] flex items-center justify-center", app.color)}>
                               <app.icon size={30} className={app.iconColor || "text-white"} />
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Home Indicator */}
                      <div className="pb-2 flex justify-center">
                        <div className="w-20 h-1 bg-white/40 rounded-full" />
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
      </div>
    </div>
  );
}
