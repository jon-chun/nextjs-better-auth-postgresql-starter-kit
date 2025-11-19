import { Metadata } from "next";
import Link from "next/link";
import { CalloutBox } from "@/components/marketing/callout-box";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Getting Started | PlushifyMe Documentation",
  description:
    "Learn how to get started with PlushifyMe and create your first adorable plushie.",
};

export default function GettingStartedPage() {
  return (
    <article>
      <h1>Getting Started with PlushifyMe</h1>
      <p className="lead">
        Welcome to PlushifyMe! This guide will help you get started transforming
        your photos into adorable plushie versions.
      </p>

      <CalloutBox variant="tip" title="New to PlushifyMe?">
        This guide will walk you through everything you need to know to create
        your first plushie in just a few minutes.
      </CalloutBox>

      <h2>What is PlushifyMe?</h2>
      <p>
        PlushifyMe is an AI-powered platform that transforms your photos into
        cute, plushie-style versions. Whether it&apos;s yourself, friends,
        family, or pets, our advanced AI creates adorable plushie
        representations that capture the essence of your subject.
      </p>

      <h3>Key Features</h3>
      <ul>
        <li>
          <strong>Multiple Styles:</strong> Choose from Cute & Fluffy, Realistic
          Plush, Cartoon Style, and Minimalist designs
        </li>
        <li>
          <strong>Easy to Use:</strong> Simple drag-and-drop interface with
          intuitive controls
        </li>
        <li>
          <strong>Fast Processing:</strong> Get your plushie in seconds with our
          optimized AI
        </li>
        <li>
          <strong>Gallery Management:</strong> Save, organize, and download all
          your creations
        </li>
      </ul>

      <h2>Creating an Account</h2>
      <p>
        To get started with PlushifyMe, you&apos;ll need to create a free
        account:
      </p>

      <ol>
        <li>
          Click the <strong>&quot;Sign Up&quot;</strong> button in the top right
          corner
        </li>
        <li>Enter your email address and create a secure password</li>
        <li>Agree to the terms of service</li>
        <li>
          Click <strong>&quot;Create Account&quot;</strong>
        </li>
        <li>
          Verify your email address by clicking the link sent to your inbox
        </li>
      </ol>

      <CalloutBox variant="info" title="Free Credits">
        New users receive 10 free credits to try out PlushifyMe. Each generation
        uses 1 credit.
      </CalloutBox>

      <h2>Your First Generation</h2>
      <p>
        Once you&apos;ve signed up, you&apos;re ready to create your first
        plushie! Here&apos;s how:
      </p>

      <h3>Step 1: Upload Your Photo</h3>
      <ol>
        <li>
          Navigate to the <Link href={ROUTES.DASHBOARD}>Generate page</Link>
        </li>
        <li>Click the upload area or drag and drop an image file</li>
        <li>Supported formats: JPG, PNG, WEBP (max 10MB)</li>
      </ol>

      <h3>Step 2: Select a Style</h3>
      <p>Choose from four distinct plushie styles:</p>
      <ul>
        <li>
          <strong>Cute & Fluffy:</strong> Soft, cuddly aesthetic perfect for
          adorable results
        </li>
        <li>
          <strong>Realistic Plush:</strong> Detailed and lifelike plushie
          representation
        </li>
        <li>
          <strong>Cartoon Style:</strong> Fun, animated look with vibrant colors
        </li>
        <li>
          <strong>Minimalist:</strong> Clean, simple design with minimal details
        </li>
      </ul>

      <h3>Step 3: Adjust Your Image</h3>
      <p>Use the cropping tools to perfect your image:</p>
      <ul>
        <li>
          <strong>Zoom:</strong> Adjust the zoom level from 50% to 200%
        </li>
        <li>
          <strong>Rotate:</strong> Rotate your image in 90° increments
        </li>
        <li>
          <strong>Aspect Ratio:</strong> Choose Square, Portrait, or Landscape
        </li>
      </ul>

      <h3>Step 4: Generate</h3>
      <ol>
        <li>
          Click the <strong>&quot;Generate Plushie&quot;</strong> button
        </li>
        <li>Wait 3-5 seconds while the AI creates your plushie</li>
        <li>View your result and download or save to gallery</li>
      </ol>

      <CalloutBox variant="warning" title="Credits Required">
        Each generation uses 1 credit. Make sure you have enough credits before
        generating.
      </CalloutBox>

      <h2>Tips for Best Results</h2>

      <h3>Image Quality</h3>
      <ul>
        <li>Use high-resolution images (at least 1024x1024 pixels)</li>
        <li>Avoid heavily compressed or pixelated images</li>
        <li>Clear, sharp photos work best</li>
      </ul>

      <h3>Subject Framing</h3>
      <ul>
        <li>Center your subject in the frame</li>
        <li>Include the full face or body</li>
        <li>Avoid extreme angles or partial views</li>
        <li>Use the crop tool to remove distracting backgrounds</li>
      </ul>

      <h3>Lighting</h3>
      <ul>
        <li>Use well-lit photos with even lighting</li>
        <li>Avoid harsh shadows or overexposure</li>
        <li>Natural daylight produces the best results</li>
        <li>Front-facing lighting is ideal</li>
      </ul>

      <CalloutBox variant="tip" title="Pro Tip">
        For the best results with pets, use photos where they&apos;re looking at
        the camera and their features are clearly visible.
      </CalloutBox>

      <h2>Next Steps</h2>
      <p>
        Now that you know the basics, here are some resources to help you make
        the most of PlushifyMe:
      </p>

      <ul>
        <li>
          <Link href={ROUTES.DOCS_HOW_TO_USE}>How to Use Guide</Link> - Detailed
          instructions for all features
        </li>
        <li>
          <Link href={ROUTES.GALLERY}>Your Gallery</Link> - View and manage your
          creations
        </li>
        <li>
          <Link href={ROUTES.FAQ}>FAQ</Link> - Answers to common questions
        </li>
        <li>
          <Link href={ROUTES.PRICING}>Pricing</Link> - Purchase more credits
        </li>
      </ul>

      <CalloutBox variant="info" title="Need Help?">
        If you run into any issues or have questions, check out our{" "}
        <Link href={ROUTES.FAQ}>FAQ page</Link> or contact our support team.
      </CalloutBox>
    </article>
  );
}
