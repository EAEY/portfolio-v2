import { useState, useEffect, useCallback, useRef } from "react";
import {
  Wifi,
  Bluetooth,
  Moon,
  Plane,
  Sun,
  Volume2,
  X,
  Radio,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Toggle {
  id: string;
  icon: React.ElementType;
  label: string;
  defaultActive?: boolean;
  color?: string;
}

const CONNECTIVITY_TOGGLES: Toggle[] = [
  { id: "airplane", icon: Plane, label: "Airplane Mode", color: "bg-[#ff9500]" },
  { id: "cellular", icon: Radio, label: "Cellular", color: "bg-[#30d158]" },
  { id: "wifi", icon: Wifi, label: "Wi-Fi", defaultActive: true, color: "bg-[#007aff]" },
  { id: "bluetooth", icon: Bluetooth, label: "Bluetooth", defaultActive: true, color: "bg-[#007aff]" },
  { id: "airdrop", icon: Smartphone, label: "AirDrop", color: "bg-[#007aff]" },
  { id: "hotspot", icon: Radio, label: "Personal Hotspot", color: "bg-[#30d158]" },
];

const FOCUS_TOGGLES: Toggle[] = [
  { id: "dnd", icon: Moon, label: "Do Not Disturb", color: "bg-[#5e5ce6]" },
];

export const ControlCenter = ({ isOpen, onClose }: ControlCenterProps) => {
  const { theme, setTheme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => ({
    airplane: false,
    cellular: true,
    wifi: true,
    bluetooth: true,
    airdrop: false,
    hotspot: false,
    dnd: false,
  }));
  
  const [brightness, setBrightness] = useState(75);
  const [volume, setVolume] = useState(50);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      containerRef.current.focus();
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (reducedMotion) {
      onClose();
    } else {
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
        onClose();
      }, 280);
    }
  }, [onClose, reducedMotion]);

  const handleToggle = useCallback((id: string) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleThemeToggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  if (!isOpen && !isClosing) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/30 backdrop-blur-md",
          !reducedMotion && (isClosing ? "animate-fade-out" : "animate-fade-in")
        )}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Control Center Panel */}
      <div
        ref={containerRef}
        tabIndex={-1}
        className={cn(
          "fixed top-0 left-0 right-0 z-[65] max-h-[70vh] overflow-y-auto",
          "rounded-b-[32px]",
          "px-4 pt-14 pb-8",
          !reducedMotion && (isClosing ? "animate-cc-slide-up" : "animate-cc-slide-down")
        )}
        style={{
          background: "rgba(30, 30, 30, 0.7)",
          backdropFilter: "blur(50px) saturate(180%)",
          WebkitBackdropFilter: "blur(50px) saturate(180%)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Control Center"
      >
        {/* Close indicator */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/30 rounded-full" />

        {/* Top Grid - Connectivity & Focus */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Connectivity Panel */}
          <div 
            className="rounded-[18px] p-3 grid grid-cols-2 gap-3"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            {CONNECTIVITY_TOGGLES.slice(0, 4).map((toggle) => (
              <button
                key={toggle.id}
                onClick={() => handleToggle(toggle.id)}
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center transition-all",
                  toggles[toggle.id] ? toggle.color : "bg-white/20"
                )}
                aria-pressed={toggles[toggle.id]}
                aria-label={toggle.label}
              >
                <toggle.icon className="w-5 h-5 text-white" strokeWidth={2} />
              </button>
            ))}
          </div>

          {/* Focus & Display Panel */}
          <div className="flex flex-col gap-3">
            {/* Focus Mode */}
            <button
              onClick={() => handleToggle("dnd")}
              className={cn(
                "flex-1 rounded-[18px] p-3 flex items-center gap-3 transition-all",
                toggles["dnd"] ? "bg-[#5e5ce6]" : "bg-white/10"
              )}
              aria-pressed={toggles["dnd"]}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                toggles["dnd"] ? "bg-white/20" : "bg-white/10"
              )}>
                <Moon className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-white text-[13px] font-medium">Focus</p>
                <p className="text-white/60 text-[11px]">{toggles["dnd"] ? "On" : "Off"}</p>
              </div>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="flex-1 rounded-[18px] p-3 flex items-center gap-3 bg-white/10"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffd60a] to-[#ff9f0a] flex items-center justify-center">
                <Sun className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-white text-[13px] font-medium">Appearance</p>
                <p className="text-white/60 text-[11px]">{theme === "dark" ? "Dark" : "Light"}</p>
              </div>
            </button>
          </div>
        </div>

        {/* Brightness Slider */}
        <div 
          className="rounded-[18px] p-4 mb-3 relative overflow-hidden"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          <div 
            className="absolute inset-0 bg-white/30"
            style={{ width: `${brightness}%` }}
          />
          <div className="relative flex items-center gap-3">
            <Sun className="w-5 h-5 text-white flex-shrink-0" />
            <input
              type="range"
              min="0"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="flex-1 h-full opacity-0 cursor-pointer"
              aria-label="Brightness"
            />
          </div>
        </div>

        {/* Volume Slider */}
        <div 
          className="rounded-[18px] p-4 mb-4 relative overflow-hidden"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          <div 
            className="absolute inset-0 bg-white/30"
            style={{ width: `${volume}%` }}
          />
          <div className="relative flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-white flex-shrink-0" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1 h-full opacity-0 cursor-pointer"
              aria-label="Volume"
            />
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Plane, label: "Airplane", id: "airplane" },
          ].map((action) => (
            <button
              key={action.id}
              onClick={() => handleToggle(action.id)}
              className={cn(
                "aspect-square rounded-[18px] flex flex-col items-center justify-center gap-1 transition-all",
                toggles[action.id] ? "bg-[#ff9500]" : "bg-white/10"
              )}
              aria-pressed={toggles[action.id]}
            >
              <action.icon className="w-6 h-6 text-white" />
              <span className="text-[10px] text-white/80">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ControlCenter;
