import { useState, useEffect, useRef } from "react";
import { Signal, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

interface IOSStatusBarProps {
  variant?: "light" | "dark" | "auto";
  onSwipeDown?: () => void;
}

export const IOSStatusBar = ({ variant = "auto", onSwipeDown }: IOSStatusBarProps) => {
  const [time, setTime] = useState(new Date());
  const touchStartY = useRef<number | null>(null);
  const [batteryLevel] = useState(Math.floor(Math.random() * 40) + 60);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    
    const currentY = e.touches[0].clientY;
    if (currentY - touchStartY.current > 50) {
      onSwipeDown?.();
      touchStartY.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-[54px] px-6",
        "flex items-center justify-between"
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-hidden="true"
    >
      {/* Time (left) */}
      <span 
        className="font-semibold text-[16px] text-white tracking-tight min-w-[54px]"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
      >
        {formattedTime}
      </span>

      {/* Dynamic Island (center) */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[10px]">
        <div 
          className="w-[126px] h-[37px] bg-black rounded-[24px] transition-all duration-300"
          style={{ boxShadow: "0 0 0 0.5px rgba(255,255,255,0.1)" }}
        />
      </div>

      {/* Status icons (right) */}
      <div className="flex items-center gap-[3px] text-white min-w-[72px] justify-end">
        <Signal className="w-[18px] h-[18px]" strokeWidth={2.5} />
        <Wifi className="w-[18px] h-[18px]" strokeWidth={2.5} />
        <div className="flex items-center ml-1">
          <span 
            className="text-[13px] font-semibold mr-[3px]"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
          >
            {batteryLevel}
          </span>
          {/* Custom battery icon matching iOS */}
          <div className="relative w-[27px] h-[13px]">
            {/* Battery outline */}
            <div className="absolute inset-0 border-[1.5px] border-white rounded-[4px]" />
            {/* Battery cap */}
            <div className="absolute right-[-3px] top-1/2 -translate-y-1/2 w-[1.5px] h-[5px] bg-white rounded-r-sm" />
            {/* Battery level */}
            <div 
              className="absolute left-[2px] top-[2px] bottom-[2px] bg-white rounded-[2px]"
              style={{ width: `${(batteryLevel / 100) * 20}px` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default IOSStatusBar;