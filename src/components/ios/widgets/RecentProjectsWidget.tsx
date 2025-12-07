import { FolderOpen } from "lucide-react";
import IOSWidget from "./IOSWidget";

const RECENT_PROJECTS = [
  { name: "E-commerce App", color: "bg-blue-500" },
  { name: "Portfolio v2", color: "bg-purple-500" },
  { name: "Dashboard UI", color: "bg-green-500" },
  { name: "Mobile App", color: "bg-orange-500" },
];

interface RecentProjectsWidgetProps {
  onTap?: () => void;
}

export const RecentProjectsWidget = ({ onTap }: RecentProjectsWidgetProps) => {
  return (
    <IOSWidget size="large" onClick={onTap} ariaLabel="Recent Projects - Tap to open">
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <FolderOpen className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold">Recent Projects</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 flex-1">
          {RECENT_PROJECTS.map((project, i) => (
            <div
              key={i}
              className="rounded-xl bg-secondary/40 p-2 flex flex-col items-center justify-center"
            >
              <div className={`w-10 h-10 ${project.color} rounded-lg mb-1 shadow-sm`} />
              <span className="text-[10px] text-foreground/80 text-center line-clamp-1">
                {project.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </IOSWidget>
  );
};

export default RecentProjectsWidget;
