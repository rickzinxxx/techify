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

  return (
    <nav id="main-nav" className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center justify-between overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 mr-8 flex-shrink-0 cursor-pointer" onClick={() => setActiveTab("Início")}>
          <div className="w-1 h-8 bg-brand rounded-full"></div>
          <span className="text-xl font-bold tracking-tight">Techify</span>
        </div>
        
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`flex items-center gap-2 text-sm font-medium transition-all whitespace-nowrap cursor-pointer relative py-2 ${
                activeTab === item.label ? "text-brand" : "text-gray-400 hover:text-white"
              }`}
            >
              <item.icon size={16} />
              {item.label}
              {activeTab === item.label && (
                <motion.div 
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
