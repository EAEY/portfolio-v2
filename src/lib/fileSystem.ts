export type FileType = "folder" | "image" | "document" | "project" | "wallpaper" | "pdf" | "code";

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  icon?: string;
  preview?: string;
  content?: string;
  link?: string;
  children?: FileItem[];
  size?: string;
  modified?: string;
}

// Virtual file system structure
export const FILE_SYSTEM: FileItem[] = [
  {
    id: "desktop",
    name: "Desktop",
    type: "folder",
    children: [
      {
        id: "readme",
        name: "README.md",
        type: "document",
        content: "# Welcome to my Portfolio\n\nThis is a macOS-style portfolio built with React.",
        size: "1 KB",
        modified: "Today",
      },
      {
        id: "notes",
        name: "Notes.txt",
        type: "document",
        content: "Personal notes and ideas...",
        size: "512 B",
        modified: "Yesterday",
      },
    ],
  },
  {
    id: "documents",
    name: "Documents",
    type: "folder",
    children: [
      {
        id: "cv-pdf",
        name: "CV.pdf",
        type: "document",
        link: "https://drive.google.com/file/d/1nf-GsGo0MrRUgn_6xjvhlnmymZJFpqsA/view?usp=sharing",
        size: "2.5 MB",
        modified: "Last week",
      },
      {
        id: "cover-letter",
        name: "Cover Letter.pdf",
        type: "document",
        content: "My professional cover letter...",
        size: "156 KB",
        modified: "Last month",
      },
    ],
  },
  {
    id: "projects",
    name: "Featured Projects",
    type: "folder",
    children: [
      {
        id: "project-1",
        name: "SafeCycle",
        type: "project",
        content: "managment system for operation and maintenance of factories",
        size: "—",
        modified: "1 year ago",
      },
      {
        id: "project-2",
        name: "Eyad's Blog",
        type: "project",
        content: "A tech blog platform with markdown support",
        size: "—",
        modified: "1 week ago",
      },
      {
        id: "project-3",
        name: "Software Startup company",
        type: "project",
        content: "Open a software company that provides web and mobile applications",
        size: "—",
        modified: "2 weeks ago",
      },
    ],
  },
  {
    id: "gallery",
    name: "Gallery",
    type: "folder",
    children: [
      {
        id: "1",
        name: "1st Photo.jpeg",
        type: "image",
        preview: "/src/assets/images/Eyad-1.jpeg",
        size: "1.2 MB",
        modified: "3 days ago",
      },
      {
        id: "2",
        name: "2nd Photo.jpeg",
        type: "image",
        preview: "/src/assets/images/Eyad-2.jpg",
        size: "890 KB",
        modified: "1 week ago",
      },
      {
        id: "3",
        name: "3rd Photo.jpeg",
        type: "image",
        preview: "/src/assets/images/Eyad-3.jpg",
        size: "2.1 MB",
        modified: "2 weeks ago",
      },
      {
        id: "4",
        name: "4th Photo.jpeg",
        type: "image",
        preview: "/src/assets/images/Eyad-4.jpeg",
        size: "2.1 MB",
        modified: "2 weeks ago",
      },
      {        id: "5",
        name: "5th Photo.jpeg",
        type: "image",
        preview: "/src/assets/images/Eyad-5.jpeg",
        size: "2.1 MB",
        modified: "2 weeks ago",
      },
      {
        id: "6",
        name: "6th Photo.jpeg",
        type: "image",
        preview: "/src/assets/images/Eyad-6.jpg",
        size: "2.1 MB",
        modified: "2 weeks ago",
      },
      {
        id: "7",
        name: "7th Photo.jpeg",
        type: "image",
        preview: "/src/assets/images/Eyad-7.jpg",
        size: "2.1 MB",
        modified: "2 weeks ago",
      },
      {
        id: "8",
        name: "8th Photo.jpeg",
        type: "image",
        preview: "/src/assets/images/Eyad-8.jpg",
        size: "2.1 MB",
        modified: "2 weeks ago",
      }
    ],
  },
  {
    id: "wallpapers",
    name: "Wallpapers",
    type: "folder",
    children: [
      {
        id: "wallpaper-aurora",
        name: "Aurora.jpg",
        type: "wallpaper",
        preview: "linear-gradient(135deg, hsl(220, 60%, 12%) 0%, hsl(260, 40%, 15%) 50%, hsl(200, 50%, 10%) 100%)",
        size: "3.2 MB",
        modified: "—",
      },
      {
        id: "wallpaper-ocean",
        name: "Ocean.jpg",
        type: "wallpaper",
        preview: "linear-gradient(135deg, hsl(200, 70%, 15%) 0%, hsl(180, 60%, 12%) 50%, hsl(220, 50%, 18%) 100%)",
        size: "2.8 MB",
        modified: "—",
      },
      {
        id: "wallpaper-sunset",
        name: "Sunset.jpg",
        type: "wallpaper",
        preview: "linear-gradient(135deg, hsl(350, 60%, 18%) 0%, hsl(30, 50%, 15%) 50%, hsl(280, 40%, 12%) 100%)",
        size: "3.5 MB",
        modified: "—",
      },
      {
        id: "wallpaper-forest",
        name: "Forest.jpg",
        type: "wallpaper",
        preview: "linear-gradient(135deg, hsl(140, 50%, 12%) 0%, hsl(160, 40%, 15%) 50%, hsl(180, 30%, 10%) 100%)",
        size: "4.1 MB",
        modified: "—",
      },
      {
        id: "wallpaper-midnight",
        name: "Midnight.jpg",
        type: "wallpaper",
        preview: "linear-gradient(135deg, hsl(240, 50%, 8%) 0%, hsl(260, 40%, 12%) 50%, hsl(220, 60%, 6%) 100%)",
        size: "2.9 MB",
        modified: "—",
      },
      {
        id: "wallpaper-cosmic",
        name: "Cosmic.jpg",
        type: "wallpaper",
        preview: "linear-gradient(135deg, hsl(280, 60%, 15%) 0%, hsl(320, 50%, 12%) 50%, hsl(260, 40%, 18%) 100%)",
        size: "3.7 MB",
        modified: "—",
      },
      {
        id: "wallpaper-1",
        name: "Tahoe-Beach-Night.png",
        type: "image",
        preview: "/src/assets/wallpapers/tahoe-beach-night.png",
        size: "3.7 MB",
        modified: "—",
      },
      {
        id: "wallpaper-2",
        name: "Space-Black.png",
        type: "image",
        preview: "/src/assets/wallpapers/space-black.png",
        size: "3.7 MB",
        modified: "—",
      },
      {
        id: "wallpaper-3",
        name: "ventura.png",
        type: "image",
        preview: "/src/assets/wallpapers/ventura.jpg",
        size: "3.7 MB",
        modified: "—",
      },
      {
        id: "wallpaper-4",
        name: "big-sur.png",
        type: "image",
        preview: "/src/assets/wallpapers/big-sur.jpg",
        size: "3.7 MB",
        modified: "—",
      },
    ],
  },
];

// Helper functions
export function findFolder(path: string[]): FileItem | undefined {
  if (path.length === 0) return undefined;
  
  let current: FileItem | undefined = FILE_SYSTEM.find((f) => f.id === path[0]);
  
  for (let i = 1; i < path.length; i++) {
    if (!current?.children) return undefined;
    current = current.children.find((f) => f.id === path[i]);
  }
  
  return current;
}

// Updated to return paths to assets instead of emojis
export function getFileIcon(type: FileType): string {
  switch (type) {
    case "folder":
      return "src/assets/icons/folder.svg";
    case "image":
      return "src/assets/icons/image.svg";
    case "document":
      return "src/assets/icons/document.svg";
    case "project":
      return "src/assets/icons/project.svg";
    case "wallpaper":
      return "src/assets/icons/image.svg"; // or wallpaper.svg
    case "pdf":
      return "src/assets/icons/pdf.svg";
    case "code":
      return "src/assets/icons/code.svg";
    default:
      return "src/assets/icons/document.svg";
  }
}

export function formatFileSize(size: string): string {
  return size;
}