import { useState, useEffect } from "react";
import { ExternalLink, Github, Figma, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// IMPORTS: Import your images here
// Make sure these files exist in src/assets/projects/
// You can change the extensions (.png, .jpg, .jpeg) to match your files
import taibetImg from "@/assets/projects/taibat.jpg";
import evaImg from "@/assets/projects/EvaSchool.jpg";
import pharmaImg from "@/assets/projects/pharma_shop.png";
import medicalImg from "@/assets/projects/medical_rep.jpg";
import chaiImg from "@/assets/projects/olova.png";
import safeCycleImg from "@/assets/projects/SafeCycle.png";
import portfolioImg from "@/assets/projects/Eyad_logo.png";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  liveUrl?: string;
  repoUrl?: string;
  figmaUrl?: string;
}

const projects: Project[] = [
  {
    id: "1",
    title: "Taibet Alkhair",
    description:
      "Taibet Alkhair is a user interface for a real estate company website that allows users to browse and search for properties, view details, and contact agents.",
    tags: ["UI/UX Design", "Figma", "Prototyping"],
    image: taibetImg,
    figmaUrl: "https://www.figma.com/file/beERPbTPaFdhs6Zmo8CRJU/Untitled?type=design&node-id=5%3A11&mode=design&t=pqgLHnHPLAzoPPap-1",
  },
  {
    id: "2",
    title: "EVA School's Website",
    description:
      "Official website for EVA International Applied School.",
    tags: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    image: evaImg,
    liveUrl: "https://eaey.github.io/EVA-School-IATS/",
    repoUrl: "https://github.com/EAEY/EVA-School-IATS",
    
  },
  {
    id: "3",
    title: "Pharma Shop",
    description:
      "UI for Eva Company for selling medicines and nutritional supplements.",
    tags: ["UI/UX Design", "Figma", "Prototyping"],
    image: pharmaImg,
    figmaUrl: "https://www.figma.com/design/WJIm70Qlw6ZxotPohckFVn/UI-Design-for-Medicine-Store--Community-?node-id=0-1&p=f",
  },
  {
    id: "4",
    title: "Medical Rep. Helper",
    description:
      "UI for Eva Pharma & Eva Cosmetics for the medical representatives to help them in their daily tasks.",
    tags: ["UI/UX Design", "Figma", "Prototyping"],
    image: medicalImg,
    figmaUrl: "https://www.figma.com/file/D1Vz1B6M6FnClYJJoYC9Ah/Capstone-Final?type=design&node-id=201%3A977&mode=design&t=iGcgBdV3fMLUNZPn-1",
  },
  {
    id: "5",
    title: "ChaiGPT",
    description:
      "Design and development of a Chatbot with an Arabic interface and file upload support ",
    tags: ["html", "css", "javascript", "WebApi", "OpenAI",],
    image: chaiImg,
    liveUrl: "https://eaey.github.io/ChaiGPT/",
    repoUrl: "https://github.com/EAEY/ChaiGPT",
  },
  {
    id: "6",
    title: "SafeCycle",
    description:
      "SafeCycle is a system for the tracking and maintenance of factory equipment and inventory ",
    tags: ["html", "css", "javascript", ".net", "sql server","WebApi","mobile app","flutter"],
    image: safeCycleImg,
    liveUrl: "https://eaey.github.io/SafeCycle/",
    repoUrl: "https://github.com/EAEY/SafeCycle",
  },
  {
    id: "7",
    title: "Personal Portfolio",
    description:
      "A personal portfolio website to showcase my projects and skills.",
    tags: ["html", "css", "javascript"],
    image: portfolioImg,
    liveUrl: "https://eaey.github.io/portfolio/",
    repoUrl: "https://github.com/EAEY/portfolio",
  },
];

const ProjectCard = ({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl cursor-pointer",
        "bg-secondary/50 border border-border",
        "hover:bg-secondary hover:border-primary/50",
        "transition-all duration-300"
      )}
    >
      {/* Project Image */}
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
        {project.image ? (
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="text-4xl opacity-50">🖼️</span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
        <span className="text-sm font-medium text-foreground">Click to view details</span>
      </div>
    </div>
  );
};

const ProjectModal = ({
  project,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  project: Project;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) => {
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal - Contained within window */}
      <div className="relative w-full max-w-lg max-h-full overflow-auto bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/60 hover:bg-background/80 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Navigation buttons */}
        {hasPrev && (
          <button
            onClick={onPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/60 hover:bg-background/80 transition-colors"
            aria-label="Previous project"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {hasNext && (
          <button
            onClick={onNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/60 hover:bg-background/80 transition-colors"
            aria-label="Next project"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Image */}
        <div className="aspect-video bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center overflow-hidden">
          {project.image ? (
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-5xl opacity-50">🖼️</span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <h2 className="text-xl font-bold text-foreground">{project.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm rounded-full bg-primary/20 text-primary"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
            {project.liveUrl && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-primary/20 border-primary/40 hover:bg-primary/30"
                asChild
              >
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              </Button>
            )}
            {project.repoUrl && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-secondary border-border hover:bg-secondary/80"
                asChild
              >
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                  Repository
                </a>
              </Button>
            )}
            {project.figmaUrl && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-accent/20 border-accent/40 hover:bg-accent/30"
                asChild
              >
                <a href={project.figmaUrl} target="_blank" rel="noopener noreferrer">
                  <Figma className="w-4 h-4" />
                  Figma
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProjectsWindow = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const selectedIndex = selectedProject
    ? projects.findIndex((p) => p.id === selectedProject.id)
    : -1;

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setSelectedProject(projects[selectedIndex - 1]);
    }
  };

  const handleNext = () => {
    if (selectedIndex < projects.length - 1) {
      setSelectedProject(projects[selectedIndex + 1]);
    }
  };

  return (
    <div className="h-full overflow-auto relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ProjectCard
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          </div>
        ))}
      </div>

      {/* Project Modal - positioned within the window */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={selectedIndex > 0}
          hasNext={selectedIndex < projects.length - 1}
        />
      )}
    </div>
  );
};

export default ProjectsWindow;