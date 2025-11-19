"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ImageUploadZone } from "@/components/dashboard/image-upload-zone";
import { StyleSelector } from "@/components/dashboard/style-selector";
import { ImageCropper, CropData } from "@/components/dashboard/image-cropper";
import { GenerationControls } from "@/components/dashboard/generation-controls";
import { GenerationStatus } from "@/components/dashboard/generation-status";
import { PLUSHIE_STYLES } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  uploadFileToS3,
  validateImageFile,
  UploadProgress,
} from "@/lib/upload-helpers";

type GenerationStep = "upload" | "customize" | "generating" | "result";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState<GenerationStep>("upload");
  const [selectedImage, setSelectedImage] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const [uploadedFileKey, setUploadedFileKey] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>(
    PLUSHIE_STYLES[0].id
  );
  const [_cropData, _setCropData] = useState<CropData>({
    zoom: 100,
    rotation: 0,
    aspectRatio: "1:1",
  });
  const [generationStatus, setGenerationStatus] = useState<
    "idle" | "generating" | "success" | "error"
  >("idle");
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userCredits, setUserCredits] = useState<number>(0);

  // Fetch user credits on mount
  useEffect(() => {
    const fetchUserCredits = async () => {
      if (session?.user) {
        try {
          const response = await fetch("/api/user/credits");
          if (response.ok) {
            const data = await response.json();
            setUserCredits(data.credits || 0);
          }
        } catch (error) {
          console.error("Failed to fetch credits:", error);
        }
      }
    };

    fetchUserCredits();
  }, [session]);

  const handleImageSelect = async (file: File, preview: string) => {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || "Invalid file");
      return;
    }

    setSelectedImage({ file, preview });
    setErrorMessage(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload to S3
      const result = await uploadFileToS3(file, (progress: UploadProgress) => {
        setUploadProgress(progress.percentage);
      });

      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }

      setUploadedFileKey(result.fileKey);
      setIsUploading(false);
      setCurrentStep("customize");
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to upload image",
      );
      setIsUploading(false);
      setSelectedImage(null);
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setUploadedFileKey(null);
    setCurrentStep("upload");
    setGenerationStatus("idle");
    setResultImageUrl(null);
    setErrorMessage(null);
    setUploadProgress(0);
  };

  const handleGenerate = async () => {
    if (!uploadedFileKey) {
      setErrorMessage("Please upload an image first");
      return;
    }

    setGenerationStatus("generating");
    setCurrentStep("generating");
    setErrorMessage(null);

    try {
      // Start generation
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalFileKey: uploadedFileKey,
          style: selectedStyle,
          prompt: "", // Optional custom prompt
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setGenerationId(data.imageId);

      // Poll for completion
      pollGenerationStatus(data.imageId);
    } catch (error) {
      console.error("Generation error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to generate image",
      );
      setGenerationStatus("error");
    }
  };

  // Poll generation status
  const pollGenerationStatus = async (imageId: string) => {
    const maxAttempts = 60; // 60 attempts = 2 minutes max
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/generate/${imageId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to check status");
        }

        if (data.status === "completed") {
          setResultImageUrl(data.generatedUrl);
          setGenerationStatus("success");
          setCurrentStep("result");
          // Refresh credits
          const creditsResponse = await fetch("/api/user/credits");
          if (creditsResponse.ok) {
            const creditsData = await creditsResponse.json();
            setUserCredits(creditsData.credits || 0);
          }
        } else if (data.status === "failed") {
          throw new Error(data.errorMessage || "Generation failed");
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 2000); // Poll every 2 seconds
        } else {
          throw new Error("Generation timeout - please try again");
        }
      } catch (error) {
        console.error("Polling error:", error);
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to complete generation",
        );
        setGenerationStatus("error");
      }
    };

    poll();
  };

  const handleCancel = () => {
    setGenerationStatus("idle");
    setCurrentStep("customize");
  };

  const handleDownload = () => {
    if (resultImageUrl) {
      // Mock download - in Phase 2, this would download the actual generated image
      const link = document.createElement("a");
      link.href = resultImageUrl;
      link.download = `plushie-${Date.now()}.png`;
      link.click();
    }
  };

  const handleSaveToGallery = () => {
    // Image is already saved in database from generation
    router.push("/gallery");
  };

  const handleGenerateAnother = () => {
    handleClearImage();
  };

  const isCustomizeStep = currentStep === "customize";
  const isGeneratingOrResult =
    currentStep === "generating" || currentStep === "result";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Generate Plushie"
        description="Upload a photo and transform it into an adorable plushie"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Upload & Customize */}
        <div className="space-y-6">
          {/* Image Upload */}
          <ImageUploadZone
            onImageSelect={handleImageSelect}
            selectedImage={selectedImage}
            onClear={handleClearImage}
          />

          {/* Style Selector - Only show when image is uploaded */}
          {selectedImage && isCustomizeStep && (
            <StyleSelector
              selectedStyle={selectedStyle}
              onStyleChange={setSelectedStyle}
            />
          )}
        </div>

        {/* Right Column: Crop & Controls */}
        <div className="space-y-6">
          {/* Image Cropper - Only show when image is uploaded and in customize step */}
          {selectedImage && isCustomizeStep && (
            <ImageCropper
              imageUrl={selectedImage.preview}
              onCropChange={_setCropData}
            />
          )}

          {/* Generation Controls - Only show when customizing */}
          {selectedImage && isCustomizeStep && (
            <GenerationControls
              onGenerate={handleGenerate}
              onCancel={handleCancel}
              disabled={!selectedImage || isUploading}
              isGenerating={generationStatus === "generating"}
              userCredits={userCredits}
            />
          )}

          {/* Generation Status - Show during generation and result */}
          {isGeneratingOrResult && (
            <GenerationStatus
              status={generationStatus}
              onDownload={handleDownload}
              onSaveToGallery={handleSaveToGallery}
              onGenerateAnother={handleGenerateAnother}
              resultImageUrl={resultImageUrl || undefined}
            />
          )}
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          <p className="font-medium">Error</p>
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="rounded-lg border bg-card p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading image...</span>
              <span className="font-medium">{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Placeholder message when nothing is uploaded */}
      {!selectedImage && !isUploading && (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            Upload an image to get started with creating your plushie
          </p>
        </div>
      )}
    </div>
  );
}
