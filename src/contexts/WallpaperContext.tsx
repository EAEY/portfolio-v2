import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useTheme } from "./ThemeContext";

// Wallpaper definitions
export interface Wallpaper {
  id: string;
  name: string;
  type: "gradient" | "image";
  value: string; // CSS gradient or image URL
  forTheme?: "light" | "dark" | "both";
}

// Theme-specific wallpapers
export const THEME_WALLPAPERS: Record<"light" | "dark", Wallpaper> = {
  dark: {
    id: "theme-dark",
    name: "Eyad Dark",
    type: "image",
    value: "src/assets/wallpapers/wallpaper-dark.png", 
    forTheme: "dark",
  },
  light: {
    id: "theme-light",
    name: "Eyad Light",
    type: "image",
    value: "src/assets/wallpapers/wallpaper-light.png",
    forTheme: "light",
  },
};

export const WALLPAPERS: Wallpaper[] = [
  // Theme-matching wallpapers
  {
    id: "auto",
    name: "Auto (Theme)",
    type: "image",
    value: "", 
    forTheme: "both",
  },
  // Dark wallpapers
  THEME_WALLPAPERS.dark,
  {
    id: "aurora",
    name: "Aurora",
    type: "gradient",
    value: "linear-gradient(135deg, hsl(220, 60%, 12%) 0%, hsl(260, 40%, 15%) 50%, hsl(200, 50%, 10%) 100%)",
    forTheme: "dark",
  },
  {
    id: "ocean",
    name: "Ocean",
    type: "gradient",
    value: "linear-gradient(135deg, hsl(200, 70%, 15%) 0%, hsl(180, 60%, 12%) 50%, hsl(220, 50%, 18%) 100%)",
    forTheme: "dark",
  },
  {
    id: "midnight",
    name: "Midnight",
    type: "gradient",
    value: "linear-gradient(135deg, hsl(240, 50%, 8%) 0%, hsl(260, 40%, 12%) 50%, hsl(220, 60%, 6%) 100%)",
    forTheme: "dark",
  },
  {
    id: "cosmic",
    name: "Cosmic",
    type: "gradient",
    value: "linear-gradient(135deg, hsl(280, 60%, 15%) 0%, hsl(320, 50%, 12%) 50%, hsl(260, 40%, 18%) 100%)",
    forTheme: "dark",
  },
  // YOUR NEW WALLPAPER
  {
    id: "wallpaper-1",
    name: "Tahoe Beach",
    type: "image",
    value: "/assets/wallpapers/tahoe-beach-night.png", // Ensure this file exists in public/assets/wallpapers/
    forTheme: "both",
  },
  {
    id: "wallpaper-2",
    name: "Space Black",
    type: "image",
    value: "/assets/wallpapers/space-black.png", // Ensure this file exists in public/assets/wallpapers/
    forTheme: "both",
  },
  {
    id: "wallpaper-3",
    name: "ventura",
    type: "image",
    value: "/assets/wallpapers/ventura.jpg", // Ensure this file exists in public/assets/wallpapers/
    forTheme: "both",
  },
  {
    id: "wallpaper-4",
    name: "big-sur",
    type: "image",
    value: "/assets/wallpapers/big-sur.jpg", // Ensure this file exists in public/assets/wallpapers/
    forTheme: "both",
  },
  // Light wallpapers
  THEME_WALLPAPERS.light,
  {
    id: "sunset",
    name: "Daylight",
    type: "gradient",
    value: "linear-gradient(135deg, hsl(200, 80%, 85%) 0%, hsl(220, 70%, 90%) 50%, hsl(180, 60%, 88%) 100%)",
    forTheme: "light",
  },
  {
    id: "forest",
    name: "Morning",
    type: "gradient",
    value: "linear-gradient(135deg, hsl(40, 70%, 90%) 0%, hsl(200, 60%, 88%) 50%, hsl(220, 50%, 92%) 100%)",
    forTheme: "light",
  },
];

interface WallpaperContextType {
  currentWallpaper: Wallpaper;
  effectiveWallpaper: Wallpaper;
  // Updated signature to accept an optional URL for custom images
  setWallpaper: (id: string, customUrl?: string) => void;
  wallpapers: Wallpaper[];
}

const WallpaperContext = createContext<WallpaperContextType | undefined>(undefined);

const WALLPAPER_STORAGE_KEY = "mac_portfolio.wallpaper";
const CUSTOM_WALLPAPER_STORAGE_KEY = "mac_portfolio.custom_wallpaper";

export function WallpaperProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  
  const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper>(() => {
    // 1. Try to load saved wallpaper ID
    const savedId = localStorage.getItem(WALLPAPER_STORAGE_KEY);
    
    // 2. If it's a known preset, return it
    const preset = WALLPAPERS.find((w) => w.id === savedId);
    if (preset) return preset;

    // 3. If it was a custom wallpaper, try to load the custom definition
    if (savedId && savedId.startsWith("custom-")) {
      const savedCustom = localStorage.getItem(CUSTOM_WALLPAPER_STORAGE_KEY);
      if (savedCustom) {
        try {
          return JSON.parse(savedCustom);
        } catch (e) {
          console.error("Failed to parse custom wallpaper", e);
        }
      }
    }

    // 4. Fallback to default
    return WALLPAPERS[0];
  });

  const effectiveWallpaper: Wallpaper = currentWallpaper.id === "auto"
    ? THEME_WALLPAPERS[theme]
    : currentWallpaper;

  const setWallpaper = (id: string, customUrl?: string) => {
    // 1. Check if it exists in presets
    const existing = WALLPAPERS.find((w) => w.id === id);

    if (existing) {
      setCurrentWallpaper(existing);
      localStorage.setItem(WALLPAPER_STORAGE_KEY, id);
      // Clean up custom storage if switching back to preset
      localStorage.removeItem(CUSTOM_WALLPAPER_STORAGE_KEY);
    } else if (customUrl) {
      // 2. Handle Custom Wallpaper (from file system)
      const customWallpaper: Wallpaper = {
        id: id.startsWith("wallpaper-") ? id : `custom-${id}`,
        name: "Custom Image",
        type: "image",
        value: customUrl,
        forTheme: "both"
      };
      
      setCurrentWallpaper(customWallpaper);
      localStorage.setItem(WALLPAPER_STORAGE_KEY, customWallpaper.id);
      localStorage.setItem(CUSTOM_WALLPAPER_STORAGE_KEY, JSON.stringify(customWallpaper));
    }
  };

  return (
    <WallpaperContext.Provider value={{ 
      currentWallpaper, 
      effectiveWallpaper,
      setWallpaper, 
      wallpapers: WALLPAPERS 
    }}>
      {children}
    </WallpaperContext.Provider>
  );
}

export function useWallpaper() {
  const context = useContext(WallpaperContext);
  if (!context) {
    throw new Error("useWallpaper must be used within a WallpaperProvider");
  }
  return context;
}