import { createContext, useContext, useState, ReactNode } from "react";

// Mobile-specific wallpapers (separate from desktop)
export interface MobileWallpaper {
  id: string;
  name: string;
  lockscreen: string;
  homescreen: string;
}

export const MOBILE_WALLPAPERS: MobileWallpaper[] = [
  {
    id: "default",
    name: "Default",
    lockscreen: "/mobile/wallpapers/lockscreen.jpg",
    homescreen: "/mobile/wallpapers/homescreen.jpg",
  },
  {
    id: "gradient-blue",
    name: "Blue Gradient",
    lockscreen: "https://images.unsplash.com/photo-1557683316-973673baf926?w=600&h=1200&fit=crop",
    homescreen: "https://images.unsplash.com/photo-1557683316-973673baf926?w=600&h=1200&fit=crop",
  },
  {
    id: "gradient-purple",
    name: "Purple Dreams",
    lockscreen: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&h=1200&fit=crop",
    homescreen: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&h=1200&fit=crop",
  },
  {
    id: "mountains",
    name: "Mountains",
    lockscreen: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=1200&fit=crop",
    homescreen: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=1200&fit=crop",
  },
  {
    id: "ocean",
    name: "Ocean",
    lockscreen: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=1200&fit=crop",
    homescreen: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=1200&fit=crop",
  },
  {
    id: "aurora",
    name: "Aurora",
    lockscreen: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=1200&fit=crop",
    homescreen: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=1200&fit=crop",
  },
  {
    id: "dark-abstract",
    name: "Dark Abstract",
    lockscreen: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=600&h=1200&fit=crop",
    homescreen: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=600&h=1200&fit=crop",
  },
  {
    id: "neon-city",
    name: "Neon City",
    lockscreen: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=1200&fit=crop",
    homescreen: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=1200&fit=crop",
  },
];

interface MobileWallpaperContextType {
  currentWallpaper: MobileWallpaper;
  setWallpaper: (id: string) => void;
  wallpapers: MobileWallpaper[];
}

const MobileWallpaperContext = createContext<MobileWallpaperContextType | undefined>(undefined);

const MOBILE_WALLPAPER_STORAGE_KEY = "ios_portfolio.mobile_wallpaper";

export function MobileWallpaperProvider({ children }: { children: ReactNode }) {
  const [currentWallpaper, setCurrentWallpaper] = useState<MobileWallpaper>(() => {
    const savedId = localStorage.getItem(MOBILE_WALLPAPER_STORAGE_KEY);
    return MOBILE_WALLPAPERS.find((w) => w.id === savedId) || MOBILE_WALLPAPERS[0];
  });

  const setWallpaper = (id: string) => {
    const wallpaper = MOBILE_WALLPAPERS.find((w) => w.id === id);
    if (wallpaper) {
      setCurrentWallpaper(wallpaper);
      localStorage.setItem(MOBILE_WALLPAPER_STORAGE_KEY, id);
    }
  };

  return (
    <MobileWallpaperContext.Provider value={{ 
      currentWallpaper, 
      setWallpaper, 
      wallpapers: MOBILE_WALLPAPERS 
    }}>
      {children}
    </MobileWallpaperContext.Provider>
  );
}

export function useMobileWallpaper() {
  const context = useContext(MobileWallpaperContext);
  if (!context) {
    throw new Error("useMobileWallpaper must be used within a MobileWallpaperProvider");
  }
  return context;
}