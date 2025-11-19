"use client";

import { Book, BookOpen, HelpCircle, Lightbulb } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

const docsSections = [
  {
    title: "Getting Started",
    icon: BookOpen,
    href: ROUTES.DOCS_GETTING_STARTED,
    comingSoon: false,
  },
  {
    title: "How to Use",
    icon: Book,
    href: ROUTES.DOCS_HOW_TO_USE,
    comingSoon: false,
  },
  {
    title: "Best Practices",
    icon: Lightbulb,
    href: "/docs/best-practices",
    comingSoon: true,
  },
  {
    title: "Troubleshooting",
    icon: HelpCircle,
    href: "/docs/troubleshooting",
    comingSoon: true,
  },
] as const;

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      <h3 className="mb-4 text-sm font-semibold text-muted-foreground">
        Documentation
      </h3>
      {docsSections.map((section) => {
        const Icon = section.icon;
        const isActive = pathname === section.href;

        return (
          <Link
            key={section.href}
            href={section.comingSoon ? "#" : section.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              section.comingSoon && "cursor-not-allowed opacity-50"
            )}
            onClick={(e) => section.comingSoon && e.preventDefault()}
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1">{section.title}</span>
            {section.comingSoon && (
              <span className="text-xs text-muted-foreground">Soon</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
