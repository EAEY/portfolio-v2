import { useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Search,
  Home,
  FileText,
  FolderOpen,
  Image,
  Palette,
} from "lucide-react";
import { FILE_SYSTEM, FileItem, getFileIcon, findFolder } from "@/lib/fileSystem";
import { useWallpaper, WALLPAPERS } from "@/contexts/WallpaperContext";
import { ScrollArea } from "@/components/ui/scroll-area";

type ViewMode = "grid" | "list";

const SIDEBAR_ITEMS = [
  { id: "desktop", name: "Desktop", icon: Home },
  { id: "documents", name: "Documents", icon: FileText },
  { id: "projects", name: "Projects", icon: FolderOpen },
  { id: "gallery", name: "Gallery", icon: Image },
  { id: "wallpapers", name: "Wallpapers", icon: Palette },
];

export const FinderWindow = () => {
  const [currentPath, setCurrentPath] = useState<string[]>(["desktop"]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [history, setHistory] = useState<string[][]>([["desktop"]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const { setWallpaper } = useWallpaper();

  const currentFolder = findFolder(currentPath);
  const items = currentFolder?.children || [];

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigateTo = useCallback((path: string[]) => {
    setCurrentPath(path);
    setSelectedFile(null);
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
      setSelectedFile(null);
    }
  }, [history, historyIndex]);

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
      setSelectedFile(null);
    }
  }, [history, historyIndex]);

  // UPDATED: Handle setting wallpaper for ANY image or wallpaper file
  const handleItemClick = useCallback((item: FileItem) => {
    if (item.type === "folder") {
      navigateTo([...currentPath, item.id]);
    } else if (item.type === "wallpaper") {
      // Try to match ID first, if not found, pass the preview URL
      const wallpaperId = item.id.replace("wallpaper-", "");
      const existsInContext = WALLPAPERS.find(w => w.id === wallpaperId);
      
      if (existsInContext) {
        setWallpaper(wallpaperId);
      } else if (item.preview) {
        // Custom wallpaper logic
        setWallpaper(item.id, item.preview);
      }
    } else {
      setSelectedFile(item);
    }
  }, [currentPath, navigateTo, setWallpaper]);

  const getBreadcrumbs = () => {
    return currentPath.map((id) => {
      const folder = FILE_SYSTEM.find((f) => f.id === id) ||
        FILE_SYSTEM.flatMap((f) => f.children || []).find((f) => f.id === id);
      return folder?.name || id;
    });
  };

  return (
    <div className="flex h-full bg-background/50">
      {/* Sidebar */}
      <div className="w-44 border-r border-foreground/10 flex flex-col">
        <div className="p-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          Favorites
        </div>
        <nav className="flex-1 px-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath[0] === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => navigateTo([item.id])}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "hover:bg-foreground/5 text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-10 flex items-center justify-between px-3 border-b border-foreground/10">
          <div className="flex items-center gap-1">
            <button
              onClick={goBack}
              disabled={historyIndex === 0}
              className="p-1.5 rounded hover:bg-foreground/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goForward}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded hover:bg-foreground/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Go forward"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {getBreadcrumbs().map((name, index) => (
              <span key={index} className="flex items-center">
                {index > 0 && <ChevronRight className="w-3 h-3 mx-1" />}
                <span className={index === getBreadcrumbs().length - 1 ? "text-foreground font-medium" : ""}>
                  {name}
                </span>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-32 pl-7 pr-2 py-1 bg-foreground/5 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="flex rounded-md bg-foreground/5 p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1 rounded transition-colors ${
                  viewMode === "grid" ? "bg-background shadow-sm" : ""
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1 rounded transition-colors ${
                  viewMode === "list" ? "bg-background shadow-sm" : ""
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* File browser */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            {filteredItems.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                {searchQuery ? "No items match your search" : "This folder is empty"}
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-4 gap-4 md:grid-cols-5 lg:grid-cols-6">
                {filteredItems.map((item) => {
                   const isGradient = item.preview?.startsWith("linear-gradient");
                   return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      onDoubleClick={() => item.type === "folder" && navigateTo([...currentPath, item.id])}
                      className={`flex flex-col items-center p-3 rounded-lg transition-colors hover:bg-foreground/5 ${
                        selectedFile?.id === item.id ? "bg-primary/20 ring-1 ring-primary" : ""
                      }`}
                    >
                      {(item.type === "image" || item.type === "wallpaper") && item.preview ? (
                        <div className="w-16 h-16 rounded-lg mb-2 overflow-hidden bg-background shadow-sm">
                          {isGradient ? (
                            <div className="w-full h-full" style={{ background: item.preview }} />
                          ) : (
                            <img
                              src={item.preview}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center mb-2">
                          <img 
                            src={getFileIcon(item.type)} 
                            alt={item.type} 
                            className="w-12 h-12 object-contain drop-shadow-sm" 
                          />
                        </div>
                      )}
                      <span className="text-xs text-center line-clamp-2 w-full break-words">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-0.5">
                <div className="grid grid-cols-[1fr_80px_100px] gap-4 px-3 py-1 text-xs text-muted-foreground border-b border-foreground/10">
                  <span>Name</span>
                  <span>Size</span>
                  <span>Modified</span>
                </div>
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    onDoubleClick={() => item.type === "folder" && navigateTo([...currentPath, item.id])}
                    className={`w-full grid grid-cols-[1fr_80px_100px] gap-4 px-3 py-2 rounded-md text-left transition-colors hover:bg-foreground/5 ${
                      selectedFile?.id === item.id ? "bg-primary/20 ring-1 ring-primary" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                       <img 
                        src={getFileIcon(item.type)} 
                        alt={item.type}
                        className="w-5 h-5 object-contain"
                      />
                      <span className="text-sm truncate">{item.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.size || "—"}</span>
                    <span className="text-xs text-muted-foreground">{item.modified || "—"}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Preview panel for selected file */}
        {selectedFile && selectedFile.type !== "folder" && (
          <div className="border-t border-foreground/10 p-3 bg-foreground/5">
            <div className="flex items-start gap-3">
              {(selectedFile.type === "image" || selectedFile.type === "wallpaper") && selectedFile.preview ? (
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-background shadow-sm">
                  {selectedFile.preview.startsWith("linear-gradient") ? (
                    <div className="w-full h-full" style={{ background: selectedFile.preview }} />
                  ) : (
                    <img
                      src={selectedFile.preview}
                      alt={selectedFile.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ) : (
                <div className="w-20 h-20 flex items-center justify-center bg-foreground/5 rounded-lg">
                   <img 
                      src={getFileIcon(selectedFile.type)} 
                      alt={selectedFile.type}
                      className="w-12 h-12 object-contain"
                    />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{selectedFile.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedFile.size && `${selectedFile.size} • `}
                  {selectedFile.modified}
                </p>
                {/* Updated "Set as Wallpaper" button logic */}
                {(selectedFile.type === "wallpaper" || selectedFile.type === "image") && (
                  <button
                    onClick={() => {
                      const wallpaperId = selectedFile.id.replace("wallpaper-", "");
                      // Pass both ID and Preview URL to handle custom images
                      setWallpaper(wallpaperId, selectedFile.preview);
                    }}
                    className="mt-2 px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Set as Wallpaper
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinderWindow;