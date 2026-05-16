import React, { useEffect, useRef } from 'react';

interface PoemAnimationProps {
    poemHTML: string;
    backgroundImageUrl: string;
    boyImageUrl: string;
}

/**
 * Renders the 3D Techify animation footer section.
 */
export const PoemAnimation: React.FC<PoemAnimationProps> = ({ poemHTML, backgroundImageUrl, boyImageUrl }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    // This effect handles the responsive scaling of the animation container.
    useEffect(() => {
        function adjustContentSize() {
            if (contentRef.current) {
                const viewportWidth = window.innerWidth;
                const baseWidth = 1000;
                const scaleFactor = viewportWidth < baseWidth ? (viewportWidth / baseWidth) * 0.9 : 1;
                contentRef.current.style.transform = `scale(${scaleFactor})`;
            }
        }

        adjustContentSize();
        window.addEventListener("resize", adjustContentSize);
        return () => window.removeEventListener("resize", adjustContentSize);
    }, []);

    return (
        <header className="hero-section-3d">
            <div className="container-3d">
                <div 
                    ref={contentRef} 
                    className="content-3d" 
                    style={{ position: 'relative', width: '1000px', height: '562px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <div className="container-full">
                        <div className="animated hue"></div>
                        <img 
                            className="backgroundImage" 
                            src={backgroundImageUrl} 
                            alt="Background" 
                            onError={(e) => (e.currentTarget.style.display = 'none')} 
                        />
                        <img 
                            className="boyImage" 
                            src={boyImageUrl} 
                            alt="Techify Team" 
                            onError={(e) => (e.currentTarget.style.display = 'none')} 
                        />
                        
                        <div className="cube-container">
                            <div className="cube">
                                <div className="face-3d top"></div>
                                <div className="face-3d bottom"></div>
                                <div className="face-3d left text-3d" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
                                <div className="face-3d right text-3d" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
                                <div className="face-3d front"></div>
                                <div className="face-3d back text-3d" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
                            </div>
                        </div>

                        <div className="container-reflect">
                            <div className="cube">
                                <div className="face-3d top"></div>
                                <div className="face-3d bottom"></div>
                                <div className="face-3d left text-3d" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
                                <div className="face-3d right text-3d" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
                                <div className="face-3d front"></div>
                                <div className="face-3d back text-3d" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
