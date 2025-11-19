"use client";

import Link from "next/link";
import {
  ArrowRight,
  Book,
  BookOpen,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

const quickLinks = [
  {
    title: "Getting Started",
    description:
      "New to PlushifyMe? Start here to learn the basics and create your first plushie.",
    icon: BookOpen,
    href: ROUTES.DOCS_GETTING_STARTED,
    comingSoon: false,
  },
  {
    title: "How to Use",
    description:
      "Complete guide to all features including uploading, styles, and gallery management.",
    icon: Book,
    href: ROUTES.DOCS_HOW_TO_USE,
    comingSoon: false,
  },
  {
    title: "Best Practices",
    description:
      "Tips and techniques for getting the best results from your plushie generations.",
    icon: Lightbulb,
    href: "#",
    comingSoon: true,
  },
  {
    title: "Troubleshooting",
    description:
      "Common issues and solutions to help you resolve problems quickly.",
    icon: HelpCircle,
    href: "#",
    comingSoon: true,
  },
] as const;

export default function DocsHomePage() {
  return (
    <article>
      <h1>PlushifyMe Documentation</h1>
      <p className="lead">
        Everything you need to know about creating adorable plushie versions of
        your photos.
      </p>

      <div className="not-prose my-8 grid gap-6 sm:grid-cols-2">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.comingSoon ? "#" : link.href}
              className="group relative flex flex-col gap-3 rounded-lg border p-6 transition-all hover:border-primary hover:shadow-md"
              onClick={(e) => link.comingSoon && e.preventDefault()}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{link.title}</h3>
                {link.comingSoon && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    Coming Soon
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {link.description}
              </p>
              {!link.comingSoon && (
                <div className="mt-auto flex items-center text-sm font-medium text-primary">
                  Read more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              )}
            </Link>
          );
        })}
      </div>

      <h2>Popular Topics</h2>

      <h3>For New Users</h3>
      <ul>
        <li>
          <Link href={ROUTES.DOCS_GETTING_STARTED}>
            Creating your first plushie
          </Link>
        </li>
        <li>
          <Link href={ROUTES.DOCS_GETTING_STARTED}>
            Understanding credits and pricing
          </Link>
        </li>
        <li>
          <Link href={ROUTES.DOCS_HOW_TO_USE}>
            Choosing the right plushie style
          </Link>
        </li>
      </ul>

      <h3>Common Tasks</h3>
      <ul>
        <li>
          <Link href={ROUTES.DOCS_HOW_TO_USE}>
            Uploading and preparing images
          </Link>
        </li>
        <li>
          <Link href={ROUTES.DOCS_HOW_TO_USE}>
            Using the cropping and editing tools
          </Link>
        </li>
        <li>
          <Link href={ROUTES.DOCS_HOW_TO_USE}>Managing your gallery</Link>
        </li>
        <li>
          <Link href={ROUTES.DOCS_HOW_TO_USE}>
            Downloading and sharing results
          </Link>
        </li>
      </ul>

      <h3>Troubleshooting</h3>
      <ul>
        <li>
          <Link href={ROUTES.FAQ}>Why is my upload being rejected?</Link>
        </li>
        <li>
          <Link href={ROUTES.FAQ}>How can I improve generation quality?</Link>
        </li>
        <li>
          <Link href={ROUTES.FAQ}>What if I run out of credits?</Link>
        </li>
      </ul>

      <div className="not-prose my-8 rounded-lg border bg-accent/50 p-6">
        <h3 className="mb-2 text-lg font-semibold">Need More Help?</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Can&apos;t find what you&apos;re looking for? Check out our FAQ page
          for answers to common questions.
        </p>
        <Button asChild>
          <Link href={ROUTES.FAQ}>
            View FAQ
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <h2>Quick Start Guide</h2>
      <ol>
        <li>
          <Link href={ROUTES.SIGN_UP}>Create a free account</Link> (get 10 free
          credits)
        </li>
        <li>
          <Link href={ROUTES.DASHBOARD}>Upload a photo</Link> (JPG, PNG, or WEBP
          up to 10MB)
        </li>
        <li>Choose a plushie style that matches your vision</li>
        <li>Adjust crop, zoom, and rotation as needed</li>
        <li>Click &quot;Generate Plushie&quot; and wait 3-5 seconds</li>
        <li>Download or save your adorable plushie to your gallery</li>
      </ol>

      <div className="not-prose my-8">
        <Button asChild size="lg">
          <Link href={ROUTES.DASHBOARD}>
            Start Creating
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
