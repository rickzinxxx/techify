import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Services from "./components/Services";
import Academy from "./components/Academy";
import Footer from "./components/Footer";
import Courses from "./components/Courses";
import Chatbot from "./components/Chatbot";

export default function App() {
  const [activeTab, setActiveTab] = useState("Início");

  return (
    <div className="min-h-screen bg-black text-white selection:bg-brand/30">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {activeTab === "Início" ? (
          <>
            <Hero />
            <Stats />
            <Services />
            <Academy onExplore={() => setActiveTab("Cursos")} />
          </>
        ) : (
          <Courses />
        )}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
