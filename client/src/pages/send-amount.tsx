import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBar } from "@/components/ui/status-bar";
import { BottomNav } from "@/components/ui/bottom-nav";
import { CurrencySelector } from "@/components/ui/currency-selector";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { User, ExchangeRate } from "@shared/schema";
import { COUNTRIES, QUICK_AMOUNTS, FEES } from "@/lib/constants";
import { ArrowLeft, Edit, RefreshCw, Clock } from "lucide-react";

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

          {/* Exchange Rate Card */}
          <div className="bg-gradient-to-r from-primary/5 to-primary-light/5 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Live Exchange Rate</span>
              </div>
              <span className="text-xs text-success bg-success/10 px-2 py-1 rounded-full">
                <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                +0.5%
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-gray">1 {targetCurrency} =</span>
                <span className="font-semibold">₨ {parseFloat(exchangeRate?.rate || "284.50").toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-gray">Rate expires in:</span>
                <span className="font-semibold text-warning flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Summary */}
          <div className="bg-white border rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-sm">Transaction Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-gray">Amount you send</span>
                <span className="font-medium">₨ {summary.sendAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-gray">Transfer fee</span>
                <span className="font-medium">₨ {summary.transferFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-gray">Exchange fee</span>
                <span className="font-medium">₨ {summary.exchangeFee.toFixed(0)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total you pay</span>
                <span>₨ {summary.totalPay.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-success font-semibold">
                <span>Recipient receives</span>
                <span>${summary.recipientReceives.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Clock className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">
                Estimated delivery: {selectedCountry?.deliveryTime || "1-2 hours"}
              </span>
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
