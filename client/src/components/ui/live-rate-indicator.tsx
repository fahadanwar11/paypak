import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

interface LiveRateIndicatorProps {
  fromCurrency: string;
  toCurrency: string;
  currentRate: string;
  lastUpdate?: Date;
  className?: string;
}

export function LiveRateIndicator({ 
  fromCurrency, 
  toCurrency, 
  currentRate, 
  lastUpdate = new Date(),
  className = "" 
}: LiveRateIndicatorProps) {
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [isLive, setIsLive] = useState(true);
  const [lastUpdateText, setLastUpdateText] = useState('');

  useEffect(() => {
    // Simulate rate changes
    const interval = setInterval(() => {
      const change = Math.random() - 0.5;
      if (change > 0.1) setTrend('up');
      else if (change < -0.1) setTrend('down');
      else setTrend('stable');
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateLastUpdateText = () => {
      const now = new Date();
      const diffMs = now.getTime() - lastUpdate.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);

      if (diffSeconds < 10) {
        setLastUpdateText('just now');
      } else if (diffSeconds < 60) {
        setLastUpdateText(`${diffSeconds}s ago`);
      } else if (diffMinutes < 60) {
        setLastUpdateText(`${diffMinutes}m ago`);
      } else {
        setLastUpdateText('over 1h ago');
        setIsLive(false);
      }
    };

    updateLastUpdateText();
    const interval = setInterval(updateLastUpdateText, 1000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-success" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-destructive" />;
      default:
        return <RefreshCw className="w-3 h-3 text-text-gray" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-success bg-success/10';
      case 'down':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-text-gray bg-gray-100';
    }
  };

  return (
    <div className={`flex items-center justify-between p-3 border rounded-lg ${className}`}>
      <div className="flex items-center space-x-2">
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="font-medium">
            1 {toCurrency} = ₨ {parseFloat(currentRate).toFixed(2)}
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 text-xs text-text-gray">
        <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-success animate-pulse' : 'bg-gray-400'}`}></div>
        <span>{isLive ? 'Live' : 'Stale'} • {lastUpdateText}</span>
      </div>
    </div>
  );
}