import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { StatusBar } from "@/components/ui/status-bar";
import { BottomNav } from "@/components/ui/bottom-nav";
import { useLanguage } from "@/hooks/use-language";
import { User, Recipient } from "@shared/schema";
import { COUNTRIES } from "@/lib/constants";
import { ArrowLeft, History, Globe, MapPin, Search, Plus } from "lucide-react";

export default function SendMoney() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<"international" | "domestic">("international");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}") as User;

  const { data: recipients = [] } = useQuery<Recipient[]>({
    queryKey: ["/api/users", user.id, "recipients"],
    enabled: !!user.id,
  });

  const handleContinue = () => {
    if (!selectedCountry && selectedType === "international") {
      return;
    }
    
    const queryParams = new URLSearchParams({
      type: selectedType,
      ...(selectedCountry && { country: selectedCountry }),
      ...(selectedRecipient && { recipient: selectedRecipient }),
    });
    
    navigate(`/send/amount?${queryParams.toString()}`);
  };

  const getRecipientInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
  };

  const getCountryRate = (currency: string) => {
    // Mock exchange rates - in real app would fetch from API
    const rates: Record<string, string> = {
      USD: "284.50",
      GBP: "356.20",
      AED: "77.45",
      CAD: "210.30",
      AUD: "190.80",
    };
    return rates[currency] || "1.00";
  };

  return (
    <div className="mobile-container animate-fade-in">
      <StatusBar className="bg-white border-b text-gray-900" />
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <button 
          onClick={() => navigate("/dashboard")}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 min-h-touch min-w-touch"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold">{t("sendMoney")}</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 min-h-touch min-w-touch">
          <History className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Send Type Selection */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold">{t("whereAreSending")}</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedType("international")}
              className={`p-4 border-2 rounded-xl text-left transition-all min-h-touch ${
                selectedType === "international"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Globe className={`w-5 h-5 ${selectedType === "international" ? "text-primary" : "text-gray-400"}`} />
                {selectedType === "international" && <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>}
              </div>
              <p className="font-semibold text-sm">{t("international")}</p>
              <p className="text-xs text-text-gray">Send worldwide</p>
            </button>
            
            <button
              onClick={() => setSelectedType("domestic")}
              className={`p-4 border-2 rounded-xl text-left transition-all min-h-touch ${
                selectedType === "domestic"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <MapPin className={`w-5 h-5 ${selectedType === "domestic" ? "text-primary" : "text-gray-400"}`} />
                {selectedType === "domestic" && <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>}
              </div>
              <p className="font-semibold text-sm">{t("domestic")}</p>
              <p className="text-xs text-text-gray">Within Pakistan</p>
            </button>
          </div>
        </div>

        {/* Country Selection (only for international) */}
        {selectedType === "international" && (
          <div className="space-y-3">
            <h3 className="text-base font-semibold">{t("selectCountry")}</h3>
            <div className="space-y-2">
              {COUNTRIES.map((country) => (
                <button
                  key={country.code}
                  onClick={() => setSelectedCountry(country.code)}
                  className={`w-full flex items-center justify-between p-4 bg-white border rounded-xl hover:bg-gray-50 transition-colors min-h-touch ${
                    selectedCountry === country.code ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div className="text-left">
                      <p className="font-medium text-sm">{country.name}</p>
                      <p className="text-xs text-text-gray">{country.currency} • {country.deliveryTime}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-gray">Rate</p>
                    <p className="font-semibold text-sm">1 {country.currency} = ₨ {getCountryRate(country.currency)}</p>
                  </div>
                </button>
              ))}
              
              <button className="w-full flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl text-text-gray hover:border-gray-400 transition-colors min-h-touch">
                <Search className="w-4 h-4 mr-2" />
                <span className="font-medium">Search more countries</span>
              </button>
            </div>
          </div>
        )}

        {/* Recent Recipients */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold">{t("recentRecipients")}</h3>
          <div className="flex space-x-3 overflow-x-auto pb-2 custom-scrollbar">
            {recipients.slice(0, 3).map((recipient) => (
              <button
                key={recipient.id}
                onClick={() => setSelectedRecipient(recipient.id)}
                className={`flex-shrink-0 flex flex-col items-center p-3 bg-white border rounded-xl min-w-touch min-h-touch ${
                  selectedRecipient === recipient.id ? "border-primary bg-primary/5" : ""
                }`}
              >
                <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mb-2">
                  <span className="text-white font-semibold text-sm">
                    {getRecipientInitials(recipient.name)}
                  </span>
                </div>
                <p className="text-xs font-medium truncate w-16 text-center">
                  {recipient.name.split(' ')[0]}
                </p>
              </button>
            ))}
            
            <button 
              onClick={() => {}}
              className="flex-shrink-0 flex flex-col items-center p-3 border-2 border-dashed border-gray-300 rounded-xl min-w-touch min-h-touch hover:border-gray-400 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <Plus className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-xs font-medium text-text-gray">{t("addNew")}</p>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 max-w-sm mx-auto p-4 bg-white border-t">
        <Button 
          onClick={handleContinue}
          disabled={selectedType === "international" && !selectedCountry}
          className="w-full py-4 min-h-touch"
          size="lg"
        >
          {t("continue")}
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
