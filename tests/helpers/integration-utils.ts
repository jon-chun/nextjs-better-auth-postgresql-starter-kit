import { prisma } from '@/lib/db'
import { hash } from 'bcrypt'
import type { User, Session } from '@prisma/client'

/**
 * Create a test user with specified credits
 * @param email User email address
 * @param password Plain text password (will be hashed)
 * @param credits Initial credit balance
 * @returns Created user object
 */
export async function createTestUser(
  email: string = `test-${Date.now()}@example.com`,
  password: string = 'Test123!@#',
  credits: number = 50,
): Promise<User> {
  const hashedPassword = await hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: 'Test User',
      credits,
      emailVerified: new Date(),
    },
  })

  return user
}

/**
 * Create a session for test user
 * @param userId User ID to create session for
 * @param expiresInDays Number of days until session expires (default: 7)
 * @returns Created session object
 */
export async function createTestSession(
  userId: string,
  expiresInDays: number = 7,
): Promise<Session> {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + expiresInDays)

  const sessionToken = `test-session-${userId}-${Date.now()}`

  const session = await prisma.session.create({
    data: {
      userId,
      sessionToken,
      expiresAt,
    },
  })

  return session
}

/**
 * Create authenticated request headers with session token
 * @param sessionToken Session token from createTestSession
 * @returns Headers object with cookie
 */
export function createAuthHeaders(sessionToken: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Cookie: `session=${sessionToken}`,
  }
}

/**
 * Clean up test data - deletes all test-related records
 * Use in afterEach or afterAll hooks
 */
export async function cleanupTestData(): Promise<void> {
  // Delete in correct order to respect foreign key constraints
  await prisma.image.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.verification.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()
}

/**
 * Clean up specific user's data
 * @param userId User ID to clean up
 */
export async function cleanupUserData(userId: string): Promise<void> {
  await prisma.image.deleteMany({ where: { userId } })
  await prisma.transaction.deleteMany({ where: { userId } })
  await prisma.session.deleteMany({ where: { userId } })
  await prisma.account.deleteMany({ where: { userId } })
  await prisma.user.delete({ where: { id: userId } })
}

/**
 * Wait for a condition to be true (useful for polling tests)
 * @param condition Function that returns true when condition is met
 * @param timeout Maximum time to wait in milliseconds (default: 5000)
 * @param interval Polling interval in milliseconds (default: 100)
 * @throws Error if timeout is reached
 */
export async function waitFor(
  condition: () => Promise<boolean> | boolean,
  timeout: number = 5000,
  interval: number = 100,
): Promise<void> {
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    const result = await condition()
    if (result) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, interval))
  }

  throw new Error(`Timeout waiting for condition after ${timeout}ms`)
}

/**
 * Create a test image record in database
 * @param userId User ID who owns the image
 * @param status Image generation status
 * @returns Created image object
 */
export async function createTestImage(
  userId: string,
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED' = 'COMPLETED',
) {
  const image = await prisma.image.create({
    data: {
      userId,
      originalImageUrl: 'https://test-bucket.s3.amazonaws.com/uploads/test.jpg',
      generatedImageUrl:
        status === 'COMPLETED'
          ? 'https://test-bucket.s3.amazonaws.com/generated/plushie.png'
          : null,
      style: 'Cute & Fluffy',
      status,
      errorMessage: status === 'FAILED' ? 'Test error' : null,
    },
  })

  return image
}

/**
 * Create a test transaction (credit purchase)
 * @param userId User ID who made the purchase
 * @param amount Amount in cents (e.g., 995 for $9.95)
 * @param credits Number of credits purchased
 * @returns Created transaction object
 */
export async function createTestTransaction(
  userId: string,
  amount: number = 995,
  credits: number = 30,
) {
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      amount,
      credits,
      status: 'COMPLETED',
      stripePaymentIntentId: `pi_test_${Date.now()}`,
    },
  })

  return transaction
}

/**
 * Get user's current credit balance from database
 * @param userId User ID
 * @returns Credit balance
 */
export async function getUserCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  })

  return user?.credits ?? 0
}

/**
 * Update user's credit balance
 * @param userId User ID
 * @param credits New credit balance
 */
export async function setUserCredits(
  userId: string,
  credits: number,
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { credits },
  })
}

/**
 * Verify that a session exists and is valid
 * @param sessionToken Session token to verify
 * @returns True if session exists and not expired
 */
export async function isSessionValid(sessionToken: string): Promise<boolean> {
  const session = await prisma.session.findUnique({
    where: { sessionToken },
  })

  if (!session) {
    return false
  }

  return session.expiresAt > new Date()
}

/**
 * Create an expired session for testing
 * @param userId User ID
 * @returns Created expired session
 */
export async function createExpiredSession(userId: string): Promise<Session> {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() - 1) // Expired yesterday

  const sessionToken = `expired-session-${userId}-${Date.now()}`

  const session = await prisma.session.create({
    data: {
      userId,
      sessionToken,
      expiresAt,
    },
  })

  return session
}

/**
 * Mock fetch response helper
 * @param data Response data
 * @param status HTTP status code
 * @returns Mock Response object
 */
export function createMockResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Parse cookies from response headers
 * @param response Response object
 * @returns Object with cookie name as key, value as value
 */
export function parseCookies(response: Response): Record<string, string> {
  const cookies: Record<string, string> = {}
  const setCookieHeader = response.headers.get('set-cookie')

  if (setCookieHeader) {
    const cookiePairs = setCookieHeader.split(';')
    cookiePairs.forEach((pair) => {
      const [name, value] = pair.trim().split('=')
      if (name && value) {
        cookies[name] = value
      }
    })
  }

  return cookies
}
