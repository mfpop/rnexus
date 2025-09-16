import React, { useState } from "react";
import {
  Send,
  User,
  Mail,
  Building,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Phone,
  Sparkles,
} from "lucide-react";
import { Button, Input } from "../ui/bits";
import { SimpleSelect } from "../ui/bits/SimpleSelect";

/**
 * ContactRightCard - Contact page specific right card content component
 * Independent content - contains the actual contact form
 * Not related to the company information in the left card
 */
const ContactRightCard: React.FC = () => {
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    phone: string;
    subject: string;
    message: string;
    inquiryType: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const inquiryTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "sales", label: "Sales & Pricing" },
    { value: "support", label: "Technical Support" },
    { value: "partnership", label: "Partnership" },
    { value: "demo", label: "Request Demo" },
    { value: "feedback", label: "Feedback" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors["firstName"] = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors["lastName"] = "Last name is required";
    }

    if (!formData.email) {
      newErrors["email"] = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors["email"] = "Please enter a valid email address";
    }

    if (!formData.company.trim()) {
      newErrors["company"] = "Company name is required";
    }

    if (!formData.subject.trim()) {
      newErrors["subject"] = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors["message"] = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors["message"] = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Submit using GraphQL
      const mutation = `
        mutation CreateContact(
          $firstName: String!
          $lastName: String!
          $email: String!
          $company: String!
          $subject: String!
          $message: String!
          $inquiryType: String
          $phone: String
        ) {
          createContact(
            firstName: $firstName
            lastName: $lastName
            email: $email
            company: $company
            subject: $subject
            message: $message
            inquiryType: $inquiryType
            phone: $phone
          ) {
            ok
            contact {
              id
              firstName
              lastName
              email
              company
              subject
              message
              inquiryType
              status
              createdAt
            }
            errors
          }
        }
      `;

      const response = await fetch("/graphql/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: mutation,
          variables: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            company: formData.company,
            subject: formData.subject,
            message: formData.message,
            inquiryType: formData.inquiryType,
            phone: formData.phone || "",
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message || "GraphQL error occurred");
      }

      if (!result.data?.createContact?.ok) {
        const errors = result.data?.createContact?.errors || [
          "Failed to send message",
        ];
        throw new Error(errors.join(", "));
      }

      // Handle successful form submission
      setIsSubmitted(true);
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "Failed to send message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewMessage = () => {
    setIsSubmitted(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      phone: "",
      subject: "",
      message: "",
      inquiryType: "general",
    });
    setErrors({});
  };

  if (isSubmitted) {
    return (
      <div className="p-6 h-full flex flex-col justify-center max-w-lg mx-auto w-full">
        {/* Success State */}
        <div className="text-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-emerald-200">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Message Sent Successfully!
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Thank you for reaching out! We've received your message and will get
            back to you within 24 hours.
          </p>
        </div>

        {/* Next Steps */}
        <div className="space-y-3 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 shadow-lg">
            <h3 className="font-semibold text-blue-800 mb-2 text-base">
              What happens next?
            </h3>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>We'll review your message within 2 hours</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>You'll receive a confirmation email shortly</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Our team will respond based on your inquiry type</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>For urgent matters, please call our support line</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleNewMessage}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            <div className="flex items-center justify-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span>Send Another Message</span>
            </div>
          </Button>

          <Button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Support Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Need immediate assistance?{" "}
            <a
              href="tel:+15551234567"
              className="text-blue-600 hover:text-blue-500 font-semibold transition-colors duration-200 underline decoration-2 underline-offset-2"
            >
              Call (555) 123-4567
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col max-w-2xl mx-auto w-full">
      {/* Enhanced Header */}
      <div className="text-center mb-6">
        <div className="relative mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-200/50 transform hover:scale-105 transition-transform duration-300">
            <Send className="h-8 w-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent mb-2">
          Send us a Message
        </h2>
        <p className="text-gray-600 text-base leading-relaxed max-w-md mx-auto">
          We'd love to hear from you. Send us a message and we'll respond as
          soon as possible.
        </p>
      </div>

      {/* Enhanced Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-4 flex-1">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="group">
            <label
              htmlFor="firstName"
              className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-blue-600 transition-colors duration-200"
            >
              First Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
              </div>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                // variant={errors["firstName"] ? "error" : "default"}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="First name"
                disabled={isLoading}
              />
            </div>
            {errors["firstName"] && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors["firstName"]}
              </p>
            )}
          </div>

          <div className="group">
            <label
              htmlFor="lastName"
              className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-blue-600 transition-colors duration-200"
            >
              Last Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
              </div>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                // variant={errors["lastName"] ? "error" : "default"}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="Last name"
                disabled={isLoading}
              />
            </div>
            {errors["lastName"] && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors["lastName"]}
              </p>
            )}
          </div>
        </div>

        {/* Email and Company */}
        <div className="grid grid-cols-2 gap-4">
          <div className="group">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-blue-600 transition-colors duration-200"
            >
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
              </div>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                // variant={errors["email"] ? "error" : "default"}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="Your email"
                disabled={isLoading}
              />
            </div>
            {errors["email"] && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors["email"]}
              </p>
            )}
          </div>

          <div className="group">
            <label
              htmlFor="company"
              className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-blue-600 transition-colors duration-200"
            >
              Company *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
              </div>
              <Input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                // variant={errors["company"] ? "error" : "default"}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="Company name"
                disabled={isLoading}
              />
            </div>
            {errors["company"] && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors["company"]}
              </p>
            )}
          </div>
        </div>

        {/* Phone Field */}
        <div className="group">
          <label
            htmlFor="phone"
            className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-blue-600 transition-colors duration-200"
          >
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
            </div>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              placeholder="Your phone number (optional)"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Inquiry Type */}
        <div className="group">
          <label
            htmlFor="inquiryType"
            className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-blue-600 transition-colors duration-200"
          >
            Inquiry Type
          </label>
          <SimpleSelect
            id="inquiryType"
            name="inquiryType"
            value={formData.inquiryType}
            onChange={handleInputChange}
            disabled={isLoading}
            className="w-full rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {inquiryTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </SimpleSelect>
        </div>

        {/* Subject */}
        <div className="group">
          <label
            htmlFor="subject"
            className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-blue-600 transition-colors duration-200"
          >
            Subject *
          </label>
          <Input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            // variant={errors["subject"] ? "error" : "default"}
            className="w-full py-2.5 px-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            placeholder="Brief subject of your message"
            disabled={isLoading}
          />
          {errors["subject"] && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors["subject"]}
            </p>
          )}
        </div>

        {/* Message */}
        <div className="group">
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-blue-600 transition-colors duration-200"
          >
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-3 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 text-sm resize-none shadow-sm hover:shadow-md ${
              errors["message"]
                ? "border-red-500 hover:border-red-400"
                : "border-gray-200 hover:border-blue-300 focus:border-blue-500"
            }`}
            placeholder="Please provide details about your inquiry..."
            disabled={isLoading}
          />
          {errors["message"] && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors["message"]}
            </p>
          )}
          <div className="mt-1 flex justify-between items-center">
            <p className="text-xs text-gray-500">
              {formData.message.length}/500 characters
            </p>
            <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{
                  width: `${Math.min((formData.message.length / 500) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Submit Error */}
        {errors["submit"] && (
          <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl text-red-700 text-sm shadow-lg">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <span className="font-medium">{errors["submit"]}</span>
          </div>
        )}

        {/* Enhanced Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white py-3 rounded-2xl font-semibold text-base transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl hover:shadow-2xl"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending Message...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Send className="h-5 w-5" />
              <span>Send Message</span>
            </div>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ContactRightCard;
