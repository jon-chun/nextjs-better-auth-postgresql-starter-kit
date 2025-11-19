/**
 * Unit Tests: Validation Schemas
 * Tests for lib/validations.ts
 */

import {
  signUpSchema,
  signInSchema,
  imageUploadSchema,
  updateProfileSchema,
} from '@/lib/validations'

describe('Validation Schemas', () => {
  describe('signUpSchema', () => {
    it('should accept valid sign-up data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
      }

      const result = signUpSchema.safeParse(validData)

      expect(result.success).toBe(true)
    })

    it('should accept valid sign-up without name', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123',
      }

      const result = signUpSchema.safeParse(validData)

      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'Password123',
      }

      const result = signUpSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid email')
      }
    })

    it('should reject password without uppercase', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
      }

      const result = signUpSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('uppercase')
      }
    })

    it('should reject password without lowercase', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'PASSWORD123',
      }

      const result = signUpSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('lowercase')
      }
    })

    it('should reject password without numbers', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'PasswordABC',
      }

      const result = signUpSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('number')
      }
    })

    it('should reject password less than 8 characters', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Pass1',
      }

      const result = signUpSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('8 characters')
      }
    })

    it('should reject name less than 2 characters', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'A',
      }

      const result = signUpSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('2 characters')
      }
    })

    it('should reject name more than 50 characters', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'A'.repeat(51),
      }

      const result = signUpSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('50 characters')
      }
    })
  })

  describe('signInSchema', () => {
    it('should accept valid sign-in data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'anypassword',
      }

      const result = signInSchema.safeParse(validData)

      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'password',
      }

      const result = signInSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
    })

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      }

      const result = signInSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('required')
      }
    })

    it('should reject missing email', () => {
      const invalidData = {
        password: 'password',
      }

      const result = signInSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
    })
  })

  describe('imageUploadSchema', () => {
    it('should accept valid upload data with all styles', () => {
      const styles = ['cute-fluffy', 'realistic-plush', 'cartoon-style', 'minimalist']

      styles.forEach((style) => {
        const validData = {
          style,
          prompt: 'Make it extra cute',
        }

        const result = imageUploadSchema.safeParse(validData)

        expect(result.success).toBe(true)
      })
    })

    it('should accept upload without prompt', () => {
      const validData = {
        style: 'cute-fluffy',
      }

      const result = imageUploadSchema.safeParse(validData)

      expect(result.success).toBe(true)
    })

    it('should reject invalid style', () => {
      const invalidData = {
        style: 'invalid-style',
      }

      const result = imageUploadSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
    })

    it('should reject prompt longer than 200 characters', () => {
      const invalidData = {
        style: 'cute-fluffy',
        prompt: 'A'.repeat(201),
      }

      const result = imageUploadSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('200 characters')
      }
    })

    it('should accept prompt at exactly 200 characters', () => {
      const validData = {
        style: 'cute-fluffy',
        prompt: 'A'.repeat(200),
      }

      const result = imageUploadSchema.safeParse(validData)

      expect(result.success).toBe(true)
    })
  })

  describe('updateProfileSchema', () => {
    it('should accept valid profile updates', () => {
      const validData = {
        name: 'Updated Name',
        email: 'newemail@example.com',
      }

      const result = updateProfileSchema.safeParse(validData)

      expect(result.success).toBe(true)
    })

    it('should accept name only', () => {
      const validData = {
        name: 'Updated Name',
      }

      const result = updateProfileSchema.safeParse(validData)

      expect(result.success).toBe(true)
    })

    it('should accept email only', () => {
      const validData = {
        email: 'newemail@example.com',
      }

      const result = updateProfileSchema.safeParse(validData)

      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
      }

      const result = updateProfileSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
    })

    it('should reject name less than 2 characters', () => {
      const invalidData = {
        name: 'A',
      }

      const result = updateProfileSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
    })

    it('should accept empty object (no updates)', () => {
      const validData = {}

      const result = updateProfileSchema.safeParse(validData)

      expect(result.success).toBe(true)
    })
  })
})
