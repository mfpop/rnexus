import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Card";
import { ArrowLeft } from "lucide-react";

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back to Home */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <img src="/Nexus.svg" alt="Nexus LMD" className="h-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-600">Last updated: December 2024</p>
        </div>

        {/* Privacy Policy Content */}
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <div className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  1. Introduction
                </h2>
                <p className="text-gray-700 mb-4">
                  Nexus LMD ("we," "our," or "us") is committed to protecting
                  your privacy. This Privacy Policy explains how we collect,
                  use, disclose, and safeguard your information when you use our
                  production management platform and related services.
                </p>
                <p className="text-gray-700">
                  By using our services, you agree to the collection and use of
                  information in accordance with this policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  2. Information We Collect
                </h2>

                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  2.1 Personal Information
                </h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>
                    Name and contact information (email address, phone number)
                  </li>
                  <li>Company and job title information</li>
                  <li>Account credentials and authentication data</li>
                  <li>Profile information and preferences</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  2.2 Usage Information
                </h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Log data and analytics information</li>
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                  <li>Usage patterns and feature interactions</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  2.3 Production Data
                </h3>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>Production metrics and performance data</li>
                  <li>Equipment and system information</li>
                  <li>Process and workflow data</li>
                  <li>Quality control and compliance information</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  3. How We Use Your Information
                </h2>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>Provide and maintain our services</li>
                  <li>Process transactions and manage accounts</li>
                  <li>Send notifications and updates</li>
                  <li>Improve our platform and user experience</li>
                  <li>Ensure security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                  <li>Provide customer support</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  4. Information Sharing and Disclosure
                </h2>
                <p className="text-gray-700 mb-4">
                  We do not sell, trade, or otherwise transfer your personal
                  information to third parties without your consent, except in
                  the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>With your explicit consent</li>
                  <li>To comply with legal requirements</li>
                  <li>To protect our rights and safety</li>
                  <li>
                    With trusted service providers who assist in operating our
                    platform
                  </li>
                  <li>In connection with business transfers or mergers</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  5. Data Security
                </h2>
                <p className="text-gray-700 mb-4">
                  We implement appropriate technical and organizational measures
                  to protect your information against unauthorized access,
                  alteration, disclosure, or destruction.
                </p>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Employee training on data protection</li>
                  <li>Incident response procedures</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  6. Your Rights and Choices
                </h2>
                <p className="text-gray-700 mb-4">
                  You have the following rights regarding your personal
                  information:
                </p>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>
                    <strong>Access:</strong> Request access to your personal
                    information
                  </li>
                  <li>
                    <strong>Correction:</strong> Request correction of
                    inaccurate information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your personal
                    information
                  </li>
                  <li>
                    <strong>Portability:</strong> Request a copy of your data in
                    a portable format
                  </li>
                  <li>
                    <strong>Objection:</strong> Object to certain processing
                    activities
                  </li>
                  <li>
                    <strong>Withdrawal:</strong> Withdraw consent where
                    processing is based on consent
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  7. Data Retention
                </h2>
                <p className="text-gray-700">
                  We retain your personal information for as long as necessary
                  to provide our services, comply with legal obligations,
                  resolve disputes, and enforce our agreements. When we no
                  longer need your information, we will securely delete or
                  anonymize it.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  8. International Data Transfers
                </h2>
                <p className="text-gray-700">
                  Your information may be transferred to and processed in
                  countries other than your own. We ensure that such transfers
                  comply with applicable data protection laws and implement
                  appropriate safeguards to protect your information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  9. Cookies and Tracking Technologies
                </h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar technologies to enhance your
                  experience, analyze usage patterns, and provide personalized
                  content. You can control cookie settings through your browser
                  preferences.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  10. Children's Privacy
                </h2>
                <p className="text-gray-700">
                  Our services are not intended for children under 13 years of
                  age. We do not knowingly collect personal information from
                  children under 13. If you believe we have collected such
                  information, please contact us immediately.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  11. Changes to This Policy
                </h2>
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any material changes by posting the new policy
                  on our platform and updating the "Last updated" date. Your
                  continued use of our services after such changes constitutes
                  acceptance of the updated policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  12. Contact Us
                </h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy or our
                  data practices, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Email:</strong> privacy@nexuslmd.com
                    <br />
                    <strong>Address:</strong> Nexus LMD, 123 Production Ave,
                    Manufacturing City, MC 12345
                    <br />
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
