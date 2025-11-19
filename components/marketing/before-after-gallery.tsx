"use client";

import { useState } from "react";
import { BeforeAfterSlider } from "@/components/shared/before-after-slider";
import { mockBeforeAfterPairs } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "All" },
  { id: "people", label: "People" },
  { id: "pets", label: "Pets" },
  { id: "kids", label: "Kids" },
  { id: "groups", label: "Groups" },
] as const;

export function BeforeAfterGallery() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredPairs = mockBeforeAfterPairs.filter(
    (pair) => activeCategory === "all" || pair.category === activeCategory
  );

  return (
    <section id="examples" className="py-20 md:py-32 bg-muted/50">
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            See the Magic in Action
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore real transformations from photos to adorable plushies
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "transition-all",
                activeCategory === category.id && "shadow-lg"
              )}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPairs.map((pair) => (
            <div key={pair.id} className="group animate-fade-in">
              <BeforeAfterSlider
                beforeImage={pair.before}
                afterImage={pair.after}
                beforeAlt={`${pair.title} - Before`}
                afterAlt={`${pair.title} - After`}
                className="shadow-lg transition-transform group-hover:scale-[1.02]"
              />
              <p className="mt-3 text-center text-sm font-medium text-muted-foreground">
                {pair.title}
              </p>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPairs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No examples found for this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
