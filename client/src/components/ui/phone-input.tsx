import { useState } from "react";
import { Input } from "./input";
import { Label } from "./label";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

export function PhoneInput({ 
  value, 
  onChange, 
  placeholder = "301 2345678",
  label = "Phone Number",
  error 
}: PhoneInputProps) {
  const [focused, setFocused] = useState(false);

  const formatPhoneNumber = (input: string) => {
    // Remove all non-digits
    const digits = input.replace(/\D/g, '');
    
    // Format as XXX XXXXXXX for Pakistani mobile numbers
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 10) {
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    }
    return `${digits.slice(0, 3)} ${digits.slice(3, 10)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(formatted);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="phone">{label}</Label>
      <div className="flex">
        <div className="flex items-center px-3 py-3 border border-gray-300 rounded-l-lg bg-gray-50 min-h-touch">
          <span className="text-lg mr-2">🇵🇰</span>
          <span className="text-sm font-medium">+92</span>
        </div>
        <Input
          id="phone"
          type="tel"
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={`flex-1 rounded-l-none border-l-0 min-h-touch ${
            error ? 'border-destructive focus:border-destructive' : ''
          } ${focused ? 'ring-2 ring-primary ring-offset-2' : ''}`}
          maxLength={13}
        />
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
