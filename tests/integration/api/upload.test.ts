/**
 * Integration Tests: Upload API
 * Tests presigned URL generation for S3 uploads
 */

import { POST } from '@/app/api/upload/presigned-url/route'
import { prisma } from '@/lib/db'
import {
  createTestUser,
  createTestSession,
  createAuthHeaders,
  cleanupTestData,
} from '@/tests/helpers/integration-utils'
import { NextRequest } from 'next/server'

describe('POST /api/upload/presigned-url', () => {
  let testUserId: string
  let testSessionToken: string

  beforeEach(async () => {
    // Create test user and session before each test
    const user = await createTestUser('upload-test@example.com', 'Test123!@#', 50)
    testUserId = user.id

    const session = await createTestSession(user.id)
    testSessionToken = session.sessionToken
  })

  afterEach(async () => {
    // Clean up test data after each test
    await cleanupTestData()
  })

  afterAll(async () => {
    // Disconnect Prisma
    await prisma.$disconnect()
  })

  describe('Authentication', () => {
    it('should reject unauthenticated request', async () => {
      const request = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: 'test.jpg',
          contentType: 'image/jpeg',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toContain('Unauthorized')
    })

    it('should accept authenticated request with valid session', async () => {
      const request = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
        method: 'POST',
        headers: {
          ...createAuthHeaders(testSessionToken),
        },
        body: JSON.stringify({
          fileName: 'test.jpg',
          contentType: 'image/jpeg',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })
  })

  describe('Request Validation', () => {
    it('should reject request without fileName', async () => {
      const request = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          contentType: 'image/jpeg',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid file name')
    })

    it('should reject request without contentType', async () => {
      const request = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          fileName: 'test.jpg',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid content type')
    })

    it('should reject invalid fileName type (not string)', async () => {
      const request = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          fileName: 123, // number instead of string
          contentType: 'image/jpeg',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid file name')
    })

    it('should reject invalid contentType type (not string)', async () => {
      const request = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          fileName: 'test.jpg',
          contentType: { type: 'image/jpeg' }, // object instead of string
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid content type')
    })
  })

  describe('File Type Validation', () => {
    it('should accept JPEG images', async () => {
      const request = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          fileName: 'photo.jpg',
          contentType: 'image/jpeg',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.uploadUrl).toBeDefined()
      expect(data.fileKey).toBeDefined()
    })

    it('should accept PNG images', async () => {
      const request = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          fileName: 'photo.png',
          contentType: 'image/png',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })

    it('should accept WebP images', async () => {
      const request = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          fileName: 'photo.webp',
          contentType: 'image/webp',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })

    it('should reject GIF images', async () => {
      const request = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          fileName: 'animation.gif',
          contentType: 'image/gif',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid file type')
    })

    it('should reject PDF files', async () => {
      const request = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          fileName: 'document.pdf',
          contentType: 'application/pdf',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid file type')
    })

    it('should reject video files', async () => {
      const request = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          fileName: 'video.mp4',
          contentType: 'video/mp4',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid file type')
    })
  })

  describe('Response Structure', () => {
    it('should return uploadUrl, fileKey, and expiresIn', async () => {
      const request = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          fileName: 'test-image.jpg',
          contentType: 'image/jpeg',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('uploadUrl')
      expect(data).toHaveProperty('fileKey')
      expect(data).toHaveProperty('expiresIn')
      expect(typeof data.uploadUrl).toBe('string')
      expect(typeof data.fileKey).toBe('string')
      expect(typeof data.expiresIn).toBe('number')
    })

    it('should generate file key with user ID prefix', async () => {
      const request = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          fileName: 'my-photo.jpg',
          contentType: 'image/jpeg',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.fileKey).toContain(`uploads/${testUserId}`)
      expect(data.fileKey).toContain('my-photo.jpg')
    })

    it('should generate unique file keys for same filename', async () => {
      // First request
      const request1 = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          fileName: 'photo.jpg',
          contentType: 'image/jpeg',
        }),
      })

      const response1 = await POST(request1)
      const data1 = await response1.json()

      // Second request with same filename
      const request2 = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          fileName: 'photo.jpg',
          contentType: 'image/jpeg',
        }),
      })

      const response2 = await POST(request2)
      const data2 = await response2.json()

      expect(response1.status).toBe(200)
      expect(response2.status).toBe(200)
      // File keys should be different due to timestamp/uuid
      expect(data1.fileKey).not.toBe(data2.fileKey)
    })
  })

  describe('Presigned URL Generation', () => {
    it('should generate presigned URL with S3 endpoint', async () => {
      const request = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          fileName: 'test.jpg',
          contentType: 'image/jpeg',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      // Mocked URL from jest.setup.js
      expect(data.uploadUrl).toContain('mock-presigned-url')
      expect(data.uploadUrl).toContain('amazonaws.com')
    })

    it('should set appropriate expiration time', async () => {
      const request = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          fileName: 'test.jpg',
          contentType: 'image/jpeg',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.expiresIn).toBeGreaterThan(0)
      // Default is 15 minutes (900 seconds)
      expect(data.expiresIn).toBeLessThanOrEqual(900)
    })
  })
})
