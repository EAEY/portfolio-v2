import { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { useHomeScreen, AppIcon as AppIconType } from "@/contexts/HomeScreenContext";
import { useMobileWallpaper } from "@/contexts/MobileWallpaperContext";
import { DockItemId } from "@/components/macos/Dock";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import IOSStatusBar from "./IOSStatusBar";
import IOSLockScreen from "./IOSLockScreen";
import AppGrid from "./AppGrid";
import IOSDock from "./IOSDock";
import QuickActionsMenu from "./QuickActionsMenu";
import FullScreenApp from "./FullScreenApp";
import ControlCenter from "./ControlCenter";
import SpotlightSearch from "./SpotlightSearch";

interface IOSHomeScreenProps {
  onBootComplete?: () => void;
}

export const IOSHomeScreen = ({ onBootComplete }: IOSHomeScreenProps) => {
  const { currentWallpaper } = useMobileWallpaper();
  const { setEditMode } = useHomeScreen();
  const reducedMotion = usePrefersReducedMotion();
  
  const [isLocked, setIsLocked] = useState(true);
  const [activeApp, setActiveApp] = useState<DockItemId | "settings" | null>(null);
  const [launchRect, setLaunchRect] = useState<DOMRect | undefined>();
  const [quickActionsMenu, setQuickActionsMenu] = useState<{
    app: AppIconType;
    position: { x: number; y: number };
  } | null>(null);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  const iconRefs = useRef<Map<string, DOMRect>>(new Map());

  // Handle unlock
  const handleUnlock = useCallback(() => {
    setIsLocked(false);
  }, []);

  // Handle app tap
  const handleAppTap = useCallback((id: string, rect?: DOMRect) => {
    if (id === "github") {
      window.open("https://github.com/EAEY/", "_blank");
      return;
    }
    if (id === "linkedin") {
      window.open("https://www.linkedin.com/in/eyad-ayman-32a9272aa/", "_blank");
      return;
    }

    if (rect) {
      iconRefs.current.set(id, rect);
      setLaunchRect(rect);
    }
    setActiveApp(id as DockItemId | "settings");
  }, []);

  // Handle long press
  const handleLongPress = useCallback((app: AppIconType, rect: DOMRect) => {
    iconRefs.current.set(app.id, rect);
    setLaunchRect(rect);
    setQuickActionsMenu({
      app,
      position: { x: rect.left, y: rect.bottom + 8 },
    });
  }, []);

  // Handle quick action
  const handleQuickAction = useCallback((appId: string, actionId: string) => {
    const rect = iconRefs.current.get(appId);
    if (rect) setLaunchRect(rect);
    setActiveApp(appId as DockItemId | "settings");
    setQuickActionsMenu(null);
  }, []);

  // Close active app
  const handleCloseApp = useCallback(() => {
    setActiveApp(null);
    setLaunchRect(undefined);
  }, []);

  // Enter edit mode
  const handleEnterEditMode = useCallback(() => {
    setEditMode(true);
    setQuickActionsMenu(null);
  }, [setEditMode]);

  // Control center
  const handleOpenControlCenter = useCallback(() => {
    setIsControlCenterOpen(true);
  }, []);

  // Spotlight search
  const handleOpenSpotlight = useCallback(() => {
    setIsSpotlightOpen(true);
  }, []);

  const handleSpotlightSelect = useCallback((appId: string) => {
    setIsSpotlightOpen(false);
    handleAppTap(appId);
  }, [handleAppTap]);

  // Show lock screen if locked
  if (isLocked) {
    return <IOSLockScreen onUnlock={handleUnlock} />;
  }

  return (
    <div
      className={cn("fixed inset-0 flex flex-col overflow-hidden ios-home-screen")}
      style={{
        backgroundImage: `url(${currentWallpaper.homescreen})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-black/5 pointer-events-none" />

      {/* Status Bar */}
      <IOSStatusBar onSwipeDown={handleOpenControlCenter} />

      {/* Spotlight Search Trigger Area */}
      <div className="pt-14 pb-3 px-5">
        <button 
          onClick={handleOpenSpotlight}
          className={cn(
            "w-full py-2 px-4 rounded-xl",
            "bg-white/10 backdrop-blur-xl",
            "border border-white/10",
            "text-white/50 text-[15px] font-normal",
            "flex items-center justify-center gap-2",
            "active:bg-white/15 transition-colors"
          )}
          aria-label="Search"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search
        </button>
      </div>

      {/* App Grid */}
      <AppGrid onAppTap={handleAppTap} onLongPress={handleLongPress} />

      {/* Dock */}
      <IOSDock onAppTap={handleAppTap} onLongPress={handleLongPress} />

      {/* Quick Actions Menu */}
      {quickActionsMenu && (
        <QuickActionsMenu
          app={quickActionsMenu.app}
          position={quickActionsMenu.position}
          onAction={handleQuickAction}
          onClose={() => setQuickActionsMenu(null)}
          onEnterEditMode={handleEnterEditMode}
        />
      )}

      {/* Spotlight Search */}
      <SpotlightSearch
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        onSelect={handleSpotlightSelect}
      />

      {/* Control Center */}
      <ControlCenter
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
      />

      {/* Full Screen App */}
      {activeApp && (
        <FullScreenApp
          appId={activeApp}
          onClose={handleCloseApp}
          launchRect={launchRect}
        />
      )}
    </div>
  );
};

export default IOSHomeScreen;
