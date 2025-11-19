"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import {
  GalleryFilters,
  GalleryFilterOptions,
} from "@/components/dashboard/gallery-filters";
import { GalleryGrid } from "@/components/dashboard/gallery-grid";
import { ImageViewModal } from "@/components/dashboard/image-view-modal";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { mockGalleryItems, GalleryItem } from "@/lib/mock-data";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(mockGalleryItems);
  const [filters, setFilters] = useState<GalleryFilterOptions>({
    dateFilter: "all",
    styleFilter: "all",
    sortOrder: "newest",
    searchQuery: "",
  });
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter((item) => {
        const name = item.prompt || `Plushie ${item.id}`;
        return name.toLowerCase().includes(query);
      });
    }

    // Style filter
    if (filters.styleFilter !== "all") {
      result = result.filter((item) => item.style === filters.styleFilter);
    }

    // Date filter
    if (filters.dateFilter !== "all") {
      const now = new Date();
      result = result.filter((item) => {
        const diffMs = now.getTime() - item.createdAt.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        switch (filters.dateFilter) {
          case "today":
            return diffDays === 0;
          case "week":
            return diffDays < 7;
          case "month":
            return diffDays < 30;
          default:
            return true;
        }
      });
    }

    // Sort
    result.sort((a, b) => {
      const timeA = a.createdAt.getTime();
      const timeB = b.createdAt.getTime();
      return filters.sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [items, filters]);

  const handleView = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDownload = (item: GalleryItem) => {
    // Mock download
    const link = document.createElement("a");
    link.href = item.generatedImage;
    const name = item.prompt || `plushie-${item.id}`;
    link.download = `${name}.png`;
    link.click();
  };

  const handleDelete = (item: GalleryItem) => {
    setItemToDelete(item);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      // Remove item from gallery
      setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
      setItemToDelete(null);

      // Close modal if the deleted item was being viewed
      if (selectedItem?.id === itemToDelete.id) {
        setIsModalOpen(false);
        setSelectedItem(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Gallery"
        description="View and manage your generated plushie images"
      />

      {/* Filters */}
      <GalleryFilters filters={filters} onFilterChange={setFilters} />

      {/* Results Count */}
      {filteredItems.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredItems.length} of {items.length} plushies
        </div>
      )}

      {/* Gallery Grid */}
      <GalleryGrid
        items={filteredItems}
        onView={handleView}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />

      {/* Image Viewer Modal */}
      <ImageViewModal
        item={selectedItem}
        allItems={filteredItems}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Plushie?"
        description={`Are you sure you want to delete "${itemToDelete?.prompt || "this plushie"}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
