import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { AppIcon as AppIconType } from "@/contexts/HomeScreenContext";

interface QuickActionsMenuProps {
  app: AppIconType;
  position: { x: number; y: number };
  onAction: (appId: string, actionId: string) => void;
  onClose: () => void;
  onEnterEditMode: () => void;
}

export const QuickActionsMenu = ({
  app,
  position,
  onAction,
  onClose,
  onEnterEditMode,
}: QuickActionsMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [onClose]);

  // Calculate menu position to stay within viewport
  const menuStyle = {
    left: Math.min(position.x, window.innerWidth - 200),
    top: Math.min(position.y, window.innerHeight - 200),
  };

  return (
    <div
      ref={menuRef}
      className={cn(
        "fixed z-50 min-w-[180px] glass rounded-2xl p-1 animate-scale-in shadow-xl"
      )}
      style={menuStyle}
      role="menu"
      aria-label={`Quick actions for ${app.label}`}
    >
      {/* App preview */}
      <div className="flex items-center gap-3 p-3 border-b border-border/50">
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-secondary">
          <img src={app.icon} alt="" className="w-full h-full object-cover" />
        </div>
        <span className="font-medium">{app.label}</span>
      </div>

      {/* Quick actions */}
      {app.quickActions && app.quickActions.length > 0 && (
        <div className="py-1 border-b border-border/50">
          {app.quickActions.map((action) => (
            <button
              key={action.id}
              className={cn(
                "w-full text-left px-4 py-2.5 transition-colors rounded-lg",
                "hover:bg-secondary/80 focus:outline-none focus-visible:bg-secondary"
              )}
              onClick={() => {
                onAction(app.id, action.id);
                onClose();
              }}
              role="menuitem"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Edit Home Screen */}
      <div className="py-1">
        <button
          className={cn(
            "w-full text-left px-4 py-2.5 transition-colors rounded-lg",
            "hover:bg-secondary/80 focus:outline-none focus-visible:bg-secondary"
          )}
          onClick={() => {
            onEnterEditMode();
            onClose();
          }}
          role="menuitem"
        >
          Edit Home Screen
        </button>
      </div>
    </div>
  );
};

export default QuickActionsMenu;
