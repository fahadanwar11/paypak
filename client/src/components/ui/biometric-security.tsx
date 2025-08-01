import { useState } from "react";
import { Fingerprint, Smartphone, Shield, Check } from "lucide-react";
import { Button } from "./button";
import { Dialog, DialogContent } from "./dialog";

interface BiometricSecurityProps {
  onSuccess: () => void;
  onCancel: () => void;
  isOpen: boolean;
  amount?: string;
  action?: string;
}

export function BiometricSecurity({ 
  onSuccess, 
  onCancel, 
  isOpen, 
  amount = "₨ 50,000",
  action = "Exchange"
}: BiometricSecurityProps) {
  const [step, setStep] = useState<'select' | 'authenticating' | 'success'>('select');
  const [selectedMethod, setSelectedMethod] = useState<'fingerprint' | 'face' | null>(null);

  const handleMethodSelect = (method: 'fingerprint' | 'face') => {
    setSelectedMethod(method);
    setStep('authenticating');
    
    // Simulate authentication
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
        setStep('select');
        setSelectedMethod(null);
      }, 1500);
    }, 2000);
  };

  const renderStep = () => {
    switch (step) {
      case 'select':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-2">Secure Authentication</h3>
              <p className="text-text-gray mb-1">
                {action} of {amount} requires biometric verification
              </p>
              <p className="text-xs text-text-gray">
                Choose your preferred method below
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleMethodSelect('fingerprint')}
                className="w-full p-4 border-2 border-primary/20 rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Fingerprint className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Fingerprint</p>
                    <p className="text-sm text-text-gray">Touch sensor to authenticate</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleMethodSelect('face')}
                className="w-full p-4 border-2 border-primary/20 rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Face ID</p>
                    <p className="text-sm text-text-gray">Look at your device to authenticate</p>
                  </div>
                </div>
              </button>
            </div>

            <Button variant="outline" onClick={onCancel} className="w-full">
              Cancel
            </Button>
          </div>
        );

      case 'authenticating':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <div className="animate-pulse">
                {selectedMethod === 'fingerprint' ? (
                  <Fingerprint className="w-10 h-10 text-primary" />
                ) : (
                  <Smartphone className="w-10 h-10 text-primary" />
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-2">Authenticating...</h3>
              <p className="text-text-gray">
                {selectedMethod === 'fingerprint' 
                  ? 'Please place your finger on the sensor'
                  : 'Position your face in front of the camera'
                }
              </p>
            </div>

            {/* Animated scanning effect */}
            <div className="w-32 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full animate-pulse"></div>
            </div>

            <Button variant="outline" onClick={onCancel} className="w-full">
              Cancel
            </Button>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-success animate-bounce" />
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-success mb-2">Verified!</h3>
              <p className="text-text-gray">
                Authentication successful. Processing your {action.toLowerCase()}...
              </p>
            </div>

            <div className="w-16 h-1 bg-success rounded-full mx-auto animate-pulse"></div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      if (step === 'select') {
        onCancel();
      }
    }}>
      <DialogContent className="max-w-sm mx-4">
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
}