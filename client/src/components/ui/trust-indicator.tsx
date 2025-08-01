import { Shield, CheckCircle } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export function TrustIndicator() {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-center space-x-2 text-xs opacity-90">
      <div className="flex items-center space-x-1">
        <Shield className="w-3 h-3 text-success" />
        <span>{t("regulatedBy")}</span>
      </div>
      <div className="w-1 h-1 bg-current rounded-full opacity-40"></div>
      <div className="flex items-center space-x-1">
        <CheckCircle className="w-3 h-3 text-success" />
        <span>{t("proofOfReserves")}</span>
      </div>
    </div>
  );
}
