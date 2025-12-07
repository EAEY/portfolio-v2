import { Briefcase, Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string[];
}

const experiences: Experience[] = [
  {
    
    id: "1",
    company: "Online Freelance Projects",
    role: "Freelaner",
    location: "Remote",
    startDate: "2025",
    endDate: "Present",
    description:
      "Developed responsive web applications for various clients. Collaborated with designers to implement pixel-perfect UIs and integrated third-party APIs.",
    technologies: ["HTML", "CSS", "JavaScript", "APIs", "React" ,"Node.js","Figma",".NET framework","SQL Server", "GitHub","Agile Methodologies"],
  },
  {
    id: "2",
    company: "Developer Student Clubs -Cairo University",
    role: "Event Organizer & Web Developer",
    location: "Giza, Egypt",
    startDate: "2024",
    endDate: "Present",
    description:
      "An Event Organizer of Formerly GDSC and currently DSC on Cairo University are university-based community club for students interested in various technology fields. ",
    technologies: ["Event Organization", "Time Management", "Leadership", "tutorning","teamwork","communication"
    ],
  },
  {
    id: "3",
    company: "EVA International Applied Technology School",
    role: "Software Developement student",
    location: "Giza, Egypt",
    startDate: "2023",
    endDate: "Present",
    description:
      "A technical school that provides comprehensive training in software development, equipping students with practical skills and knowledge to excel in the tech industry.",
    technologies: ["Web Development", "Software Testing", "UI/UX", "Database Management","Mobile App Development","Embedded Systems","Desktop Applications","Networking Basics"],
  },
];

const TimelineItem = ({
  experience,
  isLast,
}: {
  experience: Experience;
  isLast: boolean;
}) => {
  return (
    <div className="relative flex gap-4">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-macos-accent-blue to-macos-accent-purple/30" />
      )}

      {/* Timeline dot */}
      <div className="relative z-10 flex-shrink-0">
        <div className="w-6 h-6 rounded-full bg-macos-accent-blue flex items-center justify-center shadow-lg shadow-macos-accent-blue/30">
          <Briefcase className="w-3 h-3 text-white" />
        </div>
      </div>

      {/* Content card */}
      <div
        className={cn(
          "flex-1 pb-8",
          "bg-white/5 rounded-xl p-4 border border-glass-border",
          "hover:bg-white/8 hover:border-macos-accent-blue/30 transition-all duration-300"
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-foreground">{experience.role}</h3>
            <p className="text-macos-accent-blue font-medium">
              {experience.company}
            </p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {experience.startDate} - {experience.endDate}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {experience.location}
            </div>
          </div>
        </div>

        <p className="text-sm text-foreground/70 mb-3 leading-relaxed">
          {experience.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {experience.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs rounded-full bg-macos-accent-purple/20 text-macos-accent-purple"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ExperiencesWindow = () => {
  return (
    <div className="h-full overflow-auto pr-2">
      <div className="space-y-0">
        {experiences.map((exp, index) => (
          <div
            key={exp.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <TimelineItem
              experience={exp}
              isLast={index === experiences.length - 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperiencesWindow;
