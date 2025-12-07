import { useState, useEffect } from "react";
import { Palette, Accessibility, RotateCcw, Sun, Moon, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useWallpaper, WALLPAPERS, THEME_WALLPAPERS } from "@/contexts/WallpaperContext";

interface SettingsState {
  accentColor: string;
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: "small" | "medium" | "large";
}

const ACCENT_COLORS = [
  { name: "Blue", value: "211 100% 50%", class: "bg-[hsl(211,100%,50%)]" },
  { name: "Purple", value: "280 80% 60%", class: "bg-[hsl(280,80%,60%)]" },
  { name: "Pink", value: "330 80% 60%", class: "bg-[hsl(330,80%,60%)]" },
  { name: "Orange", value: "25 95% 55%", class: "bg-[hsl(25,95%,55%)]" },
  { name: "Green", value: "140 70% 45%", class: "bg-[hsl(140,70%,45%)]" },
  { name: "Cyan", value: "185 90% 45%", class: "bg-[hsl(185,90%,45%)]" },
];

const DEFAULT_SETTINGS: SettingsState = {
  accentColor: "211 100% 50%",
  reducedMotion: false,
  highContrast: false,
  fontSize: "medium",
};

const STORAGE_KEY = "mac_portfolio.settings";

export const SettingsWindow = () => {
  const { theme, setTheme } = useTheme();
  const { currentWallpaper, setWallpaper, wallpapers } = useWallpaper();
  
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [activeTab, setActiveTab] = useState<"appearance" | "wallpaper" | "accessibility">("appearance");

  // Apply settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    // Apply accent color
    document.documentElement.style.setProperty("--primary", settings.accentColor);
    document.documentElement.style.setProperty("--ring", settings.accentColor);
    document.documentElement.style.setProperty("--macos-accent-blue", settings.accentColor);

    // Apply reduced motion
    if (settings.reducedMotion) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }

    // Apply high contrast
    if (settings.highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }

    // Apply font size via class
    document.documentElement.classList.remove("font-small", "font-medium", "font-large");
    document.documentElement.classList.add(`font-${settings.fontSize}`);
  }, [settings]);

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setTheme("dark");
    setWallpaper("auto");
  };

  // Get wallpaper preview style
  const getWallpaperStyle = (wallpaper: typeof WALLPAPERS[0]) => {
    if (wallpaper.id === "auto") {
      // Show the current theme's wallpaper as preview
      const themeWallpaper = THEME_WALLPAPERS[theme];
      return themeWallpaper.type === "image" 
        ? { backgroundImage: `url(${themeWallpaper.value})`, backgroundSize: "cover", backgroundPosition: "center" }
        : { background: themeWallpaper.value };
    }
    return wallpaper.type === "image" 
      ? { backgroundImage: `url(${wallpaper.value})`, backgroundSize: "cover", backgroundPosition: "center" }
      : { background: wallpaper.value };
  };

  const tabs = [
    { id: "appearance" as const, label: "Appearance", icon: Palette },
    { id: "wallpaper" as const, label: "Wallpaper", icon: Image },
    { id: "accessibility" as const, label: "Accessibility", icon: Accessibility },
  ];

  return (
    <div className="flex flex-col sm:flex-row h-full text-foreground">
      {/* Sidebar */}
      <nav
        className="sm:w-48 border-b sm:border-b-0 sm:border-r border-border/50 p-2 sm:p-3 flex sm:flex-col gap-1 overflow-x-auto sm:overflow-x-visible"
        role="tablist"
        aria-label="Settings categories"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeTab === tab.id
                ? "bg-primary/20 text-primary"
                : "hover:bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 overflow-auto">
        {/* Appearance Tab */}
        {activeTab === "appearance" && (
          <div
            id="appearance-panel"
            role="tabpanel"
            aria-labelledby="appearance-tab"
            className="space-y-6 animate-fade-in"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/20">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
                <p className="text-sm text-muted-foreground">
                  Customize how the portfolio looks
                </p>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Theme</label>
              <div className="flex gap-3" role="radiogroup" aria-label="Theme">
                <button
                  role="radio"
                  aria-checked={theme === "light"}
                  onClick={() => setTheme("light")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-lg border transition-all",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    theme === "light"
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-secondary/50 hover:bg-secondary text-foreground"
                  )}
                >
                  <Sun className="w-5 h-5" />
                  <span className="text-sm font-medium">Light</span>
                </button>
                <button
                  role="radio"
                  aria-checked={theme === "dark"}
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-lg border transition-all",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    theme === "dark"
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-secondary/50 hover:bg-secondary text-foreground"
                  )}
                >
                  <Moon className="w-5 h-5" />
                  <span className="text-sm font-medium">Dark</span>
                </button>
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Accent Color</label>
              <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Accent color">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color.name}
                    role="radio"
                    aria-checked={settings.accentColor === color.value}
                    aria-label={color.name}
                    onClick={() => setSettings((s) => ({ ...s, accentColor: color.value }))}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all",
                      color.class,
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      settings.accentColor === color.value
                        ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110"
                        : "hover:scale-105"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Wallpaper Tab */}
        {activeTab === "wallpaper" && (
          <div
            id="wallpaper-panel"
            role="tabpanel"
            aria-labelledby="wallpaper-tab"
            className="space-y-6 animate-fade-in"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/20">
                <Image className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Wallpaper</h2>
                <p className="text-sm text-muted-foreground">
                  Choose your desktop wallpaper
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {wallpapers.map((wallpaper) => (
                <button
                  key={wallpaper.id}
                  onClick={() => setWallpaper(wallpaper.id)}
                  className={cn(
                    "relative aspect-video rounded-lg overflow-hidden transition-all",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    currentWallpaper.id === wallpaper.id
                      ? "ring-2 ring-primary scale-[1.02]"
                      : "hover:scale-[1.02] opacity-80 hover:opacity-100"
                  )}
                  aria-label={wallpaper.name}
                  aria-pressed={currentWallpaper.id === wallpaper.id}
                >
                  <div
                    className="absolute inset-0"
                    style={getWallpaperStyle(wallpaper)}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                    <span className="text-xs text-white font-medium">{wallpaper.name}</span>
                  </div>
                  {wallpaper.id === "auto" && (
                    <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-primary/80 rounded text-[10px] text-white font-medium">
                      Auto
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Accessibility Tab */}
        {activeTab === "accessibility" && (
          <div
            id="accessibility-panel"
            role="tabpanel"
            aria-labelledby="accessibility-tab"
            className="space-y-6 animate-fade-in"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/20">
                <Accessibility className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Accessibility</h2>
                <p className="text-sm text-muted-foreground">
                  Make the portfolio easier to use
                </p>
              </div>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <div className="space-y-0.5">
                <label htmlFor="reduced-motion" className="text-sm font-medium text-foreground">
                  Reduce Motion
                </label>
                <p className="text-xs text-muted-foreground">
                  Minimize animations and transitions
                </p>
              </div>
              <button
                id="reduced-motion"
                role="switch"
                aria-checked={settings.reducedMotion}
                onClick={() =>
                  setSettings((s) => ({ ...s, reducedMotion: !s.reducedMotion }))
                }
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  settings.reducedMotion ? "bg-primary" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                    settings.reducedMotion && "translate-x-5"
                  )}
                />
              </button>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <div className="space-y-0.5">
                <label htmlFor="high-contrast" className="text-sm font-medium text-foreground">
                  High Contrast
                </label>
                <p className="text-xs text-muted-foreground">
                  Increase color contrast for better visibility
                </p>
              </div>
              <button
                id="high-contrast"
                role="switch"
                aria-checked={settings.highContrast}
                onClick={() =>
                  setSettings((s) => ({ ...s, highContrast: !s.highContrast }))
                }
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  settings.highContrast ? "bg-primary" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                    settings.highContrast && "translate-x-5"
                  )}
                />
              </button>
            </div>

            {/* Font Size */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Text Size</label>
              <div className="flex gap-2" role="radiogroup" aria-label="Text size">
                {(["small", "medium", "large"] as const).map((size) => (
                  <button
                    key={size}
                    role="radio"
                    aria-checked={settings.fontSize === size}
                    onClick={() => setSettings((s) => ({ ...s, fontSize: size }))}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm capitalize transition-colors",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      settings.fontSize === size
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Current: {settings.fontSize === "small" ? "14px" : settings.fontSize === "medium" ? "16px" : "18px"}
              </p>
            </div>
          </div>
        )}

        {/* Reset Button */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <button
            onClick={handleReset}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm",
              "bg-destructive/10 text-destructive hover:bg-destructive/20",
              "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsWindow;
