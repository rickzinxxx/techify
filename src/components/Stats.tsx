import { motion } from "motion/react";

export default function Stats() {
  const stats = [
    { value: "50+", label: "Projetos" },
    { value: "30+", label: "Clientes" },
    { value: "100%", label: "Satisfação" },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-6xl md:text-7xl font-black text-brand neon-glow mb-2">{stat.value}</div>
              <div className="text-gray-400 uppercase tracking-widest font-bold text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
