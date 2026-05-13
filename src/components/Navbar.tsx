import { useState, useEffect } from "react";
import { motion } from "motion/react";
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
  Wand2
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
    { label: "Cursos", icon: GraduationCap },
    { label: "Portfólio", icon: Globe },
    { label: "Designs", icon: Palette },
    { label: "Carreiras", icon: Briefcase },
    { label: "Questionário", icon: ClipboardList },
    { label: "Meu Projeto", icon: Layout },
    { label: "Mural", icon: Columns3 },
    { label: "Admin", icon: ShieldCheck },
    { label: "Analytics", icon: BarChart3 },
    { label: "AI Studio", icon: Wand2 },
  ].filter(item => !adminTabs.includes(item.label) || isUserAdmin);

  // Mobile navigation items (picking most important ones for the dock)
  const mobileNavItems = [
    { label: "Início", icon: Home },
    { label: "Cursos", icon: GraduationCap },
    { label: "Portfólio", icon: Globe },
    { label: "Designs", icon: Palette },
    { label: "Carreiras", icon: Briefcase },
    { label: "AI Studio", icon: Wand2 },
  ].filter(item => !adminTabs.includes(item.label) || isUserAdmin);

  const dockIcons = mobileNavItems.map(item => ({
    icon: <item.icon />,
    alt: item.label,
    active: activeTab === item.label,
    onClick: () => setActiveTab(item.label)
  }));

  return (
    <>
      {/* Desktop Navbar - Glass Styled */}
      <nav id="main-nav" className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 hidden md:block">
        <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer" onClick={() => setActiveTab("Início")}>
            <div className="w-1.5 h-8 bg-brand rounded-full"></div>
            <span className="text-xl font-bold tracking-tight">Techify</span>
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

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[999] bg-black/90 backdrop-blur-2xl border-b border-brand/20 flex flex-col pt-4 pb-2">
        <div className="flex items-center px-6 mb-3">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("Início")}>
            <div className="w-1.5 h-7 bg-brand rounded-full shadow-[0_0_20px_rgba(132,204,22,0.6)]"></div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">Techify</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth px-4 pb-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer relative px-3 py-2 rounded-lg ${
                activeTab === item.label ? "text-brand bg-white/10" : "text-gray-400"
              }`}
            >
              <item.icon size={12} />
              {item.label}
              {activeTab === item.label && (
                <motion.div 
                  layoutId="mobile-nav-underline"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Dock for Mobile */}
      <div className="md:hidden fixed bottom-8 left-0 right-0 z-[999] px-4 flex justify-center pointer-events-none">
        <div className="w-full max-w-[95%] pointer-events-auto h-16">
          <GlassDock icons={dockIcons.length > 0 ? dockIcons : []} className="w-full h-full" />
        </div>
      </div>
    </>
  );
}
