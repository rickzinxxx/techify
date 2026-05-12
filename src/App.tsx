import { useState, lazy, Suspense, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

gsap.registerPlugin(ScrollTrigger);

// Lazy load below-the-fold components
const Stats = lazy(() => import("./components/Stats"));
const Services = lazy(() => import("./components/Services"));
const About = lazy(() => import("./components/About"));
const Academy = lazy(() => import("./components/Academy"));
const FinalCTA = lazy(() => import("./components/FinalCTA"));
const Footer = lazy(() => import("./components/Footer"));
const Courses = lazy(() => import("./components/Courses"));

const LoadingFallback = () => <div className="h-20 bg-black" />;

export default function App() {
  const [activeTab, setActiveTab] = useState("Início");

  useEffect(() => {
    // Refresh ScrollTrigger when lazy components might have finished rendering
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-brand/30">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {activeTab === "Início" ? (
          <>
            <Hero />
            <Suspense fallback={<LoadingFallback />}>
              <Stats />
              <Services />
              <About />
              <Academy onExplore={() => setActiveTab("Cursos")} />
              <FinalCTA />
            </Suspense>
          </>
        ) : (
          <Suspense fallback={<div className="min-h-screen pt-24 text-center">Carregando...</div>}>
            <Courses />
          </Suspense>
        )}
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
