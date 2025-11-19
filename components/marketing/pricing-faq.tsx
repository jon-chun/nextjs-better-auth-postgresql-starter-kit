import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { mockFAQData } from "@/lib/mock-data";

export function PricingFAQ() {
  // Filter only pricing/credits related FAQs
  const pricingFAQs = mockFAQData.filter((faq) => faq.category === "credits");

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Pricing Questions?
        </h2>
        <p className="text-lg text-muted-foreground">
          Common questions about credits and pricing
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {pricingFAQs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
