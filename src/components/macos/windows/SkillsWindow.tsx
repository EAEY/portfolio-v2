import { useState } from "react";
import { cn } from "@/lib/utils";

interface Skill {
  name: string;
  level: number; // 0-100
  color: string;
}

interface SkillCategory {
  id: string;
  label: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    skills: [
      { name: "React", level: 40, color: "hsl(var(--macos-accent-yellow))" },
      { name: "TypeScript", level: 50, color: "hsl(var(--macos-accent-yellow))" },
      { name: "Next.js", level: 40, color: "hsl(var(--macos-accent-yellow))" },
      { name: "Tailwind CSS", level: 75, color: "hsl(var(--macos-accent-blue))" },
      { name: "HTML/CSS", level: 95, color: "hsl(var(--macos-accent-green))" },
      { name: "JavaScript", level: 80, color: "hsl(var(--macos-accent-green))" },
      { name: "Flutter", level: 80, color: "hsl(var(--macos-accent-green))" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      { name: "C#", level: 85, color: "hsl(var(--macos-accent-blue))" },
      { name: "C++", level: 85, color: "hsl(var(--macos-accent-blue))" },
      { name: "SQL", level: 90, color: "hsl(var(--macos-accent-green))" },
      { name: "Python", level: 70, color: "hsl(var(--macos-accent-yellow))" },
      { name: "APIs", level: 80, color: "hsl(var(--macos-accent-blue))" },
      { name: ".NET", level: 85, color: "hsl(var(--macos-accent-blue))" },
    ],
  },
  {
    id: "tools",
    label: "Tools & Design",
    skills: [
      { name: "Git", level: 90, color: "hsl(var(--macos-accent-green))" },
      { name: "Figma", level: 95, color: "hsl(var(--macos-accent-green))" },
      { name: "Agile", level: 80, color: "hsl(var(--macos-accent-blue))" },
      { name: "VS Code", level: 95, color: "hsl(var(--macos-accent-green))" },
      { name: "Linux", level: 65, color: "hsl(var(--macos-accent-yellow))" },
      { name: "Photoshop", level: 90, color: "hsl(var(--macos-accent-green))" },
    ],
  },
];

const RadialProgress = ({ skill }: { skill: Skill }) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (skill.level / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-white/10"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={skill.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${skill.color})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-foreground">{skill.level}%</span>
        </div>
      </div>
      <span className="text-sm font-medium text-foreground/80">{skill.name}</span>
    </div>
  );
};

export const SkillsWindow = () => {
  const [activeCategory, setActiveCategory] = useState<string>("frontend");

  const currentCategory = skillCategories.find((c) => c.id === activeCategory);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Category Toggles */}
      <div className="flex gap-2 justify-center">
        {skillCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              activeCategory === category.id
                ? "bg-macos-accent-blue text-white shadow-lg shadow-macos-accent-blue/30"
                : "bg-white/10 text-foreground/70 hover:bg-white/20 hover:text-foreground"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 p-2">
          {currentCategory?.skills.map((skill, index) => (
            <div
              key={skill.name}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <RadialProgress skill={skill} />
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground border-t border-glass-border/50 pt-4">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-macos-accent-green" />
          Expert (90%+)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-macos-accent-blue" />
          Proficient (50-90%)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-macos-accent-orange" />
          Intermediate (25-49%)
        </span>
      </div>
    </div>
  );
};

export default SkillsWindow;
