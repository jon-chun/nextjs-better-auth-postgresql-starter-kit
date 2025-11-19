"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLUSHIE_STYLES } from "@/lib/constants";

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (styleId: string) => void;
}

export function StyleSelector({
  selectedStyle,
  onStyleChange,
}: StyleSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Select Plushie Style</h3>
        <p className="text-sm text-muted-foreground">
          Choose how you want your plushie to look
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PLUSHIE_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onStyleChange(style.id)}
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-lg border-2 p-4 text-left transition-all duration-200",
              selectedStyle === style.id
                ? "border-primary bg-primary/5 shadow-md"
                : "border-muted hover:border-primary/50 hover:bg-accent/50"
            )}
          >
            {/* Selection Indicator */}
            {selectedStyle === style.id && (
              <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                <Check className="h-4 w-4 text-primary-foreground" />
              </div>
            )}

            {/* Style Preview Placeholder */}
            <div
              className={cn(
                "mb-3 flex h-24 items-center justify-center rounded-md",
                selectedStyle === style.id
                  ? "bg-primary/10"
                  : "bg-muted group-hover:bg-primary/5"
              )}
            >
              <span className="text-4xl">{style.emoji}</span>
            </div>

            {/* Style Info */}
            <div className="space-y-1">
              <h4
                className={cn(
                  "font-semibold",
                  selectedStyle === style.id && "text-primary"
                )}
              >
                {style.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                {style.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
