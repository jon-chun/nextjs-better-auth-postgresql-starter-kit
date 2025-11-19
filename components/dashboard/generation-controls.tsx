"use client";

import { Sparkles, Coins, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CREDITS } from "@/lib/constants";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface GenerationControlsProps {
  onGenerate: () => void;
  onCancel?: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
  userCredits: number;
}

export function GenerationControls({
  onGenerate,
  onCancel,
  disabled = false,
  isGenerating = false,
  userCredits,
}: GenerationControlsProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [quality, setQuality] = useState(80);
  const [removeBackground, setRemoveBackground] = useState(false);

  const hasEnoughCredits = userCredits >= CREDITS.PER_GENERATION;
  const canGenerate = !disabled && hasEnoughCredits && !isGenerating;

  return (
    <div className="space-y-4 rounded-lg border bg-card p-6">
      {/* Credits Info */}
      <div className="flex items-center justify-between rounded-lg bg-muted p-3">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Generation Cost</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            {CREDITS.PER_GENERATION} credit
          </span>
        </div>
      </div>

      {/* Available Credits */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Available Credits</span>
        <span
          className={cn("font-medium", !hasEnoughCredits && "text-destructive")}
        >
          {userCredits}
        </span>
      </div>

      {/* Advanced Options */}
      <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-between">
            <span className="text-sm font-medium">Advanced Options</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                advancedOpen && "rotate-180"
              )}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          {/* Quality Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Quality</label>
              <span className="text-sm text-muted-foreground">{quality}%</span>
            </div>
            <Slider
              value={[quality]}
              onValueChange={(value) => setQuality(value[0])}
              min={50}
              max={100}
              step={10}
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">
              Higher quality may take longer to process
            </p>
          </div>

          {/* Background Removal */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Remove Background</label>
              <p className="text-xs text-muted-foreground">
                Create plushie on transparent background
              </p>
            </div>
            <Switch
              checked={removeBackground}
              onCheckedChange={setRemoveBackground}
              disabled={isGenerating}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        {isGenerating && onCancel && (
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button
          onClick={onGenerate}
          disabled={!canGenerate}
          className={cn("flex-1", !isGenerating && "w-full")}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isGenerating ? "Generating..." : "Generate Plushie"}
        </Button>
      </div>

      {/* Insufficient Credits Warning */}
      {!hasEnoughCredits && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          You don&apos;t have enough credits. Please purchase more to continue.
        </div>
      )}
    </div>
  );
}
