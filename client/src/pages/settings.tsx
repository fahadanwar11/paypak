import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { StatusBar } from "@/components/ui/status-bar";
import { BottomNav } from "@/components/ui/bottom-nav";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { User } from "@shared/schema";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { 
  ArrowLeft, 
  Languages, 
  Globe, 
  Lock, 
  Shield, 
  Fingerprint, 
  Smartphone,
  UserCheck,
  HelpCircle,
  MessageCircle,
  FileText,
  Download,
  Trash2,
  ChevronRight,
  Check,
  X,
  Edit
} from "lucide-react";

export default function Settings() {
  const [, navigate] = useLocation();
  const { t, language, setLanguage, isRTL } = useLanguage();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/onboarding");
    }
  }, [navigate]);

  if (!user) {
    return <div className="mobile-container">Loading...</div>;
  }

  const getUserInitials = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user.phoneNumber?.slice(-2) || "U";
  };

  const getUserName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.phoneNumber || "User";
  };

  const getKYCLevel = (level: number) => {
    switch (level) {
      case 0: return { text: "Basic", color: "text-warning bg-warning/10" };
      case 1: return { text: "Enhanced", color: "text-primary bg-primary/10" };
      case 2: return { text: "Premium", color: "text-success bg-success/10" };
      default: return { text: "Basic", color: "text-gray-500 bg-gray-100" };
    }
  };

  const handleLanguageChange = () => {
    const newLang = language === "en" ? "ur" : "en";
    setLanguage(newLang);
    toast({
      title: t("success"),
      description: `Language changed to ${newLang === "en" ? "English" : "اردو"}`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/onboarding");
  };

  const kycLevel = getKYCLevel(user.kycLevel || 0);

  return (
    <div className="mobile-container animate-fade-in">
      <StatusBar className="bg-white border-b text-gray-900" />
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <button 
          onClick={() => navigate("/dashboard")}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 min-h-touch min-w-touch"
        >
          <ArrowLeft className={`w-5 h-5 text-gray-600 ${isRTL ? 'rtl-flip' : ''}`} />
        </button>
        <h1 className="text-lg font-semibold">{t("settings")}</h1>
        <div className="w-10 h-10"></div>
      </div>

      {/* Profile Section */}
      <div className="p-4 bg-white border-b">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{getUserInitials(user)}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{getUserName(user)}</h2>
            <p className="text-sm text-text-gray">{user.phoneNumber}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="inline-flex items-center text-xs text-success bg-success/10 px-2 py-1 rounded-full">
                <div className="w-1.5 h-1.5 bg-success rounded-full mr-1"></div>
                Verified
              </span>
              <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${kycLevel.color}`}>
                {kycLevel.text} KYC
              </span>
            </div>
          </div>
          <button className="text-primary min-h-touch min-w-touch flex items-center justify-center">
            <Edit className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Language & Region */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold">{t("languageAndRegion")}</h3>
          <div className="space-y-2">
            <button 
              onClick={handleLanguageChange}
              className="w-full flex items-center justify-between p-4 bg-white border rounded-xl hover:bg-gray-50 transition-colors min-h-touch"
            >
              <div className="flex items-center space-x-3">
                <Languages className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-sm">{t("language")}</p>
                  <p className="text-xs text-text-gray">
                    {language === "en" ? "English" : "اردو"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {language === "en" ? "English" : "اردو"}
                </span>
                <ChevronRight className={`w-4 h-4 text-text-gray ${isRTL ? 'rtl-flip' : ''}`} />
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-white border rounded-xl hover:bg-gray-50 transition-colors min-h-touch">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-sm">{t("region")}</p>
                  <p className="text-xs text-text-gray">Pakistan</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🇵🇰</span>
                <ChevronRight className={`w-4 h-4 text-text-gray ${isRTL ? 'rtl-flip' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold">{t("security")}</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-4 bg-white border rounded-xl hover:bg-gray-50 transition-colors min-h-touch">
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-sm">PIN & Password</p>
                  <p className="text-xs text-text-gray">Change your security PIN</p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-text-gray ${isRTL ? 'rtl-flip' : ''}`} />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-white border rounded-xl hover:bg-gray-50 transition-colors min-h-touch">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-sm">Two-Factor Authentication</p>
                  <p className="text-xs text-success">Enabled via SMS</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-6 bg-success rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 transition-transform"></div>
                </div>
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-white border rounded-xl hover:bg-gray-50 transition-colors min-h-touch">
              <div className="flex items-center space-x-3">
                <Fingerprint className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-sm">Biometric Login</p>
                  <p className="text-xs text-success">Fingerprint enabled</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-6 bg-success rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 transition-transform"></div>
                </div>
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-white border rounded-xl hover:bg-gray-50 transition-colors min-h-touch">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-sm">Trusted Devices</p>
                  <p className="text-xs text-text-gray">Manage your devices</p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-text-gray ${isRTL ? 'rtl-flip' : ''}`} />
            </button>
          </div>
        </div>

        {/* KYC Status */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Verification</h3>
          <div className="bg-white border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <UserCheck className="w-5 h-5 text-success" />
                <div>
                  <p className="font-medium text-sm">KYC Status</p>
                  <p className="text-xs text-success">{kycLevel.text} Level</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${kycLevel.color}`}>
                Level {user.kycLevel || 0}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-gray">Phone Verification</span>
                <Check className="w-4 h-4 text-success" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-gray">CNIC Verification</span>
                {user.cnicNumber ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <X className="w-4 h-4 text-destructive" />
                )}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-gray">Selfie Verification</span>
                {(user.kycLevel || 0) >= 1 ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <X className="w-4 h-4 text-destructive" />
                )}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-gray">Address Verification</span>
                {(user.kycLevel || 0) >= 2 ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <X className="w-4 h-4 text-destructive" />
                )}
              </div>
            </div>

            {(user.kycLevel || 0) < 2 && (
              <Button 
                variant="outline" 
                className="w-full py-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 min-h-touch"
              >
                Upgrade to Premium (Level 2)
              </Button>
            )}
          </div>
        </div>

        {/* Support & Help */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Support</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-4 bg-white border rounded-xl hover:bg-gray-50 transition-colors min-h-touch">
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-sm">Help Center</p>
                  <p className="text-xs text-text-gray">FAQs and guides</p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-text-gray ${isRTL ? 'rtl-flip' : ''}`} />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-white border rounded-xl hover:bg-gray-50 transition-colors min-h-touch">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-sm">Live Chat</p>
                  <p className="text-xs text-success">Available 24/7</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <ChevronRight className={`w-4 h-4 text-text-gray ${isRTL ? 'rtl-flip' : ''}`} />
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-white border rounded-xl hover:bg-gray-50 transition-colors min-h-touch">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.097z"/>
                </svg>
                <div className="text-left">
                  <p className="font-medium text-sm">WhatsApp Support</p>
                  <p className="text-xs text-text-gray">+92 300 CRYPTOFI</p>
                </div>
              </div>
              <svg className="w-4 h-4 text-text-gray" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Legal & Privacy */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Legal & Privacy</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-4 bg-white border rounded-xl hover:bg-gray-50 transition-colors min-h-touch">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-primary" />
                <p className="font-medium text-sm">Terms of Service</p>
              </div>
              <ChevronRight className={`w-4 h-4 text-text-gray ${isRTL ? 'rtl-flip' : ''}`} />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-white border rounded-xl hover:bg-gray-50 transition-colors min-h-touch">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-primary" />
                <p className="font-medium text-sm">Privacy Policy</p>
              </div>
              <ChevronRight className={`w-4 h-4 text-text-gray ${isRTL ? 'rtl-flip' : ''}`} />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-white border rounded-xl hover:bg-gray-50 transition-colors min-h-touch">
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-primary" />
                <p className="font-medium text-sm">Download My Data</p>
              </div>
              <ChevronRight className={`w-4 h-4 text-text-gray ${isRTL ? 'rtl-flip' : ''}`} />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-white border border-destructive/20 rounded-xl hover:bg-red-50 transition-colors min-h-touch">
              <div className="flex items-center space-x-3">
                <Trash2 className="w-5 h-5 text-destructive" />
                <p className="font-medium text-sm text-destructive">Delete Account</p>
              </div>
              <ChevronRight className="w-4 h-4 text-destructive" />
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-4">
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="w-full py-4 border-destructive/20 text-destructive hover:bg-destructive/10 min-h-touch"
            size="lg"
          >
            Sign Out
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
