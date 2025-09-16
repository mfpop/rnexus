import React, { useState, useCallback } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Input } from "./bits";
import { Button } from "./Button";

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "tel" | "file";
  placeholder: string;
  required?: boolean;
  icon?: React.ReactNode;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | null;
  };
  accept?: string; // For file inputs
  maxSize?: number; // For file inputs (in bytes)
}

export interface FormData {
  [key: string]: string | File;
}

export interface FormErrors {
  [key: string]: string;
}

export interface AuthFormProps {
  fields: FormField[];
  onSubmit: (data: FormData) => Promise<void> | void;
  submitButtonText: string;
  submitButtonIcon?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  footer?: React.ReactNode;
}

/**
 * PasswordStrengthIndicator - Shows password strength visually
 */
export const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
  const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(password);
  const getStrengthText = () => {
    if (strength < 2) return "Weak";
    if (strength < 4) return "Medium";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (strength < 2) return "bg-red-500";
    if (strength < 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${
          strength < 2 ? "text-red-600" :
          strength < 4 ? "text-yellow-600" : "text-green-600"
        }`}>
          {getStrengthText()}
        </span>
      </div>
      <div className="text-xs text-gray-500">
        Use 8+ characters with uppercase, lowercase, numbers & symbols
      </div>
    </div>
  );
};

/**
 * PasswordInput - Enhanced password input with show/hide and strength indicator
 */
export const PasswordInput: React.FC<{
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  showStrengthIndicator?: boolean;
  disabled?: boolean;
  required?: boolean;
}> = ({
  name,
  value,
  onChange,
  placeholder,
  error,
  showStrengthIndicator = false,
  disabled = false,
  required = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <div className="w-5 h-5 text-gray-400" />
        </div>
        <Input
          type={showPassword ? "text" : "password"}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          // variant={error ? "error" : "default"}
          className="w-full pl-12 pr-12 py-3"
          placeholder={placeholder}
          disabled={disabled}
          required={required}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>
      {showStrengthIndicator && <PasswordStrengthIndicator password={value} />}
      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

/**
 * AuthForm - Reusable authentication form component
 */
export const AuthForm: React.FC<AuthFormProps> = ({
  fields,
  onSubmit,
  submitButtonText,
  submitButtonIcon,
  isLoading = false,
  className = "",
  footer
}) => {
  const [formData, setFormData] = useState<FormData>(() =>
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = useCallback((field: FormField, value: string | File): string | null => {
    if (field.type === "file") {
      if (field.required && !value) {
        return `${field.label} is required`;
      }
      if (value instanceof File) {
        if (field.maxSize && value.size > field.maxSize) {
          return `${field.label} must be less than ${Math.round(field.maxSize / 1024 / 1024)}MB`;
        }
        if (field.accept && !field.accept.split(',').some(type =>
          value.type.match(type.trim().replace('*', '.*'))
        )) {
          return `Please select a valid ${field.label.toLowerCase()} file`;
        }
      }
      return null;
    }

    const stringValue = typeof value === 'string' ? value : '';
    if (field.required && !stringValue.trim()) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      const { minLength, maxLength, pattern, custom } = field.validation;

      if (minLength && stringValue.length < minLength) {
        return `${field.label} must be at least ${minLength} characters`;
      }

      if (maxLength && stringValue.length > maxLength) {
        return `${field.label} must be no more than ${maxLength} characters`;
      }

      if (pattern && !pattern.test(stringValue)) {
        return `Please enter a valid ${field.label.toLowerCase()}`;
      }

      if (custom) {
        return custom(stringValue);
      }
    }

    return null;
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    fields.forEach(field => {
      const value = formData[field.name] || "";
      const error = validateField(field, value);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fields, formData, validateField]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] as File }));

      // Clear error when user selects a file
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: "" }));
      }
    }
  };

  const handleInputBlur = (fieldName: string) => {
    const field = fields.find(f => f.name === fieldName);
    if (field) {
      const value = formData[fieldName] || "";
      const error = validateField(field, value);
      if (error) {
        setErrors(prev => ({ ...prev, [fieldName]: error }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {fields.map(field => (
        <div key={field.name}>
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {field.type === "password" ? (
            <PasswordInput
              name={field.name}
              value={typeof formData[field.name] === 'string' ? formData[field.name] as string : ""}
              onChange={handleInputChange}
              placeholder={field.placeholder}
              error={errors[field.name]}
              showStrengthIndicator={field.name === "password"}
              disabled={isLoading}
              required={field.required}
            />
          ) : field.type === "file" ? (
            <div className="relative">
              <input
                type="file"
                id={field.name}
                name={field.name}
                onChange={handleFileChange}
                accept={field.accept}
                disabled={isLoading}
                required={field.required}
                className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
              />
              {formData[field.name] instanceof File && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected: {(formData[field.name] as File).name}
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              {field.icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {field.icon}
                </div>
              )}
              <Input
                type={field.type}
                id={field.name}
                name={field.name}
                value={typeof formData[field.name] === 'string' ? formData[field.name] as string : ""}
                onChange={handleInputChange}
                onBlur={() => handleInputBlur(field.name)}
                // variant={errors[field.name] ? "error" : "default"}
                className={`w-full ${field.icon ? "pl-12" : "pl-4"} pr-4 py-3`}
                placeholder={field.placeholder}
                disabled={isLoading}
                required={field.required}
                aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
              />
            </div>
          )}

          {errors[field.name] && (
            <div
              id={`${field.name}-error`}
              className="flex items-center gap-2 mt-2 text-red-600 text-sm"
              role="alert"
            >
              <AlertCircle className="h-4 w-4" />
              <span>{errors[field.name]}</span>
            </div>
          )}
        </div>
      ))}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            {submitButtonIcon}
            <span>{submitButtonText}</span>
          </div>
        )}
      </Button>

      {footer && (
        <div className="mt-6">
          {footer}
        </div>
      )}
    </form>
  );
};

export default AuthForm;
