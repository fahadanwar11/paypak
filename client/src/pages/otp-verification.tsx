import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { OTPInput } from "@/components/ui/otp-input";
import { StatusBar } from "@/components/ui/status-bar";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { MessageSquare } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function OTPVerification() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();

  // Get phone number from URL params
  const searchParams = new URLSearchParams(window.location.search);
  const phoneNumber = searchParams.get("phone") || "";

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: t("error"),
        description: "Please enter a valid 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/verify-otp", {
        phoneNumber: `+92${phoneNumber.replace(/\s/g, '')}`,
        otp,
      });

      const data = await response.json();
      
      // Store user session
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      
      toast({
        title: t("success"),
        description: "Phone number verified successfully",
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: t("error"),
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    try {
      await apiRequest("POST", "/api/auth/send-otp", {
        phoneNumber: `+92${phoneNumber.replace(/\s/g, '')}`,
      });
      
      setResendTimer(30);
      toast({
        title: t("success"),
        description: "New verification code sent",
      });
    } catch (error) {
      toast({
        title: t("error"),
        description: "Failed to resend code. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mobile-container animate-fade-in">
      <StatusBar className="bg-primary text-white" />
      
      {/* Progress Header */}
      <div className="bg-primary px-4 pb-6">
        <div className="flex justify-between items-center mb-2">
          <button 
            onClick={() => navigate("/onboarding")}
            className="text-white min-h-touch min-w-touch flex items-center justify-center"
            aria-label={t("back")}
          >
            <svg className="w-5 h-5 rtl-flip" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <span className="text-white text-sm">Step 2 of 4</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: "50%" }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{t("otpTitle")}</h1>
          <p className="text-text-gray">
            {t("otpSubtitle")} <span className="font-semibold">+92 {phoneNumber}</span>
          </p>
        </div>

        <div className="space-y-6">
          <OTPInput 
            value={otp} 
            onChange={setOtp}
            onComplete={handleVerifyOTP}
          />

          <div className="text-center">
            <p className="text-sm text-text-gray mb-2">Didn't receive the code?</p>
            <button 
              onClick={handleResendOTP}
              disabled={resendTimer > 0}
              className="text-primary font-medium underline disabled:text-text-gray disabled:no-underline"
            >
              {resendTimer > 0 ? `${t("otpResend")} (${resendTimer}s)` : t("otpResend")}
            </button>
          </div>
        </div>

        <Button 
          onClick={handleVerifyOTP}
          disabled={isLoading || otp.length !== 6}
          className="w-full py-4 min-h-touch"
          size="lg"
        >
          {isLoading ? t("loading") : t("otpVerify")}
        </Button>
      </div>
    </div>
  );
}
