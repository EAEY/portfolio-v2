import { FileText } from "lucide-react";
import IOSWidget from "./IOSWidget";

const SAMPLE_NOTES = [
  "Portfolio launch checklist",
  "Meeting notes - Design review",
  "Ideas for new projects",
];

export const QuickNotesWidget = () => {
  return (
    <IOSWidget size="medium" ariaLabel="Quick Notes">
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-yellow-500" />
          <span className="text-xs font-semibold">Notes</span>
        </div>
        <div className="flex-1 space-y-1.5 overflow-hidden">
          {SAMPLE_NOTES.map((note, i) => (
            <div
              key={i}
              className="text-[11px] text-foreground/80 truncate bg-secondary/30 rounded px-2 py-1"
            >
              {note}
            </div>
          ))}
        </div>
      </div>
    </IOSWidget>
  );
};

export default QuickNotesWidget;
