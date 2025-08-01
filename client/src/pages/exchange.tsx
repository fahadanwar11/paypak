import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBar } from "@/components/ui/status-bar";
import { BottomNav } from "@/components/ui/bottom-nav";
import { LiveRateIndicator } from "@/components/ui/live-rate-indicator";
import { ContextualHelp } from "@/components/ui/contextual-help";
import { BiometricSecurity } from "@/components/ui/biometric-security";
import { SuccessAnimation } from "@/components/ui/success-animation";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { User, Balance, ExchangeRate } from "@shared/schema";
import { CURRENCIES, QUICK_AMOUNTS, FEES } from "@/lib/constants";
import { ArrowLeft, History, RefreshCw, ChevronDown, Info, Shield, ArrowUpDown, Zap, Clock, AlertTriangle } from "lucide-react";

export default function Exchange() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [fromCurrency, setFromCurrency] = useState("PKR");
  const [toCurrency, setToCurrency] = useState("USDT");
  const [fromAmount, setFromAmount] = useState("10000");
  const [showBiometric, setShowBiometric] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}") as User;

  const { data: balances = [] } = useQuery<Balance[]>({
    queryKey: ["/api/users", user.id, "balances"],
    enabled: !!user.id,
  });

  const { data: exchangeRate } = useQuery<ExchangeRate>({
    queryKey: ["/api/exchange-rates", { from: fromCurrency, to: toCurrency }],
    enabled: !!fromCurrency && !!toCurrency,
  });

  const getBalance = (currency: string) => {
    const balance = balances.find(b => b.currency === currency);
    return parseFloat(balance?.amount || "0");
  };

  const calculateExchange = () => {
    const amount = parseFloat(fromAmount) || 0;
    const rate = parseFloat(exchangeRate?.rate || "0.0035");
    const platformFee = amount * (FEES.EXCHANGE_FEE_PERCENT / 100);
    const networkFee = toCurrency === "USDT" ? FEES.NETWORK_FEE_USDT : FEES.NETWORK_FEE_BTC;
    const totalCost = amount + platformFee + networkFee;
    const toAmount = amount * rate;

    return {
      amount,
      rate,
      platformFee,
      networkFee,
      totalCost,
      toAmount,
    };
  };

  const exchange = calculateExchange();

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount("0");
  };

  const handleQuickAmount = (amount: number) => {
    if (amount === -1) {
      // "All" button
      const balance = getBalance(fromCurrency);
      setFromAmount(balance.toString());
    } else {
      setFromAmount(amount.toString());
    }
  };

  const handleExchange = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast({
        title: t("error"),
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const balance = getBalance(fromCurrency);
    if (exchange.totalCost > balance) {
      toast({
        title: t("error"),
        description: "Insufficient balance",
        variant: "destructive",
      });
      return;
    }

    // Check if biometric authentication is needed (for amounts > ₨25,000)
    if (parseFloat(fromAmount) > 25000) {
      setShowBiometric(true);
    } else {
      processExchange();
    }
  };

  const processExchange = () => {
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      
      toast({
        title: "Exchange complete",
        description: `Successfully exchanged ₨${parseFloat(fromAmount).toLocaleString()} to ${exchange.toAmount.toFixed(4)} ${toCurrency}`,
      });
    }, 2000);
  };

  const getCurrencyColor = (currency: string) => {
    switch (currency) {
      case "PKR": return "bg-success/20 text-success";
      case "USDT": return "bg-warning/20 text-warning";
      case "BTC": return "bg-orange-500/20 text-orange-500";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getCurrencyIcon = (currency: string) => {
    return CURRENCIES[currency as keyof typeof CURRENCIES]?.icon || currency;
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
        <h1 className="text-lg font-semibold">{t("exchange")}</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 min-h-touch min-w-touch">
          <History className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Exchange Widget */}
        <div className="bg-white border rounded-2xl p-6 space-y-4">
          {/* From */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-gray">From</label>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${getCurrencyColor(fromCurrency)} rounded-full flex items-center justify-center`}>
                  <span className="font-bold text-sm">{getCurrencyIcon(fromCurrency)}</span>
                </div>
                <div>
                  <p className="font-semibold">{fromCurrency}</p>
                  <p className="text-xs text-text-gray">{CURRENCIES[fromCurrency as keyof typeof CURRENCIES]?.name}</p>
                </div>
              </div>
              <div className="text-right">
                <Input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="0"
                  className="text-right text-xl font-bold bg-transparent border-none outline-none w-24 p-0 focus:ring-0"
                />
                <p className="text-xs text-text-gray">
                  Balance: {getCurrencyIcon(fromCurrency)} {getBalance(fromCurrency).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors min-h-touch min-w-touch"
            >
              <RefreshCw className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* To */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-gray">To</label>
            <div className="relative">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <button className="flex items-center space-x-3 min-h-touch">
                  <div className={`w-10 h-10 ${getCurrencyColor(toCurrency)} rounded-full flex items-center justify-center`}>
                    <span className="font-bold text-sm">{getCurrencyIcon(toCurrency)}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{toCurrency}</p>
                    <p className="text-xs text-text-gray">{CURRENCIES[toCurrency as keyof typeof CURRENCIES]?.name}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-text-gray" />
                </button>
                <div className="text-right">
                  <p className="text-xl font-bold">{exchange.toAmount.toFixed(5)}</p>
                  <p className="text-xs text-text-gray">
                    Balance: {getCurrencyIcon(toCurrency)} {getBalance(toCurrency).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Market Info */}
        <LiveRateIndicator
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          currentRate={(1/exchange.rate).toFixed(2)}
          lastUpdate={new Date()}
          className="bg-gradient-to-r from-primary/5 to-warning/5 border-primary/20"
        />

        {/* Fee Breakdown with Help */}
        <div className="bg-white border rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-sm">Fee Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <div className="flex items-center space-x-1">
                <span className="text-text-gray">Platform Fee ({FEES.EXCHANGE_FEE_PERCENT}%)</span>
                <ContextualHelp
                  topic="platform-fee"
                  title="Platform Fee"
                  content="A small percentage fee that covers our exchange services, security measures, and regulatory compliance."
                  tips={[
                    "Much lower than traditional banks",
                    "Transparent with no hidden costs",
                    "Funds advanced security features"
                  ]}
                />
              </div>
              <span className="font-semibold">₨ {exchange.platformFee.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center space-x-1">
                <span className="text-text-gray">Network Fee</span>
                <ContextualHelp
                  topic="network-fee"
                  title="Network Fee"
                  content="Blockchain network fee required to process the transaction. This goes directly to miners/validators."
                  tips={[
                    "Varies based on network congestion",
                    "Currently at optimal levels",
                    "Ensures fast transaction confirmation"
                  ]}
                />
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-semibold">₨ {exchange.networkFee}</span>
                <span className="text-xs text-success bg-success/10 px-1 rounded">Low</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-text-gray">Market Slippage</span>
              <span className="font-semibold text-warning">~0.1%</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Cost</span>
              <span>₨ {exchange.totalCost.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Security Notice for Large Amounts */}
        {parseFloat(fromAmount) > 25000 && (
          <div className="bg-gradient-to-r from-warning/10 to-orange-500/10 border border-warning/20 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">Enhanced Security Required</h3>
                <p className="text-sm text-text-gray mb-2">
                  Exchanges above ₨25,000 require biometric authentication for your security.
                </p>
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span>SBP Compliant</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Anti-Fraud Protection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Exchange Amounts */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Quick Amounts</h3>
          <div className="grid grid-cols-4 gap-2">
            {[2500, 5000, 10000, -1].map((amount, index) => (
              <button
                key={index}
                onClick={() => handleQuickAmount(amount)}
                className={`py-3 px-2 border rounded-lg text-sm font-medium transition-colors min-h-touch ${
                  (amount === -1 ? getBalance(fromCurrency) : amount) === parseFloat(fromAmount)
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-300 hover:border-primary hover:text-primary"
                }`}
              >
                {amount === -1 ? "All" : `₨ ${(amount/1000)}K`}
              </button>
            ))}
          </div>
        </div>

        {/* Educational Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm mb-1">Understanding USDT</h3>
              <p className="text-sm text-text-gray">
                USDT (Tether) is a stablecoin pegged to the US Dollar. It's widely accepted and maintains price stability, making it ideal for cross-border transactions.
              </p>
              <button className="text-xs text-primary font-medium mt-2">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Portfolio After Trade */}
        <div className="bg-white border rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-sm">Portfolio After Exchange</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 ${getCurrencyColor(fromCurrency)} rounded-full flex items-center justify-center`}>
                  <span className="text-xs font-bold">{getCurrencyIcon(fromCurrency)}</span>
                </div>
                <span className="text-sm font-medium">{fromCurrency}</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">
                  {getCurrencyIcon(fromCurrency)} {(getBalance(fromCurrency) - exchange.totalCost).toLocaleString()}
                </p>
                <p className="text-xs text-destructive">-{getCurrencyIcon(fromCurrency)} {exchange.totalCost.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 ${getCurrencyColor(toCurrency)} rounded-full flex items-center justify-center`}>
                  <span className="text-xs font-bold">{getCurrencyIcon(toCurrency)}</span>
                </div>
                <span className="text-sm font-medium">{toCurrency}</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">
                  {getCurrencyIcon(toCurrency)} {(getBalance(toCurrency) + exchange.toAmount).toFixed(2)}
                </p>
                <p className="text-xs text-success">+{getCurrencyIcon(toCurrency)} {exchange.toAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 max-w-sm mx-auto p-4 bg-white border-t">
        <Button 
          onClick={handleExchange}
          disabled={isProcessing || !fromAmount || parseFloat(fromAmount) <= 0}
          className="w-full py-4 text-lg font-semibold min-h-touch relative overflow-hidden"
          size="lg"
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <ArrowUpDown className="w-5 h-5" />
              <span>Exchange ₨ {exchange.amount.toLocaleString()} → {getCurrencyIcon(toCurrency)} {exchange.toAmount.toFixed(2)}</span>
            </div>
          )}
          
          {/* Shimmer effect for high-value transactions */}
          {parseFloat(fromAmount) > 25000 && !isProcessing && (
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          )}
        </Button>

        {/* Processing Status */}
        {isProcessing && (
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div>
                <p className="font-medium text-sm">Processing Exchange</p>
                <p className="text-xs text-text-gray">Securing best rates...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
      
      {/* Biometric Authentication */}
      <BiometricSecurity
        isOpen={showBiometric}
        amount={`₨ ${parseFloat(fromAmount).toLocaleString()}`}
        action="Exchange"
        onSuccess={() => {
          setShowBiometric(false);
          processExchange();
        }}
        onCancel={() => setShowBiometric(false)}
      />
      
      {/* Success Animation */}
      <SuccessAnimation 
        trigger={showSuccess}
        message="Exchange Complete!"
        onComplete={() => {
          setShowSuccess(false);
          navigate("/dashboard");
        }}
      />
    </div>
  );
}
