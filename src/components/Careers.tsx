import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GlowCard } from "./ui/spotlight-card";
// ... (rest of imports)
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Plus, 
  X, 
  Upload, 
  Send,
  User as UserIcon,
  Mail,
  Phone,
  MessageSquare,
  Search,
  Filter,
  Trash2,
  CheckCircle2,
  Sparkles,
  LogIn,
  LogOut
} from "lucide-react";
import { db, auth, isAdmin, signInWithGoogle, logout } from "../lib/firebase";
import { collection, onSnapshot, setDoc, doc, deleteDoc, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

interface Vacancy {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

export default function Careers() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("Todos");

  // Form states
  const [newVacancy, setNewVacancy] = useState({
    title: "",
    department: "Design",
    type: "Tempo Integral",
    location: "",
    description: "",
    requirements: [] as string[],
    benefits: [] as string[]
  });

  const [application, setApplication] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "vacancies"), orderBy("title", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vacancy));
      setVacancies(list);
      setLoading(false);
    });

    const authUnsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => {
      unsubscribe();
      authUnsubscribe();
    };
  }, []);

  const handlePublish = async () => {
    if (!newVacancy.title || !newVacancy.location || !isAdmin(user?.email)) return;
    
    const id = Math.random().toString(36).substr(2, 9);
    try {
      await setDoc(doc(db, "vacancies", id), {
        ...newVacancy
      });
      setIsPublishModalOpen(false);
      setNewVacancy({
        title: "",
        department: "Design",
        type: "Tempo Integral",
        location: "",
        description: "",
        requirements: [],
        benefits: []
      });
    } catch (error) {
      console.error("Error saving vacancy:", error);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin(user?.email)) return;
    if (!confirm("Deseja realmente remover esta vaga?")) return;
    try {
      await deleteDoc(doc(db, "vacancies", id));
    } catch (error) {
      console.error("Error deleting vacancy:", error);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVacancy) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "applications"), {
        vacancyId: selectedVacancy.id,
        vacancyTitle: selectedVacancy.title,
        ...application,
        status: "pendente",
        createdAt: serverTimestamp()
      });
      setIsSubmitting(false);
      setIsApplyModalOpen(false);
      setApplication({ name: "", email: "", phone: "", message: "" });
      alert("Candidatura enviada com sucesso!");
    } catch (error) {
      console.error("Error submitting application:", error);
      setIsSubmitting(false);
      alert("Erro ao enviar candidatura. Tente novamente.");
    }
  };

  const filteredVacancies = vacancies.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         v.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "Todos" || v.department.toLowerCase() === selectedDept.toLowerCase();
    return matchesSearch && matchesDept;
  });

  const departments = ["Todos", "Design", "Desenvolvimento", "Marketing", "Vendas", "Outro"];

  return (
    <div className="min-h-screen pt-4 md:pt-24 pb-20 px-6 bg-transparent relative">
       {/* Background Effects */}
       <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand/5 blur-[120px] rounded-full -z-10" />
       <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-8xl font-black mb-6 leading-[0.9]"
          >
            Junte-se ao <span className="text-brand">Time Techify</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-base md:text-xl max-w-3xl mx-auto"
          >
            Construa o futuro do design digital conosco. Estamos procurando talentos 
            apaixonados por criar experiências incríveis.
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            {isAdmin(user?.email) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPublishModalOpen(true)}
                className="w-full sm:w-auto bg-brand text-black font-black uppercase tracking-wider h-12 md:h-14 px-8 md:px-10 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(132,204,22,0.2)]"
              >
                <Plus size={20} />
                Publicar Vaga
              </motion.button>
            )}

            {!user ? (
              <button 
                onClick={() => signInWithGoogle()}
                className="w-full sm:w-auto text-gray-500 hover:text-brand flex items-center justify-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest bg-white/5 px-6 h-12 md:h-14 rounded-2xl border border-white/10"
              >
                <LogIn size={16} />
                Admin
              </button>
            ) : (
               <button 
                onClick={() => logout()}
                className="w-full sm:w-auto text-red-500 hover:text-red-400 flex items-center justify-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest bg-red-500/5 px-6 h-12 md:h-14 rounded-2xl border border-red-500/20"
              >
                <LogOut size={16} />
                Sair
              </button>
            )}
          </div>
        </header>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full"
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-center">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Buscar vagas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 h-14 pl-12 pr-4 rounded-xl focus:outline-none focus:border-brand/50 transition-all font-medium"
            />
          </div>

          <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 overflow-x-auto no-scrollbar max-w-full">
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-6 h-10 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  selectedDept === dept ? "bg-brand text-black" : "text-gray-400 hover:text-white"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredVacancies.map((vacancy, index) => (
              <motion.div
                key={vacancy.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setSelectedVacancy(vacancy);
                  setIsDetailModalOpen(true);
                }}
                className="h-full"
              >
                <GlowCard 
                  glowColor={vacancy.department === "Desenvolvimento" ? "blue" : "green"}
                  customSize
                  className="group bg-[#111] border border-white/5 p-8 rounded-3xl hover:border-brand/40 transition-all cursor-pointer relative overflow-hidden h-full"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex flex-col gap-3">
                      <h3 className="text-2xl font-black uppercase tracking-tight group-hover:text-brand transition-colors text-white">
                        {vacancy.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500">
                          {vacancy.department}
                        </span>
                        <span className="px-3 py-1 bg-brand/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-brand">
                          {vacancy.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isAdmin(user?.email) && (
                        <button 
                          onClick={(e) => handleDelete(vacancy.id, e)}
                          className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                      <ChevronRight size={24} className="text-gray-600 group-hover:text-brand group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-500 mb-6 text-sm">
                    <MapPin size={16} />
                    {vacancy.location}
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                    {vacancy.description}
                  </p>
                </GlowCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredVacancies.length === 0 && (
          <div className="py-20 text-center">
            <Briefcase size={48} className="text-gray-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-500">Nenhuma vaga aberta no momento</h2>
          </div>
        )}
      </div>

      {/* Modal Detalhes da Vaga */}
      <AnimatePresence>
        {isDetailModalOpen && selectedVacancy && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar"
            >
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                <X size={28} />
              </button>

              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 pr-10">
                {selectedVacancy.title}
              </h2>

              <div className="flex flex-wrap gap-3 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-gray-400">
                  <Briefcase size={14} className="text-brand" />
                  {selectedVacancy.department}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-brand/10 rounded-xl text-xs font-bold text-brand">
                  <Clock size={14} />
                  {selectedVacancy.type}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-gray-400">
                  <MapPin size={14} className="text-brand" />
                  {selectedVacancy.location}
                </div>
              </div>

              <div className="space-y-10">
                <section>
                  <h4 className="text-brand font-black uppercase tracking-widest text-xs mb-4">Descrição</h4>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {selectedVacancy.description}
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <section>
                    <h4 className="text-brand font-black uppercase tracking-widest text-xs mb-4">Requisitos</h4>
                    <ul className="space-y-3">
                      {selectedVacancy.requirements.map((req, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-400">
                          <div className="w-1.5 h-1.5 bg-brand rounded-full" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h4 className="text-brand font-black uppercase tracking-widest text-xs mb-4">Benefícios</h4>
                    <ul className="space-y-3">
                      {selectedVacancy.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-400">
                          <CheckCircle2 size={16} className="text-brand" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      setIsApplyModalOpen(true);
                    }}
                    className="w-full bg-brand text-black font-black uppercase tracking-widest h-16 rounded-2xl shadow-[0_0_40px_rgba(132,204,22,0.3)] hover:scale-[1.02] active:scale-95 transition-all text-xl"
                  >
                    Candidatar-se à Vaga
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Candidatura */}
      <AnimatePresence>
        {isApplyModalOpen && selectedVacancy && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute inset-0 bg-black/98 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-10 overflow-hidden"
            >
              <button 
                onClick={() => setIsApplyModalOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-black mb-2">Candidatar-se para</h2>
              <h3 className="text-xl font-bold text-brand uppercase mb-8">{selectedVacancy.title}</h3>

              <form onSubmit={handleApply} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Nome Completo *</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                    <input 
                      required
                      type="text"
                      value={application.name}
                      onChange={e => setApplication({...application, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 h-14 pl-12 pr-4 rounded-xl focus:outline-none focus:border-brand/50 transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                      <input 
                        required
                        type="email"
                        value={application.email}
                        onChange={e => setApplication({...application, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 h-14 pl-12 pr-4 rounded-xl focus:outline-none focus:border-brand/50 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Telefone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                      <input 
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={application.phone}
                        onChange={e => setApplication({...application, phone: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 h-14 pl-12 pr-4 rounded-xl focus:outline-none focus:border-brand/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Mensagem / Por que você? *</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 text-gray-600" size={18} />
                    <textarea 
                      required
                      rows={4}
                      value={application.message}
                      onChange={e => setApplication({...application, message: e.target.value})}
                      placeholder="Conte-nos por que você é o candidato ideal para esta vaga..."
                      className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl focus:outline-none focus:border-brand/50 transition-all resize-none"
                    />
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full h-16 bg-brand text-black font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-black border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      Enviar Candidatura
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Publicar Vaga */}
      <AnimatePresence>
        {isPublishModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPublishModalOpen(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#111] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <button 
                onClick={() => setIsPublishModalOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                <X size={28} />
              </button>

              <h2 className="text-4xl font-black mb-10">Publicar Nova <span className="text-brand">Vaga</span></h2>

              <div className="space-y-8">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">Título da Vaga</label>
                  <input 
                    type="text"
                    placeholder="Ex: Designer Gráfico Sênior"
                    value={newVacancy.title}
                    onChange={e => setNewVacancy({...newVacancy, title: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-white/10 h-16 px-6 rounded-xl focus:outline-none focus:border-brand/50 transition-all font-bold text-white text-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">Departamento</label>
                    <select 
                      value={newVacancy.department}
                      onChange={e => setNewVacancy({...newVacancy, department: e.target.value})}
                      className="w-full bg-[#0a0a0a] border border-white/10 h-14 px-6 rounded-xl focus:outline-none focus:border-brand/50 transition-all appearance-none text-white font-bold"
                    >
                      {departments.filter(d => d !== "Todos").map(d => (
                        <option key={d} value={d} className="bg-[#111]">{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">Tipo</label>
                    <select 
                      value={newVacancy.type}
                      onChange={e => setNewVacancy({...newVacancy, type: e.target.value})}
                      className="w-full bg-[#0a0a0a] border border-white/10 h-14 px-6 rounded-xl focus:outline-none focus:border-brand/50 transition-all appearance-none text-white font-bold"
                    >
                      <option className="bg-[#111]" value="Tempo Integral">Tempo Integral</option>
                      <option className="bg-[#111]" value="Meio Período">Meio Período</option>
                      <option className="bg-[#111]" value="Estágio">Estágio</option>
                      <option className="bg-[#111]" value="PJ">Freelance / PJ</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">Localização</label>
                  <input 
                    type="text"
                    placeholder="Ex: Remoto, São Paulo - SP"
                    value={newVacancy.location}
                    onChange={e => setNewVacancy({...newVacancy, location: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-white/10 h-14 px-6 rounded-xl focus:outline-none focus:border-brand/50 transition-all font-medium text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">Descrição</label>
                  <textarea 
                    rows={4}
                    value={newVacancy.description}
                    onChange={e => setNewVacancy({...newVacancy, description: e.target.value})}
                    placeholder="Descreva as responsabilidades e o perfil desejado..."
                    className="w-full bg-[#0a0a0a] border border-white/10 p-6 rounded-xl focus:outline-none focus:border-brand/50 transition-all resize-none text-gray-400 text-sm leading-relaxed"
                  />
                </div>

                <div className="pt-4 flex gap-4">
                   <button 
                    onClick={() => setIsPublishModalOpen(false)}
                    className="flex-1 h-16 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handlePublish}
                    className="flex-[2] h-16 rounded-xl bg-brand text-black font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_40px_rgba(132,204,22,0.3)]"
                  >
                    Publicar Vaga
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
