import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Card";
import { ArrowLeft } from "lucide-react";

const Terms: React.FC = () => {
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
            Terms of Service
          </h1>
          <p className="text-gray-600">Last updated: December 2024</p>
        </div>

        {/* Terms Content */}
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <div className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using the Nexus LMD platform ("Service"), you
                  accept and agree to be bound by the terms and provision of
                  this agreement. If you do not agree to abide by the above,
                  please do not use this service.
                </p>
                <p className="text-gray-700">
                  These Terms of Service ("Terms") govern your use of our
                  production management platform and related services provided
                  by Nexus LMD ("Company," "we," "us," or "our").
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  2. Description of Service
                </h2>
                <p className="text-gray-700 mb-4">
                  Nexus LMD provides a comprehensive production management
                  platform that includes:
                </p>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>Production monitoring and analytics</li>
                  <li>Equipment and system management</li>
                  <li>Quality control and compliance tracking</li>
                  <li>Team collaboration and communication tools</li>
                  <li>Real-time reporting and dashboards</li>
                  <li>Process optimization and workflow management</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  3. User Accounts and Registration
                </h2>
                <p className="text-gray-700 mb-4">
                  To access certain features of the Service, you must create an
                  account. You agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>
                    Provide accurate, current, and complete information during
                    registration
                  </li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your account credentials secure and confidential</li>
                  <li>
                    Accept responsibility for all activities under your account
                  </li>
                  <li>
                    Notify us immediately of any unauthorized use of your
                    account
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  4. Acceptable Use Policy
                </h2>
                <p className="text-gray-700 mb-4">
                  You agree not to use the Service to:
                </p>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Transmit harmful, offensive, or inappropriate content</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the Service</li>
                  <li>
                    Use the Service for any commercial purpose without
                    authorization
                  </li>
                  <li>Reverse engineer or attempt to extract source code</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  5. Intellectual Property Rights
                </h2>
                <p className="text-gray-700 mb-4">
                  The Service and its original content, features, and
                  functionality are owned by Nexus LMD and are protected by
                  international copyright, trademark, patent, trade secret, and
                  other intellectual property laws.
                </p>
                <p className="text-gray-700">
                  You retain ownership of any content you submit to the Service,
                  but you grant us a worldwide, non-exclusive, royalty-free
                  license to use, reproduce, modify, and distribute such content
                  in connection with the Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  6. Privacy and Data Protection
                </h2>
                <p className="text-gray-700 mb-4">
                  Your privacy is important to us. Our collection and use of
                  personal information is governed by our Privacy Policy, which
                  is incorporated into these Terms by reference.
                </p>
                <p className="text-gray-700">
                  You are responsible for ensuring that your use of the Service
                  complies with applicable data protection laws and regulations.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  7. Service Availability and Modifications
                </h2>
                <p className="text-gray-700 mb-4">
                  We strive to provide reliable and continuous service, but we
                  do not guarantee that the Service will be available at all
                  times. We may:
                </p>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>
                    Modify, suspend, or discontinue the Service at any time
                  </li>
                  <li>
                    Perform maintenance that may temporarily affect availability
                  </li>
                  <li>Update features and functionality</li>
                  <li>Change pricing with appropriate notice</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  8. Limitation of Liability
                </h2>
                <p className="text-gray-700 mb-4">
                  To the maximum extent permitted by law, Nexus LMD shall not be
                  liable for any indirect, incidental, special, consequential,
                  or punitive damages, including but not limited to:
                </p>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>Loss of profits, data, or business opportunities</li>
                  <li>Service interruptions or downtime</li>
                  <li>Data loss or corruption</li>
                  <li>Third-party actions or content</li>
                  <li>Security breaches or unauthorized access</li>
                </ul>
                <p className="text-gray-700">
                  Our total liability shall not exceed the amount paid by you
                  for the Service in the twelve months preceding the claim.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  9. Indemnification
                </h2>
                <p className="text-gray-700">
                  You agree to indemnify and hold harmless Nexus LMD, its
                  officers, directors, employees, and agents from and against
                  any claims, damages, obligations, losses, liabilities, costs,
                  or debt arising from your use of the Service or violation of
                  these Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  10. Termination
                </h2>
                <p className="text-gray-700 mb-4">
                  We may terminate or suspend your account and access to the
                  Service immediately, without prior notice, for conduct that we
                  believe violates these Terms or is harmful to other users, us,
                  or third parties.
                </p>
                <p className="text-gray-700">
                  Upon termination, your right to use the Service will cease
                  immediately, and we may delete your account and data in
                  accordance with our data retention policies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  11. Governing Law and Dispute Resolution
                </h2>
                <p className="text-gray-700 mb-4">
                  These Terms shall be governed by and construed in accordance
                  with the laws of the jurisdiction in which Nexus LMD operates,
                  without regard to its conflict of law provisions.
                </p>
                <p className="text-gray-700">
                  Any disputes arising from these Terms or your use of the
                  Service shall be resolved through binding arbitration in
                  accordance with the rules of the American Arbitration
                  Association.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  12. Severability
                </h2>
                <p className="text-gray-700">
                  If any provision of these Terms is found to be unenforceable
                  or invalid, that provision will be limited or eliminated to
                  the minimum extent necessary so that these Terms will
                  otherwise remain in full force and effect.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  13. Changes to Terms
                </h2>
                <p className="text-gray-700">
                  We reserve the right to modify these Terms at any time. We
                  will notify users of any material changes by posting the new
                  Terms on our platform and updating the "Last updated" date.
                  Your continued use of the Service after such changes
                  constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  14. Contact Information
                </h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about these Terms of Service, please
                  contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Email:</strong> legal@nexuslmd.com
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

export default Terms;
