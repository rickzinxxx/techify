import React, { useEffect, useMemo } from 'react';

interface CosmicParallaxBgProps {
  /**
   * Main heading text (displayed large in the center)
   */
  head: string;
  
  /**
   * Subtitle text (displayed below the heading)
   * Comma-separated string that will be split into animated parts
   */
  text: string;
  
  /**
   * Whether the text animations should loop
   * @default true
   */
  loop?: boolean;
  
  /**
   * Custom class name for additional styling
   */
  className?: string;
}

// Generate random star positions - moved outside to avoid re-creation
const generateStarBoxShadow = (count: number): string => {
  let shadows = [];
  
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 2000);
    const y = Math.floor(Math.random() * 2000);
    shadows.push(`${x}px ${y}px #FFF`);
  }
  
  return shadows.join(', ');
};

/**
 * A cosmic parallax background component with animated stars and text
 */
const CosmicParallaxBg: React.FC<CosmicParallaxBgProps> = ({
  head,
  text,
  loop = true,
  className = '',
}) => {
  // Memoize star shadows so they remain stable across re-renders
  const { smallStars, mediumStars, bigStars } = useMemo(() => {
    // Check if we are on mobile to reduce star count (simplified check)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const multiplier = isMobile ? 0.5 : 1;
    
    return {
      smallStars: generateStarBoxShadow(Math.floor(600 * multiplier)),
      mediumStars: generateStarBoxShadow(Math.floor(150 * multiplier)),
      bigStars: generateStarBoxShadow(Math.floor(80 * multiplier))
    };
  }, []);
  
  // Split the text by commas and trim whitespace
  const textParts = text.split(',').map(part => part.trim());
  
  useEffect(() => {
    // Set animation iteration based on loop prop
    document.documentElement.style.setProperty(
      '--animation-iteration', 
      loop ? 'infinite' : '1'
    );
  }, [loop]);
  
  return (
    <div className={`cosmic-parallax-container ${className}`}>
      {/* Stars layers with hardware acceleration hint */}
      <div 
        id="stars" 
        style={{ boxShadow: smallStars, willChange: 'transform' }}
        className="cosmic-stars"
      ></div>
      <div 
        id="stars2" 
        style={{ boxShadow: mediumStars, willChange: 'transform' }}
        className="cosmic-stars-medium"
      ></div>
      <div 
        id="stars3" 
        style={{ boxShadow: bigStars, willChange: 'transform' }}
        className="cosmic-stars-large"
      ></div>
      
      {/* Horizon and Earth */}
      <div id="horizon">
        <div className="glow"></div>
      </div>
      <div id="earth"></div>
    </div>
  );
};

export {CosmicParallaxBg}
