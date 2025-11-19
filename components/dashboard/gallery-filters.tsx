"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PLUSHIE_STYLES } from "@/lib/constants";

export interface GalleryFilterOptions {
  dateFilter: string;
  styleFilter: string;
  sortOrder: string;
  searchQuery: string;
}

interface GalleryFiltersProps {
  filters: GalleryFilterOptions;
  onFilterChange: (filters: GalleryFilterOptions) => void;
}

const DATE_FILTERS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
] as const;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
] as const;

export function GalleryFilters({
  filters,
  onFilterChange,
}: GalleryFiltersProps) {
  const activeFilterCount = [
    filters.dateFilter !== "all",
    filters.styleFilter !== "all",
    filters.searchQuery.length > 0,
  ].filter(Boolean).length;

  const handleClearFilters = () => {
    onFilterChange({
      dateFilter: "all",
      styleFilter: "all",
      sortOrder: "newest",
      searchQuery: "",
    });
  };

  const updateFilter = (key: keyof GalleryFilterOptions, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-8 text-sm"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name..."
          value={filters.searchQuery}
          onChange={(e) => updateFilter("searchQuery", e.target.value)}
          className="pl-9 pr-9"
        />
        {filters.searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateFilter("searchQuery", "")}
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="grid gap-3 sm:grid-cols-3">
        {/* Date Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Select
            value={filters.dateFilter}
            onValueChange={(value) => updateFilter("dateFilter", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DATE_FILTERS.map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Style Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Style</label>
          <Select
            value={filters.styleFilter}
            onValueChange={(value) => updateFilter("styleFilter", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Styles</SelectItem>
              {PLUSHIE_STYLES.map((style) => (
                <SelectItem key={style.id} value={style.id}>
                  {style.emoji} {style.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Sort By</label>
          <Select
            value={filters.sortOrder}
            onValueChange={(value) => updateFilter("sortOrder", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
