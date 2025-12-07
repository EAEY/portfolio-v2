import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

export type WidgetSize = "small" | "medium" | "large";

interface IOSWidgetProps {
  size: WidgetSize;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

const SIZE_CLASSES: Record<WidgetSize, string> = {
  small: "col-span-1 row-span-1 aspect-square",
  medium: "col-span-2 row-span-1",
  large: "col-span-2 row-span-2",
};

export const IOSWidget = ({
  size,
  children,
  onClick,
  className,
  ariaLabel,
}: IOSWidgetProps) => {
  const reducedMotion = usePrefersReducedMotion();
  
  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={cn(
        SIZE_CLASSES[size],
        "ios-widget-glass rounded-[20px] p-3 overflow-hidden",
        "relative",
        onClick && "cursor-pointer",
        !reducedMotion && "transition-transform duration-200 active:scale-[0.98]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      aria-label={ariaLabel}
      role={onClick ? "button" : "region"}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 ios-widget-sheen pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 h-full">{children}</div>
    </Component>
  );
};

export default IOSWidget;
