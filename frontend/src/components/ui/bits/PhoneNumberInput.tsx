import React, { useState, useEffect } from 'react';

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChange,
  placeholder = "Enter phone number",
  className = "",
  disabled = false
}) => {
  const [displayValue, setDisplayValue] = useState("");

  // Format the phone number for display
  const formatPhoneNumber = (phoneNumber: string): string => {
    // Remove all non-digits
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Format as xxx-xxx-xxxx
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Remove all non-digits from input
    const cleaned = input.replace(/\D/g, '');

    // Limit to 10 digits
    if (cleaned.length <= 10) {
      const formatted = formatPhoneNumber(cleaned);
      setDisplayValue(formatted);
      onChange(cleaned); // Store only digits in parent component
    }
  };

  // Handle keydown events for better UX
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, and navigation keys
    if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(e.keyCode)) {
      return;
    }

    // Allow only digits
    if (!/\d/.test(e.key)) {
      e.preventDefault();
    }
  };

  // Handle paste events
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text/plain');
    const cleaned = pastedText.replace(/\D/g, '').slice(0, 10);

    if (cleaned.length > 0) {
      const formatted = formatPhoneNumber(cleaned);
      setDisplayValue(formatted);
      onChange(cleaned);
    }
  };

  // Update display value when external value changes
  useEffect(() => {
    if (value) {
      setDisplayValue(formatPhoneNumber(value));
    } else {
      setDisplayValue("");
    }
  }, [value]);

  return (
    <input
      type="tel"
      value={displayValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      placeholder={placeholder}
      className={`w-full h-8 text-sm border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-inset rounded-md px-3 ${className}`}
      disabled={disabled}
      maxLength={12} // xxx-xxx-xxxx = 12 characters
    />
  );
};
