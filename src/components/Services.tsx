import { motion } from "motion/react";
import { Globe, Palette, Monitor, Zap } from "lucide-react";
import { CosmicSpectrum } from "./ui/cosmos-spectrum";

export default function Services() {
  const services = [
    {
      title: "Criação de Sites",
      description: "Websites modernos, responsivos e otimizados para conversão que geram resultados reais.",
      icon: "🌐",
      iconColor: "text-blue-500",
      theme: "blue-pink" as const
    },
    {
      title: "Design Gráfico",
      description: "Identidade visual única, logos, banners e materiais gráficos que representam sua marca.",
      icon: "🎨",
      iconColor: "text-orange-500",
      theme: "blue-orange" as const
    },
    {
      title: "Desenvolvimento",
      description: "Código limpo, performático e escalável para qualquer tipo de projeto digital.",
      icon: "💻",
      iconColor: "text-gray-400",
      theme: "purple" as const
    },
    {
      title: "Otimização & SEO",
      description: "Performance máxima e visibilidade no Google para seu site aparecer na frente.",
      icon: "⚡",
      iconColor: "text-yellow-500",
      theme: "sunset" as const
    },
  ];

  return (
    <section className="py-24 bg-black/50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Nossos <span className="text-brand">Serviços</span>
          </h2>
          <p className="text-gray-400">Soluções completas para elevar sua presença digital</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-brand/40 transition-all group cursor-default relative overflow-hidden h-full"
            >
              {/* Cosmic Spectrum Effect Background */}
              <CosmicSpectrum 
                color={service.theme} 
                blur 
                noScrollTrigger
                className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
              />
              
              <div className="relative z-10">
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl mb-6"
                >
                  {service.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-brand transition-colors">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
