import { Cloud, Sun } from "lucide-react";
import IOSWidget from "./IOSWidget";

export const WeatherIOSWidget = () => {
  return (
    <IOSWidget size="small" ariaLabel="Weather: 22°C, Partly Cloudy">
      <div className="h-full flex flex-col items-center justify-center">
        <div className="relative mb-1">
          <Sun className="w-8 h-8 text-yellow-400" />
          <Cloud className="w-6 h-6 text-foreground/60 absolute -bottom-1 -right-2" />
        </div>
        <span className="text-xl font-semibold">22°</span>
        <span className="text-[10px] text-foreground/70">Partly Cloudy</span>
      </div>
    </IOSWidget>
  );
};

export default WeatherIOSWidget;
