import { HeroScrub } from "./ui/hero-scrub";

export default function DesignerFeature() {
  return (
    <section id="designer" className="relative">
      <HeroScrub
        frameCount={300}
        frameUrl={(i) =>
          `https://raw.githubusercontent.com/duthiljean/ferrari-hero-demo/main/${String(i + 1).padStart(4, "0")}.webp`
        }
        titleTop="Design que"
        titleBottom="Converte"
        accentHex="#84cc16"
      />
      <div className="absolute inset-x-0 bottom-[15%] pointer-events-none flex flex-col items-center justify-center text-center px-4">
         <p className="text-white/40 text-sm md:text-base font-bold tracking-[0.3em] uppercase mb-4">
           Exclusividade Techify
         </p>
         <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-white max-w-2xl">
           A alta performance encontra a estética imersiva para resultados brutais.
         </h3>
      </div>
    </section>
  );
}
