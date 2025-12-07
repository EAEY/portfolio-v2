import { useState, useEffect } from "react";
import IOSWidget from "./IOSWidget";

export const ClockIOSWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  const formattedDate = time.toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  // Calculate hand rotations
  const hourRotation = (hours % 12) * 30 + minutes * 0.5;
  const minuteRotation = minutes * 6;
  const secondRotation = time.getSeconds() * 6;

  return (
    <IOSWidget size="small" ariaLabel={`Current time: ${formattedTime}`}>
      <div className="h-full flex flex-col items-center justify-center">
        {/* Analog clock face */}
        <div className="relative w-14 h-14 rounded-full border-2 border-foreground/20 mb-1">
          {/* Hour markers */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <div
              key={deg}
              className="absolute w-0.5 h-1 bg-foreground/40 left-1/2 -translate-x-1/2"
              style={{
                transform: `rotate(${deg}deg) translateY(2px)`,
                transformOrigin: "center 28px",
              }}
            />
          ))}
          
          {/* Hour hand */}
          <div
            className="absolute w-1 h-4 bg-foreground rounded-full left-1/2 -translate-x-1/2 bottom-1/2 origin-bottom"
            style={{ transform: `translateX(-50%) rotate(${hourRotation}deg)` }}
          />
          
          {/* Minute hand */}
          <div
            className="absolute w-0.5 h-5 bg-foreground rounded-full left-1/2 -translate-x-1/2 bottom-1/2 origin-bottom"
            style={{ transform: `translateX(-50%) rotate(${minuteRotation}deg)` }}
          />
          
          {/* Second hand */}
          <div
            className="absolute w-[1px] h-5 bg-primary rounded-full left-1/2 -translate-x-1/2 bottom-1/2 origin-bottom"
            style={{ transform: `translateX(-50%) rotate(${secondRotation}deg)` }}
          />
          
          {/* Center dot */}
          <div className="absolute w-1.5 h-1.5 bg-primary rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <span className="text-[10px] font-medium text-foreground/70">{formattedDate}</span>
      </div>
    </IOSWidget>
  );
};

export default ClockIOSWidget;
