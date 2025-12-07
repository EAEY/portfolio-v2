import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const CalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();

  const days = [];
  
  // Empty cells for days before first day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="w-5 h-5" />);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(
      <button
        key={day}
        className={cn(
          "w-5 h-5 text-[10px] rounded-full flex items-center justify-center transition-all",
          isToday(day)
            ? "bg-primary text-primary-foreground font-bold shadow-sm"
            : "hover:bg-foreground/10"
        )}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={prevMonth}
          className="p-0.5 rounded hover:bg-foreground/10 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={goToToday}
          className={cn(
            "text-[11px] font-medium px-2 py-0.5 rounded transition-colors",
            isCurrentMonth 
              ? "text-foreground" 
              : "text-primary hover:bg-primary/10"
          )}
        >
          {MONTHS[month]} {year}
        </button>
        <button
          onClick={nextMonth}
          className="p-0.5 rounded hover:bg-foreground/10 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAYS.map((day) => (
          <div
            key={day}
            className="w-5 h-4 text-[9px] text-muted-foreground text-center font-medium"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5 flex-1 content-start">
        {days}
      </div>
    </div>
  );
};

export default CalendarWidget;
