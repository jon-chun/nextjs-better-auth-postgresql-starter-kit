"use client";

import { Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    category: "Credits & Generation",
    items: [
      { name: "Credits included", basic: "30", pro: "100", elite: "200" },
      { name: "Cost per credit", basic: "$0.33", pro: "$0.20", elite: "$0.15" },
      { name: "Credits never expire", basic: true, pro: true, elite: true },
      { name: "Bulk generation", basic: false, pro: true, elite: true },
    ],
  },
  {
    category: "Processing & Quality",
    items: [
      {
        name: "Processing speed",
        basic: "Standard",
        pro: "Priority",
        elite: "Ultra-fast",
      },
      { name: "High-resolution output", basic: true, pro: true, elite: true },
      { name: "Background removal", basic: false, pro: true, elite: true },
      { name: "Advanced editing tools", basic: false, pro: true, elite: true },
    ],
  },
  {
    category: "Styles & Customization",
    items: [
      { name: "Access to all styles", basic: true, pro: true, elite: true },
      { name: "Style presets", basic: false, pro: true, elite: true },
      { name: "Custom style requests", basic: false, pro: false, elite: true },
      { name: "Advanced customization", basic: false, pro: false, elite: true },
    ],
  },
  {
    category: "Support & Features",
    items: [
      {
        name: "Email support",
        basic: "24-hour",
        pro: "Email",
        elite: "Premium",
      },
      { name: "Priority queue", basic: false, pro: false, elite: true },
      { name: "Commercial license", basic: false, pro: false, elite: true },
      { name: "API access", basic: false, pro: false, elite: true },
    ],
  },
];

export function PricingComparison() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl">Detailed Feature Comparison</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Feature</TableHead>
                <TableHead className="text-center">Basic</TableHead>
                <TableHead className="text-center bg-primary/5">Pro</TableHead>
                <TableHead className="text-center">Elite</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((category) => (
                <>
                  <TableRow key={category.category} className="bg-muted/50">
                    <TableCell colSpan={4} className="font-semibold">
                      {category.category}
                    </TableCell>
                  </TableRow>
                  {category.items.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-center">
                        {renderCell(item.basic)}
                      </TableCell>
                      <TableCell className="text-center bg-primary/5">
                        {renderCell(item.pro)}
                      </TableCell>
                      <TableCell className="text-center">
                        {renderCell(item.elite)}
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function renderCell(value: boolean | string) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-5 w-5 text-green-600 mx-auto" />
    ) : (
      <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
    );
  }
  return <span className="text-sm">{value}</span>;
}
