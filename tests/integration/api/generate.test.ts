/**
 * Integration Tests: Generation API
 * Tests AI image generation with credit management
 */

import { POST } from '@/app/api/generate/route'
import { GET } from '@/app/api/generate/[id]/route'
import { prisma } from '@/lib/db'
import {
  createTestUser,
  createTestSession,
  createAuthHeaders,
  cleanupTestData,
  getUserCredits,
  setUserCredits,
  waitFor,
  createTestImage,
} from '@/tests/helpers/integration-utils'
import { NextRequest } from 'next/server'

describe('POST /api/generate', () => {
  let testUserId: string
  let testSessionToken: string

  beforeEach(async () => {
    // Create test user with credits
    const user = await createTestUser('generate-test@example.com', 'Test123!@#', 50)
    testUserId = user.id

    const session = await createTestSession(user.id)
    testSessionToken = session.sessionToken
  })

  afterEach(async () => {
    await cleanupTestData()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('Authentication', () => {
    it('should reject unauthenticated request', async () => {
      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalFileKey: 'uploads/test/image.jpg',
          style: 'Cute & Fluffy',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toContain('Unauthorized')
    })

    it('should accept authenticated request', async () => {
      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          originalFileKey: 'uploads/test/image.jpg',
          style: 'Cute & Fluffy',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })
  })

  describe('Request Validation', () => {
    it('should reject request without originalFileKey', async () => {
      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          style: 'Cute & Fluffy',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('file key')
    })

    it('should reject request with invalid style', async () => {
      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          originalFileKey: 'uploads/test/image.jpg',
          style: 'Invalid Style',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid')
    })

    it('should accept valid plushie styles', async () => {
      const validStyles = ['Cute & Fluffy', 'Realistic Plush', 'Cartoon Style', 'Minimalist']

      for (const style of validStyles) {
        const request = new NextRequest('http://localhost:3000/api/generate', {
          method: 'POST',
          headers: createAuthHeaders(testSessionToken),
          body: JSON.stringify({
            originalFileKey: 'uploads/test/image.jpg',
            style,
          }),
        })

        const response = await POST(request)
        expect(response.status).toBe(200)
      }
    })

    it('should accept optional custom prompt', async () => {
      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          originalFileKey: 'uploads/test/image.jpg',
          style: 'Cute & Fluffy',
          prompt: 'Make it extra fluffy with big eyes',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })
  })

  describe('Credit Management', () => {
    it('should reject request when user has 0 credits', async () => {
      // Set credits to 0
      await setUserCredits(testUserId, 0)

      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          originalFileKey: 'uploads/test/image.jpg',
          style: 'Cute & Fluffy',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(402) // Payment Required
      expect(data.error).toContain('Insufficient credits')
      expect(data.required).toBe(1)
      expect(data.available).toBe(0)
    })

    it('should reject request when user has insufficient credits', async () => {
      // Set credits below required amount (though 1 credit is minimum)
      await setUserCredits(testUserId, 0)

      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          originalFileKey: 'uploads/test/image.jpg',
          style: 'Cute & Fluffy',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(402)
      expect(data.error).toContain('Insufficient credits')
    })

    it('should check credits before starting generation', async () => {
      const initialCredits = await getUserCredits(testUserId)
      expect(initialCredits).toBe(50)

      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          originalFileKey: 'uploads/test/image.jpg',
          style: 'Cute & Fluffy',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(200)

      // Credits should NOT be deducted immediately (deducted after generation completes)
      const creditsAfterStart = await getUserCredits(testUserId)
      expect(creditsAfterStart).toBe(50)
    })

    it('should deduct credits after successful generation', async () => {
      const initialCredits = await getUserCredits(testUserId)

      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          originalFileKey: 'uploads/test/image.jpg',
          style: 'Cute & Fluffy',
        }),
      })

      const response = await POST(request)
      const data = await response.json()
      expect(response.status).toBe(200)

      // Wait for generation to complete (async process)
      await waitFor(async () => {
        const image = await prisma.generatedImage.findUnique({
          where: { id: data.imageId },
        })
        return image?.status === 'completed'
      }, 10000) // 10 second timeout

      // Check credits were deducted
      const finalCredits = await getUserCredits(testUserId)
      expect(finalCredits).toBe(initialCredits - 1)
    })

    it('should create transaction record after generation', async () => {
      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          originalFileKey: 'uploads/test/image.jpg',
          style: 'Cute & Fluffy',
        }),
      })

      const response = await POST(request)
      const data = await response.json()
      expect(response.status).toBe(200)

      // Wait for generation to complete
      await waitFor(async () => {
        const image = await prisma.generatedImage.findUnique({
          where: { id: data.imageId },
        })
        return image?.status === 'completed'
      }, 10000)

      // Check transaction was created
      const transaction = await prisma.transaction.findFirst({
        where: {
          userId: testUserId,
          type: 'generation',
        },
      })

      expect(transaction).not.toBeNull()
      expect(transaction?.credits).toBe(-1)
      expect(transaction?.description).toContain('Cute & Fluffy')
    })
  })

  describe('Generation Process', () => {
    it('should create GeneratedImage record with pending status', async () => {
      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          originalFileKey: 'uploads/test/image.jpg',
          style: 'Cute & Fluffy',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.imageId).toBeDefined()
      expect(data.status).toBe('pending')

      // Verify database record
      const image = await prisma.generatedImage.findUnique({
        where: { id: data.imageId },
      })

      expect(image).not.toBeNull()
      expect(image?.userId).toBe(testUserId)
      expect(image?.style).toBe('Cute & Fluffy')
      expect(image?.status).toBe('pending')
    })

    it('should store custom prompt if provided', async () => {
      const customPrompt = 'Make it extra cute with rainbow colors'

      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          originalFileKey: 'uploads/test/image.jpg',
          style: 'Cute & Fluffy',
          prompt: customPrompt,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      const image = await prisma.generatedImage.findUnique({
        where: { id: data.imageId },
      })

      expect(image?.prompt).toBe(customPrompt)
    })

    it('should return generation ID and pending status immediately', async () => {
      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          originalFileKey: 'uploads/test/image.jpg',
          style: 'Cute & Fluffy',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('imageId')
      expect(data).toHaveProperty('status')
      expect(data).toHaveProperty('message')
      expect(data.status).toBe('pending')
      expect(data.message).toContain('started')
    })

    it('should process generation asynchronously', async () => {
      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          originalFileKey: 'uploads/test/image.jpg',
          style: 'Cute & Fluffy',
        }),
      })

      const startTime = Date.now()
      const response = await POST(request)
      const responseTime = Date.now() - startTime

      // Response should be immediate (< 1 second)
      expect(responseTime).toBeLessThan(1000)
      expect(response.status).toBe(200)

      const data = await response.json()

      // Status should be pending initially
      const immediateImage = await prisma.generatedImage.findUnique({
        where: { id: data.imageId },
      })
      expect(immediateImage?.status).toBe('pending')
    })
  })

  describe('Response Structure', () => {
    it('should return imageId, status, and message', async () => {
      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: createAuthHeaders(testSessionToken),
        body: JSON.stringify({
          originalFileKey: 'uploads/test/image.jpg',
          style: 'Cute & Fluffy',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data).toHaveProperty('imageId')
      expect(data).toHaveProperty('status')
      expect(data).toHaveProperty('message')
      expect(typeof data.imageId).toBe('string')
      expect(typeof data.status).toBe('string')
      expect(typeof data.message).toBe('string')
    })
  })
})

describe('GET /api/generate/[id]', () => {
  let testUserId: string
  let testSessionToken: string
  let otherUserId: string
  let otherSessionToken: string

  beforeEach(async () => {
    // Create test user
    const user = await createTestUser('status-test@example.com', 'Test123!@#', 50)
    testUserId = user.id
    const session = await createTestSession(user.id)
    testSessionToken = session.sessionToken

    // Create another user for ownership tests
    const otherUser = await createTestUser('other-test@example.com', 'Test123!@#', 50)
    otherUserId = otherUser.id
    const otherSession = await createTestSession(otherUser.id)
    otherSessionToken = otherSession.sessionToken
  })

  afterEach(async () => {
    await cleanupTestData()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('Authentication', () => {
    it('should reject unauthenticated request', async () => {
      const imageId = 'test-image-id'
      const request = new NextRequest(`http://localhost:3000/api/generate/${imageId}`, {
        method: 'GET',
      })

      const response = await GET(request, { params: { id: imageId } })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toContain('Unauthorized')
    })

    it('should accept authenticated request', async () => {
      // Create test image
      const image = await createTestImage(testUserId, 'COMPLETED')

      const request = new NextRequest(`http://localhost:3000/api/generate/${image.id}`, {
        method: 'GET',
        headers: createAuthHeaders(testSessionToken),
      })

      const response = await GET(request, { params: { id: image.id } })
      expect(response.status).toBe(200)
    })
  })

  describe('Authorization', () => {
    it('should return 403 for generation owned by another user', async () => {
      // Create image for test user
      const image = await createTestImage(testUserId, 'COMPLETED')

      // Try to access with other user's session
      const request = new NextRequest(`http://localhost:3000/api/generate/${image.id}`, {
        method: 'GET',
        headers: createAuthHeaders(otherSessionToken),
      })

      const response = await GET(request, { params: { id: image.id } })
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toContain('Forbidden')
      expect(data.error).toContain('another user')
    })

    it('should allow user to access their own generation', async () => {
      const image = await createTestImage(testUserId, 'COMPLETED')

      const request = new NextRequest(`http://localhost:3000/api/generate/${image.id}`, {
        method: 'GET',
        headers: createAuthHeaders(testSessionToken),
      })

      const response = await GET(request, { params: { id: image.id } })
      expect(response.status).toBe(200)
    })
  })

  describe('Generation Status', () => {
    it('should return 404 for non-existent generation', async () => {
      const fakeId = 'non-existent-id'

      const request = new NextRequest(`http://localhost:3000/api/generate/${fakeId}`, {
        method: 'GET',
        headers: createAuthHeaders(testSessionToken),
      })

      const response = await GET(request, { params: { id: fakeId } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toContain('not found')
    })

    it('should return PROCESSING status during generation', async () => {
      const image = await createTestImage(testUserId, 'PROCESSING')

      const request = new NextRequest(`http://localhost:3000/api/generate/${image.id}`, {
        method: 'GET',
        headers: createAuthHeaders(testSessionToken),
      })

      const response = await GET(request, { params: { id: image.id } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('PROCESSING')
      expect(data.generatedUrl).toBeNull()
    })

    it('should return COMPLETED status with generated URL', async () => {
      const image = await createTestImage(testUserId, 'COMPLETED')

      const request = new NextRequest(`http://localhost:3000/api/generate/${image.id}`, {
        method: 'GET',
        headers: createAuthHeaders(testSessionToken),
      })

      const response = await GET(request, { params: { id: image.id } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('COMPLETED')
      expect(data.generatedUrl).toBeDefined()
      expect(data.generatedUrl).toContain('generated')
    })

    it('should return FAILED status with error message', async () => {
      const image = await createTestImage(testUserId, 'FAILED')

      const request = new NextRequest(`http://localhost:3000/api/generate/${image.id}`, {
        method: 'GET',
        headers: createAuthHeaders(testSessionToken),
      })

      const response = await GET(request, { params: { id: image.id } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('FAILED')
      expect(data.errorMessage).toBeDefined()
      expect(data.generatedUrl).toBeNull()
    })
  })

  describe('Response Structure', () => {
    it('should return complete generation details', async () => {
      const image = await createTestImage(testUserId, 'COMPLETED')

      const request = new NextRequest(`http://localhost:3000/api/generate/${image.id}`, {
        method: 'GET',
        headers: createAuthHeaders(testSessionToken),
      })

      const response = await GET(request, { params: { id: image.id } })
      const data = await response.json()

      expect(data).toHaveProperty('id')
      expect(data).toHaveProperty('status')
      expect(data).toHaveProperty('originalUrl')
      expect(data).toHaveProperty('generatedUrl')
      expect(data).toHaveProperty('style')
      expect(data).toHaveProperty('prompt')
      expect(data).toHaveProperty('createdAt')
      expect(data).toHaveProperty('updatedAt')
    })

    it('should not expose userId in response', async () => {
      const image = await createTestImage(testUserId, 'COMPLETED')

      const request = new NextRequest(`http://localhost:3000/api/generate/${image.id}`, {
        method: 'GET',
        headers: createAuthHeaders(testSessionToken),
      })

      const response = await GET(request, { params: { id: image.id } })
      const data = await response.json()

      // Response should not expose userId (verified via ownership check instead)
      expect(data).not.toHaveProperty('userId')
    })
  })
})
