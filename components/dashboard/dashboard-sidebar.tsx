"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Images, Coins, Settings } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Generate",
    href: ROUTES.DASHBOARD,
    icon: Home,
  },
  {
    label: "My Gallery",
    href: ROUTES.GALLERY,
    icon: Images,
  },
  {
    label: "Credits",
    href: ROUTES.CREDITS,
    icon: Coins,
  },
  {
    label: "Settings",
    href: ROUTES.SETTINGS,
    icon: Settings,
  },
];

interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col gap-4 border-r bg-background p-4",
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 py-4">
        <Image
          src="/images/logo/logo.svg"
          alt="PlushifyMe"
          width={32}
          height={32}
          className="h-8 w-auto"
        />
        <span className="text-xl font-bold">PlushifyMe</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
