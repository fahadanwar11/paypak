import { Shield, Lock, Eye } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

interface SecurityBadgeProps {
  className?: string;
}

export function SecurityBadge({ className = "" }: SecurityBadgeProps) {
  const { t } = useLanguage();
  
  return (
    <div className={`bg-gradient-to-r from-success/10 to-primary/10 border border-success/20 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm flex items-center">
          <Shield className="w-4 h-4 text-success mr-2" />
          Your Security
        </h3>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs text-success font-medium">Protected</span>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-3 h-3 text-success" />
            <span className="text-text-gray">256-bit Encryption</span>
          </div>
          <span className="text-success text-xs">✓ Active</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="w-3 h-3 text-success" />
            <span className="text-text-gray">Real-time Monitoring</span>
          </div>
          <span className="text-success text-xs">✓ Active</span>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-success/10">
          <span className="text-text-gray text-xs">{t("regulatedBy")}</span>
          <span className="text-success text-xs font-medium">SBP License #2024</span>
        </div>
      </div>
    </div>
  );
}