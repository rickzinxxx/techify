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
    <section className="py-20 md:py-24 border-y border-white/5 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-3 divide-x divide-white/10">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="text-center px-2 flex flex-col items-center"
            >
              <div className="text-3xl sm:text-4xl md:text-6xl font-black text-brand mb-2 tracking-tighter drop-shadow-[0_0_15px_rgba(132,204,22,0.5)]">
                <Counter value={stat.value} />
              </div>
              <div className="text-white font-black uppercase tracking-widest text-[9px] md:text-xs opacity-40">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand/5 blur-[100px] -z-10 rounded-full" />
    </section>
  );
}
