import { useState, useEffect } from "react";
import { Cpu, MemoryStick, HardDrive, Wifi, Battery, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface SystemStatus {
  cpu: number;
  memory: number;
  storage: number;
  battery: number;
  uptime: string;
  network: "connected" | "disconnected";
}

// Simulate system status - in production, this could use actual system APIs
const getRandomStatus = (): SystemStatus => ({
  cpu: Math.floor(Math.random() * 40) + 10,
  memory: Math.floor(Math.random() * 30) + 40,
  storage: Math.floor(Math.random() * 20) + 50,
  battery: Math.floor(Math.random() * 20) + 75,
  uptime: "2h 34m",
  network: "connected",
});

export const SystemStatusWidget = () => {
  const [status, setStatus] = useState<SystemStatus>(getRandomStatus);

  useEffect(() => {
    // Update status every 5 seconds
    const timer = setInterval(() => {
      setStatus((prev) => ({
        ...getRandomStatus(),
        uptime: prev.uptime, // Keep uptime stable
      }));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (value: number) => {
    if (value < 50) return "bg-emerald-500";
    if (value < 75) return "bg-amber-500";
    return "bg-red-500";
  };

  const StatusBar = ({ value, label, icon: Icon }: { value: number; label: string; icon: typeof Cpu }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">{label}</span>
        </div>
        <span className="text-[10px] font-medium tabular-nums">{value}%</span>
      </div>
      <div className="h-1.5 bg-foreground/10 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            getStatusColor(value)
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-2.5 h-full">
      {/* Activity indicator */}
      <div className="flex items-center gap-2 pb-2 border-b border-border/30">
        <Activity className="w-4 h-4 text-primary animate-pulse" />
        <span className="text-[11px] font-medium">System Active</span>
      </div>

      {/* Status bars */}
      <StatusBar value={status.cpu} label="CPU" icon={Cpu} />
      <StatusBar value={status.memory} label="Memory" icon={MemoryStick} />
      <StatusBar value={status.storage} label="Storage" icon={HardDrive} />

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between text-[9px] text-muted-foreground pt-2 border-t border-border/30">
        <div className="flex items-center gap-1">
          <Wifi className={cn(
            "w-3 h-3",
            status.network === "connected" ? "text-emerald-500" : "text-red-500"
          )} />
          <span className="capitalize">{status.network}</span>
        </div>
        <div className="flex items-center gap-1">
          <Battery className="w-3 h-3" />
          <span>{status.battery}%</span>
        </div>
        <span>Up: {status.uptime}</span>
      </div>
    </div>
  );
};

export default SystemStatusWidget;
