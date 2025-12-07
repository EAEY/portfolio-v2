import { useState, useRef, useCallback, useEffect, ReactNode } from "react";
import { X, Minus, Pin, PinOff, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { WidgetState } from "@/contexts/WidgetContext";

interface WidgetProps {
  widget: WidgetState;
  onUpdate: (updates: Partial<WidgetState>) => void;
  onRemove: () => void;
  onTogglePin: () => void;
  onToggleMinimize: () => void;
  children: ReactNode;
  title: string;
}

const SIZE_DIMENSIONS = {
  small: { width: 160, height: 160 },
  medium: { width: 224, height: 224 },
  large: { width: 320, height: 320 },
};

const GRID_SIZE = 20;

// Snap to grid helper
const snapToGrid = (value: number): number => Math.round(value / GRID_SIZE) * GRID_SIZE;

export const Widget = ({
  widget,
  onUpdate,
  onRemove,
  onTogglePin,
  onToggleMinimize,
  children,
  title,
}: WidgetProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(false);
  const [localPosition, setLocalPosition] = useState(widget.position);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Sync local position with widget state
  useEffect(() => {
    if (!isDragging) {
      setLocalPosition(widget.position);
    }
  }, [widget.position, isDragging]);

  const handleDragStart = useCallback(
    (e: React.PointerEvent) => {
      if (widget.isPinned) return;
      
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      
      const rect = widgetRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    },
    [widget.isPinned]
  );

  const handleDragMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Constrain to viewport
      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 100;

      // Update local position immediately for smooth dragging
      setLocalPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(40, Math.min(newY, maxY)),
      });
    },
    [isDragging, dragOffset]
  );

  const handleDragEnd = useCallback(() => {
    if (isDragging) {
      // Snap to grid when drag ends
      onUpdate({
        position: {
          x: snapToGrid(localPosition.x),
          y: snapToGrid(localPosition.y),
        },
      });
    }
    setIsDragging(false);
  }, [isDragging, localPosition, onUpdate]);

  // Cycle through sizes
  const cycleSize = useCallback(() => {
    const sizes: Array<"small" | "medium" | "large"> = ["small", "medium", "large"];
    const currentIndex = sizes.indexOf(widget.size);
    const nextIndex = (currentIndex + 1) % sizes.length;
    onUpdate({ size: sizes[nextIndex] });
  }, [widget.size, onUpdate]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("pointermove", handleDragMove);
      document.addEventListener("pointerup", handleDragEnd);
      return () => {
        document.removeEventListener("pointermove", handleDragMove);
        document.removeEventListener("pointerup", handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  const dimensions = SIZE_DIMENSIONS[widget.size];

  // Minimized state - show as a small pill
  if (widget.isMinimized) {
    return (
      <button
        onClick={onToggleMinimize}
        className={cn(
          "fixed z-20 px-3 py-1.5 rounded-full text-xs font-medium",
          "glass hover:scale-105 transition-all duration-200",
          "animate-scale-in"
        )}
        style={{
          left: widget.position.x,
          top: widget.position.y,
        }}
      >
        {title}
      </button>
    );
  }

  return (
    <div
      ref={widgetRef}
      className={cn(
        "fixed z-20 rounded-2xl overflow-hidden",
        "glass transition-all",
        isDragging 
          ? "cursor-grabbing scale-[1.02] shadow-2xl duration-0" 
          : "cursor-default duration-200",
        !isDragging && "animate-scale-in"
      )}
      style={{
        left: localPosition.x,
        top: localPosition.y,
        width: dimensions.width,
        height: dimensions.height,
      }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Header - draggable area */}
      <div
        className={cn(
          "h-7 flex items-center justify-between px-2 select-none",
          "bg-foreground/5 border-b border-border/30",
          widget.isPinned ? "cursor-default" : "cursor-grab active:cursor-grabbing"
        )}
        onPointerDown={handleDragStart}
      >
        <span className="text-[11px] font-medium text-muted-foreground truncate flex items-center gap-1.5">
          {widget.isPinned && <Pin className="w-2.5 h-2.5" />}
          {title}
        </span>
        
        {/* Controls */}
        <div
          className={cn(
            "flex items-center gap-0.5 transition-opacity duration-150",
            showControls ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Resize button */}
          <button
            onClick={cycleSize}
            className="p-1 rounded hover:bg-foreground/10 transition-colors"
            aria-label="Resize widget"
            title={`Size: ${widget.size}`}
          >
            {widget.size === "large" ? (
              <Minimize2 className="w-3 h-3 text-muted-foreground" />
            ) : (
              <Maximize2 className="w-3 h-3 text-muted-foreground" />
            )}
          </button>
          
          {/* Pin button */}
          <button
            onClick={onTogglePin}
            className={cn(
              "p-1 rounded transition-colors",
              widget.isPinned 
                ? "bg-primary/20 text-primary" 
                : "hover:bg-foreground/10 text-muted-foreground"
            )}
            aria-label={widget.isPinned ? "Unpin widget" : "Pin widget"}
          >
            {widget.isPinned ? (
              <PinOff className="w-3 h-3" />
            ) : (
              <Pin className="w-3 h-3" />
            )}
          </button>
          
          {/* Minimize button */}
          <button
            onClick={onToggleMinimize}
            className="p-1 rounded hover:bg-foreground/10 transition-colors"
            aria-label="Minimize widget"
          >
            <Minus className="w-3 h-3 text-muted-foreground" />
          </button>
          
          {/* Close button */}
          <button
            onClick={onRemove}
            className="p-1 rounded hover:bg-destructive/20 transition-colors group"
            aria-label="Close widget"
          >
            <X className="w-3 h-3 text-muted-foreground group-hover:text-destructive" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 h-[calc(100%-28px)] overflow-auto text-foreground">
        {children}
      </div>

      {/* Grid snap indicator during drag */}
      {isDragging && (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded">
          {Math.round(localPosition.x)}, {Math.round(localPosition.y)}
        </div>
      )}
    </div>
  );
};

export default Widget;
