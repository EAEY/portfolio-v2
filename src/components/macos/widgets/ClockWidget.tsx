import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ClockWidgetProps {
  showAnalog?: boolean;
}

export const ClockWidget = ({ showAnalog = true }: ClockWidgetProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Analog clock hand rotations
  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      {showAnalog && (
        <div className="relative w-24 h-24 rounded-full border-2 border-border bg-background/30 shadow-inner">
          {/* Clock face markers */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute left-1/2 -translate-x-1/2",
                i % 3 === 0 ? "w-0.5 h-2 bg-foreground/60" : "w-0.5 h-1.5 bg-foreground/30"
              )}
              style={{
                transform: `translateX(-50%) rotate(${i * 30}deg)`,
                transformOrigin: "50% 48px",
              }}
            />
          ))}
          
          {/* Hour hand */}
          <div
            className="absolute w-1 h-6 bg-foreground rounded-full left-1/2 bottom-1/2 origin-bottom transition-transform"
            style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
          />
          
          {/* Minute hand */}
          <div
            className="absolute w-0.5 h-8 bg-foreground rounded-full left-1/2 bottom-1/2 origin-bottom transition-transform"
            style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }}
          />
          
          {/* Second hand */}
          <div
            className="absolute w-px h-9 bg-primary rounded-full left-1/2 bottom-1/2 origin-bottom"
            style={{ 
              transform: `translateX(-50%) rotate(${secondDeg}deg)`,
              transition: seconds === 0 ? 'none' : 'transform 0.1s linear'
            }}
          />
          
          {/* Center dot */}
          <div className="absolute w-2 h-2 bg-primary rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-sm" />
        </div>
      )}

      <div className="text-center">
        <div className="text-lg font-semibold tabular-nums tracking-tight">
          {formatTime(time)}
        </div>
        <div className="text-[11px] text-muted-foreground mt-0.5">
          {formatDate(time)}
        </div>
      </div>
    </div>
  );
};

export default ClockWidget;
