import React, { useState } from "react";
import {
  Send,
  User,
  Mail,
  Building,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
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
    subject: string;
    message: string;
    inquiryType: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Handle successful form submission

      setIsSubmitted(true);
    } catch (error) {
      setErrors({ submit: "Failed to send message. Please try again." });
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
      subject: "",
      message: "",
      inquiryType: "general",
    });
    setErrors({});
  };

  if (isSubmitted) {
    return (
      <div className="p-6 h-full flex flex-col justify-center max-w-md mx-auto w-full">
        {/* Success State */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Message Sent!
          </h2>
          <p className="text-gray-600">
            Thank you for contacting us. We've received your message and will
            get back to you shortly.
          </p>
        </div>

        {/* Next Steps */}
        <div className="space-y-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">
              What happens next?
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• We'll review your message within 2 hours</li>
              <li>• You'll receive a confirmation email shortly</li>
              <li>• Our team will respond based on your inquiry type</li>
              <li>• For urgent matters, please call our support line</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleNewMessage}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            <div className="flex items-center justify-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span>Send Another Message</span>
            </div>
          </Button>

          <Button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Need immediate assistance?{" "}
            <a
              href="tel:+15551234567"
              className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
            >
              Call (555) 123-4567
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col max-w-xl mx-auto w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Send className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Send us a Message
        </h2>
        <p className="text-gray-600">
          We'd love to hear from you. Send us a message and we'll respond as
          soon as possible.
        </p>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-4 flex-1">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                variant={errors["firstName"] ? "error" : "default"}
                className="w-full pl-9 pr-3"
                placeholder="First name"
                disabled={isLoading}
              />
            </div>
            {errors["firstName"] && (
              <p className="mt-1 text-xs text-red-600">{errors["firstName"]}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                variant={errors["lastName"] ? "error" : "default"}
                className="w-full pl-9 pr-3"
                placeholder="Last name"
                disabled={isLoading}
              />
            </div>
            {errors["lastName"] && (
              <p className="mt-1 text-xs text-red-600">{errors["lastName"]}</p>
            )}
          </div>
        </div>

        {/* Email and Company */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                variant={errors["email"] ? "error" : "default"}
                className="w-full pl-9 pr-3"
                placeholder="Your email"
                disabled={isLoading}
              />
            </div>
            {errors["email"] && (
              <p className="mt-1 text-xs text-red-600">{errors["email"]}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Company *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                variant={errors["company"] ? "error" : "default"}
                className="w-full pl-9 pr-3"
                placeholder="Company name"
                disabled={isLoading}
              />
            </div>
            {errors["company"] && (
              <p className="mt-1 text-xs text-red-600">{errors["company"]}</p>
            )}
          </div>
        </div>

        {/* Inquiry Type */}
        <div>
          <label
            htmlFor="inquiryType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Inquiry Type
          </label>
          <SimpleSelect
            id="inquiryType"
            name="inquiryType"
            value={formData.inquiryType}
            onChange={handleInputChange}
            disabled={isLoading}
            className="w-full"
          >
            {inquiryTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </SimpleSelect>
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subject *
          </label>
          <Input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            variant={errors["subject"] ? "error" : "default"}
            className="w-full"
            placeholder="Brief subject of your message"
            disabled={isLoading}
          />
          {errors["subject"] && (
            <p className="mt-1 text-xs text-red-600">{errors["subject"]}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={6}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm resize-none ${
              errors["message"] ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Please provide details about your inquiry..."
            disabled={isLoading}
          />
          {errors["message"] && (
            <p className="mt-1 text-xs text-red-600">{errors["message"]}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.message.length}/500 characters
          </p>
        </div>

        {/* Submit Error */}
        {errors["submit"] && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{errors["submit"]}</span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending...</span>
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
