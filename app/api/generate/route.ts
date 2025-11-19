/**
 * API Endpoint: Generate Plushie Image
 * POST /api/generate
 *
 * Handles AI image generation with DALL-E 3 and credits management
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { imageUploadSchema } from "@/lib/validations";
import { headers } from "next/headers";
import { generatePlushieImage } from "@/lib/ai-generation";
import { getPublicUrl } from "@/lib/storage";

const GENERATION_COST = 1; // Credits required per generation

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 },
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { originalFileKey, style, prompt } = body;

    // Validate required fields
    if (!originalFileKey || typeof originalFileKey !== "string") {
      return NextResponse.json(
        { error: "Original file key is required" },
        { status: 400 },
      );
    }

    // Validate style and prompt with Zod
    const validation = imageUploadSchema.safeParse({ style, prompt });
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid style or prompt", details: validation.error.issues },
        { status: 400 },
      );
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, credits: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 },
      );
    }

    // Check if user has enough credits
    if (user.credits < GENERATION_COST) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          required: GENERATION_COST,
          available: user.credits,
        },
        { status: 402 }, // Payment Required
      );
    }

    // Create database record with pending status
    const image = await db.generatedImage.create({
      data: {
        userId: user.id,
        originalUrl: getPublicUrl(originalFileKey),
        style: validation.data.style,
        prompt: validation.data.prompt || null,
        status: "pending",
      },
    });

    // Start generation process (async)
    // In production, you'd use a queue (Bull, BullMQ, or SQS)
    processGeneration(image.id, user.id, originalFileKey, validation.data)
      .catch((error) => {
        console.error("Generation failed:", error);
      });

    // Return immediate response with pending status
    return NextResponse.json({
      imageId: image.id,
      status: "pending",
      message: "Image generation started. This may take 30-60 seconds.",
    });
  } catch (error) {
    console.error("Error starting generation:", error);
    return NextResponse.json(
      { error: "Failed to start image generation" },
      { status: 500 },
    );
  }
}

/**
 * Process image generation asynchronously
 * This function runs in the background after the API response is sent
 */
async function processGeneration(
  imageId: string,
  userId: string,
  originalFileKey: string,
  data: { style: string; prompt?: string },
) {
  const startTime = Date.now();

  try {
    // Update status to processing
    await db.generatedImage.update({
      where: { id: imageId },
      data: { status: "processing" },
    });

    // Generate the plushie image using DALL-E 3
    const generatedUrl = await generatePlushieImage({
      originalFileKey,
      style: data.style,
      prompt: data.prompt,
    });

    const processingTime = Date.now() - startTime;

    // Update image record with result
    await db.generatedImage.update({
      where: { id: imageId },
      data: {
        generatedUrl,
        status: "completed",
        processingTime,
      },
    });

    // Deduct credits and create transaction record
    await db.$transaction([
      db.user.update({
        where: { id: userId },
        data: {
          credits: {
            decrement: GENERATION_COST,
          },
        },
      }),
      db.transaction.create({
        data: {
          userId,
          type: "generation",
          credits: -GENERATION_COST,
          description: `Generated plushie image (${data.style})`,
        },
      }),
    ]);

    console.log(
      `✅ Generation completed: ${imageId} in ${processingTime}ms`,
    );
  } catch (error) {
    console.error("Generation processing failed:", error);

    // Update image record with error
    await db.generatedImage.update({
      where: { id: imageId },
      data: {
        status: "failed",
        errorMessage:
          error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}
