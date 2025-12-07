import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHomeScreen } from "@/contexts/HomeScreenContext";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (appId: string) => void;
}

export const SpotlightSearch = ({ isOpen, onClose, onSelect }: SpotlightSearchProps) => {
  const { state } = useHomeScreen();
  const reducedMotion = usePrefersReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const allApps = [...state.gridApps, ...state.dockApps].filter(
    (app) => !state.hiddenApps.includes(app.id)
  );

  const filteredApps = query
    ? allApps.filter((app) =>
        app.label.toLowerCase().includes(query.toLowerCase())
      )
    : allApps.slice(0, 6); // Show suggestions when empty

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredApps.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && filteredApps[selectedIndex]) {
        handleSelect(filteredApps[selectedIndex].id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredApps, selectedIndex]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleClose = useCallback(() => {
    if (reducedMotion) {
      setQuery("");
      onClose();
    } else {
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
        setQuery("");
        onClose();
      }, 200);
    }
  }, [onClose, reducedMotion]);

  const handleSelect = useCallback((appId: string) => {
    setQuery("");
    onSelect(appId);
  }, [onSelect]);

  if (!isOpen && !isClosing) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[70] bg-black/40 backdrop-blur-xl",
          !reducedMotion && (isClosing ? "animate-fade-out" : "animate-fade-in")
        )}
        onClick={handleClose}
      />

      {/* Search Container */}
      <div
        className={cn(
          "fixed top-20 left-4 right-4 z-[75]",
          !reducedMotion && (isClosing ? "animate-scale-out" : "animate-scale-in")
        )}
      >
        {/* Search Input */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Search className="w-5 h-5 text-white/50" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className={cn(
              "w-full py-3.5 pl-12 pr-12 rounded-2xl",
              "bg-white/15 backdrop-blur-2xl",
              "border border-white/10",
              "text-white text-[17px] placeholder:text-white/40",
              "focus:outline-none focus:ring-2 focus:ring-white/20"
            )}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/20"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        {/* Results */}
        {filteredApps.length > 0 && (
          <div className="mt-3 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/10 overflow-hidden">
            <div className="px-4 py-2 border-b border-white/10">
              <span className="text-xs text-white/50 font-medium uppercase tracking-wide">
                {query ? "Search Results" : "Siri Suggestions"}
              </span>
            </div>
            <div className="py-1">
              {filteredApps.map((app, index) => (
                <button
                  key={app.id}
                  onClick={() => handleSelect(app.id)}
                  className={cn(
                    "w-full px-4 py-3 flex items-center gap-4 transition-colors",
                    index === selectedIndex ? "bg-white/15" : "hover:bg-white/10"
                  )}
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                    <img 
                      src={app.icon} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-white font-medium text-[15px]">{app.label}</p>
                    <p className="text-white/50 text-[13px]">App</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {query && filteredApps.length === 0 && (
          <div className="mt-3 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/10 p-6 text-center">
            <p className="text-white/60 text-[15px]">No results for "{query}"</p>
          </div>
        )}

        {/* Cancel Button */}
        <button
          onClick={handleClose}
          className="w-full mt-3 py-3 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/10 text-white font-medium"
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default SpotlightSearch;
