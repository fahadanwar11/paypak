import { Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react";

interface TransactionStep {
  label: string;
  status: 'pending' | 'completed' | 'failed' | 'current';
  timestamp?: string;
  description?: string;
}

interface TransactionStatusTrackerProps {
  steps: TransactionStep[];
  className?: string;
}

export function TransactionStatusTracker({ steps, className = "" }: TransactionStatusTrackerProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'current':
        return <RefreshCw className="w-4 h-4 text-primary animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-text-gray" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-success bg-success/5';
      case 'failed':
        return 'border-destructive bg-destructive/5';
      case 'current':
        return 'border-primary bg-primary/5';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="font-semibold text-base">Transaction Progress</h3>
      
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={index} className={`flex items-start space-x-3 p-3 border rounded-lg transition-all duration-300 ${getStatusColor(step.status)}`}>
            <div className="flex-shrink-0 mt-0.5">
              {getStatusIcon(step.status)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={`font-medium text-sm ${
                  step.status === 'completed' ? 'text-success' : 
                  step.status === 'failed' ? 'text-destructive' :
                  step.status === 'current' ? 'text-primary' : 'text-text-gray'
                }`}>
                  {step.label}
                </p>
                {step.timestamp && (
                  <span className="text-xs text-text-gray">{step.timestamp}</span>
                )}
              </div>
              
              {step.description && (
                <p className="text-xs text-text-gray mt-1">{step.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-text-gray">
          <span className="font-medium">Need help?</span> Our support team is available 24/7 via live chat.
        </p>
      </div>
    </div>
  );
}