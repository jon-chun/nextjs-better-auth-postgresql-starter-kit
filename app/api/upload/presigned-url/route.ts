/**
 * API Endpoint: Generate Presigned Upload URL
 * POST /api/upload/presigned-url
 *
 * Generates a presigned S3 URL for direct client-side file uploads
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  generatePresignedUploadUrl,
  isValidImageType,
} from "@/lib/storage";
import { headers } from "next/headers";

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

    // Parse request body
    const body = await request.json();
    const { fileName, contentType } = body;

    // Validation
    if (!fileName || typeof fileName !== "string") {
      return NextResponse.json(
        { error: "Invalid file name" },
        { status: 400 },
      );
    }

    if (!contentType || typeof contentType !== "string") {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 },
      );
    }

    // Validate content type
    if (!isValidImageType(contentType)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only JPEG, PNG, and WebP images are allowed.",
        },
        { status: 400 },
      );
    }

    // Generate presigned URL
    const folder = `uploads/${session.user.id}`;
    const result = await generatePresignedUploadUrl(
      fileName,
      contentType,
      folder,
    );

    return NextResponse.json({
      uploadUrl: result.uploadUrl,
      fileKey: result.fileKey,
      expiresIn: result.expiresIn,
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 },
    );
  }
}
