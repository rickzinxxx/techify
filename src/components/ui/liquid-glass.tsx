"use client";

import React from "react";
import { motion } from "motion/react";

// Types
export interface GlassEffectProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  target?: string;
}

export interface DockIcon {
  src?: string;
  icon?: React.ReactNode; // Added support for icons
  alt: string;
  active?: boolean;
  onClick?: () => void;
}

// Glass Effect Wrapper Component
export const GlassEffect: React.FC<GlassEffectProps> = ({
  children,
  className = "",
  style = {},
  href,
  target = "_blank",
}) => {
  const glassStyle = {
    boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
    transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
    ...style,
  };

  const content = (
    <div
      className={`relative flex font-semibold overflow-hidden text-black transition-all duration-700 ${className}`}
      style={glassStyle}
    >
      {/* Glass Layers */}
      <div
        className="absolute inset-0 z-0 overflow-hidden rounded-inherit"
        style={{
          backdropFilter: "blur(5px)",
          filter: "url(#glass-distortion)",
          isolation: "isolate",
        }}
      />
      <div
        className="absolute inset-0 z-10 rounded-inherit"
        style={{ background: "rgba(255, 255, 255, 0.15)" }}
      />
      <div
        className="absolute inset-0 z-20 rounded-inherit overflow-hidden"
        style={{
          boxShadow:
            "inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)",
        }}
      />

      {/* Content */}
      <div className="relative z-30 w-full">{children}</div>
    </div>
  );

  return href ? (
    <a href={href} target={target} rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    content
  );
};

// Dock Component
export const GlassDock: React.FC<{ icons: DockIcon[]; href?: string; className?: string }> = ({
  icons,
  href,
  className = "",
}) => (
  <div className={className}>
    <GlassFilter />
    <GlassEffect
      href={href}
      className="rounded-3xl p-1.5"
    >
      <div className="flex items-center gap-1.5 p-1 overflow-x-auto no-scrollbar scroll-smooth">
        {icons.map((icon, index) => (
          <motion.div
            key={index}
            onClick={icon.onClick}
            whileTap={{ scale: 0.9 }}
            className={`relative p-3 rounded-2xl transition-all duration-500 cursor-pointer flex flex-col items-center justify-center min-w-[50px] ${
              icon.active ? "bg-brand/20" : "hover:bg-white/10"
            }`}
          >
             {icon.active && (
              <motion.div
                layoutId="liquid-dock-active"
                className="absolute inset-0 bg-brand rounded-2xl z-0"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              />
            )}
            
            <div className="relative z-10">
              {icon.src ? (
                <img
                  src={icon.src}
                  alt={icon.alt}
                  className="w-8 h-8 transition-all duration-700 hover:scale-110"
                  style={{
                    transformOrigin: "center center",
                    transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
                  }}
                />
              ) : (
                <div className={icon.active ? "text-black" : "text-white"}>
                  {icon.icon}
                </div>
              )}
            </div>
            
            {icon.active && (
               <span className="text-[8px] font-black uppercase mt-1 text-black relative z-10 leading-none">
                 {icon.alt}
               </span>
            )}
          </motion.div>
        ))}
      </div>
    </GlassEffect>
  </div>
);

// Button Component
export const GlassButton: React.FC<{ children: React.ReactNode; href?: string; className?: string }> = ({
  children,
  href,
  className = "",
}) => (
  <GlassEffect
    href={href}
    className={`rounded-3xl px-6 py-4 hover:rounded-4xl overflow-hidden ${className}`}
  >
    <div
      className="transition-all duration-700 hover:scale-95"
      style={{
        transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
      }}
    >
      {children}
    </div>
  </GlassEffect>
);

// SVG Filter Component
export const GlassFilter: React.FC = () => (
  <svg style={{ display: "none" }}>
    <filter
      id="glass-distortion"
      x="0%"
      y="0%"
      width="100%"
      height="100%"
      filterUnits="objectBoundingBox"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.001 0.005"
        numOctaves="1"
        seed="17"
        result="turbulence"
      />
      <feComponentTransfer in="turbulence" result="mapped">
        <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
        <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
        <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
      </feComponentTransfer>
      <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
      <feSpecularLighting
        in="softMap"
        surfaceScale="5"
        specularConstant="1"
        specularExponent="100"
        lightingColor="white"
        result="specLight"
      >
        <fePointLight x="-200" y="-200" z="300" />
      </feSpecularLighting>
      <feComposite
        in="specLight"
        operator="arithmetic"
        k1="0"
        k2="1"
        k3="1"
        k4="0"
        result="litImage"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="softMap"
        scale="20"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>
);
