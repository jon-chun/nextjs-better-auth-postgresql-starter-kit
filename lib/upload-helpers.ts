/**
 * Client-Side Image Upload Helpers
 * Utilities for handling file uploads to S3 via presigned URLs
 */

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  fileKey: string;
  success: boolean;
  error?: string;
}

/**
 * Upload file to S3 using presigned URL
 */
export async function uploadFileToS3(
  file: File,
  onProgress?: (progress: UploadProgress) => void,
): Promise<UploadResult> {
  try {
    // Step 1: Get presigned URL from our API
    const presignedResponse = await fetch("/api/upload/presigned-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
      }),
    });

    if (!presignedResponse.ok) {
      const error = await presignedResponse.json();
      throw new Error(error.error || "Failed to get upload URL");
    }

    const { uploadUrl, fileKey } = await presignedResponse.json();

    // Step 2: Upload file directly to S3
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          onProgress({
            loaded: e.loaded,
            total: e.total,
            percentage: Math.round((e.loaded / e.total) * 100),
          });
        }
      });
    }

    // Perform the upload
    await new Promise<void>((resolve, reject) => {
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });

    return {
      fileKey,
      success: true,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      fileKey: "",
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Validate file before upload
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ValidationResult {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed.",
    };
  }

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: "File too large. Maximum size is 10MB.",
    };
  }

  return { valid: true };
}

/**
 * Generate image preview URL
 */
export function generateImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error("Failed to read file"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Math.round(bytes / Math.pow(k, i) * 100) / 100} ${sizes[i]}`;
}

/**
 * Check if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}
