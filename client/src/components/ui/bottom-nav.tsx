import { Home, Send, RefreshCw, List, Settings } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/hooks/use-language";

interface BottomNavProps {
  className?: string;
}

export function BottomNav({ className = "" }: BottomNavProps) {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: Send, label: t("send"), path: "/send" },
    { icon: RefreshCw, label: t("exchange"), path: "/exchange" },
    { icon: List, label: "History", path: "/transactions" },
    { icon: Settings, label: t("settings"), path: "/settings" },
  ];

  const [location] = useLocation();

  return (
    <nav className={`fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-white border-t shadow-lg ${className}`}>
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location === path;
          
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center p-2 min-h-touch min-w-touch transition-colors ${
                isActive 
                  ? 'text-primary' 
                  : 'text-text-gray hover:text-primary'
              }`}
              aria-label={label}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
