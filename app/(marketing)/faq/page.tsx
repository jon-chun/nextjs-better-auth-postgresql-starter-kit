"use client";

import { useState, useMemo } from "react";
import Script from "next/script";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { mockFAQData } from "@/lib/mock-data";

const categories = [
  { id: "general", label: "General Questions" },
  { id: "credits", label: "Credits & Pricing" },
  { id: "technical", label: "Technical Questions" },
  { id: "privacy", label: "Privacy & Security" },
] as const;

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter FAQ items based on search
  const filteredFAQs = useMemo(() => {
    if (!searchQuery) return mockFAQData;

    const query = searchQuery.toLowerCase();
    return mockFAQData.filter(
      (item) =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group FAQs by category
  const faqsByCategory = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      items: filteredFAQs.filter((faq) => faq.category === category.id),
    }));
  }, [filteredFAQs]);

  // Schema.org FAQPage structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: mockFAQData.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about PlushifyMe
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-muted-foreground">
              Found {filteredFAQs.length} result
              {filteredFAQs.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {faqsByCategory.map((category) => {
            if (category.items.length === 0) return null;

            return (
              <div key={category.id}>
                <h2 className="mb-6 text-2xl font-semibold">
                  {category.label}
                </h2>
                <Accordion type="multiple" className="space-y-4">
                  {category.items.map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="rounded-lg border bg-card px-6"
                    >
                      <AccordionTrigger className="text-left hover:no-underline">
                        <span className="font-medium">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            );
          })}

          {filteredFAQs.length === 0 && (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <p className="text-lg text-muted-foreground">
                No questions found matching &quot;{searchQuery}&quot;
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try searching with different keywords
              </p>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-16 rounded-lg border bg-accent/50 p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">Still have questions?</h3>
          <p className="mb-4 text-muted-foreground">
            Can&apos;t find the answer you&apos;re looking for? Our support team
            is here to help.
          </p>
          <p className="text-sm text-muted-foreground">
            Email us at{" "}
            <a
              href="mailto:support@plushifyme.com"
              className="font-medium text-primary hover:underline"
            >
              support@plushifyme.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
