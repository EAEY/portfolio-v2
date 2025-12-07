import { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useHomeScreen, AppIcon as AppIconType } from "@/contexts/HomeScreenContext";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import AppIcon from "./AppIcon";

interface AppGridProps {
  onAppTap: (id: string, rect?: DOMRect) => void;
  onLongPress: (app: AppIconType, rect: DOMRect) => void;
}

const APPS_PER_PAGE = 20; // 4 columns x 5 rows

export const AppGrid = ({ onAppTap, onLongPress }: AppGridProps) => {
  const { state, setCurrentPage, isEditMode, reorderGridApps } = useHomeScreen();
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  
  // Drag and drop state
  const [draggingApp, setDraggingApp] = useState<AppIconType | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);

  const visibleApps = state.gridApps.filter(
    (app) => !state.hiddenApps.includes(app.id)
  );

  const totalPages = Math.max(1, Math.ceil(visibleApps.length / APPS_PER_PAGE));
  const pages = Array.from({ length: totalPages }, (_, pageIndex) =>
    visibleApps.slice(pageIndex * APPS_PER_PAGE, (pageIndex + 1) * APPS_PER_PAGE)
  );

  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (draggingApp) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setSwipeOffset(0);
  }, [draggingApp]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (draggingApp) return;
    const currentX = e.targetTouches[0].clientX;
    setTouchEnd(currentX);
    
    if (touchStart !== null) {
      const diff = currentX - touchStart;
      const maxOffset = window.innerWidth * 0.3;
      const resistance = 0.4;
      let offset = diff * resistance;
      
      if ((state.currentPage === 0 && diff > 0) || 
          (state.currentPage === totalPages - 1 && diff < 0)) {
        offset *= 0.3;
      }
      
      setSwipeOffset(Math.max(-maxOffset, Math.min(maxOffset, offset)));
    }
  }, [touchStart, state.currentPage, totalPages, draggingApp]);

  const onTouchEnd = useCallback(() => {
    if (draggingApp) return;
    
    if (!touchStart || !touchEnd) {
      setSwipeOffset(0);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && state.currentPage < totalPages - 1) {
      setCurrentPage(state.currentPage + 1);
    }
    if (isRightSwipe && state.currentPage > 0) {
      setCurrentPage(state.currentPage - 1);
    }
    
    setSwipeOffset(0);
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, state.currentPage, totalPages, setCurrentPage, draggingApp]);

  // Drag handlers for edit mode
  const handleDragStart = useCallback((app: AppIconType, rect: DOMRect) => {
    setDraggingApp(app);
    setDragPosition({ x: rect.left, y: rect.top });
  }, []);

  const handleDragMove = useCallback((e: React.TouchEvent) => {
    if (!draggingApp || !dragPosition) return;
    
    const touch = e.touches[0];
    setDragPosition({ x: touch.clientX - 30, y: touch.clientY - 30 });
  }, [draggingApp, dragPosition]);

  const handleDragEnd = useCallback((e: React.TouchEvent) => {
    if (!draggingApp) return;
    
    // Find drop target based on position
    const dropX = e.changedTouches[0].clientX;
    const dropY = e.changedTouches[0].clientY;
    
    // Find which icon we're dropping on
    const currentIndex = visibleApps.findIndex(a => a.id === draggingApp.id);
    let targetIndex = currentIndex;
    
    // Simple grid-based calculation
    const gridElement = containerRef.current?.querySelector('.grid');
    if (gridElement) {
      const icons = gridElement.querySelectorAll('button');
      icons.forEach((icon, index) => {
        const rect = icon.getBoundingClientRect();
        if (dropX >= rect.left && dropX <= rect.right && 
            dropY >= rect.top && dropY <= rect.bottom) {
          targetIndex = index;
        }
      });
    }
    
    if (targetIndex !== currentIndex && targetIndex >= 0) {
      reorderGridApps(currentIndex, targetIndex);
    }
    
    setDraggingApp(null);
    setDragPosition(null);
  }, [draggingApp, visibleApps, reorderGridApps]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && state.currentPage > 0) {
        setCurrentPage(state.currentPage - 1);
      } else if (e.key === "ArrowRight" && state.currentPage < totalPages - 1) {
        setCurrentPage(state.currentPage + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.currentPage, totalPages, setCurrentPage]);

  return (
    <div 
      className="flex-1 flex flex-col overflow-hidden"
      onTouchMove={isEditMode ? handleDragMove : undefined}
      onTouchEnd={isEditMode ? handleDragEnd : undefined}
    >
      {/* Pages container */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className={cn(
            "flex h-full",
            !reducedMotion && swipeOffset === 0 && "transition-transform duration-300"
          )}
          style={{
            transform: `translateX(calc(-${state.currentPage * 100}% + ${swipeOffset}px))`,
            width: `${totalPages * 100}%`,
            transitionTimingFunction: "cubic-bezier(0.2, 0.9, 0.2, 1)",
          }}
        >
          {pages.map((pageApps, pageIndex) => (
            <div
              key={pageIndex}
              className="flex-shrink-0 h-full px-4"
              style={{ width: `${100 / totalPages}%` }}
            >
              <div className="grid grid-cols-4 gap-y-5 gap-x-2 justify-items-center content-start pt-2">
                {pageApps.map((app) => (
                  <AppIcon
                    key={app.id}
                    app={app}
                    onTap={onAppTap}
                    onLongPress={onLongPress}
                    isDragging={draggingApp?.id === app.id}
                    onDragStart={isEditMode ? handleDragStart : undefined}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Dragging icon overlay */}
        {draggingApp && dragPosition && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              left: dragPosition.x,
              top: dragPosition.y,
              transform: "scale(1.15)",
            }}
          >
            <div
              className="w-[60px] h-[60px] overflow-hidden shadow-2xl"
              style={{ borderRadius: 60 * 0.22 }}
            >
              <img
                src={draggingApp.icon}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Page indicator dots */}
      {totalPages > 1 && (
        <div
          className="flex justify-center gap-2 py-2"
          role="tablist"
          aria-label="Home screen pages"
        >
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "rounded-full transition-all duration-300",
                index === state.currentPage
                  ? "w-[7px] h-[7px] bg-white"
                  : "w-[6px] h-[6px] bg-white/40"
              )}
              onClick={() => setCurrentPage(index)}
              role="tab"
              aria-selected={index === state.currentPage}
              aria-label={`Page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppGrid;
