import { motion } from "motion/react";

export default function Stats() {
  const stats = [
    { value: "50+", label: "Projetos" },
    { value: "30+", label: "Clientes" },
    { value: "100%", label: "Satisfação" },
  ];

  return (
    <section className="py-32 border-y border-white/5 bg-white/[0.01]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center py-12 md:py-0 px-8"
            >
              <div className="text-4xl md:text-5xl font-black text-brand neon-glow mb-4 tracking-tighter">{stat.value}</div>
              <div className="text-white font-black uppercase tracking-[0.2em] text-[10px] md:text-xs opacity-40">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
