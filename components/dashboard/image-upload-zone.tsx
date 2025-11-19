"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, X, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IMAGE_UPLOAD } from "@/lib/constants";
import Image from "next/image";

interface ImageUploadZoneProps {
  onImageSelect: (file: File, preview: string) => void;
  selectedImage?: { file: File; preview: string } | null;
  onClear: () => void;
}

export function ImageUploadZone({
  onImageSelect,
  selectedImage,
  onClear,
}: ImageUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    const acceptedFormats = IMAGE_UPLOAD.acceptedFormats as readonly string[];
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid file type. Please upload ${IMAGE_UPLOAD.acceptedFormats
        .map((t) => t.split("/")[1].toUpperCase())
        .join(", ")} files.`;
    }

    // Check file size
    if (file.size > IMAGE_UPLOAD.maxSizeMB * 1024 * 1024) {
      return `File size exceeds ${IMAGE_UPLOAD.maxSizeMB}MB limit.`;
    }

    return null;
  };

  const handleFile = (file: File) => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Create preview URL
    const preview = URL.createObjectURL(file);
    onImageSelect(file, preview);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setError(null);
    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview);
    }
    onClear();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {!selectedImage ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative cursor-pointer rounded-lg border-2 border-dashed p-12 transition-all duration-200",
            isDragOver
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50",
            error && "border-destructive bg-destructive/5"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={IMAGE_UPLOAD.acceptedFormats.join(",")}
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div
              className={cn(
                "rounded-full p-6 transition-colors",
                isDragOver ? "bg-primary/10" : "bg-muted",
                error && "bg-destructive/10"
              )}
            >
              {error ? (
                <FileWarning className="h-10 w-10 text-destructive" />
              ) : (
                <Upload
                  className={cn(
                    "h-10 w-10",
                    isDragOver ? "text-primary" : "text-muted-foreground"
                  )}
                />
              )}
            </div>

            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragOver ? "Drop your image here" : "Upload your photo"}
              </p>
              <p className="text-sm text-muted-foreground">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports JPG, PNG, WEBP up to {IMAGE_UPLOAD.maxSizeMB}MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg border bg-card p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex flex-col space-y-4 md:flex-row md:items-start md:space-x-4 md:space-y-0">
            <div className="relative mx-auto h-48 w-48 flex-shrink-0 overflow-hidden rounded-lg md:mx-0">
              <Image
                src={selectedImage.preview}
                alt="Uploaded image"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-1 flex-col justify-center space-y-2">
              <p className="text-sm font-medium">{selectedImage.file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(selectedImage.file.size)}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedImage.file.type.split("/")[1].toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          <FileWarning className="h-4 w-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
