import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GlowCard } from "./ui/spotlight-card";
import WarpShader from "./ui/warp-shader";
import { 
  Globe, 
  ExternalLink, 
  Plus, 
  X, 
  Upload, 
  Sparkles,
  Search,
  Filter,
  Trash2,
  CheckCircle2,
  Pencil,
  Box,
  LogIn,
  LogOut
} from "lucide-react";
import { db, auth, isAdmin, signInWithGoogle, logout } from "../lib/firebase";
import { collection, onSnapshot, setDoc, doc, deleteDoc, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

interface Site {
  id: string;
  name: string;
  url: string;
  threeDUrl?: string;
  image: string;
  category: string;
  description: string;
}

const INITIAL_SITES: Site[] = [
  {
    id: "1",
    name: "KALDI",
    url: "https://healthcare-demo.netlify.app",
    threeDUrl: "https://techify-ferrari.vercel.app",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop",
    category: "3D Experience",
    description: "Uma experiência imersiva em 3D desenvolvida para a KALDI. Design agressivo, performance fluida e interatividade de última geração."
  },
  {
    id: "2",
    name: "EPIC DESIGNER",
    url: "https://epicdesigner.com.br",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop",
    category: "Landing Page",
    description: "O EPIC DESIGNER é uma empresa especializada em design gráfico para o setor gastronômico, oferecendo serviços como criação de cardápios..."
  },
  {
    id: "3",
    name: "Saude Connect",
    url: "https://saudeconnect.vercel.app",
    image: "https://images.unsplash.com/photo-1576091160550-217359f42f8c?q=80&w=800&auto=format&fit=crop",
    category: "Corporativo",
    description: "O site Saude Connect é uma plataforma corporativa dedicada a otimizar o atendimento à saúde dos colaboradores, oferecendo acesso..."
  },
  {
    id: "4",
    name: "Senac Reciclagem",
    url: "https://senac-reciclagem.vercel.app",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop",
    category: "Corporativo",
    description: "O site Senac Reciclagem é uma plataforma educacional dedicada à conscientização ambiental, oferecendo informações sobre..."
  }
];

export default function Portfolio() {
  const [sites, setSites] = useState<Site[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSiteId, setEditingSiteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [user, setUser] = useState<User | null>(null);
  
  // New site form state
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    threeDUrl: "",
    image: "",
    category: "Landing Page",
    description: ""
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "portfolio"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const siteList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Site));
      if (siteList.length > 0) {
        setSites(siteList);
      } else {
        setSites(INITIAL_SITES);
      }
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

  const handleMigrate = async () => {
    if (!isAdmin(user?.email)) return;
    setIsMigrating(true);
    try {
      for (const site of INITIAL_SITES) {
        await setDoc(doc(db, "portfolio", site.id), site);
      }
      alert("Projetos migrados com sucesso para a nuvem!");
    } catch (err) {
      console.error("Migration error:", err);
      alert("Erro na migração.");
    } finally {
      setIsMigrating(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingSiteId(null);
    setFormData({ name: "", url: "", threeDUrl: "", image: "", category: "Landing Page", description: "" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (site: Site) => {
    setEditingSiteId(site.id);
    setFormData({
      name: site.name,
      url: site.url,
      threeDUrl: site.threeDUrl || "",
      image: site.image,
      category: site.category,
      description: site.description
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.url || !isAdmin(user?.email)) return;
    
    const id = editingSiteId || Math.random().toString(36).substr(2, 9);
    try {
      await setDoc(doc(db, "portfolio", id), {
        ...formData,
        image: formData.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
        description: formData.description || "Projeto desenvolvido com excelência tecnológica pela equipe Techify."
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving site:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin(user?.email)) return;
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;
    try {
      await deleteDoc(doc(db, "portfolio", id));
    } catch (error) {
      console.error("Error deleting site:", error);
    }
  };

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         site.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || site.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["Todos", "Landing Page", "Corporativo", "E-commerce", "Blog", "Portfólio", "Plataforma", "Outro"];

  return (
    <WarpShader className="min-h-screen pt-12 md:pt-32 pb-20 px-4 md:px-6 bg-transparent relative">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/10 blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-12">
          <div className="max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 uppercase tracking-tighter leading-[0.9]"
            >
              Portfólio de <span className="text-brand italic">Sites</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 text-base md:text-xl max-w-2xl font-medium leading-relaxed"
            >
              Explore nossa galeria de projetos desenvolvidos com excelência, 
              performance e design de alto impacto.
            </motion.p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
             {isAdmin(user?.email) && sites.length === INITIAL_SITES.length && sites[0].id === "1" && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={handleMigrate}
                  className="bg-white/10 text-white font-bold h-12 md:h-14 px-6 md:px-8 rounded-2xl flex items-center justify-center gap-2 border border-brand/20 transition-all text-sm md:text-base"
                >
                  {isMigrating ? <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:1}} className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full" /> : <Sparkles size={18} className="text-brand" />}
                  Migrar
                </motion.button>
             )}
             
             {isAdmin(user?.email) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenAddModal}
                className="bg-brand text-black font-bold h-12 md:h-14 px-6 md:px-8 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(132,204,22,0.3)] transition-all text-sm md:text-base"
              >
                <Plus size={20} />
                Novo Site
              </motion.button>
             )}

            {!user ? (
              <button 
                onClick={() => signInWithGoogle()}
                className="text-gray-500 hover:text-brand flex items-center justify-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest bg-white/5 px-4 h-12 md:h-14 rounded-2xl border border-white/10"
              >
                <LogIn size={16} />
                Admin
              </button>
            ) : (
               <button 
                onClick={() => logout()}
                className="text-red-500 hover:text-red-400 flex items-center justify-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest bg-red-500/5 px-4 h-12 md:h-14 rounded-2xl border border-red-500/20"
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

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Buscar projetos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 h-14 pl-12 pr-4 rounded-xl focus:outline-none focus:border-brand/50 focus:bg-white/10 transition-all font-medium"
            />
          </div>

          <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 overflow-x-auto no-scrollbar max-w-full">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 h-10 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat ? "bg-brand text-black" : "text-gray-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          <AnimatePresence mode="popLayout">
            {filteredSites.map((site, idx) => (
              <motion.div
                key={site.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.6, 
                  delay: idx * 0.05,
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="h-full"
              >
                <GlowCard 
                  glowColor={site.category === "3D Experience" ? "purple" : site.category === "E-commerce" ? "orange" : "blue"}
                  customSize
                  className="group relative bg-[#050505] border border-white/5 rounded-[2rem] overflow-hidden hover:border-brand/40 transition-all duration-700 h-full p-0 flex flex-col"
                >
                  {/* Image Container */}
                  <div className="aspect-[16/10] overflow-hidden relative bg-[#0a0a0a] flex items-center justify-center border-b border-white/5">
                    <img 
                      src={site.image} 
                      alt={site.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      title={`Preview of ${site.name}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    {/* Overlay Controls */}
                    {isAdmin(user?.email) && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-5 z-20">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => { e.stopPropagation(); handleOpenEditModal(site); }}
                          className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-brand hover:text-black transition-all shadow-xl"
                        >
                          <Pencil size={22} />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => { e.stopPropagation(); handleDelete(site.id); }}
                          className="w-14 h-14 rounded-2xl bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-xl"
                        >
                          <Trash2 size={22} />
                        </motion.button>
                      </div>
                    )}
                    
                    <div className="absolute top-5 left-5 z-10">
                      <span className="px-4 py-1.5 bg-black/60 backdrop-blur-xl rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-brand border border-white/10 shadow-2xl">
                        {site.category}
                      </span>
                    </div>

                    <button 
                      onClick={() => window.open(site.url, "_blank")}
                      className="absolute bottom-5 right-5 w-12 h-12 rounded-2xl bg-brand/10 backdrop-blur-xl border border-brand/20 text-brand flex items-center justify-center hover:bg-brand transition-all hover:text-black shadow-2xl z-10"
                    >
                      <ExternalLink size={20} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-4 group/title">
                      <h3 className="text-3xl font-black tracking-tighter leading-none group-hover/title:text-brand transition-colors text-white">{site.name}</h3>
                      <Globe size={20} className="text-white/10 group-hover:text-brand transition-colors flex-shrink-0 mt-1" />
                    </div>
                    
                    <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                      {site.description}
                    </p>
                    
                    <div className="mt-auto space-y-4">
                      {site.threeDUrl && (
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => window.open(site.threeDUrl, "_blank")}
                          className="w-full h-14 bg-white/5 hover:bg-white/10 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all border border-white/10"
                        >
                          <Box size={18} className="text-brand" />
                          Experiência 3D Imersiva
                        </motion.button>
                      )}

                      <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-brand animate-pulse shadow-[0_0_10px_#84cc16]" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-white/40 transition-colors">
                            Techify Certified Project
                          </span>
                        </div>
                        <div className="flex -space-x-2">
                           {[1,2,3].map(i => (
                             <div key={i} className="w-6 h-6 rounded-full border-2 border-[#050505] bg-white/5 flex items-center justify-center overflow-hidden">
                                <Box size={10} className="text-white/20" />
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredSites.length === 0 && (
            <div className="col-span-full py-32 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Nenhum projeto encontrado</h2>
              <p className="text-gray-500">Tente ajustar sua busca ou filtros.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Adicionar/Editar Site */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-[#111] border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-black mb-8">
                {editingSiteId ? "Editar" : "Adicionar Novo"} <span className="text-brand">Site</span>
              </h2>

              <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 no-scrollbar">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">Nome do Projeto</label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: KALDI Academy"
                    className="w-full bg-[#0a0a0a] border border-white/10 h-14 px-6 rounded-xl focus:outline-none focus:border-brand/50 transition-all font-bold text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">URL do Site</label>
                  <input 
                    type="text"
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    placeholder="https://exemplo.com"
                    className="w-full bg-[#0a0a0a] border border-white/10 h-14 px-6 rounded-xl focus:outline-none focus:border-brand/50 transition-all text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">URL 3D (Opcional)</label>
                  <input 
                    type="text"
                    value={formData.threeDUrl}
                    onChange={(e) => setFormData({...formData, threeDUrl: e.target.value})}
                    placeholder="https://techify-ferrari.vercel.app"
                    className="w-full bg-[#0a0a0a] border border-white/10 h-14 px-6 rounded-xl focus:outline-none focus:border-brand/50 transition-all text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">Imagem do Site</label>
                  <div 
                    className="w-full aspect-video bg-[#0a0a0a] border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-brand/50 transition-all relative overflow-hidden"
                  >
                    {formData.image ? (
                      <>
                        <img src={formData.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload className="text-brand mb-2" size={32} />
                          <span className="text-xs font-bold text-white">Clique para trocar</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="text-brand" size={24} />
                        </div>
                        <span className="text-xs font-bold text-gray-500">Clique para adicionar</span>
                      </>
                    )}
                    <input 
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="Cole o link da imagem aqui..."
                      className="absolute bottom-4 left-4 right-4 bg-black/80 border border-white/10 h-10 px-4 rounded-lg text-[10px] focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">Categoria</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-[#0a0a0a] border border-white/10 h-14 px-6 rounded-xl focus:outline-none focus:border-brand/50 transition-all appearance-none text-white font-bold"
                    >
                      {categories.filter(c => c !== "Todos").map(c => (
                        <option key={c} value={c} className="bg-[#111]">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500">Descrição</label>
                    <button 
                      onClick={() => {
                        setIsGenerating(true);
                        setTimeout(() => setIsGenerating(false), 1500);
                        setFormData({...formData, description: "Uma plataforma digital de alta performance desenvolvida com tecnologias de ponta para oferecer a melhor experiência ao usuário."});
                      }}
                      disabled={isGenerating}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-brand hover:scale-105 transition-all disabled:opacity-50"
                    >
                      <Sparkles size={12} />
                      {isGenerating ? "Gerando..." : "A descrição será gerada automaticamente por IA"}
                    </button>
                  </div>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Conte um pouco sobre o projeto..."
                    rows={4}
                    className="w-full bg-[#0a0a0a] border border-white/10 p-6 rounded-xl focus:outline-none focus:border-brand/50 transition-all resize-none text-gray-400 text-sm"
                  />
                </div>
              </div>

              <div className="pt-8 flex gap-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-14 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all text-white"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSubmit}
                  className="flex-[2] h-14 rounded-xl bg-brand text-black font-black uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(132,204,22,0.3)]"
                >
                  {editingSiteId ? "Atualizar" : "Adicionar Site"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </WarpShader>
  );
}
