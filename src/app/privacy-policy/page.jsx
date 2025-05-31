export const metadata = {
  title: "Privacy Policy | Daily Trend News",
};

export default async function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-6 space-y-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="text-gray-600">Effective Date: June 1, 2025</p>

      <section>
        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <p>
          We may collect personal information such as your name, email address, and IP address when you subscribe to our newsletter, comment on articles, or contact us.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
        <p>
          Your data helps us improve our content, respond to inquiries, and send relevant updates if you subscribe to our newsletter.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">3. Cookies</h2>
        <p>
          We use cookies to analyze site traffic and enhance your reading experience. You can control cookies through your browser settings.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">4. Third-Party Services</h2>
        <p>
          We may use third-party tools like Google Analytics or AdSense. These services may collect data in accordance with their own privacy policies.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">5. Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal data. To do so, please contact us through our support page.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">6. Changes to This Policy</h2>
        <p>
          We may revise this policy at any time. Updates will be posted here, and we encourage you to review it periodically.
        </p>
      </section>

      <p className="text-sm text-gray-600">
        Questions about privacy? Contact us at contact@dailytrendnews.in
      </p>
    </main>
  );
}