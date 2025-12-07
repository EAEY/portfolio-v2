import { useState, useEffect, useRef, useCallback } from "react";
import { Search } from "lucide-react";
import { DockItemId } from "./Dock";
import { useFocusTrap } from "@/hooks/use-focus-trap";

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWindow: (id: DockItemId) => void;
}

interface SearchResult {
  id: DockItemId;
  label: string;
  description: string;
  type: "section" | "external";
}

const SEARCH_INDEX: SearchResult[] = [
  { id: "about", label: "About", description: "Learn about me", type: "section" },
  { id: "skills", label: "Skills", description: "Technical skills & expertise", type: "section" },
  { id: "projects", label: "Projects", description: "Portfolio projects", type: "section" },
  { id: "experiences", label: "Experiences", description: "Work experience", type: "section" },
  { id: "contact", label: "Contact", description: "Get in touch", type: "section" },
  { id: "cv", label: "CV", description: "Download resume", type: "section" },
  { id: "settings", label: "Settings", description: "Customize appearance & accessibility", type: "section" },
];

export const SpotlightSearch = ({ isOpen, onClose, onOpenWindow }: SpotlightSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const focusTrapRef = useFocusTrap(isOpen);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Simple fuzzy search
  const search = useCallback((q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = q.toLowerCase();
    const filtered = SEARCH_INDEX.filter(
      (item) =>
        item.label.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
    );
    setResults(filtered);
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    search(query);
  }, [query, search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      onOpenWindow(results[selectedIndex].id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-sm animate-fade-in" />

      {/* Search Modal */}
      <div
        ref={focusTrapRef}
        className="relative w-full max-w-xl mx-4 glass rounded-xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Spotlight search"
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
            aria-label="Search"
            aria-autocomplete="list"
            aria-controls="spotlight-results"
            aria-activedescendant={results[selectedIndex] ? `result-${results[selectedIndex].id}` : undefined}
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-muted-foreground bg-secondary rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul 
            id="spotlight-results"
            className="max-h-80 overflow-auto p-2" 
            role="listbox"
            aria-label="Search results"
          >
            {results.map((result, index) => (
              <li
                key={result.id}
                id={`result-${result.id}`}
                role="option"
                aria-selected={index === selectedIndex}
                className={`flex flex-col px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  index === selectedIndex
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
                onClick={() => {
                  onOpenWindow(result.id);
                  onClose();
                }}
              >
                <span className="font-medium">{result.label}</span>
                <span
                  className={`text-sm ${
                    index === selectedIndex
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {result.description}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* No results */}
        {query && results.length === 0 && (
          <div className="px-4 py-8 text-center text-muted-foreground">
            No results for "{query}"
          </div>
        )}

        {/* Empty state */}
        {!query && (
          <div className="px-4 py-8 text-center text-muted-foreground">
            Type to search sections, projects, and more...
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotlightSearch;
