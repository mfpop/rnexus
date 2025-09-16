import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Shield, AlertCircle } from "lucide-react";
import { AuthForm, FormField } from "../components/ui/AuthForm";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../graphql/userRegistration";

/**
 * Register - Enhanced registration page with improved validation and UX
 */
const Register: React.FC = () => {
  const navigate = useNavigate();
  const [registerUser, { loading: isLoading }] = useMutation(REGISTER_USER);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Define form fields with validation
  const formFields: FormField[] = [
    {
      name: "avatar",
      label: "Profile Picture",
      type: "file",
      placeholder: "Choose a profile picture",
      required: false,
      accept: "image/*",
      maxSize: 5 * 1024 * 1024, // 5MB
    },
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      placeholder: "Enter your first name",
      required: true,
      icon: <UserPlus className="h-5 w-5 text-blue-400" />,
      validation: {
        minLength: 2,
        maxLength: 50,
      },
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "Enter your last name",
      required: true,
      icon: <UserPlus className="h-5 w-5 text-blue-400" />,
      validation: {
        minLength: 2,
        maxLength: 50,
      },
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter your email address",
      required: true,
      icon: <UserPlus className="h-5 w-5 text-blue-400" />,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        custom: (value: string) => {
          if (value && !value.includes("@")) {
            return "Please enter a valid email address";
          }
          return null;
        },
      },
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Create a strong password",
      required: true,
      icon: <Shield className="h-5 w-5 text-blue-400" />,
      validation: {
        minLength: 8,
        custom: (value: string) => {
          if (value && value.length >= 8) {
            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            const hasNumbers = /\d/.test(value);
            const hasNonalphas = /\W/.test(value);

            if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasNonalphas) {
              return "Password must contain uppercase, lowercase, number, and special character";
            }
          }
          return null;
        },
      },
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Confirm your password",
      required: true,
      icon: <Shield className="h-5 w-5 text-blue-400" />,
    },
  ];

  const handleSubmit = async (formData: Record<string, string | File>) => {
    // Validate terms acceptance
    if (!acceptTerms) {
      setErrors({ terms: "You must accept the Terms of Service and Privacy Policy" });
      return;
    }

    // Validate password confirmation
    const password = formData["password"] as string;
    const confirmPassword = formData["confirmPassword"] as string;
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setErrors({});

    try {
      // Handle avatar upload if provided
      let avatarBase64 = null;
      if (formData["avatar"] instanceof File) {
        const avatarFile = formData["avatar"] as File;
        // Convert file to base64 for upload
        avatarBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(avatarFile);
        });
      }

      // Call GraphQL mutation
      const { data } = await registerUser({
        variables: {
          email: formData["email"] as string,
          password: password,
          firstName: formData["firstName"] as string,
          lastName: formData["lastName"] as string,
          avatar: avatarBase64,
        },
      });

      if (data?.registerUser?.ok) {
        // Registration successful
        navigate("/login", {
          state: {
            message: "Registration successful! Please check your email to verify your account.",
            type: "success"
          }
        });
      } else {
        // Registration failed
        const errorMessage = data?.registerUser?.errors?.[0] || "Registration failed. Please try again.";
        setErrors({ submit: errorMessage });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        submit: error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
      });
    }
  };

  const footerContent = (
    <div className="space-y-4">
      {/* Terms and Conditions */}
      <div className="space-y-3">
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            required
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            disabled={isLoading}
          />
          <span className="ml-2 text-sm text-gray-700">
            I agree to the{" "}
            <Link
              to="/terms"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Privacy Policy
            </Link>
            <span className="text-red-500 ml-1">*</span>
          </span>
        </label>

        <label className="flex items-start">
          <input
            type="checkbox"
            checked={acceptMarketing}
            onChange={(e) => setAcceptMarketing(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            disabled={isLoading}
          />
          <span className="ml-2 text-sm text-gray-700">
            I would like to receive updates about new features and product announcements
          </span>
        </label>
      </div>

      {/* Terms Error */}
      {errors["terms"] && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{errors["terms"]}</span>
        </div>
      )}

      {/* Submit Error */}
      {errors["submit"] && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{errors["submit"]}</span>
        </div>
      )}

      {/* Login Link */}
      <div className="text-center pt-4">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-full py-4">
      <div className="w-full max-w-xl space-y-6">
        {/* Secure Registration Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 border-2 border-blue-200">
            <Shield className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-blue-600 mb-2">
            Secure Registration
          </h2>
          <p className="text-gray-600">
            Create your account to access your workspace
          </p>
        </div>

        <AuthForm
          fields={formFields}
          onSubmit={handleSubmit}
          submitButtonText="Create Account"
          submitButtonIcon={<UserPlus className="h-5 w-5" />}
          isLoading={isLoading}
          footer={footerContent}
        />
      </div>
    </div>
  );
};

export default Register;
