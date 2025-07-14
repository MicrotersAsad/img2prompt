import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";


export default function About() {
  return (
    <Layout>


    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <Card className="shadow-xl rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-4xl font-bold">About Us</h1>
          <p className="text-lg">img2prompt-three.vercel.app is a modern and minimalistic web application that transforms images into descriptive AI prompts. Built with cutting-edge technology and user simplicity in mind, it’s the perfect tool for designers, digital artists, prompt engineers, and AI hobbyists.</p>

          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p>We aim to bridge the gap between human creativity and artificial intelligence by helping users easily generate meaningful prompts from visual content. Creativity should be limitless, and we strive to build tools that remove friction from imagination.</p>

          <h2 className="text-2xl font-semibold">Our Vision</h2>
          <p>Our vision is to become the go-to utility for anyone working with generative AI tools. We see a future where our platform empowers storytellers, artists, educators, and developers to communicate ideas visually and effortlessly.</p>

          <h2 className="text-2xl font-semibold">Key Features</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>One-click prompt generation from images</li>
            <li>Works seamlessly with tools like MidJourney, DALL·E, and more</li>
            <li>No data storage – privacy-first infrastructure</li>
            <li>Optimized for mobile and desktop</li>
            <li>Free and open for all users worldwide</li>
          </ul>


          <h2 className="text-2xl font-semibold">Community & Feedback</h2>
          <p>We believe in continuous improvement through user feedback. If you have suggestions, bug reports, or ideas, feel free to reach out through the contact options on our site. Your voice shapes our development journey.</p>
        </CardContent>
      </Card>
    </main>
        </Layout>
  );
}