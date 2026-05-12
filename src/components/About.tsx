import { CinematicHero } from "./ui/cinematic-hero";

export default function About() {
  return (
    <section id="sobre" className="relative">
      <CinematicHero 
        brandName="TECHIFY"
        tagline1="Performance & Imersão,"
        tagline2="Onde a tecnologia flui."
        cardHeading="Diferentes por Natureza."
        cardDescription={
          <>
            Na <span className="text-white font-semibold">Techify</span>, acreditamos que a alta performance e a imersão são as chaves para a conversão. Não entregamos apenas código; entregamos experiências digitais que prendem a atenção e transformam o seu negócio.
          </>
        }
        metricValue={99}
        metricLabel="Web Vital Score"
        ctaHeading="Sua visão, nossa maestria."
        ctaDescription="Diferencie-se no mercado com soluções que unem design futurista e estabilidade técnica absoluta."
      />
    </section>
  );
}
