import { Clock, Signal, Wifi, Battery } from "lucide-react";

interface StatusBarProps {
  time?: string;
  className?: string;
}

export function StatusBar({ time = "9:41 AM", className = "" }: StatusBarProps) {
  return (
    <div className={`flex justify-between items-center p-4 pt-12 ${className}`}>
      <div className="flex items-center space-x-1">
        <div className="w-1 h-1 bg-current rounded-full opacity-75"></div>
        <div className="w-1 h-1 bg-current rounded-full opacity-75"></div>
        <div className="w-1 h-1 bg-current rounded-full opacity-75"></div>
      </div>
      
      <div className="flex items-center space-x-1">
        <Clock className="w-3 h-3 opacity-0" />
        <span className="text-sm font-medium">{time}</span>
      </div>
      
      <div className="flex items-center space-x-1">
        <Signal className="w-3 h-3 opacity-75" />
        <Wifi className="w-3 h-3 opacity-75" />
        <Battery className="w-3 h-3 opacity-75" />
      </div>
    </div>
  );
}
