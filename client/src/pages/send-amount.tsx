import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBar } from "@/components/ui/status-bar";
import { BottomNav } from "@/components/ui/bottom-nav";
import { CurrencySelector } from "@/components/ui/currency-selector";
import { LiveRateIndicator } from "@/components/ui/live-rate-indicator";
import { ContextualHelp } from "@/components/ui/contextual-help";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { User, ExchangeRate } from "@shared/schema";
import { COUNTRIES, QUICK_AMOUNTS, FEES } from "@/lib/constants";
import { ArrowLeft, Edit, RefreshCw, Clock, Shield, AlertTriangle } from "lucide-react";

export default function SendAmount() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [amount, setAmount] = useState("5000");
  const [currency, setCurrency] = useState("PKR");
  const [timeLeft, setTimeLeft] = useState(272); // 4:32 in seconds

  const searchParams = new URLSearchParams(window.location.search);
  const sendType = searchParams.get("type") || "international";
  const countryCode = searchParams.get("country");
  const recipientId = searchParams.get("recipient");

  const user = JSON.parse(localStorage.getItem("user") || "{}") as User;
  
  const selectedCountry = COUNTRIES.find(c => c.code === countryCode);
  const targetCurrency = selectedCountry?.currency || "USD";

  const { data: exchangeRate } = useQuery<ExchangeRate>({
    queryKey: ["/api/exchange-rates", { from: currency, to: targetCurrency }],
    enabled: !!targetCurrency,
  });

  // Timer for rate expiry
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateSummary = () => {
    const sendAmount = parseFloat(amount) || 0;
    const rate = parseFloat(exchangeRate?.rate || "0.0035");
    const transferFee = FEES.TRANSFER_FEE;
    const exchangeFee = FEES.EXCHANGE_FEE_PERCENT / 100 * sendAmount;
    
    const totalPay = sendAmount + transferFee + exchangeFee;
    const recipientReceives = sendAmount * rate;

    return {
      sendAmount,
      transferFee,
      exchangeFee,
      totalPay,
      recipientReceives,
      rate,
    };
  };

  const summary = calculateSummary();

  const handleReview = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: t("error"),
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    navigate("/send/review");
  };

  return (
    <div className="mobile-container animate-fade-in">
      <StatusBar className="bg-white border-b text-gray-900" />
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <button 
          onClick={() => navigate("/send")}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 min-h-touch min-w-touch"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold">Send to Sarah Khan</h1>
        <div className="w-10 h-10"></div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Recipient Info */}
        <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">SK</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold">Sarah Khan</p>
            <p className="text-sm text-text-gray">
              {selectedCountry?.flag} {selectedCountry?.name} • Bank Account
            </p>
          </div>
          <button className="text-primary min-h-touch min-w-touch flex items-center justify-center">
            <Edit className="w-4 h-4" />
          </button>
        </div>

        {/* Amount Input */}
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-text-gray mb-2">You send</p>
            <div className="relative flex items-center justify-center">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="text-center text-4xl font-bold bg-transparent border-none outline-none focus:ring-0 focus:border-none"
              />
              <div className="absolute right-4">
                <CurrencySelector
                  value={currency}
                  onChange={setCurrency}
                  currencies={["PKR", "USD", "USDT"]}
                />
              </div>
            </div>
          </div>

          {/* Enhanced Exchange Rate Card */}
          <LiveRateIndicator
            fromCurrency={currency}
            toCurrency={targetCurrency}
            currentRate={exchangeRate?.rate || "284.50"}
            lastUpdate={new Date()}
            className="bg-gradient-to-r from-primary/5 to-primary-light/5 border-primary/20"
          />
          
          {/* Rate Lock Alert */}
          <div className="bg-gradient-to-r from-warning/10 to-orange-500/10 border border-warning/20 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm">Rate Lock Expires</h3>
                  <span className="text-warning font-bold text-sm flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <p className="text-sm text-text-gray mb-2">
                  Current rate is locked for your transaction. Complete within {formatTime(timeLeft)} to avoid rate changes.
                </p>
                <div className="w-full bg-warning/20 rounded-full h-2">
                  <div 
                    className="bg-warning h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${(timeLeft / 300) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Summary */}
          <div className="bg-white border rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-sm">Transaction Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <div className="flex items-center space-x-1">
                  <span className="text-text-gray">Amount you send</span>
                </div>
                <span className="font-medium">₨ {summary.sendAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center space-x-1">
                  <span className="text-text-gray">Transfer fee</span>
                  <ContextualHelp
                    topic="transfer-fee"
                    title="Transfer Fee"
                    content="This covers the cost of processing your international transfer, including compliance checks and currency conversion."
                    tips={[
                      "Fee is fixed regardless of amount",
                      "Includes compliance and security checks",
                      "No hidden charges"
                    ]}
                  />
                </div>
                <span className="font-medium">₨ {summary.transferFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center space-x-1">
                  <span className="text-text-gray">Exchange fee ({FEES.EXCHANGE_FEE_PERCENT}%)</span>
                  <ContextualHelp
                    topic="exchange-fee"
                    title="Exchange Fee"
                    content="A small percentage fee for converting PKR to foreign currency at market rates."
                    tips={[
                      "Competitive rate vs banks",
                      "Real-time market pricing",
                      "Transparent calculation"
                    ]}
                  />
                </div>
                <span className="font-medium">₨ {summary.exchangeFee.toFixed(0)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total you pay</span>
                <span>₨ {summary.totalPay.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-success font-semibold text-lg">
                <span>Recipient receives</span>
                <span>${summary.recipientReceives.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Shield className="w-4 h-4 text-success" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-success">
                    Estimated delivery: {selectedCountry?.deliveryTime || "1-2 hours"}
                  </span>
                  <span className="text-xs text-success bg-success/10 px-2 py-1 rounded-full">
                    Guaranteed
                  </span>
                </div>
                <p className="text-xs text-text-gray mt-1">
                  Money-back guarantee if not delivered on time
                </p>
              </div>
            </div>
          </div>

          {/* Quick Amounts */}
          <div className="grid grid-cols-4 gap-2">
            {QUICK_AMOUNTS.map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className={`py-3 px-2 border rounded-lg text-sm font-medium transition-colors min-h-touch ${
                  parseInt(amount) === quickAmount
                    ? "border-primary text-primary bg-primary/5"
                    : "border-gray-300 hover:border-primary hover:text-primary"
                }`}
              >
                ₨ {quickAmount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 max-w-sm mx-auto p-4 bg-white border-t">
        <Button 
          onClick={handleReview}
          className="w-full py-4 min-h-touch"
          size="lg"
        >
          Review & Send
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
