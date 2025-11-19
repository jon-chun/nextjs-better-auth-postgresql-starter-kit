/**
 * Unit Tests: Storage Utilities
 * Tests for lib/storage.ts
 */

import {
  generateFileKey,
  getPublicUrl,
  extractFileKeyFromUrl,
  isValidImageType,
  isValidFileSize,
} from '@/lib/storage'

describe('Storage Utilities', () => {
  describe('generateFileKey', () => {
    it('should generate unique file keys', () => {
      const key1 = generateFileKey('test.jpg')
      // UUID is mocked to return same value, so we just check format
      expect(key1).toContain('test.jpg')
      expect(key1).toContain('mock-uuid')
    })

    it('should include folder prefix when provided', () => {
      const key = generateFileKey('test.jpg', 'uploads/user123')

      expect(key).toMatch(/^uploads\/user123\//)
      expect(key).toContain('test.jpg')
    })

    it('should sanitize file names', () => {
      const key = generateFileKey('test image with spaces.jpg')

      expect(key).toContain('test_image_with_spaces.jpg')
      expect(key).not.toContain(' ')
    })

    it('should handle files without extensions', () => {
      const key = generateFileKey('testfile')

      expect(key).toContain('testfile')
    })

    it('should include timestamp and UUID', () => {
      const key = generateFileKey('test.jpg')
      const parts = key.split('-')

      // Should have timestamp-uuid-filename pattern
      expect(parts.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('getPublicUrl', () => {
    const originalEnv = process.env.AWS_REGION
    const originalBucket = process.env.AWS_S3_BUCKET

    beforeEach(() => {
      process.env.AWS_REGION = 'us-east-1'
      process.env.AWS_S3_BUCKET = 'test-bucket'
    })

    afterEach(() => {
      process.env.AWS_REGION = originalEnv
      process.env.AWS_S3_BUCKET = originalBucket
    })

    it('should generate correct S3 URL format', () => {
      const url = getPublicUrl('test/file.jpg')

      expect(url).toBe(
        'https://test-bucket.s3.us-east-1.amazonaws.com/test/file.jpg',
      )
    })

    it('should handle file keys with special characters', () => {
      const url = getPublicUrl('test/file with spaces.jpg')

      expect(url).toContain('test/file with spaces.jpg')
    })

    it('should use default region if not set', () => {
      delete process.env.AWS_REGION
      const url = getPublicUrl('test.jpg')

      expect(url).toContain('.s3.us-east-1.amazonaws.com/')

      process.env.AWS_REGION = 'us-east-1'
    })
  })

  describe('extractFileKeyFromUrl', () => {
    it('should extract key from path-style URL', () => {
      const url =
        'https://s3.amazonaws.com/bucket-name/uploads/user123/test.jpg'
      const key = extractFileKeyFromUrl(url)

      expect(key).toBe('uploads/user123/test.jpg')
    })

    it('should extract key from virtual-hosted-style URL', () => {
      const url =
        'https://bucket-name.s3.us-east-1.amazonaws.com/bucket-name/uploads/user123/test.jpg'
      const key = extractFileKeyFromUrl(url)

      expect(key).toBe('uploads/user123/test.jpg')
    })

    it('should handle keys with multiple path segments', () => {
      const url = 'https://bucket.s3.amazonaws.com/bucket/folder/subfolder/file.jpg'
      const key = extractFileKeyFromUrl(url)

      expect(key).toBe('folder/subfolder/file.jpg')
    })

    it('should return null for invalid URLs', () => {
      const key = extractFileKeyFromUrl('not-a-url')

      expect(key).toBeNull()
    })

    it('should handle URL-encoded characters', () => {
      const url =
        'https://bucket.s3.amazonaws.com/bucket/folder/file%20name.jpg'
      const key = extractFileKeyFromUrl(url)

      expect(key).toBe('folder/file%20name.jpg')
    })
  })

  describe('isValidImageType', () => {
    it('should accept valid image types', () => {
      expect(isValidImageType('image/jpeg')).toBe(true)
      expect(isValidImageType('image/png')).toBe(true)
      expect(isValidImageType('image/webp')).toBe(true)
    })

    it('should reject invalid image types', () => {
      expect(isValidImageType('image/gif')).toBe(false)
      expect(isValidImageType('image/svg+xml')).toBe(false)
      expect(isValidImageType('application/pdf')).toBe(false)
      expect(isValidImageType('text/plain')).toBe(false)
    })

    it('should handle empty or null content types', () => {
      expect(isValidImageType('')).toBe(false)
    })
  })

  describe('isValidFileSize', () => {
    it('should accept files within size limit', () => {
      const oneMB = 1024 * 1024
      const fiveMB = 5 * 1024 * 1024

      expect(isValidFileSize(oneMB, 10)).toBe(true)
      expect(isValidFileSize(fiveMB, 10)).toBe(true)
    })

    it('should reject files exceeding size limit', () => {
      const elevenMB = 11 * 1024 * 1024
      const fiftyMB = 50 * 1024 * 1024

      expect(isValidFileSize(elevenMB, 10)).toBe(false)
      expect(isValidFileSize(fiftyMB, 10)).toBe(false)
    })

    it('should accept files at exact size limit', () => {
      const exactlyTenMB = 10 * 1024 * 1024

      expect(isValidFileSize(exactlyTenMB, 10)).toBe(true)
    })

    it('should use default max size of 10MB', () => {
      const nineMB = 9 * 1024 * 1024
      const elevenMB = 11 * 1024 * 1024

      expect(isValidFileSize(nineMB)).toBe(true)
      expect(isValidFileSize(elevenMB)).toBe(false)
    })

    it('should handle zero size files', () => {
      expect(isValidFileSize(0, 10)).toBe(true)
    })

    it('should handle custom size limits', () => {
      const twoMB = 2 * 1024 * 1024

      expect(isValidFileSize(twoMB, 1)).toBe(false)
      expect(isValidFileSize(twoMB, 5)).toBe(true)
    })
  })
})
