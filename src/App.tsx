import { useState, lazy, Suspense, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import { auth, isAdmin } from "./lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

// Lazy load below-the-fold components
const Stats = lazy(() => import("./components/Stats"));
const Services = lazy(() => import("./components/Services"));
const About = lazy(() => import("./components/About"));
const Academy = lazy(() => import("./components/Academy"));
const FinalCTA = lazy(() => import("./components/FinalCTA"));
const Footer = lazy(() => import("./components/Footer"));
const Courses = lazy(() => import("./components/Courses"));
const Admin = lazy(() => import("./components/Admin"));
const Portfolio = lazy(() => import("./components/Portfolio"));
const Careers = lazy(() => import("./components/Careers"));

const LoadingFallback = () => <div className="h-20 bg-black" />;

export default function App() {
  const [activeTab, setActiveTab] = useState("Início");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const adminTabs = ["Admin", "Analytics", "AI Studio"];
  const isUserAdmin = isAdmin(user?.email);

  // Redirect if not admin and trying to access admin tab
  useEffect(() => {
    if (adminTabs.includes(activeTab) && !isUserAdmin) {
      setActiveTab("Início");
    }
  }, [activeTab, isUserAdmin]);

  const renderContent = () => {
    switch (activeTab) {
      case "Início":
        return (
          <>
            <Hero onViewPortfolio={() => setActiveTab("Portfólio")} />
            <Suspense fallback={<LoadingFallback />}>
              <Stats />
              <Services />
              <About />
              <Academy onExplore={() => setActiveTab("Cursos")} />
              <FinalCTA onViewPortfolio={() => setActiveTab("Portfólio")} />
            </Suspense>
          </>
        );
      case "Portfólio":
        return (
          <Suspense fallback={<div className="min-h-screen pt-24 text-center">Carregando Galeria...</div>}>
            <Portfolio />
          </Suspense>
        );
      case "Carreiras":
        return (
          <Suspense fallback={<div className="min-h-screen pt-24 text-center">Carregando Vagas...</div>}>
            <Careers />
          </Suspense>
        );
      case "Cursos":
        return (
          <Suspense fallback={<div className="min-h-screen pt-24 text-center">Carregando...</div>}>
            <Courses />
          </Suspense>
        );
      case "Admin":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Admin />
          </Suspense>
        );
      case "Analytics":
      case "AI Studio":
        return isUserAdmin ? (
          <div className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-black mb-4 text-brand uppercase tracking-widest">{activeTab}</h1>
            <p className="text-gray-500 max-w-md">Esta área está em desenvolvimento e é restrita a administradores.</p>
          </div>
        ) : null;
      default:
        return (
          <Suspense fallback={<div className="min-h-screen pt-24 text-center">Carregando...</div>}>
            <Courses />
          </Suspense>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-brand/30">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="pt-[170px] md:pt-0">
        {renderContent()}
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
