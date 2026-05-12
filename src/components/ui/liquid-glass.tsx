"use client";

import React from "react";

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
  const glassStyle = {
    boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
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
          backdropFilter: "blur(8px)",
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
      className="rounded-3xl p-2 bg-black/20"
    >
      <div className="flex items-center justify-center gap-4 p-2">
        {icons.map((icon, index) => (
          <div
            key={index}
            onClick={icon.onClick}
            className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 cursor-pointer ${
              icon.active 
                ? "bg-brand text-black scale-110 shadow-[0_0_15px_rgba(132,204,22,0.5)]" 
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            {icon.src ? (
              <img
                src={icon.src}
                alt={icon.alt}
                className="w-8 h-8 object-contain"
              />
            ) : (
              icon.icon
            )}
            {icon.active && (
              <div className="absolute -bottom-1 w-1 h-1 bg-black rounded-full" />
            )}
          </div>
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
