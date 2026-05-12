import { useState, lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

// Lazy load below-the-fold components
const Stats = lazy(() => import("./components/Stats"));
const Services = lazy(() => import("./components/Services"));
const About = lazy(() => import("./components/About"));
const Academy = lazy(() => import("./components/Academy"));
const DesignerFeature = lazy(() => import("./components/DesignerFeature"));
const Footer = lazy(() => import("./components/Footer"));
const Courses = lazy(() => import("./components/Courses"));
const Chatbot = lazy(() => import("./components/Chatbot"));

const LoadingFallback = () => <div className="h-20 bg-black" />;

export default function App() {
  const [activeTab, setActiveTab] = useState("Início");

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
              <DesignerFeature />
              <About />
              <Academy onExplore={() => setActiveTab("Cursos")} />
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
        {activeTab === "Cursos" && <Chatbot />}
      </Suspense>
    </div>
  );
}
