"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, ArrowRight, Info } from "lucide-react";
import { PRICING_PLANS } from "@/lib/constants";
import { mockUser, mockCreditHistory } from "@/lib/mock-data";

export default function CreditsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Credits"
        description="Manage your credits and purchase more"
      />

      {/* Current Balance */}
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center py-4">
          <div className="rounded-full bg-primary/10 p-6">
            <Coins className="h-12 w-12 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Available Credits</p>
            <p className="text-5xl font-bold">{mockUser.credits}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Each plushie generation uses 1 credit
          </p>
        </div>
      </Card>

      {/* Purchase Credits */}
      <div>
        <h2 className="mb-6 text-2xl font-semibold">Purchase More Credits</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {Object.values(PRICING_PLANS).map((plan) => (
            <Card key={plan.name} className="flex flex-col p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                {"popular" in plan && plan.popular && (
                  <Badge className="mt-2">Most Popular</Badge>
                )}
              </div>
              <div className="mb-4">
                <span className="text-4xl font-bold">${plan.price}</span>
              </div>
              <div className="mb-6 flex-1">
                <p className="mb-4 text-2xl font-semibold text-primary">
                  {plan.credits} credits
                </p>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button className="w-full">Buy Now</Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Usage History */}
      <div>
        <h2 className="mb-6 text-2xl font-semibold">Recent Activity</h2>
        <Card>
          <div className="divide-y">
            {mockCreditHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-muted p-2">
                    <Coins className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{item.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.date.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={
                      item.credits < 0
                        ? "font-medium text-destructive"
                        : "font-medium text-green-600"
                    }
                  >
                    {item.credits < 0 ? "" : "+"}
                    {item.credits}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="bg-accent/50 p-6">
        <div className="flex gap-4">
          <Info className="h-6 w-6 flex-shrink-0 text-primary" />
          <div>
            <h3 className="mb-2 font-semibold">What are credits?</h3>
            <p className="text-sm text-muted-foreground">
              Credits are used to generate plushie images. Each generation costs
              1 credit. Credits never expire and can be used at any time.
              Purchase more credits whenever you need them, or subscribe to a
              plan for better value.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
