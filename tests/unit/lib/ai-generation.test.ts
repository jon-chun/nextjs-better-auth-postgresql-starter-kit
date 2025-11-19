/**
 * Unit Tests: AI Generation Service
 * Tests for lib/ai-generation.ts
 */

import { isOpenAIConfigured } from '@/lib/ai-generation'

describe('AI Generation Service', () => {
  const originalApiKey = process.env.OPENAI_API_KEY
  const originalOrgId = process.env.OPENAI_ORG_ID

  afterEach(() => {
    process.env.OPENAI_API_KEY = originalApiKey
    process.env.OPENAI_ORG_ID = originalOrgId
  })

  describe('isOpenAIConfigured', () => {
    it('should return true when both API key and Org ID are set', () => {
      process.env.OPENAI_API_KEY = 'sk-test-key'
      process.env.OPENAI_ORG_ID = 'org-test-id'

      expect(isOpenAIConfigured()).toBe(true)
    })

    it('should return false when API key is missing', () => {
      delete process.env.OPENAI_API_KEY
      process.env.OPENAI_ORG_ID = 'org-test-id'

      expect(isOpenAIConfigured()).toBe(false)
    })

    it('should return false when Org ID is missing', () => {
      process.env.OPENAI_API_KEY = 'sk-test-key'
      delete process.env.OPENAI_ORG_ID

      expect(isOpenAIConfigured()).toBe(false)
    })

    it('should return false when both are missing', () => {
      delete process.env.OPENAI_API_KEY
      delete process.env.OPENAI_ORG_ID

      expect(isOpenAIConfigured()).toBe(false)
    })

    it('should return false for empty strings', () => {
      process.env.OPENAI_API_KEY = ''
      process.env.OPENAI_ORG_ID = ''

      expect(isOpenAIConfigured()).toBe(false)
    })
  })

  // Note: generatePlushieImage is not tested here as it requires mocking
  // external API calls. This would be better suited for integration tests.
})
