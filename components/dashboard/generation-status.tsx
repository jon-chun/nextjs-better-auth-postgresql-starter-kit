"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, Download, RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

interface GenerationStatusProps {
  status: "idle" | "generating" | "success" | "error";
  onDownload?: () => void;
  onSaveToGallery?: () => void;
  onGenerateAnother?: () => void;
  resultImageUrl?: string;
  errorMessage?: string;
}

const STATUS_MESSAGES = [
  { text: "Analyzing image...", progress: 25 },
  { text: "Creating plushie...", progress: 50 },
  { text: "Adding final touches...", progress: 75 },
  { text: "Almost done...", progress: 90 },
] as const;

export function GenerationStatus({
  status,
  onDownload,
  onSaveToGallery,
  onGenerateAnother,
  resultImageUrl,
  errorMessage,
}: GenerationStatusProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (status === "generating") {
      setCurrentStep(0);
      setProgress(0);

      // Simulate progress through steps
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < STATUS_MESSAGES.length - 1) {
            const nextStep = prev + 1;
            setProgress(STATUS_MESSAGES[nextStep].progress);
            return nextStep;
          }
          return prev;
        });
      }, 1200); // ~1.2s per step = ~4.8s total

      return () => clearInterval(interval);
    } else if (status === "success") {
      setProgress(100);
    }
  }, [status]);

  if (status === "idle") {
    return null;
  }

  if (status === "generating") {
    return (
      <div className="space-y-6 rounded-lg border bg-card p-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="rounded-full bg-primary/10 p-6">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              {STATUS_MESSAGES[currentStep].text}
            </h3>
            <p className="text-sm text-muted-foreground">
              This may take a few moments
            </p>
          </div>

          <div className="w-full max-w-md space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">{progress}%</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-6 rounded-lg border border-destructive bg-destructive/10 p-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="rounded-full bg-destructive/20 p-6">
            <svg
              className="h-12 w-12 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-destructive">
              Generation Failed
            </h3>
            <p className="text-sm text-muted-foreground">
              {errorMessage || "Something went wrong. Please try again."}
            </p>
          </div>

          {onGenerateAnother && (
            <Button onClick={onGenerateAnother} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="space-y-6 rounded-lg border bg-card p-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Success Icon */}
          <div className="rounded-full bg-green-500/10 p-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>

          {/* Success Message */}
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-semibold">Plushie Created!</h3>
            <p className="text-sm text-muted-foreground">
              Your adorable plushie is ready
            </p>
          </div>

          {/* Result Image */}
          {resultImageUrl && (
            <div className="relative h-80 w-80 overflow-hidden rounded-lg border shadow-xl">
              <Image
                src={resultImageUrl}
                alt="Generated plushie"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
            {onDownload && (
              <Button onClick={onDownload} variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
            {onSaveToGallery && (
              <Button
                onClick={onSaveToGallery}
                variant="outline"
                className="flex-1"
              >
                <Save className="mr-2 h-4 w-4" />
                Save to Gallery
              </Button>
            )}
          </div>

          {onGenerateAnother && (
            <Button onClick={onGenerateAnother} className="w-full max-w-md">
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate Another
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
