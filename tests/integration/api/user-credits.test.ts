/**
 * Integration Tests: User Credits API
 * Tests user credit balance retrieval
 */

import { GET } from '@/app/api/user/credits/route'
import { prisma } from '@/lib/db'
import {
  createTestUser,
  createTestSession,
  createAuthHeaders,
  cleanupTestData,
  setUserCredits,
  getUserCredits,
} from '@/tests/helpers/integration-utils'
import { NextRequest } from 'next/server'

describe('GET /api/user/credits', () => {
  let testUserId: string
  let testSessionToken: string

  beforeEach(async () => {
    // Create test user and session before each test
    const user = await createTestUser('credits-test@example.com', 'Test123!@#', 50)
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
      const request = new NextRequest('http://localhost:3000/api/user/credits', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toContain('Unauthorized')
    })

    it('should accept authenticated request with valid session', async () => {
      const request = new NextRequest('http://localhost:3000/api/user/credits', {
        method: 'GET',
        headers: createAuthHeaders(testSessionToken),
      })

      const response = await GET(request)
      expect(response.status).toBe(200)
    })
  })

  describe('Credit Balance Retrieval', () => {
    it('should return current credit balance', async () => {
      const request = new NextRequest('http://localhost:3000/api/user/credits', {
        method: 'GET',
        headers: createAuthHeaders(testSessionToken),
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('credits')
      expect(data.credits).toBe(50) // Default from createTestUser
    })

    it('should return 0 credits for new user with no purchases', async () => {
      // Update user credits to 0
      await setUserCredits(testUserId, 0)

      const request = new NextRequest('http://localhost:3000/api/user/credits', {
        method: 'GET',
        headers: createAuthHeaders(testSessionToken),
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.credits).toBe(0)
    })

    it('should return correct balance after credit deduction', async () => {
      // Deduct 10 credits
      await setUserCredits(testUserId, 40)

      const request = new NextRequest('http://localhost:3000/api/user/credits', {
        method: 'GET',
        headers: createAuthHeaders(testSessionToken),
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.credits).toBe(40)
    })

    it('should return correct balance after credit addition', async () => {
      // Add 100 credits (purchase)
      await setUserCredits(testUserId, 150)

      const request = new NextRequest('http://localhost:3000/api/user/credits', {
        method: 'GET',
        headers: createAuthHeaders(testSessionToken),
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.credits).toBe(150)
    })

    it('should handle large credit balances', async () => {
      // Set large balance (e.g., enterprise user)
      await setUserCredits(testUserId, 10000)

      const request = new NextRequest('http://localhost:3000/api/user/credits', {
        method: 'GET',
        headers: createAuthHeaders(testSessionToken),
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.credits).toBe(10000)
    })
  })

  describe('Response Structure', () => {
    it('should return credits as a number', async () => {
      const request = new NextRequest('http://localhost:3000/api/user/credits', {
        method: 'GET',
        headers: createAuthHeaders(testSessionToken),
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(typeof data.credits).toBe('number')
    })

    it('should only return credits field (no sensitive data)', async () => {
      const request = new NextRequest('http://localhost:3000/api/user/credits', {
        method: 'GET',
        headers: createAuthHeaders(testSessionToken),
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(Object.keys(data)).toEqual(['credits'])
      expect(data).not.toHaveProperty('password')
      expect(data).not.toHaveProperty('email')
      expect(data).not.toHaveProperty('id')
    })
  })

  describe('Database Synchronization', () => {
    it('should reflect real-time credit balance from database', async () => {
      // Get initial balance via API
      const request1 = new NextRequest('http://localhost:3000/api/user/credits', {
        method: 'GET',
        headers: createAuthHeaders(testSessionToken),
      })

      const response1 = await GET(request1)
      const data1 = await response1.json()

      expect(data1.credits).toBe(50)

      // Directly update database (simulating background process)
      await setUserCredits(testUserId, 45)

      // Verify database update
      const dbCredits = await getUserCredits(testUserId)
      expect(dbCredits).toBe(45)

      // Get balance again via API
      const request2 = new NextRequest('http://localhost:3000/api/user/credits', {
        method: 'GET',
        headers: createAuthHeaders(testSessionToken),
      })

      const response2 = await GET(request2)
      const data2 = await response2.json()

      // Should reflect updated balance
      expect(data2.credits).toBe(45)
    })

    it('should handle concurrent requests correctly', async () => {
      // Make multiple concurrent requests
      const requests = Array.from({ length: 5 }, () =>
        GET(
          new NextRequest('http://localhost:3000/api/user/credits', {
            method: 'GET',
            headers: createAuthHeaders(testSessionToken),
          }),
        ),
      )

      const responses = await Promise.all(requests)
      const dataPromises = responses.map((r) => r.json())
      const results = await Promise.all(dataPromises)

      // All should return same balance
      results.forEach((data) => {
        expect(data.credits).toBe(50)
      })
    })
  })

  describe('Error Handling', () => {
    it('should return 404 if user not found (deleted)', async () => {
      // Delete user but keep session
      await prisma.user.delete({ where: { id: testUserId } })

      const request = new NextRequest('http://localhost:3000/api/user/credits', {
        method: 'GET',
        headers: createAuthHeaders(testSessionToken),
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toContain('User not found')
    })
  })
})
