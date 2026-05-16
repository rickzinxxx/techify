import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  Briefcase, 
  History, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  Phone, 
  Calendar,
  Send,
  Sparkles,
  ChevronRight,
  TrendingUp,
  X,
  Instagram,
  Smile
} from "lucide-react";
import { db, auth, isAdmin } from "../lib/firebase";
import { collection, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

interface AdminStat {
  label: string;
  count: number;
  icon: any;
  color: string;
}

interface Application {
  id: string;
  vacancyId: string;
  vacancyTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "pendente" | "aprovado" | "recusado";
  createdAt: any;
}

interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  message: string;
  status: "pendente" | "concluido" | "recusado";
  createdAt: any;
  emailCount: number;
  instagram?: string;
}

export default function Admin() {
  const [activeSubTab, setActiveSubTab] = useState<"consultas" | "historico" | "candidaturas" | "leads">("consultas");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Consultation | Application | null>(null);
  const [emailFormData, setEmailFormData] = useState({ subject: "", message: "" });
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    const qConsultations = query(collection(db, "consultations"), orderBy("createdAt", "desc"));
    const unsubConsultations = onSnapshot(qConsultations, (snap) => {
      setConsultations(snap.docs.map(d => ({ id: d.id, ...d.data() } as Consultation)));
    });

    const qApplications = query(collection(db, "applications"), orderBy("createdAt", "desc"));
    const unsubApplications = onSnapshot(qApplications, (snap) => {
      setApplications(snap.docs.map(d => ({ id: d.id, ...d.data() } as Application)));
      setLoading(false);
    });

    return () => {
      authUnsubscribe();
      unsubConsultations();
      unsubApplications();
    };
  }, []);

  const handleUpdateStatus = async (type: "consultations" | "applications", id: string, status: string) => {
    try {
      await updateDoc(doc(db, type, id), { status });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleOpenEmail = (lead: Consultation | Application) => {
    setSelectedLead(lead);
    setEmailFormData({ subject: "", message: "" });
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = async () => {
    if (!selectedLead) return;
    // In a real app, this would trigger a backend function
    alert(`E-mail enviado para ${selectedLead.email}`);
    
    if ("emailCount" in selectedLead) {
      await updateDoc(doc(db, "consultations", selectedLead.id), { 
        emailCount: (selectedLead.emailCount || 0) + 1 
      });
    }
    
    setIsEmailModalOpen(false);
  };

  const generateAIEmail = () => {
    setIsGeneratingEmail(true);
    setTimeout(() => {
      const name = selectedLead?.name || "Cliente";
      setEmailFormData({
        subject: `Proposta Personalizada Techify - ${name}`,
        message: `Olá ${name},\n\nRecebemos seu contato através da nossa plataforma. Gostaria de agendar uma reunião para discutirmos como a Techify pode elevar o patamar do seu negócio digital.\n\nTemos soluções específicas para o que você procura.\n\nAguardo seu retorno,\nEquipe Techify`
      });
      setIsGeneratingEmail(false);
    }, 1500);
  };

  if (!isAdmin(user?.email)) {
    return (
      <div className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center text-center">
        <ShieldCheck size={64} className="text-red-500 mb-6" />
        <h1 className="text-4xl font-black mb-4 uppercase tracking-widest text-white">Acesso Negado</h1>
        <p className="text-gray-500 max-w-md">Você não tem permissões de administrador para visualizar esta página.</p>
      </div>
    );
  }

  const activeConsultations = consultations.filter(c => c.status === "pendente");
  const historyConsultations = consultations.filter(c => c.status !== "pendente");
  
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
             <ShieldCheck size={28} className="text-brand shrink-0" />
             <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                Painel <span className="text-brand">Admin</span>
             </h1>
          </div>
          <p className="text-gray-500 text-base md:text-2xl font-light">
             Gerencie consultas agendadas e candidaturas às vagas
          </p>
        </header>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-10 p-1.5 bg-white/5 rounded-2xl w-full md:w-fit border border-white/10 overflow-x-auto no-scrollbar scroll-smooth">
          {[
            { id: "consultas", label: `Fila (${activeConsultations.length})`, icon: Calendar },
            { id: "historico", label: `Histórico (${historyConsultations.length})`, icon: History },
            { id: "candidaturas", label: `Vagas (${applications.length})`, icon: Briefcase },
            { id: "leads", label: `Leads (${consultations.length})`, icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 md:px-6 h-12 rounded-xl text-[10px] md:text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap snap-start ${
                activeSubTab === tab.id 
                  ? "bg-brand text-black shadow-[0_0_20px_rgba(132,204,22,0.3)]" 
                  : "text-gray-500 hover:text-white"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeSubTab === "consultas" && (
            <motion.div 
              key="consultas"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {activeConsultations.length === 0 ? (
                <EmptyState icon={Smile} text="Nenhuma consulta pendente no momento." />
              ) : (
                activeConsultations.map(item => (
                  <LeadCard 
                    key={item.id} 
                    item={item} 
                    onUpdate={(status) => handleUpdateStatus("consultations", item.id, status)} 
                  />
                ))
              )}
            </motion.div>
          )}

          {activeSubTab === "historico" && (
            <motion.div 
              key="historico"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {historyConsultations.length === 0 ? (
                <EmptyState icon={History} text="Sem histórico de consultas." />
              ) : (
                historyConsultations.map(item => (
                  <HistoryCard key={item.id} item={item} />
                ))
              )}
            </motion.div>
          )}

          {activeSubTab === "candidaturas" && (
            <motion.div 
              key="candidaturas"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-brand font-black uppercase tracking-widest text-xl mb-6">Pendentes ({applications.filter(a => a.status === "pendente").length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applications.filter(a => a.status === "pendente").map(item => (
                   <ApplicationCard 
                    key={item.id} 
                    item={item} 
                    onUpdate={(status) => handleUpdateStatus("applications", item.id, status)}
                  />
                ))}
              </div>

              <h2 className="text-gray-500 font-black uppercase tracking-widest text-xl mt-12 mb-6">Processadas ({applications.filter(a => a.status !== "pendente").length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {applications.filter(a => a.status !== "pendente").map(item => (
                   <div key={item.id} className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-black text-white mb-1">{item.name}</h3>
                        <p className="text-gray-500 text-sm mb-4 font-bold">{item.vacancyTitle}</p>
                        <div className="flex flex-col gap-2">
                           <div className="flex items-center gap-2 text-gray-400 text-sm">
                             <Mail size={14} /> {item.email}
                           </div>
                           <div className="flex items-center gap-2 text-gray-400 text-sm">
                             <Calendar size={14} /> {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : "Recém criada"}
                           </div>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        item.status === "aprovado" ? "bg-brand/10 border-brand/20 text-brand" : "bg-red-500/10 border-red-500/20 text-red-500"
                      }`}>
                        {item.status}
                      </span>
                   </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSubTab === "leads" && (
            <motion.div 
              key="leads"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {consultations.map(item => (
                <div key={item.id} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col group hover:border-brand/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-black text-white uppercase mb-1 leading-tight">{item.name}</h3>
                      <p className="text-gray-500 text-sm font-bold">{item.category || "Não informado"}</p>
                    </div>
                    <span className="px-3 py-1 bg-brand/10 text-brand rounded-lg text-[10px] font-black uppercase border border-brand/20">Completo</span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-3 text-gray-400">
                      <Mail size={16} className="text-brand" />
                      <span className="text-sm font-medium">{item.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <Phone size={16} className="text-brand" />
                      <span className="text-sm font-medium">{item.phone}</span>
                    </div>
                    {item.instagram && (
                      <div className="flex items-center gap-3 text-gray-400">
                        <Instagram size={16} className="text-brand" />
                        <span className="text-sm font-medium">{item.instagram}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-black mb-8 border border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand mb-2 flex items-center gap-2">
                       <Sparkles size={12} /> Interesses
                    </p>
                    <p className="text-sm text-gray-400 font-medium">
                      {item.message || "Interesse em desenvolvimento de sites."}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-[10px] text-gray-600 font-bold uppercase">Emails enviados: {item.emailCount || 0}</span>
                        <span className="text-[10px] text-gray-600 font-bold">{item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : "Just now"}</span>
                     </div>
                     <button 
                      onClick={() => handleOpenEmail(item)}
                      className="bg-brand text-black h-12 px-8 rounded-xl flex items-center gap-2 text-sm font-black uppercase tracking-widest shadow-[0_0_20px_rgba(132,204,22,0.2)] hover:scale-105 transition-all"
                     >
                        <Send size={16} />
                        Enviar Email
                     </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Email Modal */}
      <AnimatePresence>
        {isEmailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEmailModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-950/90 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-8 pb-4 flex justify-between items-center border-b border-white/5">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                  Enviar Email para <span className="text-brand">{selectedLead?.name}</span>
                </h2>
                <button onClick={() => setIsEmailModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="p-6 rounded-2xl bg-black border border-white/5">
                  <p className="text-sm font-bold text-gray-500 mb-1">Destinatário</p>
                  <p className="text-lg font-black text-white">{selectedLead?.email}</p>
                  {"category" in (selectedLead || {}) && (
                     <p className="text-[10px] font-black text-brand uppercase tracking-widest mt-2">Interesses: {(selectedLead as any).category}</p>
                  )}
                </div>

                <button 
                  onClick={generateAIEmail}
                  disabled={isGeneratingEmail}
                  className="w-full h-14 bg-white text-brand font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 border-2 border-brand/20 hover:bg-brand/10 transition-all disabled:opacity-50"
                >
                  <Sparkles size={20} className={isGeneratingEmail ? "animate-spin" : ""} />
                  {isGeneratingEmail ? "Gerando Proposta..." : "Gerar Email com IA"}
                </button>

                <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Assunto</label>
                   <input 
                    type="text"
                    value={emailFormData.subject}
                    onChange={(e) => setEmailFormData({...emailFormData, subject: e.target.value})}
                    placeholder="Assunto do email..."
                    className="w-full bg-black border border-white/10 h-14 px-6 rounded-xl focus:outline-none focus:border-brand/50 transition-all text-white font-medium"
                   />
                </div>

                <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Mensagem</label>
                   <textarea 
                    value={emailFormData.message}
                    onChange={(e) => setEmailFormData({...emailFormData, message: e.target.value})}
                    placeholder="Escreva sua mensagem aqui..."
                    rows={8}
                    className="w-full bg-black border border-white/10 p-6 rounded-xl focus:outline-none focus:border-brand/50 transition-all text-white font-medium resize-none"
                   />
                </div>

                <div className="flex gap-4">
                   <button 
                    onClick={() => setIsEmailModalOpen(false)}
                    className="flex-1 h-14 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all"
                   >
                     Cancelar
                   </button>
                   <button 
                    onClick={handleSendEmail}
                    className="flex-[2] h-14 bg-brand text-black font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(132,204,22,0.3)] hover:scale-105 transition-all"
                   >
                     <Send size={20} />
                     Enviar Email
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

function EmptyState({ icon: Icon, text }: { icon: any, text: string }) {
  return (
    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
       <Icon size={48} className="text-white/10 mb-6" />
       <p className="text-gray-500 font-bold">{text}</p>
    </div>
  );
}

function LeadCard({ item, onUpdate }: { item: Consultation, onUpdate: (status: string) => void }) {
  return (
    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 group hover:border-brand/20 transition-all">
       <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-black text-white uppercase leading-tight">{item.name}</h3>
          <div className="flex gap-2">
             <span className="px-3 py-1 bg-brand/10 text-brand rounded-lg text-[10px] font-black uppercase border border-brand/20">pendente</span>
             <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-[10px] font-black uppercase border border-purple-500/20">{item.category || "Outro"}</span>
          </div>
       </div>

       <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 text-gray-400">
             <Mail size={18} className="text-brand/50" />
             <span className="text-sm font-medium">{item.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
             <Phone size={18} className="text-brand/50" />
             <span className="text-sm font-medium">{item.phone}</span>
          </div>
       </div>

       <div className="flex gap-4 mt-8 pt-6 border-t border-white/5">
          <button 
            onClick={() => onUpdate("concluido")}
            className="flex-1 bg-brand p-4 rounded-2xl text-black font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-brand/90 transition-all"
          >
             <CheckCircle2 size={18} /> Aceitar
          </button>
          <button 
            onClick={() => onUpdate("recusado")}
            className="flex-1 bg-red-500 p-4 rounded-2xl text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-red-600 transition-all"
          >
             <XCircle size={18} /> Recusar
          </button>
       </div>
    </div>
  );
}

function HistoryCard({ item }: { item: Consultation }) {
  return (
    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 opacity-80">
       <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-black text-white uppercase mb-1 leading-tight">{item.name}</h3>
            <div className="flex gap-2">
               <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  item.status === "concluido" ? "bg-brand/10 text-brand" : "bg-red-500/10 text-red-500"
               }`}>{item.status}</span>
               <span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded text-[10px] font-black uppercase">{item.category || "Outro"}</span>
            </div>
          </div>
       </div>

       <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-gray-500">
             <Mail size={16} />
             <span className="text-sm">{item.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-500">
             <Calendar size={16} />
             <span className="text-sm">{item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : "Sem data"}</span>
          </div>
       </div>
    </div>
  );
}

function ApplicationCard({ item, onUpdate }: { item: Application, onUpdate: (status: string) => void }) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <>
       <div 
        onClick={() => setIsDetailOpen(true)}
        className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 group hover:border-brand/20 transition-all cursor-pointer"
       >
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-2xl font-black text-white leading-tight">{item.name}</h3>
             <span className="bg-brand/20 text-brand px-3 py-1 rounded text-[10px] font-black uppercase">aprovado</span>
          </div>
          <p className="text-gray-500 font-bold mb-6">{item.vacancyTitle}</p>
          
          <div className="space-y-4 mb-8">
             <div className="flex items-center gap-3 text-gray-400">
                <Mail size={18} className="text-brand/50" />
                <span className="text-sm">{item.email}</span>
             </div>
             <div className="flex items-center gap-3 text-gray-500">
                <Calendar size={18} />
                <span className="text-sm">{item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : "Just now"}</span>
             </div>
          </div>
       </div>

       {/* Application Details Modal */}
       <AnimatePresence>
         {isDetailOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDetailOpen(false)}
                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full max-w-2xl bg-zinc-950/90 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl p-8"
              >
                  <div className="flex justify-between items-start mb-8">
                     <div>
                        <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">Detalhes da Candidatura</h2>
                        <div className="flex items-center gap-3 mt-4">
                           <h3 className="text-3xl font-black text-brand">{item.name}</h3>
                           <span className="bg-brand/10 text-brand px-3 py-1 rounded uppercase font-black text-[10px] border border-brand/20">aprovado</span>
                        </div>
                        <p className="text-gray-500 font-bold text-lg mt-1">{item.vacancyTitle}</p>
                     </div>
                     <button onClick={() => setIsDetailOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                        <X size={24} />
                     </button>
                  </div>

                  <div className="p-8 rounded-2xl bg-black border border-white/5 mb-8">
                     <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-brand/5 border border-brand/10 text-brand">
                           <Mail size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase text-gray-500">Email</p>
                           <p className="text-white font-bold">{item.email}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-brand/5 border border-brand/10 text-brand">
                           <Phone size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase text-gray-500">Telefone</p>
                           <p className="text-white font-bold">{item.phone}</p>
                        </div>
                     </div>
                  </div>

                  <div className="mb-10">
                     <p className="text-brand font-black uppercase tracking-widest text-lg mb-4">Mensagem do Candidato</p>
                     <div className="p-6 rounded-2xl bg-black border border-white/5 text-gray-400 font-medium leading-relaxed italic">
                        "{item.message}"
                     </div>
                  </div>

                  <div className="flex gap-4 pt-8 border-t border-white/5">
                     <button 
                        onClick={() => { onUpdate("aprovado"); setIsDetailOpen(false); }}
                        className="flex-1 h-14 bg-brand text-black font-black uppercase tracking-widest rounded-2xl hover:bg-brand/90 transition-all flex items-center justify-center gap-2"
                     >
                        <CheckCircle2 size={20} /> Aprovar
                     </button>
                     <button 
                        onClick={() => { onUpdate("recusado"); setIsDetailOpen(false); }}
                        className="flex-1 h-14 bg-red-500 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                     >
                        <XCircle size={20} /> Recusar
                     </button>
                  </div>

                  <p className="text-center text-[10px] text-gray-600 font-bold uppercase mt-8">
                    Candidatura enviada em {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString() : "Just now"}
                  </p>
              </motion.div>
           </div>
         )}
       </AnimatePresence>
    </>
  );
}
