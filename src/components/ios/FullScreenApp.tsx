import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { DockItemId } from "@/components/macos/Dock";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import AboutWindow from "@/components/macos/windows/AboutWindow";
import SkillsWindow from "@/components/macos/windows/SkillsWindow";
import ProjectsWindow from "@/components/macos/windows/ProjectsWindow";
import ExperiencesWindow from "@/components/macos/windows/ExperiencesWindow";
import ContactWindow from "@/components/macos/windows/ContactWindow";
import CVWindow from "@/components/macos/windows/CVWindow";
import FinderWindow from "@/components/macos/windows/FinderWindow";
import MobileSettingsApp from "./MobileSettingsApp";

interface FullScreenAppProps {
  appId: DockItemId | "settings";
  onClose: () => void;
  launchRect?: DOMRect;
}

const APP_CONTENT: Record<string, { title: string; component: React.ReactNode; customHeader?: boolean }> = {
  about: { title: "About", component: <AboutWindow /> },
  skills: { title: "Skills", component: <SkillsWindow /> },
  projects: { title: "Projects", component: <ProjectsWindow /> },
  experiences: { title: "Experience", component: <ExperiencesWindow /> },
  contact: { title: "Contact", component: <ContactWindow /> },
  cv: { title: "CV", component: <CVWindow /> },
  settings: { title: "Settings", component: <MobileSettingsApp />, customHeader: true },
  finder: { title: "Finder", component: <FinderWindow /> },
};

export const FullScreenApp = ({ appId, onClose, launchRect }: FullScreenAppProps) => {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const appData = APP_CONTENT[appId];
  
  const [swipeY, setSwipeY] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  const getInitialTransform = () => {
    if (!launchRect || reducedMotion) return {};
    const centerX = launchRect.left + launchRect.width / 2;
    const centerY = launchRect.top + launchRect.height / 2;
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    
    return {
      "--launch-x": `${centerX - viewportCenterX}px`,
      "--launch-y": `${centerY - viewportCenterY}px`,
    } as React.CSSProperties;
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touchY = e.touches[0].clientY;
    if (touchY > window.innerHeight - 100) {
      touchStartY.current = touchY;
      touchStartTime.current = Date.now();
      setIsSwiping(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartY.current === null || !isSwiping) return;
    
    const currentY = e.touches[0].clientY;
    const diff = touchStartY.current - currentY;
    
    if (diff > 0) {
      setSwipeY(Math.min(diff, window.innerHeight * 0.5));
    }
  }, [isSwiping]);

  const handleTouchEnd = useCallback(() => {
    if (!isSwiping) return;
    
    const swipeTime = Date.now() - touchStartTime.current;
    const swipeThreshold = window.innerHeight * 0.2;
    const isQuickSwipe = swipeTime < 300 && swipeY > 40;
    
    if (swipeY > swipeThreshold || isQuickSwipe) {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
      }, reducedMotion ? 0 : 280);
    } else {
      setSwipeY(0);
    }
    
    touchStartY.current = null;
    setIsSwiping(false);
  }, [swipeY, isSwiping, onClose, reducedMotion]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [appId]);

  if (!appData) return null;

  const swipeProgress = swipeY / (window.innerHeight * 0.3);
  const scale = 1 - (swipeProgress * 0.08);
  const opacity = 1 - (swipeProgress * 0.2);
  const borderRadius = swipeProgress * 40;

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 z-50 flex flex-col overflow-hidden bg-background",
        !reducedMotion && !isClosing && "animate-ios-app-open",
        isClosing && !reducedMotion && "animate-ios-app-close"
      )}
      style={{
        ...getInitialTransform(),
        transform: swipeY > 0 ? `translateY(${swipeY * 0.2}px) scale(${scale})` : undefined,
        opacity: swipeY > 0 ? opacity : undefined,
        borderRadius: swipeY > 0 ? `${borderRadius}px` : undefined,
        transition: !isSwiping ? "transform 0.3s cubic-bezier(0.2, 0.9, 0.2, 1), opacity 0.3s, border-radius 0.3s" : "none",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label={appData.title}
    >
      {/* App Header - hide for custom header apps */}
      {!appData.customHeader && (
        <header 
          className="flex-shrink-0 flex items-center gap-3 px-4 pt-14 pb-3 border-b border-border"
          style={{
            background: "hsl(var(--background) / 0.95)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
          }}
        >
          <button
            onClick={onClose}
            className={cn(
              "flex items-center gap-0.5 text-[#007aff] font-normal text-[17px]",
              "p-2 -ml-2 rounded-xl transition-all duration-200",
              "active:opacity-50",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007aff]"
            )}
            aria-label="Go back to home screen"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
            <span>Back</span>
          </button>
          <h1 className="text-[17px] font-semibold flex-1 text-center text-foreground pr-14">
            {appData.title}
          </h1>
        </header>
      )}

      {/* App Content */}
      <main className="flex-1 overflow-y-auto overscroll-contain bg-background">
        <div className="p-4 pb-8">{appData.component}</div>
      </main>

      {/* Home Indicator */}
      <div className="flex-shrink-0 h-8 flex items-center justify-center bg-background">
        <div className="w-[134px] h-[5px] bg-foreground/30 rounded-full" />
      </div>
    </div>
  );
};

export default FullScreenApp;
