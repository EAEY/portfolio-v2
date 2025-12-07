import { useState, useEffect, useCallback } from "react";
import { FileText } from "lucide-react";

const NOTES_STORAGE_KEY = "mac_portfolio.widget_notes";

export const NotesWidget = () => {
  const [content, setContent] = useState(() => {
    return localStorage.getItem(NOTES_STORAGE_KEY) || "";
  });

  // Debounced save
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(NOTES_STORAGE_KEY, content);
    }, 500);

    return () => clearTimeout(timer);
  }, [content]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  }, []);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/30">
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] font-medium">Quick Notes</span>
        </div>
        <span className="text-[9px] text-muted-foreground">
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </span>
      </div>
      <textarea
        value={content}
        onChange={handleChange}
        placeholder="Type your notes here..."
        className="flex-1 w-full bg-transparent resize-none text-[12px] leading-relaxed focus:outline-none placeholder:text-muted-foreground/50 scrollbar-hidden"
      />
      {content && (
        <div className="pt-2 border-t border-border/30 flex justify-end">
          <button
            onClick={() => setContent("")}
            className="text-[10px] text-muted-foreground hover:text-destructive transition-colors"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default NotesWidget;
