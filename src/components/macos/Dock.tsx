import { useState, useRef, useCallback, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type DockItemId =
  | "about"
  | "skills"
  | "projects"
  | "experiences"
  | "contact"
  | "cv"
  | "finder"
  | "github"
  | "linkedin"
  | "settings";

interface DockItem {
  id: DockItemId;
  label: string;
  icon: string; // Path to icon image
  isExternal?: boolean;
  href?: string;
}

interface DockProps {
  onItemClick: (id: DockItemId) => void;
  activeWindows: DockItemId[];
  minimizedWindows: DockItemId[];
}

// Icons are stored in /public/icons/ - replace these files to change icons
const DOCK_ITEMS: DockItem[] = [
  { id: "finder", label: "Finder", icon: "/icons/finder.svg" },
  { id: "about", label: "About", icon: "/icons/about.svg" },
  { id: "skills", label: "Skills", icon: "/icons/skills.svg" },
  { id: "projects", label: "Projects", icon: "/icons/projects.svg" },
  { id: "experiences", label: "Experiences", icon: "/icons/experiences.svg" },
  { id: "contact", label: "Contact", icon: "/icons/contact.svg" },
  { id: "cv", label: "CV", icon: "/icons/cv.svg" },
  { id: "settings", label: "Settings", icon: "/icons/settings.svg" },
  {
    id: "github",
    label: "GitHub",
    icon: "/icons/github.svg",
    isExternal: true,
    href: "https://github.com/EAEY",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: "/icons/linkedin.svg",
    isExternal: true,
    href: "https://www.linkedin.com/in/eyad-ayman-32a9272aa/",
  },
];

const STORAGE_KEY = "mac_portfolio.dockOrder";

export const Dock = ({ onItemClick, activeWindows, minimizedWindows }: DockProps) => {
  const [items, setItems] = useState<DockItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const order = JSON.parse(saved) as DockItemId[];
        // Ensure all items from DOCK_ITEMS are included (in case new items were added)
        const savedItems = order
          .map((id) => DOCK_ITEMS.find((item) => item.id === id))
          .filter(Boolean) as DockItem[];
        
        // Add any missing items from DOCK_ITEMS
        const missingItems = DOCK_ITEMS.filter(
          (item) => !order.includes(item.id)
        );
        
        return [...savedItems, ...missingItems];
      } catch {
        return DOCK_ITEMS;
      }
    }
    return DOCK_ITEMS;
  });

  const dockRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);

  // Save order to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.map((item) => item.id)));
  }, [items]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMouseX(e.clientX);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
  }, []);

  const getIconScale = useCallback(
    (index: number) => {
      if (mouseX === null || !dockRef.current) return 1;

      const icons = dockRef.current.querySelectorAll(".dock-icon");
      const icon = icons[index] as HTMLElement;
      if (!icon) return 1;

      const rect = icon.getBoundingClientRect();
      const iconCenterX = rect.left + rect.width / 2;
      const distance = Math.abs(mouseX - iconCenterX);
      const maxDistance = 150;
      const maxScale = 1.6;

      if (distance > maxDistance) return 1;

      // Gaussian-like curve for smooth falloff
      const scale = 1 + (maxScale - 1) * Math.pow(1 - distance / maxDistance, 2);
      return scale;
    },
    [mouseX]
  );

  const handleItemClick = (item: DockItem) => {
    if (item.isExternal && item.href) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else {
      onItemClick(item.id);
    }
  };

  return (
    <nav
      ref={dockRef}
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 dock-glass rounded-2xl px-2 py-1.5 flex items-end gap-1"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="toolbar"
      aria-label="Application dock"
    >
      {items.map((item, index) => {
        const scale = getIconScale(index);
        const isActive = activeWindows.includes(item.id);
        const isMinimized = minimizedWindows.includes(item.id);

        return (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <button
                className="dock-icon relative flex flex-col items-center p-1.5 rounded-xl transition-colors hover:bg-foreground/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{
                  transform: `translateY(${-(scale - 1) * 15}px) scale(${scale})`,
                  transition: "transform 0.15s cubic-bezier(0.2, 0.9, 0.2, 1)",
                }}
                onClick={() => handleItemClick(item)}
                aria-label={`Open ${item.label}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl transition-all overflow-hidden ${
                    isMinimized ? "opacity-50" : ""
                  }`}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
                {/* Active indicator dot */}
                {isActive && (
                  <span
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-foreground/70"
                    aria-hidden="true"
                  />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="glass text-[13px] font-medium"
              sideOffset={8}
            >
              {item.label}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
};

export default Dock;
