"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ImageUploadZone } from "@/components/dashboard/image-upload-zone";
import { StyleSelector } from "@/components/dashboard/style-selector";
import { ImageCropper, CropData } from "@/components/dashboard/image-cropper";
import { GenerationControls } from "@/components/dashboard/generation-controls";
import { GenerationStatus } from "@/components/dashboard/generation-status";
import { mockUser } from "@/lib/mock-data";
import { PLUSHIE_STYLES } from "@/lib/constants";
import { useRouter } from "next/navigation";

type GenerationStep = "upload" | "customize" | "generating" | "result";

export default function DashboardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<GenerationStep>("upload");
  const [selectedImage, setSelectedImage] = useState<{
    file: File;
    preview: string;
  } | null>(null);
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
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedImage({ file, preview });
    setCurrentStep("customize");
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setCurrentStep("upload");
    setGenerationStatus("idle");
    setResultImageUrl(null);
  };

  const handleGenerate = () => {
    setGenerationStatus("generating");
    setCurrentStep("generating");

    // Simulate generation process (3-5 seconds)
    setTimeout(() => {
      // Mock result - in Phase 2, this would be the actual AI-generated image
      setResultImageUrl(selectedImage?.preview || "");
      setGenerationStatus("success");
      setCurrentStep("result");
    }, 4800);
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
    // Mock save - in Phase 2, this would save to the database
    alert("Image saved to gallery! (Mock action)");
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
              disabled={!selectedImage}
              isGenerating={generationStatus === "generating"}
              userCredits={mockUser.credits}
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

      {/* Placeholder message when nothing is uploaded */}
      {!selectedImage && (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            Upload an image to get started with creating your plushie
          </p>
        </div>
      )}
    </div>
  );
}
