import React, { useState } from "react";
import { User, Phone, Star } from "lucide-react";
import { Input } from "../ui/bits";

interface NamePhoneData {
  first_name: string;
  middle_name: string;
  last_name: string;
  maternal_last_name: string;
  preferred_name: string;
  phone: string;
  phone_country_code: string;
  phone_type: 'mobile' | 'home' | 'work' | 'other';
  secondary_phone: string;
}

interface NamePhoneFormProps {
  value: NamePhoneData;
  onChange: (data: NamePhoneData) => void;
  className?: string;
}

const NamePhoneForm: React.FC<NamePhoneFormProps> = ({ value, onChange, className = "" }) => {
  const [phoneError, setPhoneError] = useState("");
  const [secondaryPhoneError, setSecondaryPhoneError] = useState("");

  // Country codes for phone numbers
  const countryCodes = [
    { code: "+1", country: "US/Canada", flag: "🇺🇸" },
    { code: "+52", country: "Mexico", flag: "🇲🇽" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+49", country: "Germany", flag: "🇩🇪" },
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+34", country: "Spain", flag: "🇪🇸" },
    { code: "+39", country: "Italy", flag: "🇮🇹" },
    { code: "+31", country: "Netherlands", flag: "🇳🇱" },
    { code: "+32", country: "Belgium", flag: "🇧🇪" },
    { code: "+41", country: "Switzerland", flag: "🇨🇭" },
    { code: "+46", country: "Sweden", flag: "🇸🇪" },
    { code: "+47", country: "Norway", flag: "🇳🇴" },
    { code: "+45", country: "Denmark", flag: "🇩🇰" },
    { code: "+358", country: "Finland", flag: "🇫🇮" },
    { code: "+48", country: "Poland", flag: "🇵🇱" },
    { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
    { code: "+36", country: "Hungary", flag: "🇭🇺" },
    { code: "+43", country: "Austria", flag: "🇦🇹" },
    { code: "+351", country: "Portugal", flag: "🇵🇹" },
    { code: "+30", country: "Greece", flag: "🇬🇷" },
    { code: "+90", country: "Turkey", flag: "🇹🇷" },
    { code: "+7", country: "Russia", flag: "🇷🇺" },
    { code: "+86", country: "China", flag: "🇨🇳" },
    { code: "+81", country: "Japan", flag: "🇯🇵" },
    { code: "+82", country: "South Korea", flag: "🇰🇷" },
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+64", country: "New Zealand", flag: "🇳🇿" },
    { code: "+55", country: "Brazil", flag: "🇧🇷" },
    { code: "+54", country: "Argentina", flag: "🇦🇷" },
    { code: "+56", country: "Chile", flag: "🇨🇱" },
    { code: "+57", country: "Colombia", flag: "🇨🇴" },
    { code: "+58", country: "Venezuela", flag: "🇻🇪" },
    { code: "+51", country: "Peru", flag: "🇵🇪" },
    { code: "+593", country: "Ecuador", flag: "🇪🇨" },
    { code: "+595", country: "Paraguay", flag: "🇵🇾" },
    { code: "+598", country: "Uruguay", flag: "🇺🇾" },
    { code: "+591", country: "Bolivia", flag: "🇧🇴" },
    { code: "+503", country: "El Salvador", flag: "🇸🇻" },
    { code: "+502", country: "Guatemala", flag: "🇬🇹" },
    { code: "+504", country: "Honduras", flag: "🇭🇳" },
    { code: "+505", country: "Nicaragua", flag: "🇳🇮" },
    { code: "+506", country: "Costa Rica", flag: "🇨🇷" },
    { code: "+507", country: "Panama", flag: "🇵🇦" },
    { code: "+971", country: "UAE", flag: "🇦🇪" },
    { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+972", country: "Israel", flag: "🇮🇱" },
    { code: "+20", country: "Egypt", flag: "🇪🇬" },
    { code: "+27", country: "South Africa", flag: "🇿🇦" },
    { code: "+234", country: "Nigeria", flag: "🇳🇬" },
    { code: "+254", country: "Kenya", flag: "🇰🇪" },
    { code: "+233", country: "Ghana", flag: "🇬🇭" },
    { code: "+212", country: "Morocco", flag: "🇲🇦" },
    { code: "+216", country: "Tunisia", flag: "🇹🇳" },
    { code: "+213", country: "Algeria", flag: "🇩🇿" },
    { code: "+221", country: "Senegal", flag: "🇸🇳" },
    { code: "+225", country: "Ivory Coast", flag: "🇨🇮" },
    { code: "+237", country: "Cameroon", flag: "🇨🇲" },
    { code: "+236", country: "Central African Republic", flag: "🇨🇫" },
    { code: "+235", country: "Chad", flag: "🇹🇩" },
    { code: "+249", country: "Sudan", flag: "🇸🇩" },
    { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
    { code: "+255", country: "Tanzania", flag: "🇹🇿" },
    { code: "+256", country: "Uganda", flag: "🇺🇬" },
    { code: "+257", country: "Burundi", flag: "🇧🇮" },
    { code: "+250", country: "Rwanda", flag: "🇷🇼" },
    { code: "+252", country: "Somalia", flag: "🇸🇴" },
    { code: "+253", country: "Djibouti", flag: "🇩🇯" },
    { code: "+254", country: "Kenya", flag: "🇰🇪" },
    { code: "+255", country: "Tanzania", flag: "🇹🇿" },
    { code: "+256", country: "Uganda", flag: "🇺🇬" },
    { code: "+257", country: "Burundi", flag: "🇧🇮" },
    { code: "+258", country: "Mozambique", flag: "🇲🇿" },
    { code: "+260", country: "Zambia", flag: "🇿🇲" },
    { code: "+261", country: "Madagascar", flag: "🇲🇬" },
    { code: "+262", country: "Réunion", flag: "🇷🇪" },
    { code: "+263", country: "Zimbabwe", flag: "🇿🇼" },
    { code: "+264", country: "Namibia", flag: "🇳🇦" },
    { code: "+265", country: "Malawi", flag: "🇲🇼" },
    { code: "+266", country: "Lesotho", flag: "🇱🇸" },
    { code: "+267", country: "Botswana", flag: "🇧🇼" },
    { code: "+268", country: "Eswatini", flag: "🇸🇿" },
    { code: "+269", country: "Comoros", flag: "🇰🇲" },
    { code: "+290", country: "Saint Helena", flag: "🇸🇭" },
    { code: "+291", country: "Eritrea", flag: "🇪🇷" },
    { code: "+297", country: "Aruba", flag: "🇦🇼" },
    { code: "+298", country: "Faroe Islands", flag: "🇫🇴" },
    { code: "+299", country: "Greenland", flag: "🇬🇱" },
  ];

  const phoneTypes = [
    { value: 'mobile', label: 'Mobile', icon: '📱' },
    { value: 'home', label: 'Home', icon: '🏠' },
    { value: 'work', label: 'Work', icon: '💼' },
    { value: 'other', label: 'Other', icon: '📞' },
  ];

  const handleFieldChange = (field: keyof NamePhoneData, fieldValue: string) => {
    const newValue = { ...value, [field]: fieldValue };
    onChange(newValue);

    // Clear phone errors when user starts typing
    if (field === 'phone' && phoneError) {
      setPhoneError("");
    }
    if (field === 'secondary_phone' && secondaryPhoneError) {
      setSecondaryPhoneError("");
    }
  };

  const validatePhone = (phone: string, countryCode: string) => {
    if (!phone) return "";

    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');

    // Country-specific validation patterns
    const patterns: Record<string, { min: number; max: number; format: string }> = {
      "+1": { min: 10, max: 10, format: "(XXX) XXX-XXXX" }, // US/Canada
      "+52": { min: 10, max: 10, format: "XXX XXX XXXX" }, // Mexico
      "+44": { min: 10, max: 11, format: "XXXX XXXXXX" }, // UK
      "+49": { min: 10, max: 12, format: "XXX XXXXXXX" }, // Germany
      "+33": { min: 9, max: 10, format: "X XX XX XX XX" }, // France
      "+34": { min: 9, max: 9, format: "XXX XXX XXX" }, // Spain
      "+39": { min: 9, max: 10, format: "XXX XXX XXXX" }, // Italy
      "+31": { min: 9, max: 9, format: "X XXX XXX XXX" }, // Netherlands
      "+32": { min: 9, max: 9, format: "X XXX XXX XXX" }, // Belgium
      "+41": { min: 9, max: 9, format: "XX XXX XXXX" }, // Switzerland
      "+46": { min: 9, max: 9, format: "XX XXX XXXX" }, // Sweden
      "+47": { min: 8, max: 8, format: "XXX XX XXX" }, // Norway
      "+45": { min: 8, max: 8, format: "XX XX XX XX" }, // Denmark
      "+358": { min: 9, max: 9, format: "XXX XXX XXX" }, // Finland
      "+48": { min: 9, max: 9, format: "XXX XXX XXX" }, // Poland
      "+420": { min: 9, max: 9, format: "XXX XXX XXX" }, // Czech Republic
      "+36": { min: 9, max: 9, format: "XX XXX XXXX" }, // Hungary
      "+43": { min: 10, max: 13, format: "XXX XXX XXXX" }, // Austria
      "+351": { min: 9, max: 9, format: "XXX XXX XXX" }, // Portugal
      "+30": { min: 10, max: 10, format: "XXX XXX XXXX" }, // Greece
      "+90": { min: 10, max: 10, format: "XXX XXX XXXX" }, // Turkey
      "+7": { min: 10, max: 10, format: "XXX XXX XXXX" }, // Russia
      "+86": { min: 11, max: 11, format: "XXX XXXX XXXX" }, // China
      "+81": { min: 10, max: 10, format: "XX XXXX XXXX" }, // Japan
      "+82": { min: 10, max: 11, format: "XX XXXX XXXX" }, // South Korea
      "+91": { min: 10, max: 10, format: "XXXXX XXXXX" }, // India
      "+61": { min: 9, max: 9, format: "X XXXX XXXX" }, // Australia
      "+64": { min: 9, max: 9, format: "XX XXX XXXX" }, // New Zealand
      "+55": { min: 10, max: 11, format: "XX XXXXX XXXX" }, // Brazil
      "+54": { min: 10, max: 10, format: "XX XXXX XXXX" }, // Argentina
      "+56": { min: 9, max: 9, format: "X XXXX XXXX" }, // Chile
      "+57": { min: 10, max: 10, format: "XXX XXX XXXX" }, // Colombia
      "+58": { min: 10, max: 10, format: "XXX XXX XXXX" }, // Venezuela
      "+51": { min: 9, max: 9, format: "XXX XXX XXX" }, // Peru
      "+593": { min: 9, max: 9, format: "XX XXX XXXX" }, // Ecuador
      "+595": { min: 9, max: 9, format: "XXX XXX XXX" }, // Paraguay
      "+598": { min: 8, max: 8, format: "XX XXX XXX" }, // Uruguay
      "+591": { min: 8, max: 8, format: "XXX XXX XXX" }, // Bolivia
      "+503": { min: 8, max: 8, format: "XXXX XXXX" }, // El Salvador
      "+502": { min: 8, max: 8, format: "XXXX XXXX" }, // Guatemala
      "+504": { min: 8, max: 8, format: "XXXX XXXX" }, // Honduras
      "+505": { min: 8, max: 8, format: "XXXX XXXX" }, // Nicaragua
      "+506": { min: 8, max: 8, format: "XXXX XXXX" }, // Costa Rica
      "+507": { min: 8, max: 8, format: "XXXX XXXX" }, // Panama
    };

    const pattern = patterns[countryCode];
    if (pattern) {
      if (digitsOnly.length < pattern.min || digitsOnly.length > pattern.max) {
        return `Phone number should be ${pattern.min}-${pattern.max} digits for ${countryCode}`;
      }
    }

    return "";
  };

  const handlePhoneChange = (phone: string) => {
    const error = validatePhone(phone, value.phone_country_code);
    setPhoneError(error);
    handleFieldChange("phone", phone);
  };

  const handleSecondaryPhoneChange = (phone: string) => {
    const error = validatePhone(phone, value.phone_country_code);
    setSecondaryPhoneError(error);
    handleFieldChange("secondary_phone", phone);
  };

  const getPhonePlaceholder = (countryCode: string) => {
    const placeholders: Record<string, string> = {
      "+1": "(555) 123-4567",
      "+52": "555 123 4567",
      "+44": "20 7946 0958",
      "+49": "30 12345678",
      "+33": "1 23 45 67 89",
      "+34": "123 456 789",
      "+39": "123 456 7890",
      "+31": "6 123 456 789",
      "+32": "4 123 456 789",
      "+41": "44 123 4567",
      "+46": "8 123 456 789",
      "+47": "123 45 678",
      "+45": "12 34 56 78",
      "+358": "123 456 789",
      "+48": "123 456 789",
      "+420": "123 456 789",
      "+36": "12 345 6789",
      "+43": "123 456 7890",
      "+351": "123 456 789",
      "+30": "123 456 7890",
      "+90": "123 456 7890",
      "+7": "123 456 7890",
      "+86": "123 4567 8901",
      "+81": "12 3456 7890",
      "+82": "12 3456 7890",
      "+91": "12345 67890",
      "+61": "2 1234 5678",
      "+64": "21 123 4567",
      "+55": "11 12345 6789",
      "+54": "11 1234 5678",
      "+56": "2 1234 5678",
      "+57": "123 456 7890",
      "+58": "123 456 7890",
      "+51": "123 456 789",
      "+593": "12 345 6789",
      "+595": "123 456 789",
      "+598": "12 345 678",
      "+591": "123 456 789",
      "+503": "1234 5678",
      "+502": "1234 5678",
      "+504": "1234 5678",
      "+505": "1234 5678",
      "+506": "1234 5678",
      "+507": "1234 5678",
    };
    return placeholders[countryCode] || "Enter phone number";
  };

    return (
    <div className={`space-y-4 ${className}`}>
      {/* Name Section */}
      <div className="space-y-3">
        <h3 className="text-base font-medium text-gray-900 flex items-center">
          <User className="w-4 h-4 mr-2" />
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <Input
              type="text"
              value={value.first_name}
              onChange={(e) => handleFieldChange("first_name", e.target.value)}
              className="w-full"
              placeholder="Juan"
            />
          </div>

          {/* Middle Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Middle Name
            </label>
            <Input
              type="text"
              value={value.middle_name}
              onChange={(e) => handleFieldChange("middle_name", e.target.value)}
              className="w-full"
              placeholder="Carlos"
            />
          </div>

          {/* Last Name (Paternal) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name (Paternal) *
            </label>
            <Input
              type="text"
              value={value.last_name}
              onChange={(e) => handleFieldChange("last_name", e.target.value)}
              className="w-full"
              placeholder="García"
            />
          </div>

          {/* Maternal Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maternal Last Name
            </label>
            <Input
              type="text"
              value={value.maternal_last_name}
              onChange={(e) => handleFieldChange("maternal_last_name", e.target.value)}
              className="w-full"
              placeholder="López"
            />
          </div>
        </div>

        {/* Preferred Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Star className="inline w-4 h-4 mr-2" />
            Preferred Name / Nickname
          </label>
          <Input
            type="text"
            value={value.preferred_name}
            onChange={(e) => handleFieldChange("preferred_name", e.target.value)}
            className="w-full"
            placeholder="Johnny, J.C., etc."
          />
        </div>
      </div>

      {/* Phone Section */}
      <div className="space-y-3">
        <h3 className="text-base font-medium text-gray-900 flex items-center">
          <Phone className="w-4 h-4 mr-2" />
          Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Phone Number *
            </label>
            <div className="flex space-x-2">
              {/* Country Code */}
              <div className="w-32">
                <select
                  value={value.phone_country_code}
                  onChange={(e) => handleFieldChange("phone_country_code", e.target.value)}
                  className="w-full h-8 px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone Number */}
              <div className="flex-1">
                <Input
                  type="tel"
                  value={value.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className={`w-full ${phoneError ? 'border-red-500' : ''}`}
                  placeholder={getPhonePlaceholder(value.phone_country_code)}
                />
              </div>

              {/* Phone Type */}
              <div className="w-32">
                <select
                  value={value.phone_type}
                  onChange={(e) => handleFieldChange("phone_type", e.target.value as any)}
                  className="w-full h-8 px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {phoneTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {phoneError && (
              <p className="text-xs text-red-500 mt-1">{phoneError}</p>
            )}
          </div>

          {/* Secondary Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Phone Number
            </label>
            <div className="flex space-x-2">
              <div className="w-32">
                <select
                  value={value.phone_country_code}
                  onChange={(e) => handleFieldChange("phone_country_code", e.target.value)}
                  className="w-full h-8 px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <Input
                  type="tel"
                  value={value.secondary_phone}
                  onChange={(e) => handleSecondaryPhoneChange(e.target.value)}
                  className={`w-full ${secondaryPhoneError ? 'border-red-500' : ''}`}
                  placeholder={getPhonePlaceholder(value.phone_country_code)}
                />
              </div>
            </div>
            {secondaryPhoneError && (
              <p className="text-xs text-red-500 mt-1">{secondaryPhoneError}</p>
            )}
          </div>
        </div>
      </div>

          </div>
  );
};

export default NamePhoneForm;
