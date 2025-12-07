import { useState } from "react";
import {
  User,
  Code,
  FolderKanban,
  Briefcase,
  Mail,
  FileText,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DockItemId } from "./Dock";

interface MobileNavProps {
  onItemClick: (id: DockItemId | "settings") => void;
  activeWindow: DockItemId | "settings" | null;
}

const NAV_ITEMS = [
  { id: "about" as const, label: "About", icon: User },
  { id: "skills" as const, label: "Skills", icon: Code },
  { id: "projects" as const, label: "Projects", icon: FolderKanban },
  { id: "experiences" as const, label: "Experience", icon: Briefcase },
  { id: "contact" as const, label: "Contact", icon: Mail },
  { id: "cv" as const, label: "CV", icon: FileText },
  { id: "settings" as const, label: "Settings", icon: Settings },
];

export const MobileNav = ({ onItemClick, activeWindow }: MobileNavProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleItemClick = (id: DockItemId | "settings") => {
    onItemClick(id);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <header
        className="fixed top-0 left-0 right-0 h-14 menubar-glass z-40 flex items-center justify-between px-4"
        role="banner"
      >
        <span className="font-semibold text-lg">Portfolio</span>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            "hover:bg-foreground/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <nav
        id="mobile-menu"
        className={cn(
          "fixed top-14 left-0 right-0 z-40 glass p-4 transform transition-transform duration-300",
          isMenuOpen ? "translate-y-0" : "-translate-y-full pointer-events-none"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <ul className="space-y-2">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleItemClick(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  activeWindow === item.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Tab Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 h-16 dock-glass z-40 flex items-center justify-around px-2 safe-area-bottom"
        role="tablist"
        aria-label="Quick navigation"
      >
        {NAV_ITEMS.slice(0, 5).map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={activeWindow === item.id}
            onClick={() => handleItemClick(item.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-colors min-w-[56px]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeWindow === item.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default MobileNav;
