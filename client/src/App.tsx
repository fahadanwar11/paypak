import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language";
import NotFound from "@/pages/not-found";
import Onboarding from "@/pages/onboarding";
import OTPVerification from "@/pages/otp-verification";
import Dashboard from "@/pages/dashboard";
import SendMoney from "@/pages/send-money";
import SendAmount from "@/pages/send-amount";
import Exchange from "@/pages/exchange";
import Settings from "@/pages/settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Onboarding />} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/verify-otp" component={OTPVerification} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/send" component={SendMoney} />
      <Route path="/send/amount" component={SendAmount} />
      <Route path="/exchange" component={Exchange} />
      <Route path="/settings" component={Settings} />
      <Route path="/transactions" component={() => <div>Transactions page coming soon</div>} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
