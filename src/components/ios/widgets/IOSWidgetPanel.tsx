import { cn } from "@/lib/utils";
import ClockIOSWidget from "./ClockIOSWidget";
import WeatherIOSWidget from "./WeatherIOSWidget";
import QuickNotesWidget from "./QuickNotesWidget";
import RecentProjectsWidget from "./RecentProjectsWidget";

interface IOSWidgetPanelProps {
  onProjectsTap?: () => void;
}

export const IOSWidgetPanel = ({ onProjectsTap }: IOSWidgetPanelProps) => {
  return (
    <div className="px-4 py-4">
      <div
        className={cn(
          "grid grid-cols-2 gap-3 auto-rows-[72px]"
        )}
        role="region"
        aria-label="Home screen widgets"
      >
        <ClockIOSWidget />
        <WeatherIOSWidget />
        <QuickNotesWidget />
        <RecentProjectsWidget onTap={onProjectsTap} />
      </div>
    </div>
  );
};

export default IOSWidgetPanel;
