import React from "react";
import { motion } from "motion/react";
import { Globe, Palette, Monitor, Zap } from "lucide-react";
import { GlowCard } from "./ui/spotlight-card";

export default function Services() {
  const services = [
    {
      title: "Criação de Sites",
      description: "Websites modernos, responsivos e otimizados para conversão que geram resultados reais.",
      icon: Globe,
      iconColor: "text-blue-400",
      color: "blue" as const,
    },
    {
      title: "Design Gráfico",
      description: "Identidade visual única, logos, banners e materiais gráficos que representam sua marca.",
      icon: Palette,
      iconColor: "text-orange-400",
      color: "orange" as const,
    },
    {
      title: "Desenvolvimento",
      description: "Código limpo, performático e escalável para qualquer tipo de projeto digital.",
      icon: Monitor,
      iconColor: "text-gray-400",
      color: "purple" as const,
    },
    {
      title: "Otimização & SEO",
      description: "Performance máxima e visibilidade no Google para seu site aparecer na frente.",
      icon: Zap,
      iconColor: "text-green-400",
      color: "green" as const,
    },
  ];

  return (
    <section className="py-24 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter text-white">
            Nossos <span className="text-brand">Serviços</span>
          </h2>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Soluções completas para elevar sua presença digital</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-2 md:px-0">
          {services.map((service, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1 }}
              className="h-full active:scale-[0.98] transition-transform"
            >
              <GlowCard 
                glowColor={service.color}
                customSize
                className="h-full border-white/5 bg-white/[0.02] backdrop-blur-sm rounded-[2rem] hover:border-brand/40 transition-all duration-500 cursor-default shadow-2xl"
              >
                <div className="relative z-10 p-8 flex flex-col h-full">
                  <div className="mb-8 w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand/20 transition-all shadow-xl border border-white/5">
                    <service.icon className={service.iconColor} size={32} />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-4 group-hover:text-brand transition-colors text-white">{service.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-medium mb-4 flex-1">
                    {service.description}
                  </p>
                  <div className="pt-4 border-t border-white/5 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Techify Core</span>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

