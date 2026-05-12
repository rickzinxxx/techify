import { CinematicHero } from "./ui/cinematic-hero";

export default function About() {
  return (
    <section id="sobre" className="relative group">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand/5 blur-[120px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <CinematicHero 
        brandName="TECHIFY"
        tagline1="Performance & Imersão."
        tagline2="Engenharia de Resultados."
        cardHeading="EXCELÊNCIA É O NOSSO PADRÃO."
        cardDescription={
          <>
            Na <span className="text-brand font-black italic">Techify</span>, não aceitamos o comum. Nossa obsessão é converter cada pixel em uma vantagem competitiva para o seu negócio. Design de elite para quem busca <span className="text-white font-bold">domínio total</span> do mercado.
          </>
        }
        metricValue={100}
        metricLabel="Score Vantagem"
        ctaHeading="TRANSFORMAÇÃO ELITE."
        ctaDescription="Tecnologia proprietária, design agressivo e foco cirúrgico em conversão. O futuro do seu negócio começa aqui."
      />
    </section>
  );
}
