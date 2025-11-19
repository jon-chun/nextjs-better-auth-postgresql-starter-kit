/**
 * AI Image Generation Service
 * Uses OpenAI DALL-E 3 to generate plushie versions of photos
 */

import OpenAI from "openai";
import { uploadFile, getPublicUrl } from "./storage";
import { PLUSHIE_STYLES } from "./constants";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
});

export interface GeneratePlushieParams {
  originalFileKey: string;
  style: string;
  prompt?: string;
}

/**
 * Get style-specific prompt enhancement
 */
function getStylePrompt(styleId: string): string {
  const style = PLUSHIE_STYLES.find((s) => s.id === styleId);
  if (!style) {
    return "as a cute plushie toy";
  }

  const stylePrompts: Record<string, string> = {
    "cute-fluffy":
      "as an adorable, super fluffy plushie toy with soft texture, round features, and big expressive eyes. The plushie should have a cuddly, huggable appearance with fuzzy fabric texture.",
    "realistic-plush":
      "as a highly detailed, realistic plushie toy with accurate proportions and lifelike features. The plushie should have realistic fabric texture, proper stitching details, and authentic coloring.",
    "cartoon-style":
      "as a playful cartoon-style plushie toy with exaggerated features, bold colors, and simplified shapes. The plushie should have a fun, animated appearance with smooth surfaces.",
    minimalist:
      "as a minimalist, modern plushie toy with clean lines, simple shapes, and a contemporary aesthetic. The plushie should have a refined, elegant appearance with subtle details.",
  };

  return stylePrompts[styleId] || "as a plushie toy";
}

/**
 * Build the complete DALL-E prompt
 */
function buildPrompt(params: GeneratePlushieParams): string {
  const stylePrompt = getStylePrompt(params.style);
  const userPrompt = params.prompt ? ` ${params.prompt}` : "";

  // Base prompt structure
  const basePrompt = `Transform this image into a professional product photo of a plushie toy. Create a ${params.style} plushie version ${stylePrompt}.${userPrompt}

The plushie should be:
- Photographed on a clean, neutral background
- Well-lit with soft, professional lighting
- Centered in the frame
- Showing the plushie's texture and details clearly
- Looking like a real, purchasable plushie product

Style: High-quality product photography, studio lighting, sharp focus, professional composition.`;

  return basePrompt;
}

/**
 * Generate plushie image using DALL-E 3
 */
export async function generatePlushieImage(
  params: GeneratePlushieParams,
): Promise<string> {
  try {
    console.log("🎨 Starting DALL-E 3 generation...", {
      style: params.style,
      hasPrompt: !!params.prompt,
    });

    // Get the original image URL
    const originalUrl = getPublicUrl(params.originalFileKey);

    // Build the prompt
    const prompt = buildPrompt(params);

    console.log("📝 Prompt:", prompt.substring(0, 200) + "...");

    // Call DALL-E 3 API with image edit
    // Note: DALL-E 3 doesn't support direct image-to-image, so we use text-to-image
    // For image-to-image, you'd typically use DALL-E 2 edits or a different model
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url",
    });

    const generatedImageUrl = response.data?.[0]?.url;

    if (!generatedImageUrl) {
      throw new Error("No image URL returned from DALL-E");
    }

    console.log("✅ DALL-E generation completed");

    // Download the generated image and upload to our S3
    const imageBuffer = await downloadImage(generatedImageUrl);

    const uploadResult = await uploadFile({
      file: imageBuffer,
      fileName: `generated-${Date.now()}.png`,
      contentType: "image/png",
      folder: "generated",
    });

    console.log("✅ Uploaded to S3:", uploadResult.key);

    return uploadResult.url;
  } catch (error) {
    console.error("❌ DALL-E generation failed:", error);

    if (error instanceof OpenAI.APIError) {
      console.error("OpenAI API Error:", {
        status: error.status,
        message: error.message,
        code: error.code,
      });
      throw new Error(`AI generation failed: ${error.message}`);
    }

    throw new Error("Failed to generate plushie image");
  }
}

/**
 * Download image from URL to buffer
 */
async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Check if OpenAI is configured
 */
export function isOpenAIConfigured(): boolean {
  return !!(process.env.OPENAI_API_KEY && process.env.OPENAI_ORG_ID);
}

/**
 * Get generation status by ID
 */
export async function getGenerationStatus(imageId: string) {
  // This would typically query your database
  // Implementation depends on your database structure
  return {
    id: imageId,
    status: "processing",
    message: "Generation in progress...",
  };
}
