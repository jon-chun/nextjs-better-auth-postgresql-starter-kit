/**
 * AWS S3 Storage Utilities
 * Handles file uploads, presigned URLs, and image storage
 */

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || "plushifyme-images";
const UPLOAD_EXPIRATION = 60 * 5; // 5 minutes
const DOWNLOAD_EXPIRATION = 60 * 60; // 1 hour

/**
 * File upload types and interfaces
 */
export interface PresignedUploadUrl {
  uploadUrl: string;
  fileKey: string;
  expiresIn: number;
}

export interface UploadFileParams {
  file: Buffer;
  fileName: string;
  contentType: string;
  folder?: string;
}

export interface StorageFile {
  key: string;
  url: string;
  bucket: string;
}

/**
 * Generate a unique file key with optional folder prefix
 */
export function generateFileKey(
  fileName: string,
  folder?: string,
): string {
  const timestamp = Date.now();
  const uuid = uuidv4();
  const extension = fileName.split(".").pop() || "jpg";
  const cleanFileName = fileName
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .toLowerCase();

  const key = folder
    ? `${folder}/${timestamp}-${uuid}-${cleanFileName}`
    : `${timestamp}-${uuid}-${cleanFileName}`;

  return key;
}

/**
 * Generate presigned URL for direct client-side uploads
 * This is the recommended approach for large files
 */
export async function generatePresignedUploadUrl(
  fileName: string,
  contentType: string,
  folder?: string,
): Promise<PresignedUploadUrl> {
  const fileKey = generateFileKey(fileName, folder);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: UPLOAD_EXPIRATION,
  });

  return {
    uploadUrl,
    fileKey,
    expiresIn: UPLOAD_EXPIRATION,
  };
}

/**
 * Upload file directly to S3 (server-side)
 * Use this for smaller files or when you have the file buffer
 */
export async function uploadFile({
  file,
  fileName,
  contentType,
  folder,
}: UploadFileParams): Promise<StorageFile> {
  const fileKey = generateFileKey(fileName, folder);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);

  return {
    key: fileKey,
    url: getPublicUrl(fileKey),
    bucket: BUCKET_NAME,
  };
}

/**
 * Delete file from S3
 */
export async function deleteFile(fileKey: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  await s3Client.send(command);
}

/**
 * Generate presigned URL for downloading/viewing files
 * Use this for private files that need temporary access
 */
export async function generatePresignedDownloadUrl(
  fileKey: string,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  const downloadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: DOWNLOAD_EXPIRATION,
  });

  return downloadUrl;
}

/**
 * Get public URL for a file (if bucket allows public access)
 * For production, you'd typically use CloudFront CDN URLs
 */
export function getPublicUrl(fileKey: string): string {
  const region = process.env.AWS_REGION || "us-east-1";
  return `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${fileKey}`;
}

/**
 * Extract file key from S3 URL
 */
export function extractFileKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    // Handle both path-style and virtual-hosted-style URLs
    const pathMatch = urlObj.pathname.match(/^\/([^/]+)\/(.+)$/);
    if (pathMatch) {
      return pathMatch[2]; // Path-style: /bucket-name/key
    }
    return urlObj.pathname.substring(1); // Virtual-hosted: /key
  } catch {
    return null;
  }
}

/**
 * Validate file type for image uploads
 */
export function isValidImageType(contentType: string): boolean {
  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  return validTypes.includes(contentType);
}

/**
 * Validate file size (in bytes)
 */
export function isValidFileSize(
  size: number,
  maxSizeMB: number = 10,
): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return size <= maxSizeBytes;
}
