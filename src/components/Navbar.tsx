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
import { GlassDock, GlassEffect } from "./ui/liquid-glass";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
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
  ];

  // Mobile navigation items (picking most important ones for the dock)
  const mobileNavItems = [
    { label: "Início", icon: Home },
    { label: "Cursos", icon: GraduationCap },
    { label: "Portfólio", icon: Globe },
    { label: "Designs", icon: Palette },
    { label: "AI Studio", icon: Wand2 },
  ];

  const dockIcons = mobileNavItems.map(item => ({
    icon: <item.icon size={24} />,
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
          
          <div className="flex items-center gap-4">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`flex items-center gap-2 text-sm font-medium transition-all whitespace-nowrap cursor-pointer relative px-3 py-2 rounded-lg ${
                  activeTab === item.label ? "text-brand bg-white/5" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={16} />
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
      </nav>

      {/* Mobile Top Bar (Just Logo) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-lg border-b border-white/5 h-14 flex items-center px-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("Início")}>
          <div className="w-1 h-6 bg-brand rounded-full"></div>
          <span className="text-lg font-bold tracking-tight">Techify</span>
        </div>
      </div>

      {/* Fixed Bottom Dock for Mobile */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 px-4 flex justify-center">
        <GlassDock icons={dockIcons} className="w-full max-w-sm" />
      </div>
    </>
  );
}
