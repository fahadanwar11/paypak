import { useLanguage } from "@/hooks/use-language";

interface EnhancedProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function EnhancedProgressBar({ currentStep, totalSteps, className = "" }: EnhancedProgressBarProps) {
  const { t, isRTL } = useLanguage();
  
  const steps = [
    { key: 1, label: "Phone" },
    { key: 2, label: "OTP" },
    { key: 3, label: "CNIC" },
    { key: 4, label: "Selfie" },
  ];

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-white text-sm opacity-90">Step {currentStep} of {totalSteps}</span>
        <span className="text-white text-xs opacity-75">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-white/20 rounded-full h-2 mb-4">
        <div 
          className="bg-white h-2 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>

      {/* Step Indicators */}
      <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        {steps.map((step) => (
          <div key={step.key} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step.key <= currentStep 
                  ? 'bg-white text-primary' 
                  : 'bg-white/20 text-white/60'
              }`}
            >
              {step.key <= currentStep ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                step.key
              )}
            </div>
            <span className={`text-xs mt-1 transition-all duration-300 ${
              step.key <= currentStep ? 'text-white font-medium' : 'text-white/60'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}