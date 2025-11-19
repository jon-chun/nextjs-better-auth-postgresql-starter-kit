import {
  Sparkles,
  Palette,
  Zap,
  Shield,
  ThumbsUp,
  Download,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Transformation",
    description:
      "Advanced AI technology analyzes your photos and creates stunning plushie versions with incredible detail and charm.",
  },
  {
    icon: Palette,
    title: "Multiple Style Options",
    description:
      "Choose from Cute & Fluffy, Realistic Plush, Cartoon, and Minimalist styles to match your vision perfectly.",
  },
  {
    icon: Zap,
    title: "Lightning Fast Processing",
    description:
      "Get your plushie transformation in just 3-5 seconds. No waiting around – instant cuteness!",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your photos are encrypted and private. We never share your images or use them for training without permission.",
  },
  {
    icon: ThumbsUp,
    title: "High-Quality Results",
    description:
      "Professional-grade output suitable for social media, printing, or anywhere you want to show off your plushie.",
  },
  {
    icon: Download,
    title: "Easy Download & Share",
    description:
      "Download your plushie images in high resolution and share them instantly with friends and family.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Why Choose PlushifyMe?
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to create adorable plushie versions of your
            favorite photos
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-2 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
