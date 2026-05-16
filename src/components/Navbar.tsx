import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, 
  GraduationCap, 
  Globe, 
  Palette, 
  Briefcase, 
  ClipboardList, 
  Layout, 
  Columns3, 
  ShieldCheck, 
  BarChart3, 
  Wand2,
  Menu,
  Zap,
  Info
} from "lucide-react";
import { GlassDock } from "./ui/liquid-glass";
import { auth, isAdmin } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const adminTabs = ["Admin", "Analytics", "AI Studio"];
  const isUserAdmin = isAdmin(user?.email);

  const navItems = [
    { label: "Início", icon: Home },
    { label: "Portfólio", icon: Globe },
    { label: "Cursos", icon: GraduationCap },
    { label: "Carreiras", icon: Briefcase },
    { label: "Admin", icon: ShieldCheck },
    { label: "Analytics", icon: BarChart3 },
    { label: "AI Studio", icon: Wand2 },
  ].filter(item => !adminTabs.includes(item.label) || isUserAdmin);

  // Mobile navigation items (including all relevant ones)
  const mobileNavItems = [
    { label: "Início", icon: Home },
    { label: "Cursos", icon: GraduationCap },
    { label: "Portfólio", icon: Globe },
    { label: "Designs", icon: Palette },
    { label: "Carreiras", icon: Briefcase },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleMobileNav = (label: string) => {
    setActiveTab(label);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navbar - Glass Styled */}
      <nav id="main-nav" className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10 hidden md:block">
        <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer" onClick={() => setActiveTab("Início")}>
            <div className="w-1.5 h-8 bg-brand rounded-full"></div>
            <span className="text-xl font-bold tracking-tight text-white">Techify</span>
          </div>
          
          <div className="flex items-center gap-4 flex-1 justify-end overflow-hidden">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth px-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setActiveTab(item.label)}
                  className={`flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer relative px-2.5 py-2 rounded-lg ${
                    activeTab === item.label ? "text-brand bg-white/5" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon size={13} />
                  {item.label}
                  {activeTab === item.label && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[1000] bg-black/40 backdrop-blur-3xl border-b border-white/5 h-16 flex items-center justify-between px-6 shadow-2xl">
        <div className="flex items-center gap-2.5 cursor-pointer active:scale-95 transition-transform" onClick={() => handleMobileNav("Início")}>
          <div className="w-2 h-6 bg-brand rounded-full shadow-[0_0_15px_rgba(132,204,22,0.6)]"></div>
          <span className="text-xl font-black tracking-tighter text-white uppercase italic">Techify</span>
        </div>
        
        <button 
          onClick={toggleMenu}
          className="text-brand p-1 active:scale-95 transition-transform z-[1001]"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[2000] bg-black/98 backdrop-blur-3xl flex flex-col pt-32 px-10 gap-8 md:hidden"
          >
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 text-brand p-2 active:scale-90 transition-transform"
            >
              <Menu size={32} />
            </button>
            
            {navItems.map((item, idx) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleMobileNav(item.label)}
                className="flex items-center gap-4 text-3xl font-black text-white hover:text-brand transition-colors text-left uppercase tracking-tighter"
              >
                <item.icon size={28} className={activeTab === item.label ? "text-brand" : "text-white/20"} />
                {item.label}
              </motion.button>
            ))}
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-auto pb-32 border-t border-white/10 pt-10"
            >
               <div className="text-[10px] font-black text-brand uppercase tracking-[0.5em] mb-4">Alpha Access</div>
               <p className="text-white/40 text-sm font-medium leading-relaxed mb-2">
                 Criamos plataformas web e móveis.
               </p>
               <p className="text-white/20 text-xs font-medium leading-relaxed">
                 Desenvolvido por <span className="text-white/40">Techify IA</span> &copy; 2026.
               </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* High-Fidelity Mobile Floating Navigation (Advanced Tab System) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[1900] w-[92%] max-w-sm">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-black/80 backdrop-blur-3xl border border-white/10 rounded-full p-2 flex items-center justify-between shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] relative"
        >
          {[
            { label: "Home", icon: Home, target: "Início" },
            { label: "Portfolio", icon: Globe, target: "Portfólio" },
            { label: "Cursos", icon: GraduationCap, target: "Cursos" },
            { label: "Carreiras", icon: Briefcase, target: "Carreiras" },
            { label: "Menu", icon: Menu, target: "MENU_TRIGGER" },
          ].map((item) => {
            const isActive = activeTab === item.target;
            const isMenu = item.target === "MENU_TRIGGER";
            
            return (
              <button
                key={item.label}
                onClick={() => isMenu ? setIsMenuOpen(true) : handleMobileNav(item.target!)}
                className={`relative flex-1 flex flex-col items-center justify-center py-3 px-1 transition-all duration-300 gap-1 rounded-full ${
                  isActive ? "text-brand" : "text-white/40 active:text-white"
                }`}
              >
                <item.icon 
                  size={isActive ? 24 : 20} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={isActive ? "drop-shadow-[0_0_8px_rgba(132,204,22,0.6)]" : ""} 
                />
                
                {isActive && (
                  <motion.div 
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 bg-brand/5 rounded-full -z-10 border border-brand/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                {/* Visual dot for active or active interaction indicators */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -bottom-1 w-1 h-1 bg-brand rounded-full"
                    />
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </motion.div>
      </div>

    </>
  );
}
