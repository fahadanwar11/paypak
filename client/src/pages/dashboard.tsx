import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { StatusBar } from "@/components/ui/status-bar";
import { BottomNav } from "@/components/ui/bottom-nav";
import { BalanceCard } from "@/components/ui/balance-card";
import { TransactionItem } from "@/components/ui/transaction-item";
import { TrustIndicator } from "@/components/ui/trust-indicator";
import { useLanguage } from "@/hooks/use-language";
import { User, Balance, Transaction } from "@shared/schema";
import { Plus, Send, RefreshCw, HelpCircle, Bell, Settings as SettingsIcon, Lightbulb } from "lucide-react";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/onboarding");
    }
  }, [navigate]);

  const { data: balances = [] } = useQuery<Balance[]>({
    queryKey: ["/api/users", user?.id, "balances"],
    enabled: !!user?.id,
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/users", user?.id, "transactions"],
    enabled: !!user?.id,
  });

  if (!user) {
    return <div className="mobile-container">Loading...</div>;
  }

  const calculateTotalValue = (balances: Balance[]) => {
    // Simple calculation - in real app would use exchange rates
    const pkrBalance = balances.find(b => b.currency === "PKR");
    return `₨ ${parseFloat(pkrBalance?.amount || "0").toLocaleString()}`;
  };

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

  const quickActions = [
    { icon: Plus, label: t("addMoney"), action: () => {}, bgColor: "bg-success/10", iconColor: "text-success" },
    { icon: Send, label: t("send"), action: () => navigate("/send"), bgColor: "bg-primary/10", iconColor: "text-primary" },
    { icon: RefreshCw, label: t("exchange"), action: () => navigate("/exchange"), bgColor: "bg-warning/10", iconColor: "text-warning" },
    { icon: HelpCircle, label: t("help"), action: () => {}, bgColor: "bg-purple-accent/10", iconColor: "text-purple-accent" },
  ];

  return (
    <div className="mobile-container animate-fade-in">
      <StatusBar className="bg-primary text-white" />
      
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">{getUserInitials(user)}</span>
            </div>
            <div>
              <p className="text-sm opacity-90">{t("welcomeBack")}</p>
              <p className="font-semibold">{getUserName(user)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center min-h-touch min-w-touch relative"
              onClick={() => {}}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
            </button>
            <button 
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center min-h-touch min-w-touch"
              onClick={() => navigate("/settings")}
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Balance Card */}
        <BalanceCard 
          balances={balances}
          totalValue={calculateTotalValue(balances)}
          className="text-white"
        />

        {/* Trust Indicator */}
        <TrustIndicator />
      </div>

      {/* Content */}
      <div className="p-4 pb-20">
        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={action.action}
              className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border min-h-touch hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 ${action.bgColor} rounded-full flex items-center justify-center mb-2`}>
                <action.icon className={`w-5 h-5 ${action.iconColor}`} />
              </div>
              <span className="text-xs font-medium text-center">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{t("recentActivity")}</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate("/transactions")}>
              {t("viewAll")}
            </Button>
          </div>

          <div className="space-y-3">
            {transactions.slice(0, 3).map((transaction) => (
              <TransactionItem 
                key={transaction.id} 
                transaction={transaction}
                onClick={() => {}}
              />
            ))}
            
            {transactions.length === 0 && (
              <div className="text-center py-8 text-text-gray">
                <p>No transactions yet</p>
                <p className="text-sm">Start by adding money or sending to someone</p>
              </div>
            )}
          </div>
        </div>

        {/* Educational Nudge */}
        <div className="bg-gradient-to-r from-purple-accent/10 to-primary/10 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-4 h-4 text-purple-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">💡 Pro Tip</h3>
              <p className="text-sm text-text-gray mb-2">
                Exchange during off-peak hours (2-6 AM) for better rates and lower network fees.
              </p>
              <button className="text-xs text-purple-accent font-medium">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
