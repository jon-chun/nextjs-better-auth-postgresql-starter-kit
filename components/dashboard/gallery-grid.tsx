"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GalleryItemCard } from "./gallery-item-card";
import { GalleryItem } from "@/lib/mock-data";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";

interface GalleryGridProps {
  items: GalleryItem[];
  isLoading?: boolean;
  onView: (item: GalleryItem) => void;
  onDownload: (item: GalleryItem) => void;
  onDelete: (item: GalleryItem) => void;
}

export function GalleryGrid({
  items,
  isLoading = false,
  onView,
  onDownload,
  onDelete,
}: GalleryGridProps) {
  const router = useRouter();

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-lg bg-muted"
          />
        ))}
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <h3 className="mb-2 text-xl font-semibold">No plushies yet</h3>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          Your gallery is empty. Start creating adorable plushie versions of
          your photos!
        </p>
        <Button onClick={() => router.push(ROUTES.DASHBOARD)}>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Your First Plushie
        </Button>
      </div>
    );
  }

  // Gallery grid
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <GalleryItemCard
          key={item.id}
          item={item}
          onView={onView}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
