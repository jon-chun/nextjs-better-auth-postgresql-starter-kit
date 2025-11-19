/**
 * Unit Tests: Upload Helpers
 * Tests for lib/upload-helpers.ts
 */

import {
  validateImageFile,
  formatFileSize,
  isImageFile,
} from '@/lib/upload-helpers'
import { mockFile } from '@/tests/helpers/test-utils'

describe('Upload Helpers', () => {
  describe('validateImageFile', () => {
    it('should accept valid JPEG files', () => {
      const file = mockFile('test.jpg', 5 * 1024 * 1024, 'image/jpeg')
      const result = validateImageFile(file)

      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should accept valid PNG files', () => {
      const file = mockFile('test.png', 5 * 1024 * 1024, 'image/png')
      const result = validateImageFile(file)

      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should accept valid WebP files', () => {
      const file = mockFile('test.webp', 5 * 1024 * 1024, 'image/webp')
      const result = validateImageFile(file)

      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject files that are too large', () => {
      const file = mockFile('huge.jpg', 15 * 1024 * 1024, 'image/jpeg')
      const result = validateImageFile(file)

      expect(result.valid).toBe(false)
      expect(result.error).toContain('too large')
      expect(result.error).toContain('10MB')
    })

    it('should reject invalid file types', () => {
      const file = mockFile('document.pdf', 1 * 1024 * 1024, 'application/pdf')
      const result = validateImageFile(file)

      expect(result.valid).toBe(false)
      expect(result.error).toContain('Invalid file type')
    })

    it('should reject GIF files', () => {
      const file = mockFile('animated.gif', 1 * 1024 * 1024, 'image/gif')
      const result = validateImageFile(file)

      expect(result.valid).toBe(false)
      expect(result.error).toContain('Invalid file type')
    })

    it('should reject SVG files', () => {
      const file = mockFile('vector.svg', 100 * 1024, 'image/svg+xml')
      const result = validateImageFile(file)

      expect(result.valid).toBe(false)
      expect(result.error).toContain('Invalid file type')
    })

    it('should accept files at exactly 10MB', () => {
      const file = mockFile('max-size.jpg', 10 * 1024 * 1024, 'image/jpeg')
      const result = validateImageFile(file)

      expect(result.valid).toBe(true)
    })

    it('should reject very small invalid files', () => {
      const file = mockFile('small.txt', 100, 'text/plain')
      const result = validateImageFile(file)

      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(100)).toBe('100 Bytes')
      expect(formatFileSize(1023)).toBe('1023 Bytes')
    })

    it('should format kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1536)).toBe('1.5 KB')
      expect(formatFileSize(10240)).toBe('10 KB')
    })

    it('should format megabytes correctly', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(1536 * 1024)).toBe('1.5 MB')
      expect(formatFileSize(5 * 1024 * 1024)).toBe('5 MB')
    })

    it('should format gigabytes correctly', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
      expect(formatFileSize(2.5 * 1024 * 1024 * 1024)).toBe('2.5 GB')
    })

    it('should handle decimal values correctly', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB')
      expect(formatFileSize(2560 * 1024)).toBe('2.5 MB')
    })

    it('should round to 2 decimal places', () => {
      expect(formatFileSize(1234567)).toBe('1.18 MB')
      expect(formatFileSize(9876543)).toBe('9.42 MB')
    })
  })

  describe('isImageFile', () => {
    it('should return true for image MIME types', () => {
      expect(isImageFile(mockFile('test.jpg', 1024, 'image/jpeg'))).toBe(true)
      expect(isImageFile(mockFile('test.png', 1024, 'image/png'))).toBe(true)
      expect(isImageFile(mockFile('test.webp', 1024, 'image/webp'))).toBe(
        true,
      )
      expect(isImageFile(mockFile('test.gif', 1024, 'image/gif'))).toBe(true)
    })

    it('should return false for non-image MIME types', () => {
      expect(isImageFile(mockFile('doc.pdf', 1024, 'application/pdf'))).toBe(
        false,
      )
      expect(isImageFile(mockFile('data.json', 1024, 'application/json'))).toBe(
        false,
      )
      expect(isImageFile(mockFile('text.txt', 1024, 'text/plain'))).toBe(false)
      expect(isImageFile(mockFile('video.mp4', 1024, 'video/mp4'))).toBe(false)
    })

    it('should handle unusual MIME types', () => {
      expect(isImageFile(mockFile('file', 1024, ''))).toBe(false)
      expect(isImageFile(mockFile('file', 1024, 'unknown/type'))).toBe(false)
    })
  })
})
