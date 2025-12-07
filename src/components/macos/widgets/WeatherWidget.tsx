import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock weather data - in production, connect to a weather API
const MOCK_WEATHER = {
  current: {
    temp: 22,
    condition: "sunny" as const,
    humidity: 45,
    wind: 12,
    location: "San Francisco",
  },
  forecast: [
    { day: "Mon", temp: 24, condition: "sunny" as const },
    { day: "Tue", temp: 21, condition: "cloudy" as const },
    { day: "Wed", temp: 19, condition: "rainy" as const },
  ],
};

const CONDITION_ICONS = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
  windy: Wind,
};

const CONDITION_COLORS = {
  sunny: "text-amber-400",
  cloudy: "text-slate-400",
  rainy: "text-blue-400",
  snowy: "text-sky-200",
  windy: "text-slate-500",
};

export const WeatherWidget = () => {
  const { current, forecast } = MOCK_WEATHER;
  const CurrentIcon = CONDITION_ICONS[current.condition];

  return (
    <div className="flex flex-col h-full">
      {/* Current weather */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <CurrentIcon className={cn("w-10 h-10", CONDITION_COLORS[current.condition])} />
          {current.condition === "sunny" && (
            <div className="absolute inset-0 animate-pulse opacity-50">
              <CurrentIcon className="w-10 h-10 text-amber-300 blur-sm" />
            </div>
          )}
        </div>
        <div>
          <div className="text-2xl font-light tracking-tight">{current.temp}°</div>
          <div className="text-[11px] text-muted-foreground">{current.location}</div>
        </div>
      </div>

      {/* Details */}
      <div className="flex gap-3 mb-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Droplets className="w-3 h-3" />
          {current.humidity}%
        </span>
        <span className="flex items-center gap-1">
          <Wind className="w-3 h-3" />
          {current.wind} km/h
        </span>
      </div>

      {/* Forecast */}
      <div className="flex-1 flex items-end">
        <div className="flex gap-2 w-full">
          {forecast.map((day) => {
            const DayIcon = CONDITION_ICONS[day.condition];
            return (
              <div
                key={day.day}
                className="flex-1 text-center p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors"
              >
                <div className="text-[10px] text-muted-foreground mb-1">{day.day}</div>
                <DayIcon className={cn("w-4 h-4 mx-auto", CONDITION_COLORS[day.condition])} />
                <div className="text-[11px] font-medium mt-1">{day.temp}°</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
