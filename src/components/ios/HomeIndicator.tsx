import { cn } from "@/lib/utils";

interface HomeIndicatorProps {
  variant?: "light" | "dark" | "auto";
  className?: string;
}

export const HomeIndicator = ({ variant = "auto", className }: HomeIndicatorProps) => {
  return (
    <div
      className={cn(
        "w-32 h-1 rounded-full mx-auto",
        variant === "light" && "bg-white/50",
        variant === "dark" && "bg-black/30",
        variant === "auto" && "bg-foreground/30",
        className
      )}
      aria-hidden="true"
    />
  );
};

export default HomeIndicator;
