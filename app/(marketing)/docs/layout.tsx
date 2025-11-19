"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocsSidebar } from "@/components/marketing/docs-sidebar";
import { cn } from "@/lib/utils";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Mobile Sidebar Toggle */}
        <div className="fixed bottom-6 right-6 z-50 lg:hidden">
          <Button
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-12 w-12 rounded-full shadow-lg"
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Sidebar Overlay (Mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto border-r bg-background p-6 transition-transform duration-300 lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <DocsSidebar />
        </aside>

        {/* Spacer for desktop sidebar */}
        <div className="hidden w-64 flex-shrink-0 lg:block" />

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
