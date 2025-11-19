/**
 * Test Utilities and Helpers
 * Common functions and mocks for testing
 */

export const mockFile = (
  name: string = 'test-image.jpg',
  size: number = 1024 * 1024, // 1MB
  type: string = 'image/jpeg',
): File => {
  const blob = new Blob([''], { type })
  const file = new File([blob], name, { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

export const mockS3Response = {
  uploadUrl: 'https://test-bucket.s3.amazonaws.com/test-key',
  fileKey: 'uploads/user123/test-image.jpg',
  expiresIn: 300,
}

export const mockGenerationResponse = {
  imageId: 'gen_123456',
  status: 'pending',
  message: 'Image generation started',
}

export const mockUser = {
  id: 'user_123',
  email: 'test@example.com',
  name: 'Test User',
  credits: 50,
  emailVerified: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockGeneratedImage = {
  id: 'img_123',
  userId: 'user_123',
  originalUrl: 'https://s3.amazonaws.com/original.jpg',
  generatedUrl: 'https://s3.amazonaws.com/generated.jpg',
  style: 'cute-fluffy',
  prompt: null,
  status: 'completed',
  errorMessage: null,
  processingTime: 45000,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const createMockUploadProgress = (percentage: number) => ({
  loaded: percentage,
  total: 100,
  percentage,
})
