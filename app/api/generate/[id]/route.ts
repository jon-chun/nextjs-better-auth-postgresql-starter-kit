/**
 * API Endpoint: Get Generation Status
 * GET /api/generate/[id]
 *
 * Check the status of an image generation
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
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

    const { id } = params;

    // Get generation from database
    const image = await db.generatedImage.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        originalUrl: true,
        generatedUrl: true,
        style: true,
        prompt: true,
        status: true,
        errorMessage: true,
        processingTime: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!image) {
      return NextResponse.json(
        { error: "Generation not found" },
        { status: 404 },
      );
    }

    // Verify ownership
    if (image.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden - This generation belongs to another user" },
        { status: 403 },
      );
    }

    return NextResponse.json({
      id: image.id,
      status: image.status,
      originalUrl: image.originalUrl,
      generatedUrl: image.generatedUrl,
      style: image.style,
      prompt: image.prompt,
      errorMessage: image.errorMessage,
      processingTime: image.processingTime,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching generation status:", error);
    return NextResponse.json(
      { error: "Failed to fetch generation status" },
      { status: 500 },
    );
  }
}
