import { useState, useCallback, useRef } from "react";
import { useWallpaper } from "@/contexts/WallpaperContext";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

interface DesktopProps {
  children: React.ReactNode;
}

export const Desktop = ({ children }: DesktopProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const desktopRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { effectiveWallpaper } = useWallpaper();

  // Parallax effect on mouse move
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (prefersReducedMotion) return;

      const rect = desktopRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (e.clientX - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.height / 2) / rect.height;

      setMousePosition({ x: x * 10, y: y * 10 });
    },
    [prefersReducedMotion]
  );

  // Determine background style based on wallpaper type
  const backgroundStyle = effectiveWallpaper.type === "image"
    ? {
        backgroundImage: `url(${effectiveWallpaper.value})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat" as const,
      }
    : {
        background: effectiveWallpaper.value,
      };

  return (
    <div
      ref={desktopRef}
      className="fixed inset-0 overflow-hidden bg-background"
      onMouseMove={handleMouseMove}
    >
      {/* Wallpaper Background */}
      <div
        className="absolute inset-0 transition-all duration-500 ease-out"
        style={{
          transform: prefersReducedMotion
            ? "none"
            : `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.05)`,
          ...backgroundStyle,
        }}
      >
        {/* Animated gradient orbs - only show for gradient wallpapers */}
        {effectiveWallpaper.type === "gradient" && (
          <>
            <div
              className={`absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-primary/30 to-accent/20 blur-[100px] ${
                prefersReducedMotion ? "" : "animate-parallax-float"
              }`}
            />
            <div
              className={`absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-accent/20 to-primary/15 blur-[80px] ${
                prefersReducedMotion ? "" : "animate-parallax-float"
              }`}
              style={{ animationDelay: "-10s" }}
            />
            <div
              className={`absolute top-1/2 right-1/3 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-secondary/30 to-primary/10 blur-[60px] ${
                prefersReducedMotion ? "" : "animate-parallax-float"
              }`}
              style={{ animationDelay: "-5s" }}
            />
          </>
        )}

        {/* Subtle noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Desktop Content Area - below menu bar, above dock */}
      <main
        className="absolute inset-0 pt-7 pb-20"
        role="main"
        aria-label="Desktop"
      >
        {children}
      </main>
    </div>
  );
};

export default Desktop;
