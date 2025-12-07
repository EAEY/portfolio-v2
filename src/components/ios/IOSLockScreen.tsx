import { useState, useRef, useCallback, useEffect } from "react";
import { Signal, Wifi, Battery, Flashlight, Camera, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { useMobileWallpaper } from "@/contexts/MobileWallpaperContext";
import LockScreenNotifications from "./LockScreenNotifications";

interface IOSLockScreenProps {
  onUnlock: () => void;
}

export const IOSLockScreen = ({ onUnlock }: IOSLockScreenProps) => {
  const { currentWallpaper } = useMobileWallpaper();
  const [time, setTime] = useState(new Date());
  const [swipeY, setSwipeY] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [notificationsExpanded, setNotificationsExpanded] = useState(false);
  const [dynamicIslandExpanded, setDynamicIslandExpanded] = useState(false);
  const startY = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic island animation on mount
  useEffect(() => {
    if (!reducedMotion) {
      const animateIsland = () => {
        setDynamicIslandExpanded(true);
        setTimeout(() => setDynamicIslandExpanded(false), 2000);
      };
      const timeout = setTimeout(animateIsland, 500);
      return () => clearTimeout(timeout);
    }
  }, [reducedMotion]);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  const displayHours = hours % 12 || 12;
  
  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setIsSwiping(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentY = e.touches[0].clientY;
    const diff = startY.current - currentY;
    if (diff > 0) {
      setSwipeY(Math.min(diff, window.innerHeight));
    }
  }, [isSwiping]);

  const handleTouchEnd = useCallback(() => {
    setIsSwiping(false);
    if (swipeY > window.innerHeight * 0.25) {
      setIsUnlocking(true);
      setTimeout(onUnlock, reducedMotion ? 0 : 400);
    } else {
      setSwipeY(0);
    }
  }, [swipeY, onUnlock, reducedMotion]);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        setIsUnlocking(true);
        setTimeout(onUnlock, reducedMotion ? 0 : 400);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onUnlock, reducedMotion]);

  const swipeProgress = Math.min(swipeY / (window.innerHeight * 0.4), 1);
  const contentOpacity = 1 - swipeProgress * 0.8;
  const contentScale = 1 - swipeProgress * 0.1;
  const translateY = isUnlocking ? -window.innerHeight : -swipeY * 0.6;
  const blurAmount = swipeProgress * 20;

  // Get battery percentage (simulated)
  const [batteryLevel] = useState(Math.floor(Math.random() * 40) + 60);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col overflow-hidden touch-manipulation select-none",
        !reducedMotion && "transition-transform duration-[400ms] ease-out"
      )}
      style={{
        transform: `translateY(${translateY}px)`,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-label="Lock screen. Swipe up or press Enter to unlock."
      tabIndex={0}
    >
      {/* Wallpaper with blur effect on swipe */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${currentWallpaper.lockscreen}')`,
          filter: `blur(${blurAmount}px)`,
          transform: `scale(${1 + blurAmount * 0.01})`,
        }}
      />

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      {/* Status Bar */}
      <header className="relative z-50 h-[54px] px-6 flex items-center justify-between">
        {/* Time (left) - iOS style */}
        <span className="font-semibold text-[16px] text-white tracking-tight min-w-[54px]">
          {displayHours}:{String(minutes).padStart(2, "0")} {ampm}
        </span>

        {/* Dynamic Island (center) with animation */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[10px]">
          <div 
            className={cn(
              "bg-black rounded-[24px] flex items-center justify-center overflow-hidden",
              !reducedMotion && "transition-all duration-500 ease-out"
            )}
            style={{
              width: dynamicIslandExpanded ? 200 : 126,
              height: dynamicIslandExpanded ? 48 : 37,
            }}
          >
            {dynamicIslandExpanded && (
              <div className="flex items-center gap-3 px-4 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#007aff] to-[#5856d6] flex items-center justify-center">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <div className="text-white">
                  <p className="text-[11px] text-white/60">Face ID</p>
                  <p className="text-[13px] font-medium">Locked</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status icons (right) */}
        <div className="flex items-center gap-[3px] text-white min-w-[72px] justify-end">
          <Signal className="w-[18px] h-[18px]" strokeWidth={2.5} />
          <Wifi className="w-[18px] h-[18px]" strokeWidth={2.5} />
          <div className="flex items-center ml-1">
            <span className="text-[13px] font-semibold mr-[3px]">{batteryLevel}</span>
            <div className="relative w-[27px] h-[13px]">
              <div className="absolute inset-0 border-[1.5px] border-white rounded-[4px]" />
              <div className="absolute right-[-3px] top-1/2 -translate-y-1/2 w-[1.5px] h-[5px] bg-white rounded-r-sm" />
              <div 
                className="absolute left-[2px] top-[2px] bottom-[2px] bg-white rounded-[2px]"
                style={{ width: `${(batteryLevel / 100) * 20}px` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div 
        className="relative flex-1 flex flex-col items-center pt-10"
        style={{ 
          opacity: contentOpacity,
          transform: `scale(${contentScale})`,
          transition: !isSwiping ? "opacity 0.3s, transform 0.3s" : "none",
        }}
      >
        {/* Lock Icon */}
        <div className="mb-3">
          <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Lock className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Date */}
        <span className="text-white/80 text-[22px] font-light tracking-wide">
          {formattedDate}
        </span>

        {/* Large Time - iOS 17 style */}
        <div className="relative mt-0 flex items-baseline justify-center gap-2">
          <span 
            className="text-[86px] font-bold tracking-[-2px] leading-none"
            style={{
              color: "white",
              textShadow: "0 4px 30px rgba(0,0,0,0.3)",
            }}
          >
            {displayHours}:{String(minutes).padStart(2, "0")}
          </span>
          <span 
            className="text-[32px] font-light tracking-tight leading-none mb-2"
            style={{
              color: "white",
              textShadow: "0 4px 30px rgba(0,0,0,0.3)",
            }}
          >
            {ampm}
          </span>
        </div>

        {/* Notifications */}
        <div className="mt-6 w-full flex-1 overflow-auto">
          <LockScreenNotifications
            expanded={notificationsExpanded}
            onToggleExpand={() => setNotificationsExpanded(!notificationsExpanded)}
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div 
        className="relative pb-3 px-6"
        style={{ 
          opacity: contentOpacity,
          transition: !isSwiping ? "opacity 0.3s" : "none",
        }}
      >
        {/* Quick Action Buttons */}
        <div className="flex justify-between items-center mb-5">
          {/* Flashlight */}
          <button 
            className={cn(
              "w-[50px] h-[50px] rounded-full flex items-center justify-center",
              "bg-black/25 backdrop-blur-2xl",
              "active:bg-white/20 active:scale-95 transition-all"
            )}
            style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)" }}
            aria-label="Flashlight"
          >
            <Flashlight className="w-[26px] h-[26px] text-white" />
          </button>

          {/* Camera */}
          <button 
            className={cn(
              "w-[50px] h-[50px] rounded-full flex items-center justify-center",
              "bg-black/25 backdrop-blur-2xl",
              "active:bg-white/20 active:scale-95 transition-all"
            )}
            style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)" }}
            aria-label="Camera"
          >
            <Camera className="w-[26px] h-[26px] text-white" />
          </button>
        </div>

        {/* Swipe hint */}
        <p 
          className={cn(
            "text-center text-white/60 text-[13px] font-medium mb-2"
          )}
          style={{ opacity: 1 - swipeProgress }}
        >
          Swipe up to unlock
        </p>

        {/* Home Indicator */}
        <div className="flex justify-center pb-1">
          <div className="w-[134px] h-[5px] bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default IOSLockScreen;