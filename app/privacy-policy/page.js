import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
export default function PrivacyPolicy() {
  return (
<Layout>

    <main className="p-6 max-w-4xl mx-auto">
      <Card className="shadow-xl rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-lg">We are committed to protecting your personal data. This policy describes how your information is collected, used, and protected when using img2prompt-three.vercel.app.</p>

          <h2 className="text-2xl font-semibold">1. What We Collect</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>IP address, browser version, and screen size (analytics only)</li>
            <li>Image inputs you provide to generate prompts (temporary)</li>
            <li>No personal information or login credentials are collected</li>
          </ul>

          <h2 className="text-2xl font-semibold">2. Why We Collect It</h2>
          <p>We collect minimal data to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Operate the image-to-prompt conversion feature</li>
            <li>Monitor performance and detect misuse or abuse</li>
            <li>Improve functionality and user experience</li>
          </ul>

          <h2 className="text-2xl font-semibold">3. Data Sharing</h2>
          <p>We do not sell your information. Some anonymous data may be processed by our trusted providers (e.g., Vercel, image analysis APIs) for hosting and functionality purposes.</p>

          <h2 className="text-2xl font-semibold">4. Retention</h2>
          <p>Uploaded images and results are processed on the fly and not stored. Logs and diagnostics may be retained for up to 30 days in aggregate format.</p>

          <h2 className="text-2xl font-semibold">5. Your Rights</h2>
          <p>Depending on your location, you may have rights under laws such as GDPR or CCPA to access, modify, or delete your data. Contact us for requests.</p>

          <h2 className="text-2xl font-semibold">6. Cookies</h2>
          <p>We use only essential cookies and lightweight analytics to ensure smooth usage. You may disable cookies in your browser settings without affecting core functionality.</p>

          <h2 className="text-2xl font-semibold">7. Security</h2>
          <p>We apply best practices in web security and depend on trusted infrastructure (Vercel) to safeguard all data flows.</p>

          <h2 className="text-2xl font-semibold">8. Updates</h2>
          <p>This policy may change with new features or law updates. Please revisit this page periodically.</p>
        </CardContent>
      </Card>
    </main>
    </Layout>
  );
}