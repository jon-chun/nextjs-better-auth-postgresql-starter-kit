# Integration Tests Plan

## Overview

Integration tests verify that different parts of the application work together correctly. They test API endpoints with real database interactions, ensuring proper data flow between layers.

## Test Strategy

### Approach
- **Real Database**: Use separate test database (`plushifyme_test`)
- **Isolated Tests**: Each test creates and cleans up its own data
- **No External APIs**: Mock AWS S3 and OpenAI (already configured in jest.setup.js)
- **Session Management**: Create and use real sessions for authenticated endpoints

### Test Database Setup

Before running integration tests:
```bash
# Create test database
createdb plushifyme_test

# Set DATABASE_URL for tests
export DATABASE_URL="postgresql://plushifyme:plushifyme_dev_password@localhost:5432/plushifyme_test"

# Run migrations
npx prisma migrate deploy
```

In tests, we'll:
1. Clear relevant tables before each test
2. Create test users/sessions as needed
3. Verify database state after operations

## Test Suites

### 1. Authentication Integration Tests
**File:** `tests/integration/api/auth.test.ts`

#### Test Cases

##### Sign Up Endpoint (`POST /api/auth/sign-up`)
- ✅ Should create new user with valid data
- ✅ Should hash password securely
- ✅ Should reject duplicate email
- ✅ Should reject invalid email format
- ✅ Should reject weak password
- ✅ Should create user with default 10 credits
- ✅ Should return user data (without password)

##### Sign In Endpoint (`POST /api/auth/sign-in`)
- ✅ Should sign in with valid credentials
- ✅ Should create session in database
- ✅ Should reject invalid email
- ✅ Should reject wrong password
- ✅ Should reject non-existent user

##### Session Validation
- ✅ Should validate active session
- ✅ Should reject expired session (7+ days old)
- ✅ Should reject invalid session token

##### Email Verification (if implemented)
- ✅ Should send verification email
- ✅ Should verify email with valid token
- ✅ Should reject expired token
- ✅ Should reject invalid token

**Mock Requirements:**
- None (better-auth handles auth internally)

**Database Tables Used:**
- `User`
- `Session`
- `Verification` (if email verification implemented)

---

### 2. Upload Integration Tests
**File:** `tests/integration/api/upload.test.ts`

#### Test Cases

##### Presigned URL Generation (`POST /api/upload/presigned-url`)
- ✅ Should generate presigned URL for authenticated user
- ✅ Should return uploadUrl and fileKey
- ✅ Should reject unauthenticated request
- ✅ Should validate fileName parameter
- ✅ Should validate fileType parameter
- ✅ Should accept valid image types (JPEG, PNG, WebP)
- ✅ Should reject invalid file types (PDF, GIF, etc.)
- ✅ Should generate unique file keys for same filename

##### File Upload to S3 (via presigned URL)
- ✅ Should successfully upload file using presigned URL (mocked)
- ✅ Should return 403 for expired presigned URL (mocked)
- ✅ Should verify file key format: `uploads/{userId}/{timestamp}-{uuid}-{filename}`

**Mock Requirements:**
- AWS S3 `getSignedUrl` (already mocked in jest.setup.js)
- S3 `PutObjectCommand` (already mocked)

**Database Tables Used:**
- `User` (for authentication)
- `Session` (for authentication)

---

### 3. Generation Integration Tests
**File:** `tests/integration/api/generate.test.ts`

#### Test Cases

##### Start Generation (`POST /api/generate`)
- ✅ Should start generation for authenticated user with credits
- ✅ Should deduct 1 credit from user balance
- ✅ Should create Image record with PROCESSING status
- ✅ Should call OpenAI DALL-E 3 API (mocked)
- ✅ Should save generated image URL to database
- ✅ Should update Image status to COMPLETED
- ✅ Should reject unauthenticated request
- ✅ Should reject when user has 0 credits
- ✅ Should handle OpenAI API errors gracefully
- ✅ Should return generation ID and status

##### Poll Generation Status (`GET /api/generate/[id]`)
- ✅ Should return PROCESSING status during generation
- ✅ Should return COMPLETED status with image URL when done
- ✅ Should return FAILED status on error
- ✅ Should reject request for another user's generation
- ✅ Should return 404 for non-existent generation ID
- ✅ Should require authentication

##### Credit Deduction (Atomic Transaction)
- ✅ Should deduct credit and create image atomically
- ✅ Should rollback on generation failure
- ✅ Should handle concurrent requests (2 simultaneous generations)
- ✅ Should prevent negative credit balance

**Mock Requirements:**
- OpenAI `images.generate()` (already mocked in jest.setup.js)
- S3 upload for generated image (already mocked)

**Database Tables Used:**
- `User` (credits balance)
- `Session` (authentication)
- `Image` (generation records)

---

### 4. User Credits Integration Tests
**File:** `tests/integration/api/user-credits.test.ts`

#### Test Cases

##### Get Credit Balance (`GET /api/user/credits`)
- ✅ Should return current credit balance for authenticated user
- ✅ Should return correct balance after generation
- ✅ Should require authentication
- ✅ Should return 0 for new user with no purchases

##### Credit Purchase (if implemented)
- ✅ Should add credits after successful payment
- ✅ Should create Transaction record
- ✅ Should handle Stripe webhook correctly

**Mock Requirements:**
- None (or Stripe webhook if implemented)

**Database Tables Used:**
- `User` (credits field)
- `Session` (authentication)
- `Transaction` (purchase records)

---

## Test Utilities

### `tests/helpers/integration-utils.ts`

```typescript
/**
 * Create a test user with specified credits
 */
export async function createTestUser(
  email: string = 'test@example.com',
  password: string = 'Test123!@#',
  credits: number = 50
): Promise<User>

/**
 * Create a session for test user
 */
export async function createTestSession(userId: string): Promise<Session>

/**
 * Clean up test data (delete users, sessions, images)
 */
export async function cleanupTestData(): Promise<void>

/**
 * Create authenticated request headers with session token
 */
export function createAuthHeaders(sessionToken: string): Headers

/**
 * Wait for async operation to complete (for polling tests)
 */
export async function waitFor(
  condition: () => Promise<boolean>,
  timeout: number = 5000
): Promise<void>
```

---

## Test Configuration

### Environment Variables

Add to `jest.setup.js`:
```javascript
process.env.DATABASE_URL = 'postgresql://plushifyme:plushifyme_dev_password@localhost:5432/plushifyme_test'
```

### Database Cleanup

Use `beforeEach` and `afterAll` hooks:
```typescript
beforeEach(async () => {
  // Clear test data before each test
  await prisma.image.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  // Disconnect Prisma after all tests
  await prisma.$disconnect()
})
```

---

## Running Integration Tests

```bash
# Run all integration tests
npm run test:integration

# Run specific suite
npm test -- tests/integration/api/auth.test.ts

# Run with coverage
npm run test:coverage -- --testPathPattern=integration
```

---

## Expected Coverage

After implementing integration tests:

| Component | Current | Target | Notes |
|-----------|---------|--------|-------|
| **API Routes** | 0% | 80%+ | All endpoints tested |
| **lib/storage.ts** | 62.5% | 85%+ | Upload functions tested |
| **lib/ai-generation.ts** | 13.95% | 70%+ | Generation flow tested |
| **Overall** | 5.27% | 40%+ | Significant improvement |

---

## Test Execution Order

1. **Auth tests** → Create users and sessions
2. **Upload tests** → Test file upload flow
3. **Generation tests** → Test AI generation with credit system
4. **Credits tests** → Verify credit management

Each suite is independent and can run in any order.

---

## Success Criteria

✅ All integration tests pass
✅ No database connection leaks
✅ Tests run in under 10 seconds
✅ 80%+ coverage for API routes
✅ No flaky tests (consistent results)

---

## Next Steps

1. ✅ Create integration test utilities (`integration-utils.ts`)
2. ✅ Implement auth integration tests
3. ✅ Implement upload integration tests
4. ✅ Implement generation integration tests
5. ✅ Implement credits integration tests
6. ✅ Run all tests and verify coverage
7. ✅ Document any issues found during testing
