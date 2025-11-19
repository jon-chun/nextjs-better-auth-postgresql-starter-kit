import Link from "next/link";
import { ROUTES, SITE_CONFIG } from "@/lib/constants";

const footerLinks = {
  product: [
    { label: "Pricing", href: ROUTES.PRICING },
    { label: "Documentation", href: ROUTES.DOCS },
    { label: "FAQ", href: ROUTES.FAQ },
  ],
  legal: [
    { label: "Terms of Service", href: ROUTES.TERMS },
    { label: "Privacy Policy", href: ROUTES.TERMS },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href={ROUTES.HOME} className="flex items-center gap-2">
              <span className="text-xl font-bold">PlushifyMe</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PlushifyMe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
