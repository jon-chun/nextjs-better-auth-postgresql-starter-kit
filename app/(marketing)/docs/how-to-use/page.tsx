import { Metadata } from "next";
import Link from "next/link";
import { CalloutBox } from "@/components/marketing/callout-box";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "How to Use | PlushifyMe Documentation",
  description:
    "Complete guide to using PlushifyMe features including uploading, styles, cropping, and gallery management.",
};

export default function HowToUsePage() {
  return (
    <article>
      <h1>How to Use PlushifyMe</h1>
      <p className="lead">
        A comprehensive guide to all PlushifyMe features and functionality.
      </p>

      <h2>Uploading Images</h2>
      <p>
        PlushifyMe supports multiple ways to upload your images for
        transformation.
      </p>

      <h3>Supported Formats</h3>
      <p>You can upload images in the following formats:</p>
      <ul>
        <li>
          <strong>JPEG/JPG:</strong> Most common image format
        </li>
        <li>
          <strong>PNG:</strong> Best for images with transparency
        </li>
        <li>
          <strong>WEBP:</strong> Modern format with excellent compression
        </li>
      </ul>

      <CalloutBox variant="warning" title="File Size Limit">
        Maximum file size is 10MB. Larger files will be rejected. If your image
        is too large, try compressing it or reducing its resolution.
      </CalloutBox>

      <h3>Upload Methods</h3>

      <h4>Drag & Drop</h4>
      <ol>
        <li>Open the Generate page</li>
        <li>Drag your image file from your computer</li>
        <li>Drop it onto the upload zone</li>
        <li>The image will be validated and displayed</li>
      </ol>

      <h4>Click to Browse</h4>
      <ol>
        <li>Click anywhere in the upload zone</li>
        <li>Your file browser will open</li>
        <li>Select an image file</li>
        <li>Click &quot;Open&quot; to upload</li>
      </ol>

      <CalloutBox variant="tip" title="Quick Upload">
        You can also paste an image directly from your clipboard by clicking in
        the upload area and using Ctrl+V (Cmd+V on Mac).
      </CalloutBox>

      <h2>Choosing Styles</h2>
      <p>
        PlushifyMe offers four distinct styles to transform your photos. Each
        style produces a unique look and feel.
      </p>

      <h3>Cute & Fluffy</h3>
      <p>
        <strong>Best for:</strong> Maximum cuteness and kawaii aesthetic
      </p>
      <ul>
        <li>Soft, rounded features</li>
        <li>Pastel or vibrant colors</li>
        <li>Exaggerated cute characteristics</li>
        <li>Perfect for children, pets, and playful portraits</li>
      </ul>

      <h3>Realistic Plush</h3>
      <p>
        <strong>Best for:</strong> Detailed, lifelike plushie representation
      </p>
      <ul>
        <li>Maintains more original photo details</li>
        <li>Natural color palette</li>
        <li>Realistic texture simulation</li>
        <li>Great for professional portraits and family photos</li>
      </ul>

      <h3>Cartoon Style</h3>
      <p>
        <strong>Best for:</strong> Fun, animated look
      </p>
      <ul>
        <li>Bold outlines and vibrant colors</li>
        <li>Simplified features</li>
        <li>Playful, energetic appearance</li>
        <li>Ideal for creative projects and social media</li>
      </ul>

      <h3>Minimalist</h3>
      <p>
        <strong>Best for:</strong> Clean, modern aesthetic
      </p>
      <ul>
        <li>Simple shapes and limited details</li>
        <li>Muted color palette</li>
        <li>Contemporary design style</li>
        <li>Perfect for artistic interpretations and logos</li>
      </ul>

      <CalloutBox variant="info" title="Experiment with Styles">
        Try the same photo with different styles to see which one you prefer.
        Each style can produce surprisingly different results!
      </CalloutBox>

      <h2>Using the Cropping Tool</h2>
      <p>
        The cropping tool helps you frame your image perfectly before
        generation.
      </p>

      <h3>Zoom Controls</h3>
      <ul>
        <li>
          <strong>Range:</strong> 50% to 200%
        </li>
        <li>
          <strong>Use for:</strong> Adjusting how close your subject appears
        </li>
        <li>
          <strong>Slider:</strong> Drag to adjust zoom level smoothly
        </li>
        <li>
          <strong>Buttons:</strong> Click +/- for precise adjustments
        </li>
      </ul>

      <h3>Rotate Options</h3>
      <ul>
        <li>
          <strong>Rotate Left:</strong> Rotate 90° counter-clockwise
        </li>
        <li>
          <strong>Rotate Right:</strong> Rotate 90° clockwise
        </li>
        <li>
          <strong>Use for:</strong> Correcting image orientation
        </li>
      </ul>

      <h3>Aspect Ratios</h3>
      <p>Choose the shape of your final plushie:</p>
      <ul>
        <li>
          <strong>Square (1:1):</strong> Equal width and height, perfect for
          profile pictures
        </li>
        <li>
          <strong>Portrait (3:4):</strong> Taller than wide, traditional
          portrait orientation
        </li>
        <li>
          <strong>Landscape (4:3):</strong> Wider than tall, great for group
          photos
        </li>
      </ul>

      <CalloutBox variant="tip" title="Grid Overlay">
        The grid overlay helps you align your subject using the rule of thirds
        for better composition.
      </CalloutBox>

      <h3>Reset Crop</h3>
      <p>
        Click the <strong>&quot;Reset Crop&quot;</strong> button to return all
        adjustments to their default values:
      </p>
      <ul>
        <li>Zoom: 100%</li>
        <li>Rotation: 0°</li>
        <li>Aspect Ratio: Square (1:1)</li>
      </ul>

      <h2>Downloading Results</h2>
      <p>
        Once your plushie is generated, you have several options for saving and
        sharing.
      </p>

      <h3>Immediate Download</h3>
      <ol>
        <li>
          After generation completes, click the{" "}
          <strong>&quot;Download&quot;</strong> button
        </li>
        <li>The image will be saved to your default downloads folder</li>
        <li>File format: PNG with transparent background (if available)</li>
        <li>Resolution: Same as your input image (up to 2048x2048)</li>
      </ol>

      <h3>Download from Gallery</h3>
      <ol>
        <li>
          Navigate to <Link href={ROUTES.GALLERY}>My Gallery</Link>
        </li>
        <li>Hover over any image</li>
        <li>Click the download icon</li>
        <li>The full-resolution image will be saved</li>
      </ol>

      <CalloutBox variant="info" title="File Naming">
        Downloaded files are automatically named with the format:
        &quot;plushie-[timestamp].png&quot; to prevent overwriting previous
        downloads.
      </CalloutBox>

      <h2>Managing Your Gallery</h2>
      <p>
        Your <Link href={ROUTES.GALLERY}>Gallery</Link> is where all your
        generated plushies are stored and organized.
      </p>

      <h3>Viewing Images</h3>
      <ul>
        <li>Click any thumbnail to view full-size</li>
        <li>Use arrow buttons or keyboard arrows to navigate</li>
        <li>
          Click &quot;Show Original&quot; to compare with your source image
        </li>
        <li>Press ESC or click outside to close the viewer</li>
      </ul>

      <h3>Filtering and Sorting</h3>

      <h4>Search</h4>
      <p>Type in the search bar to find plushies by name or description.</p>

      <h4>Date Filter</h4>
      <ul>
        <li>
          <strong>All Time:</strong> Show everything
        </li>
        <li>
          <strong>Today:</strong> Only today&apos;s generations
        </li>
        <li>
          <strong>This Week:</strong> Last 7 days
        </li>
        <li>
          <strong>This Month:</strong> Last 30 days
        </li>
      </ul>

      <h4>Style Filter</h4>
      <p>
        Filter by specific style (Cute & Fluffy, Realistic, Cartoon, Minimalist)
      </p>

      <h4>Sort Order</h4>
      <ul>
        <li>
          <strong>Newest First:</strong> Most recent at the top (default)
        </li>
        <li>
          <strong>Oldest First:</strong> Chronological order
        </li>
      </ul>

      <CalloutBox variant="tip" title="Clear Filters">
        Click the &quot;Clear All&quot; button to reset all filters and see your
        entire gallery.
      </CalloutBox>

      <h3>Deleting Images</h3>
      <p>To remove unwanted images from your gallery:</p>
      <ol>
        <li>Hover over the image thumbnail</li>
        <li>Click the trash icon</li>
        <li>Confirm deletion in the dialog</li>
        <li>The image will be permanently removed</li>
      </ol>

      <CalloutBox variant="danger" title="Permanent Deletion">
        Deleted images cannot be recovered. Make sure to download any images you
        want to keep before deleting them.
      </CalloutBox>

      <h3>Sharing (Coming Soon)</h3>
      <p>We&apos;re working on sharing features that will let you:</p>
      <ul>
        <li>Share directly to social media</li>
        <li>Generate shareable links</li>
        <li>Create collections to share multiple plushies</li>
        <li>Export to various formats and sizes</li>
      </ul>

      <h2>Advanced Options</h2>
      <p>
        The generation controls include advanced options for fine-tuning your
        results.
      </p>

      <h3>Quality Slider</h3>
      <ul>
        <li>
          <strong>Range:</strong> 50% to 100%
        </li>
        <li>
          <strong>Higher quality:</strong> More details, longer processing time
        </li>
        <li>
          <strong>Lower quality:</strong> Faster results, fewer details
        </li>
        <li>
          <strong>Recommended:</strong> 80% for balanced results
        </li>
      </ul>

      <h3>Background Removal</h3>
      <ul>
        <li>Toggle on to remove the background from your plushie</li>
        <li>Results in a transparent PNG</li>
        <li>Perfect for overlaying on other images or designs</li>
        <li>Works best with clear subject separation</li>
      </ul>

      <CalloutBox variant="info" title="Credit Usage">
        Advanced options do not consume additional credits. One generation
        always equals one credit, regardless of settings.
      </CalloutBox>

      <h2>Next Steps</h2>
      <ul>
        <li>
          <Link href={ROUTES.DOCS_GETTING_STARTED}>Getting Started Guide</Link>{" "}
          - New user walkthrough
        </li>
        <li>
          <Link href={ROUTES.FAQ}>FAQ</Link> - Common questions and answers
        </li>
        <li>
          <Link href={ROUTES.PRICING}>Pricing</Link> - Credit packages and plans
        </li>
      </ul>
    </article>
  );
}
