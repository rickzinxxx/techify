import { Warp } from "@paper-design/shaders-react"

export default function WarpShader({ children, className = "" }: { children?: React.ReactNode, className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <Warp
          style={{ height: "100%", width: "100%" }}
          proportion={0.45}
          softness={1}
          distortion={0.25}
          swirl={0.8}
          swirlIterations={10}
          shape="checks"
          shapeScale={0.1}
          scale={1}
          rotation={0}
          speed={0.5}
          // Techify Colors: Lime green and dark variants
          colors={["#000000", "#111111", "#84cc16", "#2d4a06"]}
        />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
