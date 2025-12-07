import { User, Download, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

const GOOGLE_DRIVE_FILE_ID = "1nf-GsGo0MrRUgn_6xjvhlnmymZJFpqsA";
const PDF_DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${GOOGLE_DRIVE_FILE_ID}`;

export const AboutWindow = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 h-full">
      {/* Profile Image */}
      <div className="flex-shrink-0 flex flex-col items-center gap-4">
        <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-macos-accent-blue/30 to-macos-accent-purple/30 flex items-center justify-center border border-glass-border overflow-hidden">
        <img
         src="/profile/profile1.jpg"
         alt="Profile Photo"
        className="w-full h-full object-cover"/>
        </div>
        <Button asChild>
                        <a href={PDF_DOWNLOAD_URL} download>
                          <Download className="w-4 h-4 mr-2" />
                          Download CV
                        </a>
                      </Button>
      </div>

      {/* Bio Content */}
      <div className="flex-1 space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Eyad Ayman</h2>
          <p className="text-macos-accent-blue font-medium flex items-center gap-2 mt-1">
            <Briefcase className="w-4 h-4" />
Software Developer 💻 - Web Designer 🧑‍💻 - UI/UX 🧡🔥          </p>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <MapPin className="w-4 h-4" />
            6th of October, Egypt
          </p>
        </div>

        <div className="space-y-3 text-foreground/80 leading-relaxed">
          <p>
            Hello! I'm a passionate developer with a love for creating beautiful, 
            functional, and user-friendly applications. I specialize in modern web 
            technologies and enjoy bringing creative ideas to life through code.
          </p>
          <p>
            With expertise in both frontend and backend development, I craft 
            seamless digital experiences that combine aesthetic design with 
            robust functionality. I'm always eager to learn new technologies 
            and take on challenging projects.
          </p>
          <p>
            When I'm not coding, you can find me exploring new design trends, 
            contributing to open-source projects, or enjoying a good cup of coffee 
            while brainstorming my next project idea.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-glass-border/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-macos-accent-blue">3+</div>
            <div className="text-xs text-muted-foreground">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-macos-accent-purple">20+</div>
            <div className="text-xs text-muted-foreground">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-macos-accent-green">15+</div>
            <div className="text-xs text-muted-foreground">Happy Clients</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutWindow;
