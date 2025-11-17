import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "PlushifyMe - Transform Photos into Adorable Plushies with AI",
    template: "%s | PlushifyMe",
  },
  description:
    "Transform your photos into adorable plushie versions with AI. Upload images of yourself, friends, family, or pets and watch them become cute plushies.",
  keywords: [
    "AI",
    "plushie",
    "photo transformation",
    "image generation",
    "cute",
    "avatar",
  ],
  authors: [{ name: "PlushifyMe" }],
  creator: "PlushifyMe",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://plushifyme.com",
    title: "PlushifyMe - Transform Photos into Adorable Plushies with AI",
    description:
      "Transform your photos into adorable plushie versions with AI. Upload images of yourself, friends, family, or pets and watch them become cute plushies.",
    siteName: "PlushifyMe",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlushifyMe - Transform Photos into Adorable Plushies with AI",
    description:
      "Transform your photos into adorable plushie versions with AI. Upload images of yourself, friends, family, or pets and watch them become cute plushies.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
