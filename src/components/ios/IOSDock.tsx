import { cn } from "@/lib/utils";
import { useHomeScreen, AppIcon as AppIconType } from "@/contexts/HomeScreenContext";
import AppIcon from "./AppIcon";

interface IOSDockProps {
  onAppTap: (id: string, rect?: DOMRect) => void;
  onLongPress: (app: AppIconType, rect: DOMRect) => void;
}

export const IOSDock = ({ onAppTap, onLongPress }: IOSDockProps) => {
  const { state, isEditMode, setEditMode } = useHomeScreen();
  const visibleApps = state.dockApps.filter(
    (app) => !state.hiddenApps.includes(app.id)
  );

  return (
    <nav
      className="relative pb-2 px-4"
      role="toolbar"
      aria-label="Dock"
    >
      {/* Done button in edit mode */}
      {isEditMode && (
        <button
          className={cn(
            "absolute -top-12 right-4 px-5 py-2",
            "bg-white/20 backdrop-blur-xl text-white font-semibold rounded-full",
            "border border-white/20",
            "shadow-lg transition-all duration-200",
            "active:scale-95",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          )}
          onClick={() => setEditMode(false)}
        >
          Done
        </button>
      )}

      {/* Dock container */}
      <div
        className={cn(
          "flex items-center justify-evenly py-3 px-5",
          "rounded-[28px]",
          "safe-area-bottom"
        )}
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          border: "0.5px solid rgba(255,255,255,0.15)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.2), inset 0 0.5px 0 rgba(255,255,255,0.2)",
        }}
      >
        {visibleApps.map((app) => (
          <AppIcon
            key={app.id}
            app={app}
            onTap={onAppTap}
            onLongPress={onLongPress}
            inDock
          />
        ))}
      </div>

      {/* Home Indicator */}
      <div className="flex justify-center pt-2">
        <div className="w-[134px] h-[5px] bg-white/60 rounded-full" />
      </div>
    </nav>
  );
};

export default IOSDock;
