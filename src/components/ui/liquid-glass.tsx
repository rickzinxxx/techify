"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";

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
  icon?: React.ReactNode;
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
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  const glassStyle = {
    boxShadow: isMobile 
      ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" 
      : "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
    transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
    ...style,
  };

  const content = (
    <div
      className={`relative flex font-semibold overflow-hidden text-black cursor-pointer transition-all duration-700 ${className}`}
      style={glassStyle}
    >
      {/* Glass Layers */}
      <div
        className="absolute inset-0 z-0 overflow-hidden rounded-inherit"
        style={{
          backdropFilter: isMobile ? "blur(12px)" : "blur(8px)",
          filter: isMobile ? "none" : "url(#glass-distortion)",
          isolation: "isolate",
          background: isMobile ? "rgba(255, 255, 255, 0.05)" : "transparent",
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
            "inset 2px 2px 1px 0 rgba(255, 255, 255, 0.3), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.2)",
        }}
      />

      {/* Content */}
      <div className="relative z-30 w-full h-full flex items-center justify-center">
        {children}
      </div>
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
export const GlassDock: React.FC<{ icons: DockIcon[]; className?: string }> = ({
  icons,
  className = "",
}) => (
  <div className={`relative ${className}`}>
    <GlassFilter />
    <GlassEffect
      className="rounded-[2rem] p-1.5 bg-black/50 border border-white/10 backdrop-blur-2xl"
    >
      <div className="flex items-center gap-2 p-1 overflow-x-auto no-scrollbar scroll-smooth snap-x touch-pan-x">
        {icons.map((icon, index) => (
          <motion.div
            key={index}
            onClick={icon.onClick}
            whileTap={{ scale: 0.9 }}
            className={`relative flex flex-col items-center justify-center min-w-[4.2rem] h-14 rounded-[1.4rem] transition-colors duration-500 cursor-pointer snap-center ${
              icon.active 
                ? "text-black" 
                : "text-white/50 hover:text-white"
            }`}
          >
            {icon.active && (
              <motion.div
                layoutId="dock-bg"
                className="absolute inset-0 bg-brand rounded-[1.4rem] shadow-[0_0_25px_rgba(132,204,22,0.5)] z-0"
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              />
            )}
            
            <div className="relative z-10 flex flex-col items-center justify-center">
              <motion.div
                animate={{ 
                  scale: icon.active ? 1.1 : 1,
                  y: icon.active ? -1 : 0
                }}
              >
                {icon.src ? (
                  <img
                    src={icon.src}
                    alt={icon.alt}
                    className="w-5 h-5 object-contain"
                  />
                ) : (
                  <div className={icon.active ? "text-brand scale-110" : "text-white opacity-50 hover:opacity-100 transition-all"}>
                    {icon.icon}
                  </div>
                )}
              </motion.div>
              <span className={`text-[7px] font-black uppercase mt-1 tracking-wider ${icon.active ? "text-black" : "text-white/40"}`}>
                {icon.alt}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassEffect>
  </div>
);

// Button Component
export const GlassButton: React.FC<{ children: React.ReactNode; href?: string; onClick?: () => void; className?: string }> = ({
  children,
  href,
  onClick,
  className = "",
}) => (
  <div onClick={onClick} className={className}>
    <GlassFilter />
    <GlassEffect
      href={href}
      className="rounded-2xl px-6 py-3 hover:scale-105 transition-transform overflow-hidden"
    >
      <div
        className="transition-all duration-700 hover:scale-95 text-white"
        style={{
          transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
        }}
      >
        {children}
      </div>
    </GlassEffect>
  </div>
);

// SVG Filter Component
export const GlassFilter: React.FC = () => (
  <svg style={{ display: "none" }}>
    <filter
      id="glass-distortion"
      x="-20%"
      y="-20%"
      width="140%"
      height="140%"
      filterUnits="objectBoundingBox"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.01 0.05"
        numOctaves="2"
        seed="17"
        result="turbulence"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="turbulence"
        scale="10"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>
);
