import React, { useState, useEffect } from "react";
import { useAuth } from '../../contexts/AuthContext';
import {
  User,
  Key,
  Eye,
  EyeOff,
  GraduationCap,
  Briefcase,
  Plus,
  Trash2,
  Lock,
  Building,
} from "lucide-react";
import { Button, Input, NotificationToast } from "../ui/bits";
import DailyActivitiesCard from "./profile/DailyActivitiesCard";
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_USER_PROFILE,
  UPDATE_USER_PROFILE,
  CHANGE_PASSWORD,
  GetUserProfileData,
  UpdateUserProfileData,
  UpdateUserProfileVariables,
  ChangePasswordData,
  ChangePasswordVariables,
} from '../../graphql/userProfile';
import {
  GET_ALL_COUNTRIES,
  GET_STATES_BY_COUNTRY,
  GET_CITIES_BY_STATE,
  GetAllCountriesData,
  GetStatesByCountryData,
  GetCitiesByStateData,
  GetStatesByCountryVariables,
  GetCitiesByStateVariables,
  Country,
  State,
  City
} from '../../graphql/location';

interface ProfileData {
  username: string;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  maternal_last_name?: string;
  preferred_name?: string;
  date_joined: string;
  last_login: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  position?: string;
  department?: string;
  phone?: string;
  phone_country_code?: string;
  phone_type?: 'mobile' | 'home' | 'work' | 'other';
  secondary_phone?: string;
  secondary_phone_country_code?: string;
  secondary_phone_type?: 'mobile' | 'home' | 'work' | 'other';
  street_address?: string;
  apartment_suite?: string;
  city?: string;
  state_province?: string;
  zip_code?: string;
  country?: string;
  countryCode?: string;
  bio?: string;
  education?: Array<{
    id: string;
    school: string;
    degree: string;
    field?: string;
    startYear?: string;
    endYear?: string;
    description?: string;
    visible?: boolean;
  }>;
  work_history?: Array<{
    id: string;
    company: string;
    title: string;
    department?: string;
    startYear?: string;
    endYear?: string;
    description?: string;
    visible?: boolean;
  }>;
  profile_visibility?: {
    education: boolean;
    work_history: boolean;
    position: boolean;
    contact: boolean;
    bio: boolean;
    phone: boolean;
    secondary_phone: boolean;
    address: boolean;
    email: boolean;
  };
  avatar?: string;
  avatarUrl?: string;
}

interface PasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const ProfileRightCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'professional' | 'education' | 'experience' | 'security'>('general');

  // GraphQL hooks
  const { data: profileQueryData, loading: profileLoading, error: profileError } = useQuery<GetUserProfileData>(GET_USER_PROFILE);
  const [updateUserProfile] = useMutation<UpdateUserProfileData, UpdateUserProfileVariables>(UPDATE_USER_PROFILE);
  const [changePassword] = useMutation<ChangePasswordData, ChangePasswordVariables>(CHANGE_PASSWORD);

  // Initialize profile data from GraphQL query or default values
  const initializeProfileData = (): ProfileData => {
    if (profileQueryData?.userProfile) {
      const profile = profileQueryData.userProfile;
      return {
        username: profile.user.email,
        email: profile.user.email,
        first_name: profile.user.firstName,
        middle_name: profile.middleName || "",
        last_name: profile.user.lastName,
        maternal_last_name: profile.maternalLastName || "",
        preferred_name: profile.preferredName || "",
        date_joined: profile.createdAt,
        last_login: profile.updatedAt,
        is_active: profile.user.isActive,
        is_staff: false,
        is_superuser: false,
        position: profile.position || "",
        department: profile.department || "",
  phone: profile.phone || "",
  phone_country_code: profile.phoneCountryCode || "+1",
        phone_type: (profile.phoneType as any) || "mobile",
        secondary_phone: profile.secondaryPhone || "",
        secondary_phone_country_code: profile.phoneCountryCode || "+1",
        secondary_phone_type: "mobile",
        street_address: profile.streetAddress || "",
        apartment_suite: profile.apartmentSuite || "",
        city: profile.city || "",
        state_province: profile.stateProvince || "",
        zip_code: profile.zipCode || "",
        country: profile.country || "",
        countryCode: profile.countryCode || "",
        bio: profile.bio || "",
        education: Array.isArray(profile.education) ? profile.education : (typeof profile.education === 'string' ? JSON.parse(profile.education || '[]') : []),
        work_history: Array.isArray(profile.workHistory) ? profile.workHistory : (typeof profile.workHistory === 'string' ? JSON.parse(profile.workHistory || '[]') : []),
        profile_visibility: profile.profileVisibility || {
          email: true,
          phone: true,
          secondary_phone: true,
          address: true,
          education: true,
          work_history: true,
          position: true,
          contact: true,
          bio: true
        },
        avatar: profile.avatar || "",
        avatarUrl: profile.avatarUrl || "",
      };
    }

    // Default values when no profile data
    return {
      username: "",
      email: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      maternal_last_name: "",
      preferred_name: "",
      date_joined: "",
      last_login: "",
      is_active: true,
      is_staff: false,
      is_superuser: false,
      position: "",
      department: "",
  phone: "",
  phone_country_code: "+1",
      phone_type: "mobile",
      secondary_phone: "",
      secondary_phone_country_code: "+1",
      secondary_phone_type: "mobile",
      street_address: "",
      apartment_suite: "",
      city: "",
      state_province: "",
      zip_code: "",
      country: "",
      bio: "",
      education: [],
      work_history: [],
      profile_visibility: {
        email: true,
        phone: true,
        secondary_phone: true,
        address: true,
        education: true,
        work_history: true,
        position: true,
        contact: true,
        bio: true
      },
      avatar: "",
      avatarUrl: "",
    };
  };

  const [profileData, setProfileData] = useState<ProfileData>(initializeProfileData());
  const [initialProfileData, setInitialProfileData] = useState<ProfileData | null>(null);
  const { user: currentUser } = useAuth();
  // Allow superusers (admin) or staff to edit username and profile status
  const canEditUserName = !!(currentUser?.is_superuser || currentUser?.is_staff);
  const canEditProfileStatus = !!(currentUser?.is_superuser || currentUser?.is_staff);

  // Location data state
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<string>('');

  // GraphQL queries for location data
  const { data: countriesData, loading: countriesLoading } = useQuery<GetAllCountriesData>(GET_ALL_COUNTRIES);
  const { data: statesData, loading: statesLoading } = useQuery<GetStatesByCountryData, GetStatesByCountryVariables>(
    GET_STATES_BY_COUNTRY,
    {
      variables: { countryCode: profileData.countryCode || '' },
      skip: !profileData.countryCode
    }
  );
  const { data: citiesData, loading: citiesLoading } = useQuery<GetCitiesByStateData, GetCitiesByStateVariables>(
    GET_CITIES_BY_STATE,
    {
      variables: { stateId: selectedStateId },
      skip: !selectedStateId
    }
  );


  const [passwordData, setPasswordData] = useState<PasswordData>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Update profile data when GraphQL query data changes
  useEffect(() => {
    if (profileQueryData?.userProfile) {
      const newProfileData = initializeProfileData();
      setProfileData(newProfileData);
      // Set initial data for change detection
      if (!initialProfileData) {
        setInitialProfileData(newProfileData);
      }
    }
  }, [profileQueryData, profileLoading, profileError, initialProfileData]);

  // Update countries when GraphQL data is available
  useEffect(() => {
    if (countriesData?.allCountries) {
      setCountries(countriesData.allCountries);
    }
  }, [countriesData]);

  // Update states when GraphQL data is available
  useEffect(() => {
    if (statesData?.allStates) {
      setStates(statesData.allStates);

      // If we have a selected state name, find its ID
      if (profileData.state_province) {
        const selectedState = statesData.allStates.find(s => s.name === profileData.state_province);
        if (selectedState) {
          setSelectedStateId(selectedState.id);
        }
      }
    } else {
      setStates([]);
      setSelectedStateId('');
    }
  }, [statesData, profileData.countryCode, profileData.state_province]);

  // Update cities when GraphQL data is available
  useEffect(() => {
    if (citiesData?.allCities) {
      setCities(citiesData.allCities);
    } else {
      setCities([]);
    }
  }, [citiesData]);



  // Reset dependent fields when country changes
  useEffect(() => {
    if (profileData.country) {
      setProfileData(prev => ({
        ...prev,
        state_province: "",
        city: "",
        zip_code: "",
      }));
    }
  }, [profileData.country]);

  // Reset dependent fields when state changes
  useEffect(() => {
    if (profileData.state_province) {
      setProfileData(prev => ({
        ...prev,
        city: "",
        zip_code: "",
      }));
    }
  }, [profileData.state_province]);

  // Reset dependent fields when city changes
  useEffect(() => {
    if (profileData.city) {
      setProfileData(prev => ({
        ...prev,
        zip_code: "",
      }));
    }
  }, [profileData.city]);

  // Manual save mode - removed autosave functionality
  // Track unsaved changes
  useEffect(() => {
    if (!initialProfileData) return;

    const hasChanges = JSON.stringify(profileData) !== JSON.stringify(initialProfileData);
    setHasUnsavedChanges(hasChanges);
  }, [profileData, initialProfileData]);

  const performSave = async () => {
    if (isSaving) return; // Prevent multiple simultaneous saves

    setIsSaving(true);
    setErrors({});

    try {
      // Build a minimal variables object containing only changed fields to avoid sending huge payloads
      const vars: any = {};
      const prev = initialProfileData as ProfileData | null;

      const setIfChanged = (varName: string, newValue: any, prevValue?: any) => {
        // compare using JSON to handle arrays/objects
        if (typeof prevValue === 'undefined') prevValue = prev ? (prev as any)[varName] : undefined;
        try {
          if (JSON.stringify(prevValue) !== JSON.stringify(newValue)) {
            vars[varName] = newValue;
          }
        } catch (e) {
          // fallback to direct comparison
          if (prevValue !== newValue) vars[varName] = newValue;
        }
      };

      setIfChanged('email', profileData.email, prev?.email);
      setIfChanged('firstName', profileData.first_name, prev?.first_name);
      setIfChanged('lastName', profileData.last_name, prev?.last_name);
      setIfChanged('middleName', profileData.middle_name || '', prev?.middle_name || '');
      setIfChanged('maternalLastName', profileData.maternal_last_name || '', prev?.maternal_last_name || '');
      setIfChanged('preferredName', profileData.preferred_name || '', prev?.preferred_name || '');
      setIfChanged('position', profileData.position || '', prev?.position || '');
      setIfChanged('department', profileData.department || '', prev?.department || '');
      setIfChanged('phone', profileData.phone || '', prev?.phone || '');
      setIfChanged('phoneCountryCode', profileData.phone_country_code || '+1', prev?.phone_country_code || '+1');
      setIfChanged('phoneType', profileData.phone_type || 'mobile', prev?.phone_type || 'mobile');
      setIfChanged('secondaryPhone', profileData.secondary_phone || '', prev?.secondary_phone || '');
      setIfChanged('streetAddress', profileData.street_address || '', prev?.street_address || '');
      setIfChanged('apartmentSuite', profileData.apartment_suite || '', prev?.apartment_suite || '');
      setIfChanged('city', profileData.city || '', prev?.city || '');
      setIfChanged('stateProvince', profileData.state_province || '', prev?.state_province || '');
      setIfChanged('zipCode', profileData.zip_code || '', prev?.zip_code || '');
      setIfChanged('country', profileData.country || '', prev?.country || '');
      setIfChanged('countryCode', profileData.countryCode || '', prev?.countryCode || '');
      setIfChanged('isActive', profileData.is_active, prev?.is_active);
      setIfChanged('bio', profileData.bio || '', prev?.bio || '');

      // For potentially large JSON blobs, only include them if changed and reasonably sized
      try {
        const educationJson = JSON.stringify(profileData.education || []);
        const workJson = JSON.stringify(profileData.work_history || []);
        const profileVisJson = JSON.stringify(profileData.profile_visibility || {});

        const MAX_SAVE_SIZE = 100 * 1024; // 100 KB

        if (prev && JSON.stringify(prev.education || []) !== educationJson) {
          if (educationJson.length <= MAX_SAVE_SIZE) {
            vars['education'] = educationJson;
          } else {
            console.warn('Skipping save of education: payload too large');
          }
        }

        if (prev && JSON.stringify(prev.work_history || []) !== workJson) {
          if (workJson.length <= MAX_SAVE_SIZE) {
            vars['workHistory'] = workJson;
          } else {
            console.warn('Skipping save of work_history: payload too large');
          }
        }

        if (prev && JSON.stringify(prev.profile_visibility || {}) !== profileVisJson) {
          if (profileVisJson.length <= MAX_SAVE_SIZE) {
            vars['profileVisibility'] = profileVisJson;
          } else {
            console.warn('Skipping save of profile_visibility: payload too large');
          }
        }
      } catch (e) {
        console.warn('Error stringifying large profile sections, skipping them for save', e);
      }

      // If nothing changed (or only skipped large sections), don't call the mutation
      if (Object.keys(vars).length === 0) {
        setIsSaving(false);
        setSuccessMessage("No changes to save");
        setTimeout(() => setSuccessMessage(""), 3000);
        return;
      }

      const result = await updateUserProfile({ variables: vars });

      if (result.data?.updateUserProfile.ok) {
        setLastSaved(new Date());
        setSuccessMessage("Profile saved successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
        // Update initial data to current data after successful save
        setInitialProfileData({ ...profileData });
        setHasUnsavedChanges(false);
        setIsEditMode(false);
      } else {
        setErrors({ submit: result.data?.updateUserProfile.errors?.join(', ') || "Failed to save profile" });
      }
    } catch (error) {
      console.error("Save error:", error);
      setErrors({ submit: "Failed to save profile. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges && !confirm("Are you sure you want to discard your changes?")) {
      return;
    }

    // Reset to initial data
    if (initialProfileData) {
      setProfileData({ ...initialProfileData });
    }
    setHasUnsavedChanges(false);
    setIsEditMode(false);
    setErrors({});
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      return;
    }

    // TODO: Implement profile deletion
    console.log("Profile deletion not implemented yet");
  };

  // Expose button handlers to window object for StableLayout
  useEffect(() => {
    const profileButtonHandlers = {
      save: performSave,
      cancel: handleCancel,
      edit: handleEdit,
      delete: handleDelete,
      isEditMode,
      hasUnsavedChanges,
      isSaving
    };

    (window as any).profileButtonHandlers = profileButtonHandlers;
    console.log('Profile button handlers exposed:', { isEditMode, hasUnsavedChanges, isSaving });

    return () => {
      delete (window as any).profileButtonHandlers;
    };
  }, [performSave, handleCancel, handleEdit, handleDelete, isEditMode, hasUnsavedChanges, isSaving]);

  const handleProfileChange = (field: keyof ProfileData, value: any) => {
    setProfileData((prev) => {
      const updated = { ...prev, [field]: value };
      return updated;
    });
  };

  // Validation helpers
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    if (!phone || phone.trim() === '') return true; // Empty is valid
    // Normalize: remove spaces, dashes, parens, plus signs
    const digits = phone.replace(/[^0-9]/g, '');
    // Allow between 7 and 15 digits
    return digits.length >= 7 && digits.length <= 15;
  };

  // Validate ZIP/Postal code based on country
  const validateZipCode = (zipCode: string, country: string): boolean => {
    if (!zipCode || zipCode.trim() === '') return true; // Empty is valid

    const cleaned = zipCode.trim().toUpperCase();

    switch (country?.toLowerCase()) {
      case 'united states':
      case 'usa':
        // US ZIP: 5 digits or 5+4 format
        return /^\d{5}(-\d{4})?$/.test(cleaned);
      case 'canada':
        // Canadian postal code: A1A 1A1 format
        return /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/.test(cleaned);
      case 'united kingdom':
      case 'uk':
        // UK postcode: various formats like SW1A 1AA
        return /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(cleaned);
      case 'germany':
        // German postal code: 5 digits
        return /^\d{5}$/.test(cleaned);
      case 'france':
        // French postal code: 5 digits
        return /^\d{5}$/.test(cleaned);
      default:
        // Generic validation: 3-10 alphanumeric characters
        return /^[A-Z0-9\s-]{3,10}$/i.test(cleaned);
    }
  };

  // Format ZIP/Postal code based on country
  const formatZipCode = (zipCode: string, country: string): string => {
    if (!zipCode) return zipCode;

    const cleaned = zipCode.replace(/[^A-Z0-9]/gi, '').toUpperCase();

    switch (country?.toLowerCase()) {
      case 'united states':
      case 'usa':
        // Format as 12345 or 12345-6789
        if (cleaned.length <= 5) return cleaned;
        if (cleaned.length <= 9) return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
        return cleaned.slice(0, 9);
      case 'canada':
        // Format as A1A 1A1
        if (cleaned.length <= 3) return cleaned;
        if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
        return cleaned.slice(0, 6);
      case 'united kingdom':
      case 'uk':
        // Keep spaces for UK postcodes
        return zipCode.toUpperCase();
      default:
        return cleaned;
    }
  };

  // Get ZIP/Postal code placeholder based on country
  const getZipPlaceholder = (country: string): string => {
    switch (country?.toLowerCase()) {
      case 'united states':
      case 'usa':
        return '12345 or 12345-6789';
      case 'canada':
        return 'A1A 1A1';
      case 'united kingdom':
      case 'uk':
        return 'SW1A 1AA';
      case 'germany':
      case 'france':
        return '12345';
      default:
        return 'ZIP/Postal Code';
    }
  };

  // Get helpful address information based on country
  const getAddressInfo = (country: string): string => {
    switch (country?.toLowerCase()) {
      case 'united states':
      case 'usa':
        return 'ZIP codes can be 5 digits (12345) or 9 digits (12345-6789)';
      case 'canada':
        return 'Postal codes follow the format A1A 1A1 (letter-number-letter space number-letter-number)';
      case 'united kingdom':
      case 'uk':
        return 'UK postcodes vary in format, e.g., SW1A 1AA or M1 1AA';
      case 'germany':
        return 'German postal codes are 5 digits (12345)';
      case 'france':
        return 'French postal codes are 5 digits (75001 for Paris)';
      default:
        return 'Please enter your local postal/ZIP code format';
    }
  };

  // Map phone country codes to ISO country codes for GraphQL queries
  const phoneCodeToISOCode = (phoneCode: string): string => {
    const mapping: Record<string, string> = {
      '+1': 'US',        // United States/Canada
      '+44': 'GB',       // United Kingdom
      '+33': 'FR',       // France
      '+49': 'DE',       // Germany
      '+39': 'IT',       // Italy
      '+34': 'ES',       // Spain
      '+81': 'JP',       // Japan
      '+86': 'CN',       // China
      '+91': 'IN',       // India
      '+55': 'BR',       // Brazil
      '+52': 'MX',       // Mexico
      '+61': 'AU',       // Australia
      '+7': 'RU',        // Russia
      '+82': 'KR',       // South Korea
      // Add more mappings as needed
    };
    return mapping[phoneCode] || phoneCode;
  };

  // Validate street address
  const validateStreetAddress = (address: string): boolean => {
    if (!address || address.trim() === '') return true; // Empty is valid
    // Basic validation: at least 3 characters, contains both letters and numbers
    const cleaned = address.trim();
    return cleaned.length >= 3 && /\d/.test(cleaned) && /[a-zA-Z]/.test(cleaned);
  };

  // Get address completion suggestions based on common patterns
  const getAddressPattern = (country: string): string => {
    switch (country?.toLowerCase()) {
      case 'united states':
      case 'usa':
        return 'Examples: 123 Main St, 4567 Oak Avenue Apt 2B';
      case 'canada':
        return 'Examples: 123 Main Street, 456 Maple Avenue Unit 5';
      case 'united kingdom':
      case 'uk':
        return 'Examples: 123 High Street, 45 Oxford Road';
      case 'germany':
        return 'Examples: Hauptstraße 123, Musterweg 45';
      case 'france':
        return 'Examples: 123 Rue de la Paix, 45 Avenue des Champs';
      default:
        return 'Include your house/building number and street name';
    }
  };

  // Handle address field changes with validation
  const handleAddressChange = (field: keyof ProfileData, value: string) => {
    if (field === 'zip_code') {
      const formatted = formatZipCode(value, profileData.country || '');
      handleProfileChange(field, formatted);

      // Validate ZIP code
      const isValid = validateZipCode(formatted, profileData.country || '');
      if (!isValid && formatted.trim() !== '') {
        setErrors(prev => ({ ...prev, zip_code: 'Please enter a valid ZIP/postal code' }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors['zip_code'];
          return newErrors;
        });
      }
    } else if (field === 'street_address') {
      handleProfileChange(field, value);

      // Validate street address
      const isValid = validateStreetAddress(value);
      if (!isValid && value.trim() !== '') {
        setErrors(prev => ({ ...prev, street_address: 'Please enter a valid street address with number and street name' }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors['street_address'];
          return newErrors;
        });
      }
    } else {
      handleProfileChange(field, value);
      // Clear any existing errors for the field
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/[^0-9]/g, '');

    // Format based on length (US/International patterns)
    if (digits.length >= 10) {
      // Format as (XXX) XXX-XXXX for US/Canada numbers
      if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      }
      // For international numbers, format with spaces
      if (digits.length <= 15) {
        return digits.replace(/(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?/, (_, p1, p2, p3, p4) => {
          let formatted = p1;
          if (p2) formatted += ' ' + p2;
          if (p3) formatted += ' ' + p3;
          if (p4) formatted += ' ' + p4;
          return formatted;
        });
      }
    } else if (digits.length >= 7) {
      // Format as XXX-XXXX for shorter numbers
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }

    return digits; // Return digits only for shorter inputs
  };

  // Get country code display format
  const getCountryCodeDisplay = (code: string) => {
    if (!code) return 'Code';
    return code.startsWith('+') ? code : `+${code}`;
  };

  // Wrapped change handler that does inline validation for contact fields
  const handleContactChange = (field: keyof ProfileData, value: any) => {
    let processedValue = value;

    // Auto-format phone numbers as user types
    if (field === 'phone' || field === 'secondary_phone') {
      processedValue = formatPhoneNumber(value);
    }

    // Update profile data with formatted value
    handleProfileChange(field, processedValue);

    // Inline validation
    if (field === 'email') {
      if (!validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      } else {
        setErrors(prev => { const copy = { ...prev }; delete copy['email']; return copy; });
      }
    }

    if (field === 'phone') {
      if (value && !validatePhone(value)) {
        setErrors(prev => ({ ...prev, phone: 'Please enter a valid phone number (7-15 digits)' }));
      } else {
        setErrors(prev => { const copy = { ...prev }; delete copy['phone']; return copy; });
      }
    }

    if (field === 'secondary_phone') {
      if (value && !validatePhone(value)) {
        setErrors(prev => ({ ...prev, secondary_phone: 'Please enter a valid phone number (7-15 digits)' }));
      } else {
        setErrors(prev => { const copy = { ...prev }; delete copy['secondary_phone']; return copy; });
      }
    }

    // Auto-select country code based on phone number patterns
    if (field === 'phone' && value && !profileData.phone_country_code) {
      const digits = value.replace(/[^0-9]/g, '');
      if (digits.length === 10 && digits[0] !== '0') {
        // Likely US/Canada number
        handleProfileChange('phone_country_code', '+1');
      }
    }

    if (field === 'secondary_phone' && value && !profileData.secondary_phone_country_code) {
      const digits = value.replace(/[^0-9]/g, '');
      if (digits.length === 10 && digits[0] !== '0') {
        // Likely US/Canada number
        handleProfileChange('secondary_phone_country_code', '+1');
      }
    }
  };

  // Handle location selection changes - inline handlers are used instead

  const addEducation = () => {
    setProfileData(prev => ({
      ...prev,
      education: [...(prev.education || []), {
        id: Date.now().toString(),
        school: "",
        degree: "",
        field: "",
        startYear: "",
        endYear: "",
        description: "",
        visible: true
      }]
    }));
  };

  const removeEducation = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      education: (prev.education || []).filter(e => e.id !== id)
    }));
  };

  const addWork = () => {
    setProfileData(prev => ({
      ...prev,
      work_history: [...(prev.work_history || []), {
        id: Date.now().toString(),
        company: "",
        title: "",
        department: "",
        startYear: "",
        endYear: "",
        description: "",
        visible: true
      }]
    }));
  };

  const removeWork = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      work_history: (prev.work_history || []).filter(w => w.id !== id)
    }));
  };


  const validatePassword = () => {
    const newErrors: Record<string, string> = {};

    if (!passwordData['current_password']) {
      newErrors['current_password'] = "Current password is required";
    }
    if (!passwordData['new_password']) {
      newErrors['new_password'] = "New password is required";
    }
    if (passwordData['new_password'].length < 8) {
      newErrors['new_password'] = "Password must be at least 8 characters";
    }
    if (passwordData['new_password'] !== passwordData['confirm_password']) {
      newErrors['confirm_password'] = "Passwords do not match";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setIsPasswordLoading(true);
    setPasswordSuccessMessage("");

    try {
      const result = await changePassword({
        variables: {
          currentPassword: passwordData.current_password,
          newPassword: passwordData.new_password,
        }
      });

      if (result.data?.changePassword.ok) {
        setPasswordSuccessMessage("Password changed successfully!");
        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
        setTimeout(() => setPasswordSuccessMessage(""), 3000);
      } else {
        setPasswordSuccessMessage(`Password change failed: ${result.data?.changePassword.errors?.join(', ')}`);
      }
    } catch (error) {
      console.error("Password change error:", error);
      setPasswordSuccessMessage("Network error. Please try again.");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="flex flex-col space-y-6 h-full">
            {/* Cards in two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {/* Left column - Personal and Address Information */}
              <div className="flex flex-col space-y-6">
                {/* Personal Information Card */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Personal Information
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      {/* User name (admin/staff only) */}
                      <div>
                        <label className="flex text-sm font-medium text-gray-700 mb-2 items-center justify-between">
                          <span>User name</span>
                          {!canEditUserName && (
                            <span className="flex items-center text-xs text-gray-500" aria-hidden="true">
                              <Lock className="w-4 h-4 mr-1" />
                            </span>
                          )}
                        </label>
                        <Input
                          type="text"
                          value={profileData.preferred_name || ''}
                          onChange={(e) => handleProfileChange('preferred_name', e.target.value)}
                          className="w-full h-[38px]"
                          placeholder="User name"
                          disabled={!canEditUserName}
                        />
                      </div>

                      {/* Profile Status */}
                      <div>
                        <label className="flex text-sm font-medium text-gray-700 mb-2 items-center justify-between">
                          <span>Profile Status</span>
                          {!canEditProfileStatus && (
                            <span className="flex items-center text-xs text-gray-500" aria-hidden="true">
                              <Lock className="w-4 h-4 mr-1" />
                            </span>
                          )}
                        </label>
                        <div className="flex items-center">
                          <div className="inline-flex items-center px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                            <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-blue-700 font-medium">{profileData.is_active ? 'Active Profile' : 'Inactive'}</span>
                          </div>
                        </div>
                      </div>

                      {/* First Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <Input
                          type="text"
                          value={profileData.first_name || ''}
                          onChange={(e) => handleProfileChange('first_name', e.target.value)}
                          className="w-full h-[38px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="First name"
                          disabled={!isEditMode}
                        />
                      </div>

                      {/* Middle Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                        <Input
                          type="text"
                          value={profileData.middle_name || ''}
                          onChange={(e) => handleProfileChange('middle_name', e.target.value)}
                          className="w-full h-[38px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Middle name"
                          disabled={!isEditMode}
                        />
                      </div>

                      {/* Last Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <Input
                          type="text"
                          value={profileData.last_name || ''}
                          onChange={(e) => handleProfileChange('last_name', e.target.value)}
                          className="w-full h-[38px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Last name"
                          disabled={!isEditMode}
                        />
                      </div>

                      {/* Maternal name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Maternal name</label>
                        <Input
                          type="text"
                          value={profileData.maternal_last_name || ''}
                          onChange={(e) => handleProfileChange('maternal_last_name', e.target.value)}
                          className="w-full h-[38px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Maternal name"
                          disabled={!isEditMode}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information Card */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Address Information
                      </h3>
                      <div className="text-sm text-gray-500">
                        {(() => {
                          const fields = [profileData.country, profileData.state_province, profileData.city, profileData.street_address, profileData.zip_code];
                          const completed = fields.filter(field => field && field.trim()).length;
                          return `${completed}/5 fields completed`;
                        })()}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Country */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <select
                          value={profileData.country || ''}
                          onChange={(e) => {
                            const selectedCountry = countries.find(c => c.name === e.target.value);
                            handleAddressChange('country', e.target.value);
                            if (selectedCountry) {
                              console.log('Selected country:', selectedCountry); // Debug
                              const isoCode = phoneCodeToISOCode(selectedCountry.code || '');
                              console.log('Mapped ISO code:', isoCode); // Debug
                              handleProfileChange('countryCode', isoCode);
                              // Reset dependent fields when country changes
                              handleProfileChange('state_province', '');
                              handleProfileChange('city', '');
                              // Clear ZIP code error since validation rules changed
                              setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors['zip_code'];
                                return newErrors;
                              });
                            }
                          }}
                          className={`w-full bg-white rounded-md h-[38px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent ${
                            countriesLoading
                              ? 'border-gray-200 text-gray-400'
                              : profileData.country
                              ? 'border-green-300 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-blue-500'
                          }`}
                          disabled={countriesLoading}
                        >
                          <option value="">{countriesLoading ? 'Loading countries...' : 'Select Country'}</option>
                          {countries.map(c => (
                            <option key={`country-${c.id}`} value={c.name}>
                              {c.name} {c.code ? `(${c.code})` : ''}
                            </option>
                          ))}
                        </select>
                        {countriesLoading && <p className="text-xs text-gray-500 mt-1">Loading countries...</p>}
                      </div>

                      {/* State/Province */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                        <select
                          value={profileData.state_province || ''}
                          onChange={(e) => {
                            const selectedState = states.find(s => s.name === e.target.value);
                            handleAddressChange('state_province', e.target.value);
                            if (selectedState) {
                              console.log('Selected state:', selectedState); // Debug
                              setSelectedStateId(selectedState.id);
                              // Reset city when state changes
                              handleProfileChange('city', '');
                            } else {
                              setSelectedStateId('');
                            }
                          }}
                          className={`w-full bg-white rounded-md h-[38px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent ${
                            !profileData.country
                              ? 'border-gray-200 text-gray-400'
                              : statesLoading
                              ? 'border-gray-200 text-gray-400'
                              : profileData.state_province
                              ? 'border-green-300 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-blue-500'
                          }`}
                          disabled={!profileData.country || statesLoading}
                        >
                          <option value="">
                            {!profileData.country
                              ? 'Select Country First'
                              : statesLoading
                              ? 'Loading states...'
                              : states.length === 0 && profileData.country
                              ? 'No states available'
                              : 'Select State/Province'
                            }
                          </option>
                          {states.map(state => (
                            <option key={`state-${state.id}`} value={state.name}>{state.name}</option>
                          ))}
                        </select>
                        {statesLoading && <p className="text-xs text-gray-500 mt-1">Loading states...</p>}
                        {!profileData.country && <p className="text-xs text-gray-500 mt-1">Please select a country first</p>}
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <select
                          value={profileData.city || ''}
                          onChange={(e) => {
                            handleAddressChange('city', e.target.value);
                          }}
                          className={`w-full bg-white rounded-md h-[38px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent ${
                            !profileData.state_province
                              ? 'border-gray-200 text-gray-400'
                              : citiesLoading
                              ? 'border-gray-200 text-gray-400'
                              : profileData.city
                              ? 'border-green-300 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-blue-500'
                          }`}
                          disabled={!profileData.state_province || citiesLoading}
                        >
                          <option value="">
                            {!profileData.state_province
                              ? 'Select State/Province First'
                              : citiesLoading
                              ? 'Loading cities...'
                              : cities.length === 0 && profileData.state_province
                              ? 'No cities available'
                              : 'Select City'
                            }
                          </option>
                          {cities.map(city => (
                            <option key={`city-${city.id}`} value={city.name}>{city.name}</option>
                          ))}
                        </select>
                        {citiesLoading && <p className="text-xs text-gray-500 mt-1">Loading cities...</p>}
                        {!profileData.state_province && <p className="text-xs text-gray-500 mt-1">Please select a state/province first</p>}
                      </div>

                      {/* ZIP/Postal Code */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code</label>
                        <Input
                          type="text"
                          value={profileData.zip_code || ''}
                          onChange={(e) => handleAddressChange('zip_code', e.target.value)}
                          className={`w-full h-[38px] px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                            errors['zip_code']
                              ? 'border-red-300 focus:ring-red-500'
                              : profileData.zip_code && validateZipCode(profileData.zip_code, profileData.country || '')
                              ? 'border-green-300 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-blue-500'
                          }`}
                          disabled={!isEditMode}
                          placeholder={getZipPlaceholder(profileData.country || '')}
                        />
                        {errors['zip_code'] && <p className="text-xs text-red-500 mt-1">{errors['zip_code']}</p>}
                        {profileData.country && !errors['zip_code'] && (
                          <p className="text-xs text-gray-500 mt-1">{getAddressInfo(profileData.country)}</p>
                        )}
                      </div>

                      {/* Street Address */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                        <Input
                          type="text"
                          value={profileData.street_address || ''}
                          onChange={(e) => handleAddressChange('street_address', e.target.value)}
                          className={`w-full h-[38px] px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                            errors['street_address']
                              ? 'border-red-300 focus:ring-red-500'
                              : profileData.street_address && validateStreetAddress(profileData.street_address)
                              ? 'border-green-300 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-blue-500'
                          }`}
                          placeholder="123 Main Street"
                        />
                        {errors['street_address'] && <p className="text-xs text-red-500 mt-1">{errors['street_address']}</p>}
                        {profileData.country && !errors['street_address'] && (
                          <p className="text-xs text-gray-500 mt-1">{getAddressPattern(profileData.country)}</p>
                        )}
                      </div>

                      {/* Apartment/Suite */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Apartment/Suite <span className="text-gray-400">(Optional)</span></label>
                        <Input
                          type="text"
                          value={profileData.apartment_suite || ''}
                          onChange={(e) => handleAddressChange('apartment_suite', e.target.value)}
                          className={`w-full h-[38px] px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                            profileData.apartment_suite && profileData.apartment_suite.trim().length > 0
                              ? 'border-green-300 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-blue-500'
                          }`}
                          placeholder="Apt 4B, Suite 100, etc."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column - Contact Information and Bio */}
              <div className="flex flex-col space-y-6 h-full">
                {/* Contact Information Card */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Contact Information
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <Input
                          type="email"
                          value={profileData.email || ''}
                          onChange={(e) => handleContactChange('email', e.target.value)}
                          className="w-full h-[38px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Email address"
                        />
                        {errors['email'] && <p className="text-xs text-red-500 mt-1">{errors['email']}</p>}
                      </div>

                      {/* Phone */}
                      <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                          <select
                            value={profileData.phone_country_code || ''}
                            onChange={(e) => handleContactChange('phone_country_code', e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-md h-[38px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            aria-label="Phone country code"
                          >
                            <option value="">{getCountryCodeDisplay('')}</option>
                            {countries.map(c => (
                              <option key={`gpc-${c.id}`} value={c.code}>
                                {getCountryCodeDisplay(c.code)} {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
                          <Input
                            type="tel"
                            value={profileData.phone || ''}
                            onChange={(e) => handleContactChange('phone', e.target.value)}
                            className={`w-full h-[38px] px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                              errors['phone']
                                ? 'border-red-300 focus:ring-red-500'
                                : profileData.phone && validatePhone(profileData.phone)
                                ? 'border-green-300 focus:ring-green-500'
                                : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder="(555) 123-4567"
                          />
                          {errors['phone'] && <p className="text-xs text-red-500 mt-1">{errors['phone']}</p>}
                        </div>

                        <div className="col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                          <select
                            value={profileData.phone_type || 'mobile'}
                            onChange={(e) => handleProfileChange('phone_type', e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-md h-[38px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="mobile">Mobile</option>
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Secondary Phone */}
                      <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Phone</label>
                          <select
                            value={profileData.secondary_phone_country_code || ''}
                            onChange={(e) => handleContactChange('secondary_phone_country_code', e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-md h-[38px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            aria-label="Secondary phone country code"
                          >
                            <option value="">{getCountryCodeDisplay('')}</option>
                            {countries.map(c => (
                              <option key={`gpc2-${c.id}`} value={c.code}>
                                {getCountryCodeDisplay(c.code)} {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
                          <Input
                            type="tel"
                            value={profileData.secondary_phone || ''}
                            onChange={(e) => handleContactChange('secondary_phone', e.target.value)}
                            className={`w-full h-[38px] px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                              errors['secondary_phone']
                                ? 'border-red-300 focus:ring-red-500'
                                : profileData.secondary_phone && validatePhone(profileData.secondary_phone)
                                ? 'border-green-300 focus:ring-green-500'
                                : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder="(555) 987-6543"
                          />
                          {errors['secondary_phone'] && <p className="text-xs text-red-500 mt-1">{errors['secondary_phone']}</p>}
                        </div>

                        <div className="col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                          <select
                            value={profileData.secondary_phone_type || 'mobile'}
                            onChange={(e) => handleProfileChange('secondary_phone_type', e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-md h-[38px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="mobile">Mobile</option>
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio Card */}
                <div className="bg-white rounded-lg border border-gray-200 flex flex-col flex-1 min-h-0">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Biography Information
                    </h3>
                  </div>
                  <div className="p-6 flex-1 flex flex-col min-h-0 h-full">
                    <textarea
                        value={profileData.bio || ''}
                        onChange={(e) => handleProfileChange('bio', e.target.value)}
                        className="w-full h-full min-h-0 flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Write a short bio about yourself..."
                      />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'professional':
        return (
          <div className="flex flex-col space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
                  {!canEditProfileStatus && (
                    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                      <Lock className="w-4 h-4" />
                      <span>Admin Only</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 space-y-4">
                {canEditProfileStatus ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                      <Input
                        type="text"
                        value={profileData.position || ""}
                        onChange={(e) => handleProfileChange("position", e.target.value)}
                        className="w-full"
                        placeholder="Enter position"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <Input
                        type="text"
                        value={profileData.department || ""}
                        onChange={(e) => handleProfileChange("department", e.target.value)}
                        className="w-full"
                        placeholder="Enter department"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">Current Role Information</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                          <div className="text-sm text-gray-900 bg-white border border-gray-200 rounded-md px-3 py-2">
                            {profileData.position || "Not assigned"}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                          <div className="text-sm text-gray-900 bg-white border border-gray-200 rounded-md px-3 py-2">
                            {profileData.department || "Not assigned"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-blue-900">Role Assignment Required</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Only administrators can assign or modify user roles and positions.
                            Contact your system administrator to update your professional information.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Daily Activities Card - Only show if user has a position/role */}
            {profileData.position ? (
              <DailyActivitiesCard
                position={profileData.position}
                department={profileData.department}
                assignedTo={profileData.username}
              />
            ) : (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Role Assigned</h3>
                  <p className="text-gray-500 mb-4">
                    Daily activities and tasks will appear here once a position and department are assigned to your account.
                  </p>
                  <div className="text-sm text-gray-400">
                    Contact your administrator to assign your professional role.
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'education':
        return (
          <div className="flex flex-col space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                <Button
                  onClick={addEducation}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Education
                </Button>
              </div>
              <div className="p-4 space-y-4">
                {profileData.education?.map((edu, index) => (
                  <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-gray-900">Education #{index + 1}</h4>
                      <Button
                        onClick={() => removeEducation(edu.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                        <Input
                          type="text"
                          value={edu.school}
                          onChange={(e) => {
                            const newEducation = [...(profileData.education || [])];
                            newEducation[index] = { ...edu, school: e.target.value };
                            handleProfileChange("education", newEducation);
                          }}
                          className="w-full"
                          placeholder="Enter school name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                        <Input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const newEducation = [...(profileData.education || [])];
                            newEducation[index] = { ...edu, degree: e.target.value };
                            handleProfileChange("education", newEducation);
                          }}
                          className="w-full"
                          placeholder="Enter degree"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {(!profileData.education || profileData.education.length === 0) && (
                  <p className="text-gray-500 text-center py-8">No education entries yet. Click "Add Education" to get started.</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="flex flex-col space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                <Button
                  onClick={addWork}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Experience
                </Button>
              </div>
              <div className="p-4 space-y-4">
                {profileData.work_history?.map((work, index) => (
                  <div key={work.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-gray-900">Experience #{index + 1}</h4>
                      <Button
                        onClick={() => removeWork(work.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <Input
                          type="text"
                          value={work.company}
                          onChange={(e) => {
                            const newWorkHistory = [...(profileData.work_history || [])];
                            newWorkHistory[index] = { ...work, company: e.target.value };
                            handleProfileChange("work_history", newWorkHistory);
                          }}
                          className="w-full"
                          placeholder="Enter company name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <Input
                          type="text"
                          value={work.title}
                          onChange={(e) => {
                            const newWorkHistory = [...(profileData.work_history || [])];
                            newWorkHistory[index] = { ...work, title: e.target.value };
                            handleProfileChange("work_history", newWorkHistory);
                          }}
                          className="w-full"
                          placeholder="Enter job title"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {(!profileData.work_history || profileData.work_history.length === 0) && (
                  <p className="text-gray-500 text-center py-8">No work experience entries yet. Click "Add Experience" to get started.</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="flex flex-col space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <Input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                      className="w-full pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordErrors['current_password'] && <p className="text-red-500 text-xs mt-1">{passwordErrors['current_password']}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <Input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                      className="w-full pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordErrors['new_password'] && <p className="text-red-500 text-xs mt-1">{passwordErrors['new_password']}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <Input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                      className="w-full pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordErrors['confirm_password'] && <p className="text-red-500 text-xs mt-1">{passwordErrors['confirm_password']}</p>}
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    onClick={handlePasswordSubmit}
                    disabled={isPasswordLoading}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                  >
                    <Key className="w-4 h-4" />
                    {isPasswordLoading ? "Changing..." : "Change Password"}
                  </Button>
                </div>
                {passwordSuccessMessage && (
                  <NotificationToast
                    type={passwordSuccessMessage.includes("successfully") ? "success" : "error"}
                    message={passwordSuccessMessage}
                    isVisible={!!passwordSuccessMessage}
                    onClose={() => setPasswordSuccessMessage("")}
                  />
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (profileLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading profile: {profileError.message}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex items-center justify-between">
          <nav className="flex space-x-8">
            {[
              { id: 'general', label: 'General', icon: User, adminOnly: false },
              { id: 'professional', label: 'Current Role', icon: Briefcase, adminOnly: true },
              { id: 'education', label: 'Education', icon: GraduationCap, adminOnly: false },
              { id: 'experience', label: 'Work History', icon: Building, adminOnly: false },
              { id: 'security', label: 'Security', icon: Key, adminOnly: false },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.adminOnly && (
                    <Lock className="w-3 h-3 text-amber-500" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Personal Information Label and Last Saved */}
          <div className="flex items-center gap-4 select-none">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">Personal Information</span>
            </div>
            {lastSaved && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-hidden">
        <div className="h-full flex flex-col">
          {renderTabContent()}

          {/* Success/Error Messages for Profile */}
          {activeTab !== 'security' && (
            <>
              {successMessage && (
                <NotificationToast
                  type="success"
                  message={successMessage}
                  isVisible={!!successMessage}
                  onClose={() => setSuccessMessage("")}
                />
              )}

              {errors["submit"] && (
                <NotificationToast
                  type="error"
                  message={errors["submit"]}
                  isVisible={!!errors["submit"]}
                  onClose={() => setErrors((prev) => ({ ...prev, submit: "" }))}
                />
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfileRightCard;
