import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Sun, Moon, Image, Check, Lock, Home } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useMobileWallpaper, MOBILE_WALLPAPERS, MobileWallpaper } from "@/contexts/MobileWallpaperContext";

type SettingsView = "main" | "appearance" | "wallpaper" | "wallpaper-lock" | "wallpaper-home";

interface SettingsRowProps {
  icon?: React.ReactNode;
  iconBg?: string;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  rightElement?: React.ReactNode;
  showArrow?: boolean;
}

const SettingsRow = ({ 
  icon, 
  iconBg = "bg-[#8e8e93]", 
  title, 
  subtitle,
  onClick, 
  rightElement,
  showArrow = true,
}: SettingsRowProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3",
      "bg-white/10 backdrop-blur-xl",
      "active:bg-white/20 transition-colors",
      "first:rounded-t-xl last:rounded-b-xl",
      "border-b border-white/10 last:border-0"
    )}
  >
    {icon && (
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", iconBg)}>
        {icon}
      </div>
    )}
    <div className="flex-1 text-left">
      <span className="text-white text-[17px]">{title}</span>
      {subtitle && <p className="text-white/50 text-[13px]">{subtitle}</p>}
    </div>
    {rightElement}
    {showArrow && onClick && (
      <ChevronRight className="w-5 h-5 text-white/40" />
    )}
  </button>
);

const WallpaperPreview = ({ 
  wallpaper, 
  type,
  isSelected,
  onSelect,
}: { 
  wallpaper: MobileWallpaper;
  type: "lockscreen" | "homescreen";
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <button
    onClick={onSelect}
    className={cn(
      "relative aspect-[9/19] rounded-2xl overflow-hidden",
      "border-2 transition-all",
      isSelected ? "border-[#007aff] scale-[1.02]" : "border-white/20"
    )}
  >
    <img
      src={type === "lockscreen" ? wallpaper.lockscreen : wallpaper.homescreen}
      alt={wallpaper.name}
      className="w-full h-full object-cover"
    />
    {isSelected && (
      <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-[#007aff] flex items-center justify-center">
        <Check className="w-4 h-4 text-white" />
      </div>
    )}
    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
      <span className="text-white text-[13px] font-medium">{wallpaper.name}</span>
    </div>
  </button>
);

export const MobileSettingsApp = () => {
  const [view, setView] = useState<SettingsView>("main");
  const { theme, setTheme } = useTheme();
  const { currentWallpaper, setWallpaper, wallpapers } = useMobileWallpaper();

  const renderHeader = (title: string, onBack: () => void) => (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
      <button 
        onClick={onBack}
        className="flex items-center gap-1 text-[#007aff] active:opacity-70"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-[17px]">Back</span>
      </button>
      <h1 className="text-white text-[17px] font-semibold absolute left-1/2 -translate-x-1/2">
        {title}
      </h1>
    </div>
  );

  // Main settings view
  if (view === "main") {
    return (
      <div className="h-full bg-black/90 backdrop-blur-xl overflow-auto">
        {/* Header */}
        <div className="px-4 pt-16 pb-4">
          <h1 className="text-white text-[34px] font-bold">Settings</h1>
        </div>

        {/* Settings sections */}
        <div className="px-4 space-y-6">
          {/* Appearance section */}
          <div className="rounded-xl overflow-hidden">
            <SettingsRow
              icon={<Sun className="w-5 h-5 text-white" />}
              iconBg="bg-gradient-to-br from-[#ff9500] to-[#ff3b30]"
              title="Appearance"
              subtitle={theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System"}
              onClick={() => setView("appearance")}
            />
          </div>

          {/* Wallpaper section */}
          <div className="rounded-xl overflow-hidden">
            <SettingsRow
              icon={<Image className="w-5 h-5 text-white" />}
              iconBg="bg-gradient-to-br from-[#5856d6] to-[#007aff]"
              title="Wallpaper"
              subtitle="Customize your screens"
              onClick={() => setView("wallpaper")}
            />
          </div>

          {/* Current wallpaper preview */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4">
            <h3 className="text-white/60 text-[13px] uppercase tracking-wide mb-3">
              Current Wallpaper
            </h3>
            <div className="flex gap-4 justify-center">
              <div className="text-center">
                <div className="w-20 h-40 rounded-xl overflow-hidden border border-white/20 mb-2">
                  <img
                    src={currentWallpaper.lockscreen}
                    alt="Lock screen"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-white/60 text-[11px]">Lock Screen</span>
              </div>
              <div className="text-center">
                <div className="w-20 h-40 rounded-xl overflow-hidden border border-white/20 mb-2">
                  <img
                    src={currentWallpaper.homescreen}
                    alt="Home screen"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-white/60 text-[11px]">Home Screen</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Appearance view
  if (view === "appearance") {
    return (
      <div className="h-full bg-black/90 backdrop-blur-xl overflow-auto relative">
        {renderHeader("Appearance", () => setView("main"))}

        <div className="px-4 pt-6 space-y-6">
          <div className="rounded-xl overflow-hidden">
            <SettingsRow
              icon={<Sun className="w-5 h-5 text-white" />}
              iconBg="bg-[#ffcc00]"
              title="Light"
              onClick={() => setTheme("light")}
              showArrow={false}
              rightElement={
                theme === "light" && <Check className="w-5 h-5 text-[#007aff]" />
              }
            />
            <SettingsRow
              icon={<Moon className="w-5 h-5 text-white" />}
              iconBg="bg-[#5856d6]"
              title="Dark"
              onClick={() => setTheme("dark")}
              showArrow={false}
              rightElement={
                theme === "dark" && <Check className="w-5 h-5 text-[#007aff]" />
              }
            />
          </div>
        </div>
      </div>
    );
  }

  // Wallpaper selection view
  if (view === "wallpaper") {
    return (
      <div className="h-full bg-black/90 backdrop-blur-xl overflow-auto relative">
        {renderHeader("Wallpaper", () => setView("main"))}

        <div className="px-4 pt-6 space-y-4">
          <p className="text-white/60 text-[13px] text-center">
            Choose which screen to customize
          </p>

          <div className="rounded-xl overflow-hidden">
            <SettingsRow
              icon={<Lock className="w-5 h-5 text-white" />}
              iconBg="bg-[#ff3b30]"
              title="Lock Screen"
              onClick={() => setView("wallpaper-lock")}
            />
            <SettingsRow
              icon={<Home className="w-5 h-5 text-white" />}
              iconBg="bg-[#34c759]"
              title="Home Screen"
              onClick={() => setView("wallpaper-home")}
            />
          </div>
        </div>
      </div>
    );
  }

  // Lock screen wallpaper picker
  if (view === "wallpaper-lock" || view === "wallpaper-home") {
    const type = view === "wallpaper-lock" ? "lockscreen" : "homescreen";
    const title = view === "wallpaper-lock" ? "Lock Screen" : "Home Screen";

    return (
      <div className="h-full bg-black/90 backdrop-blur-xl overflow-auto relative">
        {renderHeader(title, () => setView("wallpaper"))}

        <div className="px-4 pt-6">
          <div className="grid grid-cols-2 gap-4">
            {wallpapers.map((wallpaper) => (
              <WallpaperPreview
                key={wallpaper.id}
                wallpaper={wallpaper}
                type={type}
                isSelected={currentWallpaper.id === wallpaper.id}
                onSelect={() => setWallpaper(wallpaper.id)}
              />
            ))}
          </div>

          <p className="text-white/40 text-[13px] text-center mt-6">
            More wallpapers coming soon
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default MobileSettingsApp;