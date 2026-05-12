import { CinematicHero } from "./ui/cinematic-hero";

export default function About() {
  return (
    <section id="sobre" className="relative">
      <CinematicHero 
        brandName="TECHIFY"
        tagline1="Performance & Imersão,"
        tagline2="Sua marca em evidência."
        cardHeading="Somos Diferentes."
        cardDescription={
          <>
            Na <span className="text-brand font-semibold">Techify</span>, somos movidos pela obsessão por performance e imersão. Criamos experiências únicas que transformam marcas comuns em autoridades digitais, focando 100% em converter seus visitantes em clientes reais.
          </>
        }
        metricValue={100}
        metricLabel="Score Performance"
        ctaHeading="Transforme Agora."
        ctaDescription="Tecnologia de ponta, design futurista e foco total em conversão. Saia do comum e eleve seu patamar digital."
      />
    </section>
  );
}
