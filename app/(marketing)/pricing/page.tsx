import { Metadata } from "next";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { PricingComparison } from "@/components/marketing/pricing-comparison";
import { PricingFAQ } from "@/components/marketing/pricing-faq";

export const metadata: Metadata = {
  title: "Pricing - Simple, Transparent Credit Packages",
  description:
    "Choose the perfect credit package for your plushie needs. Basic ($9.95/30 credits), Pro ($19.95/100 credits), or Elite ($29.95/200 credits). No subscriptions, credits never expire.",
  openGraph: {
    title: "PlushifyMe Pricing - Simple, Transparent Credit Packages",
    description:
      "Transform photos into plushies with our flexible credit system. Choose from Basic, Pro, or Elite packages. Credits never expire.",
    type: "website",
  },
};

export default function PricingPage() {
  return (
    <div className="py-20 md:py-32">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No subscriptions, no hidden fees. Buy credits once and use them
            whenever you want. Credits never expire.
          </p>
        </div>

        {/* Pricing Cards */}
        <section className="mb-20">
          <PricingCards />
        </section>

        {/* Comparison Table */}
        <section className="mb-20">
          <PricingComparison />
        </section>

        {/* FAQ */}
        <section>
          <PricingFAQ />
        </section>
      </div>
    </div>
  );
}
