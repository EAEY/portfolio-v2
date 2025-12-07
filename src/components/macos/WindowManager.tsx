import { useCallback, useRef } from "react";
import Window from "./Window";
import AboutWindow from "./windows/AboutWindow";
import SkillsWindow from "./windows/SkillsWindow";
import ProjectsWindow from "./windows/ProjectsWindow";
import ExperiencesWindow from "./windows/ExperiencesWindow";
import ContactWindow from "./windows/ContactWindow";
import CVWindow from "./windows/CVWindow";
import SettingsWindow from "./windows/SettingsWindow";
import FinderWindow from "./windows/FinderWindow";
import { DockItemId } from "./Dock";

interface WindowConfig {
  id: DockItemId;
  title: string;
  component: React.ReactNode;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  minSize: { width: number; height: number };
}

const windowConfigs: Record<string, Omit<WindowConfig, "id">> = {
  finder: {
    title: "Finder",
    component: <FinderWindow />,
    initialPosition: { x: 80, y: 50 },
    initialSize: { width: 800, height: 500 },
    minSize: { width: 600, height: 400 },
  },
  about: {
    title: "About",
    component: <AboutWindow />,
    initialPosition: { x: 100, y: 60 },
    initialSize: { width: 650, height: 400 },
    minSize: { width: 400, height: 300 },
  },
  skills: {
    title: "Skills",
    component: <SkillsWindow />,
    initialPosition: { x: 150, y: 80 },
    initialSize: { width: 580, height: 500 },
    minSize: { width: 400, height: 350 },
  },
  projects: {
    title: "Projects",
    component: <ProjectsWindow />,
    initialPosition: { x: 200, y: 100 },
    initialSize: { width: 700, height: 550 },
    minSize: { width: 500, height: 400 },
  },
  experiences: {
    title: "Experiences",
    component: <ExperiencesWindow />,
    initialPosition: { x: 120, y: 70 },
    initialSize: { width: 600, height: 500 },
    minSize: { width: 400, height: 350 },
  },
  contact: {
    title: "Contact",
    component: <ContactWindow />,
    initialPosition: { x: 180, y: 90 },
    initialSize: { width: 650, height: 500 },
    minSize: { width: 450, height: 400 },
  },
  cv: {
    title: "CV",
    component: <CVWindow />,
    initialPosition: { x: 220, y: 110 },
    initialSize: { width: 550, height: 550 },
    minSize: { width: 400, height: 450 },
  },
  settings: {
    title: "Settings",
    component: <SettingsWindow />,
    initialPosition: { x: 160, y: 80 },
    initialSize: { width: 600, height: 450 },
    minSize: { width: 500, height: 350 },
  },
};

interface WindowManagerProps {
  openWindows: DockItemId[];
  minimizedWindows: DockItemId[];
  activeWindow: DockItemId | null;
  onCloseWindow: (id: DockItemId) => void;
  onMinimizeWindow: (id: DockItemId) => void;
  onFocusWindow: (id: DockItemId) => void;
  dockIconRefs: Record<DockItemId, React.RefObject<HTMLButtonElement>>;
}

export const WindowManager = ({
  openWindows,
  minimizedWindows,
  activeWindow,
  onCloseWindow,
  onMinimizeWindow,
  onFocusWindow,
  dockIconRefs,
}: WindowManagerProps) => {
  // Track window z-index order
  const windowOrder = useRef<DockItemId[]>([]);

  const getZIndex = useCallback((id: DockItemId) => {
    const index = windowOrder.current.indexOf(id);
    if (index === -1) {
      windowOrder.current.push(id);
      return windowOrder.current.length + 10;
    }
    return index + 10;
  }, []);

  const bringToFront = useCallback((id: DockItemId) => {
    windowOrder.current = windowOrder.current.filter((w) => w !== id);
    windowOrder.current.push(id);
    onFocusWindow(id);
  }, [onFocusWindow]);

  return (
    <>
      {openWindows.map((id) => {
        const config = windowConfigs[id];
        if (!config) return null;

        const isMinimized = minimizedWindows.includes(id);
        const isActive = activeWindow === id;

        return (
          <Window
            key={id}
            id={id}
            title={config.title}
            isActive={isActive}
            isMinimized={isMinimized}
            initialPosition={config.initialPosition}
            initialSize={config.initialSize}
            minSize={config.minSize}
            onClose={() => onCloseWindow(id)}
            onMinimize={() => onMinimizeWindow(id)}
            onFocus={() => bringToFront(id)}
            zIndex={getZIndex(id)}
            dockIconRef={dockIconRefs[id]}
          >
            {config.component}
          </Window>
        );
      })}
    </>
  );
};

export default WindowManager;
