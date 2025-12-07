import { useState, useRef, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppIcon as AppIconType, useHomeScreen } from "@/contexts/HomeScreenContext";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

interface AppIconProps {
  app: AppIconType;
  onTap: (id: string, rect?: DOMRect) => void;
  onLongPress: (app: AppIconType, rect: DOMRect) => void;
  isDragging?: boolean;
  dragOffset?: { x: number; y: number };
  inDock?: boolean;
  onDragStart?: (app: AppIconType, rect: DOMRect) => void;
}

export const AppIcon = ({
  app,
  onTap,
  onLongPress,
  isDragging = false,
  dragOffset,
  inDock = false,
  onDragStart,
}: AppIconProps) => {
  const { isEditMode, hideApp } = useHomeScreen();
  const reducedMotion = usePrefersReducedMotion();
  const iconRef = useRef<HTMLButtonElement>(null);
  const longPressTimer = useRef<number | null>(null);
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      setIsPressed(true);
      
      if (isEditMode && onDragStart && iconRef.current) {
        // In edit mode, start drag immediately for reordering
        longPressTimer.current = window.setTimeout(() => {
          if (iconRef.current) {
            const rect = iconRef.current.getBoundingClientRect();
            onDragStart(app, rect);
          }
        }, 100);
      } else {
        // Normal mode: trigger quick actions menu after long press
        longPressTimer.current = window.setTimeout(() => {
          if (iconRef.current) {
            const rect = iconRef.current.getBoundingClientRect();
            onLongPress(app, rect);
          }
        }, 500);
      }
    },
    [app, onLongPress, isEditMode, onDragStart]
  );

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleTouchMove = useCallback(() => {
    if (longPressTimer.current && !isEditMode) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, [isEditMode]);

  const handleClick = useCallback(() => {
    if (!isEditMode && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      onTap(app.id, rect);
    }
  }, [app.id, onTap, isEditMode]);

  const handleRemove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      hideApp(app.id);
    },
    [app.id, hideApp]
  );

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  // iOS icon sizes
  const iconSize = inDock ? 60 : 60;

  return (
    <button
      ref={iconRef}
      className={cn(
        "relative flex flex-col items-center gap-1.5 touch-manipulation select-none",
        inDock ? "min-w-[60px]" : "min-w-[76px] min-h-[88px]",
        "transition-transform duration-150 ease-out",
        isPressed && !isEditMode && "scale-[0.9]",
        isDragging && "opacity-30",
        isEditMode && !reducedMotion && "animate-wiggle",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:rounded-2xl"
      )}
      style={
        isDragging && dragOffset
          ? {
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(1.15)`,
              zIndex: 100,
              transition: "none",
            }
          : undefined
      }
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      aria-label={app.label}
      aria-pressed={isPressed}
    >
      {/* Remove button in edit mode */}
      {isEditMode && (
        <button
          className={cn(
            "absolute -top-1 -left-1 w-5 h-5 z-20",
            "bg-[#8e8e93] rounded-full",
            "flex items-center justify-center",
            "shadow-lg",
            "active:scale-90 transition-transform"
          )}
          onClick={handleRemove}
          onTouchEnd={(e) => {
            e.stopPropagation();
            handleRemove(e);
          }}
          aria-label={`Remove ${app.label}`}
        >
          <X className="w-3 h-3 text-white" strokeWidth={3} />
        </button>
      )}

      {/* Icon Container - iOS squircle */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: iconSize * 0.22, // iOS squircle ratio
          boxShadow: "0 4px 12px rgba(0,0,0,0.2), 0 1px 4px rgba(0,0,0,0.1)",
        }}
      >
        <img
          src={app.icon}
          alt=""
          className="w-full h-full object-cover"
          draggable={false}
        />
        
        {/* Subtle highlight overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%)",
            borderRadius: "inherit",
          }}
        />
        
        {/* Badge */}
        {app.badge !== undefined && app.badge > 0 && (
          <span
            className={cn(
              "absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1.5",
              "bg-[#ff3b30] text-white",
              "text-[13px] font-bold rounded-full",
              "flex items-center justify-center",
              "shadow-md border-2 border-white/20"
            )}
          >
            {app.badge > 99 ? "99+" : app.badge}
          </span>
        )}
      </div>

      {/* Label - only show if not in dock */}
      {!inDock && (
        <span
          className={cn(
            "text-[11px] font-medium text-center leading-tight",
            "max-w-[72px] truncate",
            "text-white"
          )}
          style={{
            textShadow: "0 1px 3px rgba(0,0,0,0.6)",
          }}
        >
          {app.label}
        </span>
      )}
    </button>
  );
};

export default AppIcon;
