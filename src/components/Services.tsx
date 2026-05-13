import React from "react";
import { motion } from "motion/react";
import { Globe, Palette, Monitor, Zap } from "lucide-react";

export default function Services() {
  const services = [
    {
      title: "Criação de Sites",
      description: "Websites modernos, responsivos e otimizados para conversão que geram resultados reais.",
      icon: <Globe className="text-blue-400" size={32} />,
    },
    {
      title: "Design Gráfico",
      description: "Identidade visual única, logos, banners e materiais gráficos que representam sua marca.",
      icon: <Palette className="text-orange-400" size={32} />,
    },
    {
      title: "Desenvolvimento",
      description: "Código limpo, performático e escalável para qualquer tipo de projeto digital.",
      icon: <Monitor className="text-gray-400" size={32} />,
    },
    {
      title: "Otimização & SEO",
      description: "Performance máxima e visibilidade no Google para seu site aparecer na frente.",
      icon: <Zap className="text-yellow-400" size={32} />,
    },
  ];

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">
            Nossos <span className="text-brand">Serviços</span>
          </h2>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Soluções completas para elevar sua presença digital</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative group h-full"
            >
              <div
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-brand/40 transition-all cursor-default relative overflow-hidden h-full z-10 backdrop-blur-sm"
              >
                <div className="relative z-10">
                  <div className="mb-6 w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-4 group-hover:text-brand transition-colors">{service.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-medium">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

