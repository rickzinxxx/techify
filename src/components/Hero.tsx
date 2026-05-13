import { useState } from "react";
import { 
  Calendar, 
  Play, 
  GraduationCap, 
  Sparkles, 
  Box, 
  X, 
  Send, 
  Mail, 
  Phone, 
  User, 
  ChevronRight,
  TrendingUp,
  Instagram
} from "lucide-react";
import { CosmicParallaxBg } from "./ui/parallax-cosmic-background";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface HeroProps {
  onViewPortfolio?: () => void;
}

export default function Hero({ onViewPortfolio }: HeroProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "Criação de Sites",
    instagram: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "consultations"), {
        ...formData,
        status: "pendente",
        createdAt: serverTimestamp(),
        emailCount: 0
      });
      setIsSubmitting(false);
      setIsModalOpen(false);
      setFormData({ name: "", email: "", phone: "", category: "Criação de Sites", instagram: "", message: "" });
      alert("Consulta agendada com sucesso! Entraremos em contato em breve.");
    } catch (err) {
      console.error("Error scheduling consultation:", err);
      setIsSubmitting(false);
      alert("Erro ao agendar consulta. Tente novamente.");
    }
  };

  const badges = [
    { text: "Cursos Grátis", icon: "🎓" },
    { text: "8 Idiomas", icon: "🌍" },
    { text: "IA Tutora 24/7", icon: "🤖" },
    { text: "Desenvolvimento", icon: "💻" },
    { text: "Programação", icon: "🚀" },
    { text: "Certificados", icon: "🏆" },
  ];

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden pt-12 md:pt-20">
      {/* Cosmic Parallax Background */}
      <CosmicParallaxBg 
        head="Transforme Seu" 
        text="Negócio Digital, Resultados Reais, Inovação, Techify" 
        loop={true}
        className="absolute inset-0 z-0"
      />

      <div className="container mx-auto px-4 relative z-20 text-center pointer-events-none flex flex-col items-center">
        {/* Logo emblem */}
        <div 
          className="mb-8 relative inline-block pointer-events-auto"
        >
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-black/40 border-2 border-brand/30 flex flex-col items-center justify-center relative shadow-[0_0_80px_rgba(132,204,22,0.3)] backdrop-blur-md">
            <div className="absolute inset-0 bg-brand/5"></div>
            <div className="relative">
               <svg viewBox="0 0 24 24" className="w-12 h-12 md:w-16 md:h-16 text-brand fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.5,18.5L9.5,12.5L13.5,16.5L22,6.92L20.59,5.5L13.5,13.5L9.5,9.5L2,17L3.5,18.5Z" />
                  <path d="M22,12V6H16L18.29,8.29L22,12Z" opacity="0.8" />
               </svg>
            </div>
            <span className="text-sm md:text-md font-black tracking-widest mt-1 text-white">TECHIFY</span>
          </div>
        </div>

        {/* Floating badge */}
        <div
           className="px-5 py-1.5 rounded-full border border-brand/30 bg-brand/10 text-brand mb-12 flex items-center gap-2 pointer-events-auto backdrop-blur-md"
        >
          <Sparkles size={14} className="text-brand" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Inovação Digital</span>
        </div>

        {/* Animated Title Section */}
        <div className="w-full flex flex-col items-center py-8">
           <h2 id="title">TRANSFORME SEU</h2>
           <div id="subtitle-container">
              <span className="subtitle-part-1">NEGÓCIO DIGITAL</span>
           </div>
        </div>

        <div className="pointer-events-auto w-full max-w-4xl mt-12">
          <p
            className="max-w-2xl mx-auto text-lg md:text-xl text-gray-100 mb-10 leading-relaxed font-semibold drop-shadow-lg"
          >
            Criamos plataformas web e identidade visual que geram resultados reais. <br />
            <span className="text-brand">Da ideia ao lançamento, sua visão ganha vida.</span>
          </p>

          {/* Feature Badges */}
          <div 
             className="flex flex-wrap justify-center gap-4 mb-16 max-w-4xl mx-auto"
          >
            {badges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand/90 hover:bg-white/10 transition-colors backdrop-blur-md">
                <span>{badge.icon}</span>
                {badge.text}
              </div>
            ))}
          </div>

          {/* Main CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <button 
              onClick={() => setIsModalOpen(true)}
              className="h-14 px-10 rounded-xl bg-brand text-black font-bold flex items-center gap-2 hover:bg-brand/90 transition-all shadow-[0_0_20px_rgba(132,204,22,0.4)] group"
            >
              <Calendar size={20} />
              Agendar Consulta
              <span>→</span>
            </button>
            
            <button 
              onClick={onViewPortfolio}
              className="h-14 px-10 rounded-xl bg-white text-black font-bold border border-brand/20 hover:bg-white/90 transition-all"
            >
              Ver Portfólio
            </button>
          </div>

          {/* Scroll indicator */}
          <div className="flex flex-col items-center gap-4">
            <span className="text-xs uppercase tracking-widest text-brand font-bold">Role para explorar</span>
            <div className="w-6 h-10 border-2 border-brand/50 rounded-full flex justify-center p-1">
              <div 
                className="w-1.5 h-1.5 bg-brand rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
          />
          <div 
            className="relative w-full max-w-2xl bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
              >
                <X size={28} />
              </button>

              <div className="mb-10 text-center">
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
                  Agende sua <span className="text-brand italic">Mentoria</span>
                </h2>
                <p className="text-gray-500 font-bold max-w-sm mx-auto">
                  Preencha o formulário e nossa equipe entrará em contato em menos de 24h.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nome Completo</label>
                     <div className="relative">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                        <input 
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 h-14 pl-12 pr-6 rounded-2xl focus:outline-none focus:border-brand/40 transition-all font-bold text-white placeholder:text-gray-700"
                          placeholder="Ex: João Silva"
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Melhor E-mail</label>
                     <div className="relative">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                        <input 
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 h-14 pl-12 pr-6 rounded-2xl focus:outline-none focus:border-brand/40 transition-all font-bold text-white placeholder:text-gray-700"
                          placeholder="seu@email.com"
                        />
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Telefone (WhatsApp)</label>
                     <div className="relative">
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                        <input 
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 h-14 pl-12 pr-6 rounded-2xl focus:outline-none focus:border-brand/40 transition-all font-bold text-white placeholder:text-gray-700"
                          placeholder="(00) 00000-0000"
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Categoria de Interesse</label>
                     <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 h-14 px-6 rounded-2xl focus:outline-none focus:border-brand/40 transition-all font-black text-brand text-xs uppercase tracking-widest appearance-none cursor-pointer"
                     >
                        <option value="Criação de Sites">Criação de Sites</option>
                        <option value="Identidade Visual">Identidade Visual</option>
                        <option value="Marketing Digital">Marketing Digital</option>
                        <option value="Branding">Branding</option>
                        <option value="Outro">Outro</option>
                     </select>
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Instagram (@usuario)</label>
                   <div className="relative">
                      <Instagram size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                      <input 
                        type="text"
                        value={formData.instagram}
                        onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 h-14 pl-12 pr-6 rounded-2xl focus:outline-none focus:border-brand/40 transition-all font-bold text-white placeholder:text-gray-700"
                        placeholder="@seuusuario"
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Sobre o seu Projeto</label>
                   <textarea 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl focus:outline-none focus:border-brand/40 transition-all font-medium text-white placeholder:text-gray-700 resize-none h-32"
                      placeholder="Conte um pouco sobre sua ideia ou necessidade..."
                   />
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full h-16 bg-brand text-black font-black uppercase tracking-widest rounded-2xl shadow-[0_0_40px_rgba(132,204,22,0.3)] hover:scale-[1.02] active:scale-95 transition-all text-xl mt-6 flex items-center justify-center gap-3 group disabled:opacity-50"
                >
                  {isSubmitting ? (
                     <div 
                      className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"
                     />
                  ) : (
                    <>
                      <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      Confirmar Agendamento
                    </>
                  )}
                </button>
              </form>
              
              <div className="mt-8 flex items-center justify-center gap-6 text-gray-600">
                  <div className="flex items-center gap-2">
                     <TrendingUp size={16} className="text-brand" />
                     <span className="text-[9px] font-black uppercase tracking-widest">Performance</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Sparkles size={16} className="text-brand" />
                     <span className="text-[9px] font-black uppercase tracking-widest">Inovação</span>
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
