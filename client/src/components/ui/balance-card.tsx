import { useState } from "react";
import { Eye, EyeOff, TrendingUp } from "lucide-react";
import { CURRENCIES } from "@/lib/constants";
import { useLanguage } from "@/hooks/use-language";

interface Balance {
  currency: string;
  amount: string;
}

interface BalanceCardProps {
  balances: Balance[];
  totalValue: string;
  className?: string;
}

export function BalanceCard({ balances, totalValue, className = "" }: BalanceCardProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useLanguage();

  const formatBalance = (currency: string, amount: string) => {
    const currencyInfo = CURRENCIES[currency as keyof typeof CURRENCIES];
    if (!currencyInfo) return amount;
    
    const numAmount = parseFloat(amount);
    if (currency === "PKR") {
      return `₨ ${numAmount.toLocaleString()}`;
    } else if (currency === "BTC") {
      return `${numAmount.toFixed(5)} BTC`;
    } else {
      return `$${numAmount.toFixed(2)}`;
    }
  };

  return (
    <div className={`glass-effect rounded-2xl p-5 mb-4 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm opacity-90 mb-1">{t("totalBalance")}</p>
          <div className="flex items-center">
            <h2 className="text-3xl font-bold">
              {isVisible ? totalValue : "••••••"}
            </h2>
            <span className="ml-2 text-xs bg-success/20 text-success px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +2.5%
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="p-2 bg-white/20 rounded-lg min-h-touch min-w-touch hover:bg-white/30 transition-colors"
          aria-label={isVisible ? "Hide balance" : "Show balance"}
        >
          {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-3 text-center">
        {balances.slice(0, 3).map((balance) => {
          const currencyInfo = CURRENCIES[balance.currency as keyof typeof CURRENCIES];
          return (
            <div key={balance.currency} className="bg-white/10 rounded-lg p-3">
              <p className="text-xs opacity-75">{balance.currency}</p>
              <p className="font-semibold text-sm">
                {isVisible ? formatBalance(balance.currency, balance.amount) : "••••"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
