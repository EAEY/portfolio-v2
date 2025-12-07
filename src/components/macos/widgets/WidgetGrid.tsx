import { useWidgets, WidgetType } from "@/contexts/WidgetContext";
import Widget from "./Widget";
import ClockWidget from "./ClockWidget";
import WeatherWidget from "./WeatherWidget";
import CalendarWidget from "./CalendarWidget";
import SystemStatusWidget from "./SystemStatusWidget";
import NotesWidget from "./NotesWidget";
import RemindersWidget from "./RemindersWidget";

const WIDGET_COMPONENTS: Record<WidgetType, { component: React.ReactNode; title: string }> = {
  clock: { component: <ClockWidget />, title: "Clock" },
  weather: { component: <WeatherWidget />, title: "Weather" },
  calendar: { component: <CalendarWidget />, title: "Calendar" },
  system: { component: <SystemStatusWidget />, title: "System Status" },
  notes: { component: <NotesWidget />, title: "Notes" },
  reminders: { component: <RemindersWidget />, title: "Reminders" },
};

export const WidgetGrid = () => {
  const {
    widgets,
    updateWidget,
    removeWidget,
    toggleWidgetPin,
    toggleWidgetMinimize,
    showWidgets,
  } = useWidgets();

  if (!showWidgets) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      <div className="pointer-events-auto">
        {widgets.map((widget) => {
          const config = WIDGET_COMPONENTS[widget.type];
          if (!config) return null;

          return (
            <Widget
              key={widget.id}
              widget={widget}
              title={config.title}
              onUpdate={(updates) => updateWidget(widget.id, updates)}
              onRemove={() => removeWidget(widget.id)}
              onTogglePin={() => toggleWidgetPin(widget.id)}
              onToggleMinimize={() => toggleWidgetMinimize(widget.id)}
            >
              {config.component}
            </Widget>
          );
        })}
      </div>
    </div>
  );
};

export default WidgetGrid;
