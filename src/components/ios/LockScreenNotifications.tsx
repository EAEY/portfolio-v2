import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { X, MessageCircle, Mail, Bell, Calendar } from "lucide-react";

export interface Notification {
  id: string;
  app: string;
  title: string;
  message: string;
  time: string;
  icon: "message" | "mail" | "bell" | "calendar";
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    app: "Messages",
    title: "Eyad Ayman",
    message: "Hey! Check out this awesome portfolio I Made!",
    time: "Now",
    icon: "message",
  },
  {
    id: "2",
    app: "Mail",
    title: "Interview Invitation",
    message: "We'd love to schedule an interview with you...",
    time: "15m ago",
    icon: "mail",
  },
  {
    id: "3",
    app: "Reminders",
    title: "Portfolio Review",
    message: "Don't forget to update your projects section",
    time: "1h ago",
    icon: "bell",
  },
];

const ICON_MAP = {
  message: MessageCircle,
  mail: Mail,
  bell: Bell,
  calendar: Calendar,
};

const ICON_COLORS = {
  message: "bg-[#34c759]",
  mail: "bg-[#007aff]",
  bell: "bg-[#ff9500]",
  calendar: "bg-[#ff3b30]",
};

interface NotificationCardProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  isStacked?: boolean;
  stackIndex?: number;
}

const NotificationCard = ({ 
  notification, 
  onDismiss, 
  isStacked = false,
  stackIndex = 0,
}: NotificationCardProps) => {
  const [swipeX, setSwipeX] = useState(0);
  const [isDismissing, setIsDismissing] = useState(false);
  const startX = useRef(0);
  const isSwiping = useRef(false);

  const Icon = ICON_MAP[notification.icon];

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isSwiping.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    const diff = e.touches[0].clientX - startX.current;
    if (diff < 0) {
      setSwipeX(Math.max(diff, -120));
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    isSwiping.current = false;
    if (swipeX < -60) {
      setIsDismissing(true);
      setTimeout(() => onDismiss(notification.id), 200);
    } else {
      setSwipeX(0);
    }
  }, [swipeX, notification.id, onDismiss]);

  if (isDismissing) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "transition-all duration-300",
        isStacked && "absolute w-full"
      )}
      style={{
        transform: isStacked 
          ? `translateY(${stackIndex * 8}px) scale(${1 - stackIndex * 0.03})`
          : `translateX(${swipeX}px)`,
        zIndex: isStacked ? 10 - stackIndex : undefined,
        opacity: isStacked && stackIndex > 0 ? 0.9 - stackIndex * 0.2 : 1,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Delete indicator */}
      <div 
        className="absolute inset-y-0 right-0 w-20 bg-[#ff3b30] flex items-center justify-center"
        style={{ opacity: Math.min(Math.abs(swipeX) / 60, 1) }}
      >
        <X className="w-6 h-6 text-white" />
      </div>

      {/* Card content */}
      <div 
        className={cn(
          "relative bg-white/20 backdrop-blur-2xl",
          "border border-white/20",
          "p-3.5",
          "transform transition-transform"
        )}
        style={{
          borderRadius: 20,
          transform: `translateX(${swipeX}px)`,
        }}
      >
        <div className="flex items-start gap-3">
          {/* App icon */}
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
            ICON_COLORS[notification.icon]
          )}>
            <Icon className="w-5 h-5 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[13px] text-white/70 font-medium uppercase tracking-wide">
                {notification.app}
              </span>
              <span className="text-[12px] text-white/50">
                {notification.time}
              </span>
            </div>
            <h4 className="text-[15px] text-white font-semibold leading-snug">
              {notification.title}
            </h4>
            <p className="text-[14px] text-white/80 leading-snug line-clamp-2">
              {notification.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LockScreenNotificationsProps {
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export const LockScreenNotifications = ({ 
  expanded = false, 
  onToggleExpand 
}: LockScreenNotificationsProps) => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const handleDismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="w-full px-4">
      {expanded ? (
        // Expanded view - show all notifications
        <div className="space-y-2">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onDismiss={handleDismiss}
            />
          ))}
        </div>
      ) : (
        // Stacked view - show notifications stacked
        <button
          className="relative w-full"
          onClick={onToggleExpand}
          style={{ height: 80 + (Math.min(notifications.length - 1, 2) * 8) }}
        >
          {notifications.slice(0, 3).map((notification, index) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onDismiss={handleDismiss}
              isStacked
              stackIndex={index}
            />
          ))}
          
          {notifications.length > 1 && (
            <div className="absolute -bottom-4 left-0 right-0 text-center">
              <span className="text-[12px] text-white/60 font-medium">
                {notifications.length} notifications
              </span>
            </div>
          )}
        </button>
      )}
    </div>
  );
};

export default LockScreenNotifications;