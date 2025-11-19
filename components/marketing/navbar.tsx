"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Pricing", href: ROUTES.PRICING },
  { label: "Docs", href: ROUTES.DOCS },
  { label: "FAQ", href: ROUTES.FAQ },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="flex items-center gap-2">
          <Image
            src="/images/logo/logo.svg"
            alt="PlushifyMe"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
          <span className="text-xl font-bold">PlushifyMe</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href={ROUTES.SIGN_IN}>Sign In</Link>
            </Button>
            <Button asChild>
              <Link href={ROUTES.SIGN_UP}>Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={cn("md:hidden", mobileMenuOpen ? "block" : "hidden")}>
        <div className="container space-y-3 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="space-y-2 pt-2">
            <Button variant="outline" className="w-full" asChild>
              <Link href={ROUTES.SIGN_IN}>Sign In</Link>
            </Button>
            <Button className="w-full" asChild>
              <Link href={ROUTES.SIGN_UP}>Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
