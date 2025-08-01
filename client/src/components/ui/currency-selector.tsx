import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { CURRENCIES } from "@/lib/constants";

interface CurrencySelectorProps {
  value: string;
  onChange: (currency: string) => void;
  currencies?: string[];
  className?: string;
}

export function CurrencySelector({ 
  value, 
  onChange, 
  currencies = Object.keys(CURRENCIES),
  className = "" 
}: CurrencySelectorProps) {
  const [open, setOpen] = useState(false);
  
  const selectedCurrency = CURRENCIES[value as keyof typeof CURRENCIES];
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={`flex items-center space-x-2 min-h-touch ${className}`}
        >
          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">
              {selectedCurrency?.icon || value}
            </span>
          </div>
          <span className="font-semibold">{value}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Select Currency</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2">
          {currencies.map((currency) => {
            const currencyInfo = CURRENCIES[currency as keyof typeof CURRENCIES];
            return (
              <button
                key={currency}
                onClick={() => {
                  onChange(currency);
                  setOpen(false);
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors min-h-touch ${
                  value === currency 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-sm">
                    {currencyInfo?.icon || currency}
                  </span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">{currency}</p>
                  <p className="text-xs text-text-gray">{currencyInfo?.name}</p>
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
