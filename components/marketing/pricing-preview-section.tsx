import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ROUTES, PRICING_PLANS } from "@/lib/constants";

export function PricingPreviewSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/50">
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the perfect plan for your plushie needs. No subscriptions,
            just credits.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {/* Basic */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">
                {PRICING_PLANS.BASIC.name}
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  ${PRICING_PLANS.BASIC.price}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {PRICING_PLANS.BASIC.credits} credits
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {PRICING_PLANS.BASIC.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Pro (Popular) */}
          <Card className="relative border-2 border-primary shadow-lg scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary">Most Popular</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">
                {PRICING_PLANS.PRO.name}
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  ${PRICING_PLANS.PRO.price}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {PRICING_PLANS.PRO.credits} credits
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {PRICING_PLANS.PRO.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Elite */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">
                {PRICING_PLANS.ELITE.name}
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  ${PRICING_PLANS.ELITE.price}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {PRICING_PLANS.ELITE.credits} credits
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {PRICING_PLANS.ELITE.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href={ROUTES.PRICING}>
              View All Pricing Details
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
