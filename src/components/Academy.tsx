import { motion } from "motion/react";
import { GraduationCap, ArrowRight, Brain, Languages, Smile } from "lucide-react";

interface AcademyProps {
  onExplore?: () => void;
}

export default function Academy({ onExplore }: AcademyProps) {
  const educationCards = [
    {
      title: "Academia Techify",
      tag: "Grátis",
      tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      description: "Cursos gratuitos de programação, design, idiomas, massagem e muito mais. IA gera aulas personalizadas pra você!",
      icon: GraduationCap,
      color: "border-green-500/20 hover:bg-green-500/5"
    },
    {
      title: "Aprenda Idiomas",
      tag: "Multi-línguas",
      tagColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      description: "Inglês americano, Português de Portugal, Espanhol, Japonês, Francês... con gírias e cultura real!",
      icon: Languages,
      color: "border-orange-500/20 hover:bg-orange-500/5"
    },
    {
      title: "IA Tutora 24/7",
      tag: "IA",
      tagColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      description: "Techify IA responde suas dúvidas, explica conceitos e te guia com voz e chat em tempo real.",
      icon: Brain,
      color: "border-indigo-500/20 hover:bg-indigo-500/5"
    },
    {
      title: "Saúde & Bem-Estar",
      tag: "Novidade",
      tagColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      description: "Cursos de massagem terapêutica, meditação, yoga e bem-estar para cuidar de você e lucrar.",
      icon: Smile,
      color: "border-pink-500/20 hover:bg-pink-500/5"
    }
  ];

  const stats = [
    { label: "Cursos Gratuitos", value: "25+", icon: "📚" },
    { label: "Idiomas", value: "8", icon: "🌍" },
    { label: "IA Tutora", value: "24/7", icon: "🤖" },
    { label: "Certificados", value: "100%", icon: "🏆" },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold mb-6">
            <GraduationCap size={14} />
            Academia Techify
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            Aprenda <span className="text-brand">qualquer coisa</span> de graça 🚀
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400">
            IA que gera aulas personalizadas, fala com você, tira dúvidas no chat e emite certificado grátis. Programação, idiomas, massagem, design e muito mais!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {educationCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.01, x: idx % 2 === 0 ? 5 : -5 }}
              className={`p-8 rounded-3xl border ${card.color} group hover:border-brand/40 transition-all cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-6">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10"
                >
                  <card.icon className="text-brand" size={28} />
                </motion.div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${card.tagColor}`}>
                  {card.tag}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-brand transition-colors">{card.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {card.description}
              </p>
              <button 
                onClick={onExplore}
                className="flex items-center gap-2 text-brand font-bold text-sm group-hover:gap-4 transition-all cursor-pointer"
              >
                Explorar cursos <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center">
              <div className="text-3xl mb-4">{stat.icon}</div>
              <div className="text-3xl font-black text-brand mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
