import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { DockItemId } from "@/components/macos/Dock";

export interface AppIcon {
  id: DockItemId | "settings";
  label: string;
  icon: string;
  badge?: number;
  isExternal?: boolean;
  href?: string;
  quickActions?: { id: string; label: string }[];
}

export interface HomeScreenState {
  gridApps: AppIcon[];
  dockApps: AppIcon[];
  hiddenApps: string[];
  currentPage: number;
}

// Mobile-specific icons (separate from desktop)
const DEFAULT_GRID_APPS: AppIcon[] = [
  { 
    id: "about", 
    label: "About", 
    icon: "/mobile/icons/about.svg",
    quickActions: [{ id: "view", label: "View Profile" }]
  },
  { 
    id: "skills", 
    label: "Skills", 
    icon: "/mobile/icons/skills.svg",
    quickActions: [{ id: "view", label: "View All Skills" }]
  },
  { 
    id: "projects", 
    label: "Projects", 
    icon: "/mobile/icons/projects.svg",
    quickActions: [
      { id: "latest", label: "Open Latest" },
      { id: "gallery", label: "Gallery" }
    ]
  },
  { 
    id: "experiences", 
    label: "Experience", 
    icon: "/mobile/icons/experiences.svg",
    quickActions: [{ id: "timeline", label: "View Timeline" }]
  },
  { 
    id: "cv", 
    label: "CV", 
    icon: "/mobile/icons/cv.svg",
    quickActions: [
      { id: "download", label: "Download PDF" },
      { id: "view", label: "View Online" }
    ]
  },
  { 
    id: "settings", 
    label: "Settings", 
    icon: "/mobile/icons/settings.svg" 
  },
];

const DEFAULT_DOCK_APPS: AppIcon[] = [
  { id: "contact", label: "Contact", icon: "/mobile/icons/contact.svg" },
  { id: "github", label: "GitHub", icon: "/mobile/icons/github.svg", isExternal: true, href: "https://github.com/EAEY" },
  { id: "linkedin", label: "LinkedIn", icon: "/mobile/icons/linkedin.svg", isExternal: true, href: "https://www.linkedin.com/in/eyad-ayman-32a9272aa/" },
];

const STORAGE_KEY = "ios_homescreen_state";

interface HomeScreenContextType {
  state: HomeScreenState;
  isEditMode: boolean;
  setEditMode: (editing: boolean) => void;
  reorderGridApps: (fromIndex: number, toIndex: number) => void;
  reorderDockApps: (fromIndex: number, toIndex: number) => void;
  moveToGrid: (appId: string) => void;
  moveToDock: (appId: string) => void;
  hideApp: (appId: string) => void;
  showApp: (appId: string) => void;
  setCurrentPage: (page: number) => void;
  updateBadge: (appId: string, badge: number | undefined) => void;
  resetLayout: () => void;
}

const HomeScreenContext = createContext<HomeScreenContextType | undefined>(undefined);

export function HomeScreenProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HomeScreenState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall through to default
      }
    }
    return {
      gridApps: DEFAULT_GRID_APPS,
      dockApps: DEFAULT_DOCK_APPS,
      hiddenApps: [],
      currentPage: 0,
    };
  });

  const [isEditMode, setEditMode] = useState(false);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const reorderGridApps = useCallback((fromIndex: number, toIndex: number) => {
    setState((prev) => {
      const newApps = [...prev.gridApps];
      const [removed] = newApps.splice(fromIndex, 1);
      newApps.splice(toIndex, 0, removed);
      return { ...prev, gridApps: newApps };
    });
  }, []);

  const reorderDockApps = useCallback((fromIndex: number, toIndex: number) => {
    setState((prev) => {
      const newApps = [...prev.dockApps];
      const [removed] = newApps.splice(fromIndex, 1);
      newApps.splice(toIndex, 0, removed);
      return { ...prev, dockApps: newApps };
    });
  }, []);

  const moveToGrid = useCallback((appId: string) => {
    setState((prev) => {
      const app = prev.dockApps.find((a) => a.id === appId);
      if (!app) return prev;
      return {
        ...prev,
        dockApps: prev.dockApps.filter((a) => a.id !== appId),
        gridApps: [...prev.gridApps, app],
      };
    });
  }, []);

  const moveToDock = useCallback((appId: string) => {
    setState((prev) => {
      if (prev.dockApps.length >= 4) return prev; // Max 4 dock apps
      const app = prev.gridApps.find((a) => a.id === appId);
      if (!app) return prev;
      return {
        ...prev,
        gridApps: prev.gridApps.filter((a) => a.id !== appId),
        dockApps: [...prev.dockApps, app],
      };
    });
  }, []);

  const hideApp = useCallback((appId: string) => {
    setState((prev) => ({
      ...prev,
      hiddenApps: [...prev.hiddenApps, appId],
    }));
  }, []);

  const showApp = useCallback((appId: string) => {
    setState((prev) => ({
      ...prev,
      hiddenApps: prev.hiddenApps.filter((id) => id !== appId),
    }));
  }, []);

  const setCurrentPage = useCallback((page: number) => {
    setState((prev) => ({ ...prev, currentPage: page }));
  }, []);

  const updateBadge = useCallback((appId: string, badge: number | undefined) => {
    setState((prev) => ({
      ...prev,
      gridApps: prev.gridApps.map((app) =>
        app.id === appId ? { ...app, badge } : app
      ),
      dockApps: prev.dockApps.map((app) =>
        app.id === appId ? { ...app, badge } : app
      ),
    }));
  }, []);

  const resetLayout = useCallback(() => {
    setState({
      gridApps: DEFAULT_GRID_APPS,
      dockApps: DEFAULT_DOCK_APPS,
      hiddenApps: [],
      currentPage: 0,
    });
  }, []);

  return (
    <HomeScreenContext.Provider
      value={{
        state,
        isEditMode,
        setEditMode,
        reorderGridApps,
        reorderDockApps,
        moveToGrid,
        moveToDock,
        hideApp,
        showApp,
        setCurrentPage,
        updateBadge,
        resetLayout,
      }}
    >
      {children}
    </HomeScreenContext.Provider>
  );
}

export function useHomeScreen() {
  const context = useContext(HomeScreenContext);
  if (!context) {
    throw new Error("useHomeScreen must be used within a HomeScreenProvider");
  }
  return context;
}
