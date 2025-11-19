"use client";

import { useState } from "react";
import { RotateCw, RotateCcw, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";

interface ImageCropperProps {
  imageUrl: string;
  onCropChange?: (cropData: CropData) => void;
}

export interface CropData {
  zoom: number;
  rotation: number;
  aspectRatio: string;
}

const ASPECT_RATIOS = [
  { id: "1:1", label: "Square", value: 1 },
  { id: "3:4", label: "Portrait", value: 3 / 4 },
  { id: "4:3", label: "Landscape", value: 4 / 3 },
] as const;

export function ImageCropper({ imageUrl, onCropChange }: ImageCropperProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1");

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
    notifyCropChange(value[0], rotation, selectedAspectRatio);
  };

  const handleRotate = (degrees: number) => {
    const newRotation = (rotation + degrees) % 360;
    setRotation(newRotation);
    notifyCropChange(zoom, newRotation, selectedAspectRatio);
  };

  const handleAspectRatioChange = (ratioId: string) => {
    setSelectedAspectRatio(ratioId);
    notifyCropChange(zoom, rotation, ratioId);
  };

  const handleReset = () => {
    setZoom(100);
    setRotation(0);
    setSelectedAspectRatio("1:1");
    notifyCropChange(100, 0, "1:1");
  };

  const notifyCropChange = (z: number, r: number, aspectRatio: string) => {
    onCropChange?.({
      zoom: z,
      rotation: r,
      aspectRatio,
    });
  };

  const currentAspectRatio =
    ASPECT_RATIOS.find((r) => r.id === selectedAspectRatio)?.value || 1;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Crop & Adjust</h3>
        <p className="text-sm text-muted-foreground">
          Adjust the crop area and orientation
        </p>
      </div>

      {/* Image Preview Area */}
      <div className="relative overflow-hidden rounded-lg border bg-muted p-4">
        <div
          className="mx-auto flex items-center justify-center"
          style={{ maxWidth: "500px" }}
        >
          <div
            className="relative overflow-hidden rounded-lg shadow-lg"
            style={{
              aspectRatio: currentAspectRatio,
              width: "100%",
              maxWidth: "400px",
            }}
          >
            {/* Grid Overlay */}
            <div className="absolute inset-0 z-10 grid grid-cols-3 grid-rows-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="border border-white/30" />
              ))}
            </div>

            {/* Image */}
            <div
              className="relative h-full w-full transition-transform duration-200"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              }}
            >
              <Image
                src={imageUrl}
                alt="Crop preview"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Aspect Ratio Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Aspect Ratio</label>
        <div className="flex gap-2">
          {ASPECT_RATIOS.map((ratio) => (
            <Button
              key={ratio.id}
              variant={selectedAspectRatio === ratio.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleAspectRatioChange(ratio.id)}
              className="flex-1"
            >
              {ratio.label}
              <span className="ml-1 text-xs opacity-70">({ratio.id})</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Zoom Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Zoom</label>
          <span className="text-sm text-muted-foreground">{zoom}%</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleZoomChange([Math.max(50, zoom - 10)])}
            disabled={zoom <= 50}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Slider
            value={[zoom]}
            onValueChange={handleZoomChange}
            min={50}
            max={200}
            step={5}
            className="flex-1"
            aria-label="Zoom level"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleZoomChange([Math.min(200, zoom + 10)])}
            disabled={zoom >= 200}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Rotation Controls */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Rotation</label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRotate(-90)}
            className="flex-1"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Rotate Left
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRotate(90)}
            className="flex-1"
          >
            <RotateCw className="mr-2 h-4 w-4" />
            Rotate Right
          </Button>
        </div>
      </div>

      {/* Reset Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReset}
        className="w-full"
      >
        <Maximize className="mr-2 h-4 w-4" />
        Reset Crop
      </Button>
    </div>
  );
}
