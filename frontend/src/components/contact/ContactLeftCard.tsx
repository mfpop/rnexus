import React from "react";
import { MapPin, Mail, Headphones } from "lucide-react";

/**
 * ContactLeftCard - Contact page specific left card content component
 * Independent content - not related to the contact form in the right card
 * Displays company contact information and support details
 */
const ContactLeftCard: React.FC = () => {
  const contactInfo = [
    {
      id: 1,
      title: "Support Team",
      info: "Reach out to our friendly support team for any inquiries or assistance.",
      icon: <Headphones className="h-4 w-4" />,
      color: "text-teal-600",
    },
    {
      id: 2,
      title: "Our Office",
      info: "2953 Roll Drive 201\nSan Diego, CA 92154",
      icon: <MapPin className="h-4 w-4" />,
      color: "text-teal-600",
    },
    {
      id: 3,
      title: "Email Us",
      info: "support@nexuslmd.com",
      icon: <Mail className="h-4 w-4" />,
      color: "text-teal-600",
    },
  ];

  return (
    <div className="p-4 h-full flex flex-col justify-between">
      {/* Header Section */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
            <Mail className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800">Get in Touch</h2>
            <p className="text-xs text-gray-600">We're here to help</p>
          </div>
        </div>
        <p className="text-xs text-gray-700 leading-relaxed">
          Have questions about Nexus LMD? Our expert team is ready to assist you
          with your manufacturing operations.
        </p>
      </div>

      {/* Contact Information */}
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Contact Information
        </h3>
        <div className="space-y-2">
          {contactInfo.map((contact) => (
            <div
              key={contact.id}
              className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div
                className={`p-1.5 rounded-lg bg-gray-100 ${contact.color} flex-shrink-0`}
              >
                {contact.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 text-xs mb-0.5">
                  {contact.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                  {contact.info}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactLeftCard;
