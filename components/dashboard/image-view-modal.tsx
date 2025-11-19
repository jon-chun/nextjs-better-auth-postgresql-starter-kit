"use client";

import { useEffect, useState } from "react";
import {
  Download,
  Share2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { GalleryItem } from "@/lib/mock-data";
import Image from "next/image";

interface ImageViewModalProps {
  item: GalleryItem | null;
  allItems: GalleryItem[];
  isOpen: boolean;
  onClose: () => void;
  onDownload: (item: GalleryItem) => void;
  onDelete: (item: GalleryItem) => void;
}

export function ImageViewModal({
  item,
  allItems,
  isOpen,
  onClose,
  onDownload,
  onDelete,
}: ImageViewModalProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  // Get current item index
  const currentIndex = item ? allItems.findIndex((i) => i.id === item.id) : -1;

  // Navigate to previous/next
  const goToPrevious = () => {
    if (currentIndex > 0) {
      // This would typically update the parent component's state
      // For now, we'll just reset the toggle
      setShowOriginal(false);
    }
  };

  const goToNext = () => {
    if (currentIndex < allItems.length - 1) {
      setShowOriginal(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        setShowOriginal(false);
      } else if (e.key === "ArrowRight" && currentIndex < allItems.length - 1) {
        setShowOriginal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, allItems.length, onClose]);

  // Reset original view when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowOriginal(false);
    }
  }, [isOpen]);

  if (!item) return null;

  const handleShare = () => {
    // Mock share functionality
    alert("Share functionality would be implemented in Phase 2");
  };

  const displayName = item.prompt || `Plushie ${item.id}`;
  const displayImage = showOriginal ? item.originalImage : item.generatedImage;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle>{displayName}</DialogTitle>
              <Badge variant="secondary">{item.style}</Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Image Display */}
        <div className="relative bg-muted">
          <div className="relative aspect-square overflow-hidden md:aspect-video">
            <Image
              src={displayImage}
              alt={displayName}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Navigation Arrows */}
          {allItems.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full shadow-lg"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={goToNext}
                disabled={currentIndex === allItems.length - 1}
                className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full shadow-lg"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Before/After Toggle */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowOriginal(!showOriginal)}
              className="shadow-lg"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              {showOriginal ? "Show Plushie" : "Show Original"}
            </Button>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            {currentIndex + 1} of {allItems.length}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(item)}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(item)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
