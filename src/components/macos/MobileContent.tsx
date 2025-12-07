import { useEffect, useRef } from "react";
import { ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DockItemId } from "./Dock";
import AboutWindow from "./windows/AboutWindow";
import SkillsWindow from "./windows/SkillsWindow";
import ProjectsWindow from "./windows/ProjectsWindow";
import ExperiencesWindow from "./windows/ExperiencesWindow";
import ContactWindow from "./windows/ContactWindow";
import CVWindow from "./windows/CVWindow";
import SettingsWindow from "./windows/SettingsWindow";

interface MobileContentProps {
  activeSection: DockItemId | "settings" | null;
  onClose: () => void;
}

const SECTION_TITLES: Record<string, string> = {
  about: "About",
  skills: "Skills",
  projects: "Projects",
  experiences: "Experience",
  contact: "Contact",
  cv: "CV",
  settings: "Settings",
};

const SECTION_COMPONENTS: Record<string, React.ReactNode> = {
  about: <AboutWindow />,
  skills: <SkillsWindow />,
  projects: <ProjectsWindow />,
  experiences: <ExperiencesWindow />,
  contact: <ContactWindow />,
  cv: <CVWindow />,
  settings: <SettingsWindow />,
};

export const MobileContent = ({ activeSection, onClose }: MobileContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to top when section changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeSection]);

  if (!activeSection) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary/50 flex items-center justify-center">
            <span className="text-3xl">👋</span>
          </div>
          <h1 className="text-xl font-semibold">Welcome</h1>
          <p className="text-muted-foreground text-sm max-w-xs">
          </p>
        </div>
      </div>
    );
  }

  const title = SECTION_TITLES[activeSection] || "Section";
  const content = SECTION_COMPONENTS[activeSection];

  return (
    <div className="flex-1 flex flex-col min-h-0 animate-fade-in">
      {/* Section Header */}
      <header
        className="flex-shrink-0 flex items-center gap-3 p-4 border-b border-border/50 bg-background/80 backdrop-blur-sm"
        role="banner"
      >
        <button
          onClick={onClose}
          className={cn(
            "p-2 -ml-2 rounded-lg transition-colors",
            "hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold flex-1">{title}</h1>
        <button
          onClick={onClose}
          className={cn(
            "p-2 -mr-2 rounded-lg transition-colors",
            "hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          aria-label="Close section"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Section Content - Scrollable */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain"
        role="main"
        aria-label={`${title} content`}
      >
        <div className="p-4 pb-8">
          {content}
        </div>
      </div>
    </div>
  );
};

export default MobileContent;
