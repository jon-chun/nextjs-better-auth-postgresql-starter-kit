"use client";

import { Download, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { GalleryItem } from "@/lib/mock-data";

interface GalleryItemCardProps {
  item: GalleryItem;
  onView: (item: GalleryItem) => void;
  onDownload: (item: GalleryItem) => void;
  onDelete: (item: GalleryItem) => void;
}

export function GalleryItemCard({
  item,
  onView,
  onDownload,
  onDelete,
}: GalleryItemCardProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const displayName = item.prompt || `Plushie ${item.id}`;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload(item);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(item);
  };

  return (
    <div
      onClick={() => onView(item)}
      className="group relative cursor-pointer overflow-hidden rounded-lg border bg-card transition-all duration-200 hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={item.generatedImage}
          alt={displayName}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex h-full items-center justify-center gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={() => onView(item)}
              className="h-10 w-10 rounded-full"
              aria-label="View image"
            >
              <Eye className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleDownload}
              className="h-10 w-10 rounded-full"
              aria-label="Download image"
            >
              <Download className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={handleDelete}
              className="h-10 w-10 rounded-full"
              aria-label="Delete image"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <div className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-medium">{displayName}</h3>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {item.style}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {formatDate(item.createdAt)}
        </p>
      </div>
    </div>
  );
}
