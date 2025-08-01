import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PhoneInput } from "@/components/ui/phone-input";
import { StatusBar } from "@/components/ui/status-bar";
import { EnhancedProgressBar } from "@/components/ui/enhanced-progress-bar";
import { SecurityBadge } from "@/components/ui/security-badge";
import { ContextualHelp } from "@/components/ui/contextual-help";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { Smartphone, Shield } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function Onboarding() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: t("error"),
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/send-otp", {
        phoneNumber: `+92${phoneNumber.replace(/\s/g, '')}`,
      });
      
      toast({
        title: t("success"),
        description: "Verification code sent successfully",
      });
      
      navigate(`/verify-otp?phone=${encodeURIComponent(phoneNumber)}`);
    } catch (error) {
      toast({
        title: t("error"),
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mobile-container animate-fade-in">
      <StatusBar className="bg-primary text-white" />
      
      {/* Enhanced Progress Header */}
      <div className="bg-primary px-4 pb-6">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => window.history.back()}
            className="text-white min-h-touch min-w-touch flex items-center justify-center"
            aria-label={t("back")}
          >
            <svg className="w-5 h-5 rtl-flip" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="text-white text-sm">CryptoFi Setup</div>
        </div>
        
        <EnhancedProgressBar currentStep={1} totalSteps={4} />
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{t("phoneTitle")}</h1>
          <p className="text-text-gray">{t("phoneSubtitle")}</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <PhoneInput
              value={phoneNumber}
              onChange={setPhoneNumber}
              placeholder={t("phonePlaceholder")}
              label={t("phoneLabel")}
            />
            <div className="absolute top-0 right-0">
              <ContextualHelp
                topic="phone-verification"
                title="Why Phone Verification?"
                content="We use your phone number to verify your identity and secure your account. This is required by Pakistani financial regulations (SBP) and helps protect your funds."
                tips={[
                  "Your number is encrypted and never shared",
                  "Used for transaction alerts and security",
                  "Required for account recovery"
                ]}
              />
            </div>
          </div>
          
          <SecurityBadge />
        </div>

        <Button 
          onClick={handleSendOTP}
          disabled={isLoading || !phoneNumber}
          className="w-full py-4 min-h-touch"
          size="lg"
        >
          {isLoading ? t("loading") : t("sendOTP")}
        </Button>

        <div className="text-center">
          <p className="text-xs text-text-gray">
            By continuing, you agree to our{" "}
            <button className="text-primary underline">Terms of Service</button> and{" "}
            <button className="text-primary underline">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
}
