import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

interface SuccessAnimationProps {
  trigger: boolean;
  message?: string;
  onComplete?: () => void;
  className?: string;
}

export function SuccessAnimation({ 
  trigger, 
  message = "Success!", 
  onComplete,
  className = "" 
}: SuccessAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsVisible(true);
      setIsAnimating(true);
      
      // Start exit animation after 2 seconds
      const exitTimer = setTimeout(() => {
        setIsAnimating(false);
      }, 2000);

      // Hide completely after animation
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 2500);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [trigger, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${className}`}>
      {/* Overlay */}
      <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`} />
      
      {/* Success Content */}
      <div className={`relative bg-white rounded-2xl p-8 shadow-xl border max-w-xs mx-4 transform transition-all duration-500 ${
        isAnimating 
          ? 'scale-100 opacity-100 translate-y-0' 
          : 'scale-95 opacity-0 translate-y-4'
      }`}>
        {/* Confetti Effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full animate-bounce ${
                i % 4 === 0 ? 'bg-success' :
                i % 4 === 1 ? 'bg-primary' :
                i % 4 === 2 ? 'bg-warning' : 'bg-purple-accent'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className={`transition-transform duration-700 ${
              isAnimating ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
            }`}>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </div>
          
          {/* Success Message */}
          <h3 className="text-lg font-bold mb-2 text-success">
            {message}
          </h3>
          
          {/* Subtitle */}
          <p className="text-sm text-text-gray">
            Your transaction has been processed successfully
          </p>
          
          {/* Progress Ring */}
          <div className="w-12 h-12 mx-auto mt-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="stroke-gray-200"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="stroke-success transition-all duration-2000 ease-out"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={isAnimating ? "100, 100" : "0, 100"}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}