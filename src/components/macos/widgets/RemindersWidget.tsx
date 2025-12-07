import { useState, useEffect } from "react";
import { Plus, X, Check, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

interface Reminder {
  id: string;
  text: string;
  completed: boolean;
}

const REMINDERS_STORAGE_KEY = "mac_portfolio.widget_reminders";

export const RemindersWidget = () => {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem(REMINDERS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [newReminder, setNewReminder] = useState("");

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = () => {
    if (!newReminder.trim()) return;
    
    setReminders((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: newReminder.trim(),
        completed: false,
      },
    ]);
    setNewReminder("");
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const clearCompleted = () => {
    setReminders((prev) => prev.filter((r) => !r.completed));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addReminder();
    }
  };

  const completedCount = reminders.filter((r) => r.completed).length;
  const remainingCount = reminders.length - completedCount;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/30">
        <div className="flex items-center gap-1.5">
          <ListTodo className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] font-medium">Reminders</span>
        </div>
        {completedCount > 0 && (
          <button
            onClick={clearCompleted}
            className="text-[9px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear done
          </button>
        )}
      </div>

      {/* Add new reminder */}
      <div className="flex gap-1 mb-2">
        <input
          type="text"
          value={newReminder}
          onChange={(e) => setNewReminder(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add reminder..."
          className="flex-1 bg-foreground/5 rounded px-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground/50"
        />
        <button
          onClick={addReminder}
          disabled={!newReminder.trim()}
          className={cn(
            "p-1 rounded transition-colors",
            newReminder.trim() 
              ? "hover:bg-primary/20 text-primary" 
              : "text-muted-foreground/50"
          )}
          aria-label="Add reminder"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Reminders list */}
      <div className="flex-1 overflow-auto space-y-0.5 scrollbar-hidden">
        {reminders.length === 0 ? (
          <p className="text-[11px] text-muted-foreground text-center py-4">
            No reminders yet
          </p>
        ) : (
          reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={cn(
                "flex items-center gap-2 p-1.5 rounded group transition-colors",
                reminder.completed ? "opacity-60" : "hover:bg-foreground/5"
              )}
            >
              <button
                onClick={() => toggleReminder(reminder.id)}
                className={cn(
                  "w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all flex-shrink-0",
                  reminder.completed
                    ? "bg-primary border-primary"
                    : "border-muted-foreground/40 hover:border-primary"
                )}
              >
                {reminder.completed && <Check className="w-2 h-2 text-primary-foreground" />}
              </button>
              <span
                className={cn(
                  "flex-1 text-[11px] truncate",
                  reminder.completed && "line-through text-muted-foreground"
                )}
              >
                {reminder.text}
              </span>
              <button
                onClick={() => deleteReminder(reminder.id)}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-destructive/20 transition-all"
                aria-label="Delete reminder"
              >
                <X className="w-2.5 h-2.5 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {reminders.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border/30 text-[9px] text-muted-foreground text-center">
          {remainingCount} remaining • {completedCount} done
        </div>
      )}
    </div>
  );
};

export default RemindersWidget;
