"use client"

import { useEffect, useRef } from "react"

interface CosmicSpectrumProps {
  color?:
    | "original"
    | "blue-pink"
    | "blue-orange"
    | "sunset"
    | "purple"
    | "monochrome"
    | "pink-purple"
    | "blue-black"
    | "beige-black"
  blur?: boolean
  className?: string
  noScrollTrigger?: boolean
}

declare global {
  interface Window {
    gsap: any
    ScrollTrigger: any
  }
}

export function CosmicSpectrum({ color = "original", blur = false, className = "", noScrollTrigger = false }: CosmicSpectrumProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const colorThemes = {
    original: ["#340B05", "#0358F7", "#5092C7", "#E1ECFE", "#FFD400", "#FA3D1D", "#FD02F5", "#FFC0FD"],
    "blue-pink": ["#1E3A8A", "#3B82F6", "#A855F7", "#EC4899", "#F472B6", "#F9A8D4", "#FBCFE8", "#FDF2F8"],
    "blue-orange": ["#1E40AF", "#3B82F6", "#60A5FA", "#FFFFFF", "#FED7AA", "#FB923C", "#EA580C", "#9A3412"],
    sunset: ["#FEF3C7", "#FCD34D", "#F59E0B", "#D97706", "#B45309", "#92400E", "#78350F", "#451A03"],
    purple: ["#F3E8FF", "#E9D5FF", "#D8B4FE", "#C084FC", "#A855F7", "#9333EA", "#7C3AED", "#6B21B6"],
    monochrome: ["#1A1A1A", "#404040", "#666666", "#999999", "#CCCCCC", "#E5E5E5", "#F5F5F5", "#FFFFFF"],
    "pink-purple": ["#FDF2F8", "#FCE7F3", "#F9A8D4", "#F472B6", "#EC4899", "#BE185D", "#831843", "#500724"],
    "blue-black": ["#000000", "#0F172A", "#1E293B", "#334155", "#475569", "#64748B", "#94A3B8", "#CBD5E1"],
    "beige-black": ["#FEF3C7", "#F59E0B", "#D97706", "#92400E", "#451A03", "#1C1917", "#0C0A09", "#000000"],
  }

  useEffect(() => {
    // Load external scripts
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve(true)
          return
        }
        const script = document.createElement("script")
        script.src = src
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })
    }

    const initializeAnimations = async () => {
      try {
        await Promise.all([
          loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"),
          loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"),
          loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/TextPlugin.min.js"),
        ])

        // Wait a bit for scripts to be ready
        setTimeout(() => {
          if (window.gsap && window.ScrollTrigger) {
            window.gsap.registerPlugin(window.ScrollTrigger)
            setupAnimations()
          }
        }, 100)
      } catch (error) {
        console.error("Failed to load GSAP:", error)
      }
    }

    initializeAnimations()
  }, [])

  const setupAnimations = () => {
    const gsap = window.gsap
    const ScrollTrigger = window.ScrollTrigger

    if (!gsap || !ScrollTrigger || !containerRef.current) return

    const svgContainer = containerRef.current.querySelector(".svg-container");
    if (!svgContainer) return;

    if (noScrollTrigger) {
      // Just animate once or keep it visible
      gsap.to(svgContainer, { 
        opacity: 0.8, 
        transform: "scaleY(1.2) translateY(0px)",
        duration: 1, 
        ease: "power2.out" 
      });
      return;
    }

    // Scroll-triggered animations for SVG bars inside the container
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    })

    tl.to(svgContainer, { opacity: 0.8, duration: 0.1 }, 0)
      .to(
        svgContainer,
        {
          transform: "scaleY(1.2) translateY(0px)",
          duration: 1,
          ease: "power2.out",
        },
        0
      )

    // Refresh on resize
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (ScrollTrigger.getById("cosmic-spectrum")) {
        ScrollTrigger.getById("cosmic-spectrum").kill();
      }
    };
  }

  const currentColors = colorThemes[color]

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* SVG Container */}
      <div
        className="svg-container absolute bottom-0 left-0 right-0 h-full opacity-0 z-0 pointer-events-none"
        style={{
          transformOrigin: "bottom",
          transform: "scaleY(0.5) translateY(20%)",
          willChange: "transform, opacity, filter",
        }}
      >
        <svg className="w-full h-full" viewBox="0 0 1567 584" preserveAspectRatio="none" fill="none">
          <g clipPath="url(#clip-spectrum)" filter={blur ? "url(#blur-spectrum)" : undefined}>
            <path d="M1219 584H1393V184H1219V584Z" fill="url(#grad0)" />
            <path d="M1045 584H1219V104H1045V584Z" fill="url(#grad1)" />
            <path d="M348 584H174L174 184H348L348 584Z" fill="url(#grad2)" />
            <path d="M522 584H348L348 104H522L522 584Z" fill="url(#grad3)" />
            <path d="M697 584H522L522 54H697L697 584Z" fill="url(#grad4)" />
            <path d="M870 584H1045V54H870V584Z" fill="url(#grad5)" />
            <path d="M870 584H697L697 0H870L870 584Z" fill="url(#grad6)" />
            <path d="M174 585H0.000183105L-3.75875e-06 295H174L174 585Z" fill="url(#grad7)" />
            <path d="M1393 584H1567V294H1393V584Z" fill="url(#grad8)" />
          </g>
          <defs>
            <filter
              id="blur-spectrum"
              x="-30"
              y="-30"
              width="1627"
              height="644"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="15" result="effect1_foregroundBlur" />
            </filter>
            {Array.from({ length: 9 }, (_, i) => (
              <linearGradient
                key={i}
                id={`grad${i}`}
                x1="50%"
                y1="100%"
                x2="50%"
                y2="0%"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor={currentColors[0]} />
                <stop offset="0.182709" stopColor={currentColors[1]} />
                <stop offset="0.283673" stopColor={currentColors[2]} />
                <stop offset="0.413484" stopColor={currentColors[3]} />
                <stop offset="0.586565" stopColor={currentColors[4]} />
                <stop offset="0.682722" stopColor={currentColors[5]} />
                <stop offset="0.802892" stopColor={currentColors[6]} />
                <stop offset="1" stopColor={currentColors[7]} stopOpacity="0" />
              </linearGradient>
            ))}
            <clipPath id="clip-spectrum">
              <rect width="1567" height="584" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  )
}
