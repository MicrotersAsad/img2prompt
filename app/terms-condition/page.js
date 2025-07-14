import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
export default function Terms() {
  return (
    <Layout>
    <main className="p-6 max-w-4xl mx-auto">
      <Card className="shadow-xl rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-4xl font-bold">Terms & Conditions</h1>
          <p className="text-lg">These Terms govern your use of img2prompt-three.vercel.app. By accessing or using the website, you agree to be legally bound by the following conditions.</p>

          <h2 className="text-2xl font-semibold">1. Eligibility</h2>
          <p>By using this site, you confirm that you are at least 13 years old. Users under 18 should have guardian supervision.</p>

          <h2 className="text-2xl font-semibold">2. Fair Use Policy</h2>
          <p>This tool is meant for ethical and non-commercial use. Any misuse, such as generating misleading or harmful content, is strictly prohibited.</p>

          <h2 className="text-2xl font-semibold">3. Intellectual Property</h2>
          <p>All design, content, and source code on this site are owned by the developers unless stated otherwise. Unauthorized copying is not allowed.</p>

          <h2 className="text-2xl font-semibold">4. Output Responsibility</h2>
          <p>You are fully responsible for how you use the output generated from the tool. We do not control, store, or moderate the outputs.</p>

          <h2 className="text-2xl font-semibold">5. Downtime & Errors</h2>
          <p>We do our best to maintain uptime. However, we are not liable for any outages or system glitches. The platform is provided "as is."</p>

          <h2 className="text-2xl font-semibold">6. Changes to Terms</h2>
          <p>We may revise these terms occasionally. Continued use of the site after changes indicates your acceptance of the updated terms.</p>

          <h2 className="text-2xl font-semibold">7. Jurisdiction</h2>
          <p>These terms are governed by applicable international and local laws based on our hosting and development jurisdictions.</p>

          <h2 className="text-2xl font-semibold">8. Contact</h2>
          <p>Have questions or concerns? Please reach out to our admin via the support or contact section.</p>
        </CardContent>
      </Card>
    </main>
    </Layout>

  );
}
