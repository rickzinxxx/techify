import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

function Counter({ value, duration = 2 }: { value: string, duration?: number }) {
  const numericValue = parseInt(value, 10) || 0;
  const suffix = value.replace(/[0-9]/g, "");
  
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });
  
  const displayValue = useTransform(springValue, (latest) => 
    Math.floor(latest) + suffix
  );

  const [current, setCurrent] = useState("0" + suffix);

  useEffect(() => {
    motionValue.set(numericValue);
    const unsubscribe = displayValue.on("change", (latest) => {
       setCurrent(latest);
    });
    return () => unsubscribe();
  }, [numericValue, motionValue, displayValue]);

  return <>{current}</>;
}

export default function Stats() {
  const stats = [
    { value: "50+", label: "Projetos" },
    { value: "30+", label: "Clientes" },
    { value: "100%", label: "Satisfação" },
  ];

  return (
    <section className="py-24 border-y border-white/5 bg-white/[0.01]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="text-center py-12 md:py-0 px-8"
            >
              <div className="text-4xl md:text-5xl font-black text-brand neon-glow mb-4 tracking-tighter">
                <Counter value={stat.value} />
              </div>
              <div className="text-white font-black uppercase tracking-[0.2em] text-[10px] md:text-xs opacity-40">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
