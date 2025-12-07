import { useState, useRef, useEffect, useCallback } from "react";
import { X, Minus, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isActive: boolean;
  isMinimized: boolean;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  zIndex: number;
  dockIconRef?: React.RefObject<HTMLButtonElement>;
}

interface WindowState {
  x: number;
  y: number;
  width: number;
  height: number;
  isMaximized: boolean;
}

export const Window = ({
  id,
  title,
  children,
  isActive,
  isMinimized,
  initialPosition = { x: 100, y: 50 },
  initialSize = { width: 600, height: 450 },
  minSize = { width: 300, height: 200 },
  onClose,
  onMinimize,
  onFocus,
  zIndex,
  dockIconRef,
}: WindowProps) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<WindowState>(() => {
    const saved = localStorage.getItem(`window_${id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Use defaults
      }
    }
    return {
      x: initialPosition.x,
      y: initialPosition.y,
      width: initialSize.width,
      height: initialSize.height,
      isMaximized: false,
    };
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [genieTarget, setGenieTarget] = useState<{ x: number; y: number } | null>(null);
  const dragStart = useRef({ x: 0, y: 0, windowX: 0, windowY: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Save state to localStorage
  useEffect(() => {
    if (!isMinimized && !isMinimizing) {
      localStorage.setItem(`window_${id}`, JSON.stringify(state));
    }
  }, [id, state, isMinimized, isMinimizing]);

  // Get genie target position from dock icon
  useEffect(() => {
    if (dockIconRef?.current) {
      const rect = dockIconRef.current.getBoundingClientRect();
      setGenieTarget({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
  }, [dockIconRef]);

  // Handle minimize with genie effect
  const handleMinimizeWithGenie = useCallback(() => {
    setIsMinimizing(true);
    setTimeout(() => {
      setIsMinimizing(false);
      onMinimize();
    }, 400); // Match animation duration
  }, [onMinimize]);

  // Handle restore with genie effect
  useEffect(() => {
    if (!isMinimized && isRestoring) {
      const timer = setTimeout(() => setIsRestoring(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isMinimized, isRestoring]);

  // Detect when window is being restored
  const prevMinimized = useRef(isMinimized);
  useEffect(() => {
    if (prevMinimized.current && !isMinimized) {
      setIsRestoring(true);
    }
    prevMinimized.current = isMinimized;
  }, [isMinimized]);

  // Dragging handlers
  const handleDragStart = useCallback(
    (e: React.PointerEvent) => {
      if (state.isMaximized) return;
      e.preventDefault();
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        windowX: state.x,
        windowY: state.y,
      };
      onFocus();
    },
    [state.x, state.y, state.isMaximized, onFocus]
  );

  const handleDragMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;
      setState((prev) => ({
        ...prev,
        x: dragStart.current.windowX + deltaX,
        y: Math.max(28, dragStart.current.windowY + deltaY),
      }));
    },
    [isDragging]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Resizing handlers
  const handleResizeStart = useCallback(
    (e: React.PointerEvent) => {
      if (state.isMaximized) return;
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: state.width,
        height: state.height,
      };
      onFocus();
    },
    [state.width, state.height, state.isMaximized, onFocus]
  );

  const handleResizeMove = useCallback(
    (e: PointerEvent) => {
      if (!isResizing) return;
      const deltaX = e.clientX - resizeStart.current.x;
      const deltaY = e.clientY - resizeStart.current.y;
      setState((prev) => ({
        ...prev,
        width: Math.max(minSize.width, resizeStart.current.width + deltaX),
        height: Math.max(minSize.height, resizeStart.current.height + deltaY),
      }));
    },
    [isResizing, minSize.width, minSize.height]
  );

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Global pointer event listeners
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

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("pointermove", handleResizeMove);
      document.addEventListener("pointerup", handleResizeEnd);
      return () => {
        document.removeEventListener("pointermove", handleResizeMove);
        document.removeEventListener("pointerup", handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  // Toggle maximize
  const handleMaximize = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isMaximized: !prev.isMaximized,
    }));
  }, []);

  // Double-click title to maximize
  const handleTitleDoubleClick = useCallback(() => {
    handleMaximize();
  }, [handleMaximize]);

  // Don't render if minimized (after animation completes)
  if (isMinimized && !isMinimizing) {
    return null;
  }

  const windowStyle = state.isMaximized
    ? {
        left: 0,
        top: 28,
        width: "100%",
        height: "calc(100vh - 28px - 80px)",
        zIndex,
      }
    : {
        left: state.x,
        top: state.y,
        width: state.width,
        height: state.height,
        zIndex,
      };

  // Calculate genie animation styles
  const genieStyle = isMinimizing && genieTarget ? {
    "--genie-target-x": `${genieTarget.x - state.x - state.width / 2}px`,
    "--genie-target-y": `${genieTarget.y - state.y - state.height / 2}px`,
  } as React.CSSProperties : {};

  const restoreStyle = isRestoring && genieTarget ? {
    "--genie-start-x": `${genieTarget.x - state.x - state.width / 2}px`,
    "--genie-start-y": `${genieTarget.y - state.y - state.height / 2}px`,
  } as React.CSSProperties : {};

  return (
    <div
      ref={windowRef}
      className={cn(
        "absolute flex flex-col overflow-hidden",
        "bg-glass-bg/90 backdrop-blur-xl border border-glass-border rounded-xl",
        "shadow-window transition-shadow duration-200",
        isActive && "shadow-window-active ring-1 ring-macos-accent-blue/30",
        state.isMaximized && "rounded-none",
        !isMinimizing && !isRestoring && "animate-window-open",
        isMinimizing && "animate-genie-minimize",
        isRestoring && "animate-genie-restore"
      )}
      style={{ ...windowStyle, ...genieStyle, ...restoreStyle }}
      onClick={onFocus}
      role="dialog"
      aria-label={title}
    >
      {/* Title Bar */}
      <div
        className={cn(
          "flex items-center h-10 px-3 gap-2",
          "bg-gradient-to-b from-white/[0.08] to-transparent",
          "border-b border-glass-border/50",
          "select-none cursor-default",
          !state.isMaximized && "cursor-grab",
          isDragging && "cursor-grabbing"
        )}
        onPointerDown={handleDragStart}
        onDoubleClick={handleTitleDoubleClick}
      >
        {/* Traffic Lights */}
        <div className="flex items-center gap-2 group">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-150",
              "bg-macos-traffic-red hover:bg-macos-traffic-red/80",
              "flex items-center justify-center",
              "focus:outline-none focus:ring-2 focus:ring-macos-traffic-red/50"
            )}
            aria-label="Close window"
          >
            <X className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMinimizeWithGenie();
            }}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-150",
              "bg-macos-traffic-yellow hover:bg-macos-traffic-yellow/80",
              "flex items-center justify-center",
              "focus:outline-none focus:ring-2 focus:ring-macos-traffic-yellow/50"
            )}
            aria-label="Minimize window"
          >
            <Minus className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMaximize();
            }}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-150",
              "bg-macos-traffic-green hover:bg-macos-traffic-green/80",
              "flex items-center justify-center",
              "focus:outline-none focus:ring-2 focus:ring-macos-traffic-green/50"
            )}
            aria-label={state.isMaximized ? "Exit fullscreen" : "Enter fullscreen"}
          >
            <Maximize2 className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Window Title */}
        <div className="flex-1 text-center">
          <span className="text-sm font-medium text-foreground/80">{title}</span>
        </div>

        {/* Spacer to balance traffic lights */}
        <div className="w-14" />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4">{children}</div>

      {/* Resize Handle */}
      {!state.isMaximized && (
        <div
          className={cn(
            "absolute bottom-0 right-0 w-4 h-4 cursor-se-resize",
            "hover:bg-white/10 rounded-tl transition-colors"
          )}
          onPointerDown={handleResizeStart}
          aria-label="Resize window"
        />
      )}
    </div>
  );
};

export default Window;
