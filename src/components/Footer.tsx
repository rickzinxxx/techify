import { Instagram, MessageCircle, Mail } from "lucide-react";

export default function Footer() {
  const links = [
    "Início", "Cursos", "Portfólio", "Designs", "Carreiras", 
    "Questionário", "Meu Projeto", "Mural", "Admin", "Analytics", "AI Studio"
  ];

  return (
    <footer className="py-16 bg-black border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-8 bg-brand rounded-full"></div>
              <span className="text-2xl font-bold tracking-tight">Techify</span>
            </div>
            <p className="text-gray-400 mb-8 max-w-sm leading-relaxed text-sm">
              Inovação digital e design de alta performance. Criamos experiências que conectam marcas a resultados.
            </p>
            <a 
              href="#" 
              className="inline-flex items-center gap-2 text-brand font-medium hover:underline"
            >
              <div className="p-2 rounded-lg bg-brand/10 border border-brand/20">
                <Instagram size={18} />
              </div>
              <span className="text-sm">@techify.digital</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] mb-8">Navegação</h4>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              {[
                "Início", "Portfólio", "Academy", "Cases", "Equipe", "Blog"
              ].map((link) => (
                <a key={link} href="#" className="text-gray-500 hover:text-brand transition-colors text-sm font-medium">
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] mb-8">Contato</h4>
            <div className="space-y-4 mb-8">
              <a href="mailto:contato@techify.com.br" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
                <div className="p-2 rounded-lg bg-brand/10 border border-brand/20 group-hover:bg-brand/20">
                  <Mail size={16} className="text-brand" />
                </div>
                <span className="text-sm">contato@techify.com.br</span>
              </a>
              <a href="https://wa.me/5581991300885" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
                <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 group-hover:bg-green-500/20 text-green-400">
                  <MessageCircle size={16} />
                </div>
                <span className="text-sm">Suporte via WhatsApp</span>
              </a>
            </div>
            
            <button className="w-full h-12 rounded-xl bg-linear-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              <Instagram size={20} />
              Siga no Instagram
            </button>
          </div>
        </div>
        
        <div className="mt-20 pt-8 border-t border-white/5 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} Techify. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
