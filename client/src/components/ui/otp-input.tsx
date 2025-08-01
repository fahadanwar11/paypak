import { useEffect, useRef, useState } from "react";
import { Input } from "./input";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
}

export function OTPInput({ length = 6, value, onChange, onComplete }: OTPInputProps) {
  const [inputs, setInputs] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const newInputs = value.split('').slice(0, length);
    while (newInputs.length < length) {
      newInputs.push('');
    }
    setInputs(newInputs);
  }, [value, length]);

  const handleChange = (index: number, newValue: string) => {
    if (newValue.length > 1) {
      // Handle paste
      const pastedValue = newValue.slice(0, length);
      const newInputs = pastedValue.split('');
      while (newInputs.length < length) {
        newInputs.push('');
      }
      setInputs(newInputs);
      onChange(pastedValue);
      
      // Focus last filled input or next empty one
      const nextIndex = Math.min(pastedValue.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      
      if (pastedValue.length === length && onComplete) {
        onComplete(pastedValue);
      }
      return;
    }

    if (!/^\d*$/.test(newValue)) return; // Only allow digits

    const newInputs = [...inputs];
    newInputs[index] = newValue;
    setInputs(newInputs);
    
    const newValue_str = newInputs.join('');
    onChange(newValue_str);

    // Move to next input
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    if (newValue && index === length - 1 && newValue_str.length === length) {
      if (onComplete) {
        onComplete(newValue_str);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !inputs[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center space-x-3">
      {inputs.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="tel"
          inputMode="numeric"
          maxLength={length} // Allow paste
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-12 h-12 text-center text-xl font-bold border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-touch min-w-touch"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}
