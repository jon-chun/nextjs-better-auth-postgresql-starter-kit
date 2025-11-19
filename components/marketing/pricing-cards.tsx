import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRICING_PLANS } from "@/lib/constants";

export function PricingCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Basic Plan */}
      <Card className="relative flex flex-col">
        <CardHeader>
          <CardTitle className="text-2xl">{PRICING_PLANS.BASIC.name}</CardTitle>
          <CardDescription>Perfect for trying out PlushifyMe</CardDescription>
          <div className="mt-4">
            <span className="text-5xl font-bold">
              ${PRICING_PLANS.BASIC.price}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {PRICING_PLANS.BASIC.credits} credits one-time purchase
          </p>
        </CardHeader>
        <CardContent className="flex-1">
          <ul className="space-y-3">
            {PRICING_PLANS.BASIC.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" variant="outline">
            Choose Basic
          </Button>
        </CardFooter>
      </Card>

      {/* Pro Plan (Popular) */}
      <Card className="relative flex flex-col border-2 border-primary shadow-xl scale-105">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">
            Most Popular
          </Badge>
        </div>
        <CardHeader>
          <CardTitle className="text-2xl">{PRICING_PLANS.PRO.name}</CardTitle>
          <CardDescription>Best value for regular users</CardDescription>
          <div className="mt-4">
            <span className="text-5xl font-bold">
              ${PRICING_PLANS.PRO.price}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {PRICING_PLANS.PRO.credits} credits one-time purchase
          </p>
        </CardHeader>
        <CardContent className="flex-1">
          <ul className="space-y-3">
            {PRICING_PLANS.PRO.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg">
            Choose Pro
          </Button>
        </CardFooter>
      </Card>

      {/* Elite Plan */}
      <Card className="relative flex flex-col">
        <CardHeader>
          <CardTitle className="text-2xl">{PRICING_PLANS.ELITE.name}</CardTitle>
          <CardDescription>For power users and professionals</CardDescription>
          <div className="mt-4">
            <span className="text-5xl font-bold">
              ${PRICING_PLANS.ELITE.price}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {PRICING_PLANS.ELITE.credits} credits one-time purchase
          </p>
        </CardHeader>
        <CardContent className="flex-1">
          <ul className="space-y-3">
            {PRICING_PLANS.ELITE.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" variant="outline">
            Choose Elite
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
