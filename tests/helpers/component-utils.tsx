import { render, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReactElement, ReactNode } from 'react'

/**
 * Custom render function that wraps components with providers if needed
 * Currently just wraps with basic render, but can be extended with:
 * - Theme providers
 * - Router providers
 * - Context providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  // Define a wrapper component if you need to add providers
  function Wrapper({ children }: { children: ReactNode }) {
    return <>{children}</>
  }

  return render(ui, { wrapper: Wrapper, ...options })
}

/**
 * Create a mock File object for testing file uploads
 * @param name Filename (e.g., 'test.jpg')
 * @param size File size in bytes
 * @param type MIME type (e.g., 'image/jpeg')
 * @returns Mock File object
 */
export function createMockFile(
  name: string = 'test-image.jpg',
  size: number = 1024 * 1024, // 1MB default
  type: string = 'image/jpeg',
): File {
  const blob = new Blob(['fake-image-content'], { type })
  const file = new File([blob], name, { type })

  // Override size property since Blob size is calculated
  Object.defineProperty(file, 'size', {
    value: size,
    writable: false,
  })

  return file
}

/**
 * Simulate drag and drop of a file onto an element
 * @param element Target element to drop file on
 * @param file File to drop
 */
export async function simulateDragDrop(
  element: HTMLElement,
  file: File,
): Promise<void> {
  const dataTransfer = new DataTransfer()
  dataTransfer.items.add(file)

  // Dispatch drag enter
  const dragEnterEvent = new DragEvent('dragenter', {
    bubbles: true,
    cancelable: true,
    dataTransfer,
  })
  element.dispatchEvent(dragEnterEvent)

  // Dispatch drag over
  const dragOverEvent = new DragEvent('dragover', {
    bubbles: true,
    cancelable: true,
    dataTransfer,
  })
  element.dispatchEvent(dragOverEvent)

  // Dispatch drop
  const dropEvent = new DragEvent('drop', {
    bubbles: true,
    cancelable: true,
    dataTransfer,
  })
  element.dispatchEvent(dropEvent)

  // Dispatch drag leave
  const dragLeaveEvent = new DragEvent('dragleave', {
    bubbles: true,
    cancelable: true,
  })
  element.dispatchEvent(dragLeaveEvent)
}

/**
 * Simulate file selection through input element
 * @param input File input element
 * @param file File to select
 */
export async function selectFile(
  input: HTMLInputElement,
  file: File,
): Promise<void> {
  const dataTransfer = new DataTransfer()
  dataTransfer.items.add(file)

  // Set files property
  Object.defineProperty(input, 'files', {
    value: dataTransfer.files,
    writable: false,
  })

  // Trigger change event
  const changeEvent = new Event('change', { bubbles: true })
  input.dispatchEvent(changeEvent)
}

/**
 * Fill form fields with data
 * @param fields Object with field name as key, value as value
 * @returns Promise that resolves when all fields are filled
 */
export async function fillForm(
  fields: Record<string, string>,
): Promise<void> {
  const user = userEvent.setup()

  for (const [name, value] of Object.entries(fields)) {
    // Find input by name, label, or placeholder
    const input = document.querySelector(
      `input[name="${name}"], textarea[name="${name}"], input[placeholder*="${name}"]`,
    ) as HTMLInputElement | HTMLTextAreaElement

    if (input) {
      await user.clear(input)
      await user.type(input, value)
    }
  }
}

/**
 * Wait for an element to appear in the DOM
 * @param selector CSS selector or test ID
 * @param timeout Maximum time to wait (ms)
 * @returns Promise that resolves with the element
 */
export async function waitForElement(
  selector: string,
  timeout: number = 3000,
): Promise<HTMLElement> {
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    const element = document.querySelector(selector) as HTMLElement
    if (element) {
      return element
    }
    await new Promise((resolve) => setTimeout(resolve, 50))
  }

  throw new Error(`Element "${selector}" not found after ${timeout}ms`)
}

/**
 * Wait for an element to disappear from the DOM
 * @param selector CSS selector or test ID
 * @param timeout Maximum time to wait (ms)
 */
export async function waitForElementToDisappear(
  selector: string,
  timeout: number = 3000,
): Promise<void> {
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    const element = document.querySelector(selector)
    if (!element) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 50))
  }

  throw new Error(`Element "${selector}" still visible after ${timeout}ms`)
}

/**
 * Create a mock image URL for testing
 * @param width Image width
 * @param height Image height
 * @returns Data URL of a 1x1 pixel image
 */
export function createMockImageUrl(
  width: number = 100,
  height: number = 100,
): string {
  // Create a 1x1 pixel transparent PNG
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#cccccc'
    ctx.fillRect(0, 0, width, height)
  }
  return canvas.toDataURL('image/png')
}

/**
 * Simulate keyboard navigation
 * @param startElement Element to start from
 * @param key Key to press (e.g., 'ArrowDown', 'Enter', 'Tab')
 * @param times Number of times to press the key
 */
export async function simulateKeyPress(
  startElement: HTMLElement,
  key: string,
  times: number = 1,
): Promise<void> {
  const user = userEvent.setup()

  for (let i = 0; i < times; i++) {
    await user.keyboard(`{${key}}`)
  }
}

/**
 * Check if element has focus
 * @param element Element to check
 * @returns True if element has focus
 */
export function hasFocus(element: HTMLElement): boolean {
  return document.activeElement === element
}

/**
 * Get all validation errors from a form
 * @param form Form element
 * @returns Array of error messages
 */
export function getFormErrors(form: HTMLFormElement): string[] {
  const errors: string[] = []
  const errorElements = form.querySelectorAll('[role="alert"], .error-message')

  errorElements.forEach((el) => {
    if (el.textContent) {
      errors.push(el.textContent.trim())
    }
  })

  return errors
}

/**
 * Mock IntersectionObserver for components that use it
 * Useful for components with lazy loading or infinite scroll
 */
export function mockIntersectionObserver(): void {
  global.IntersectionObserver = class IntersectionObserver {
    observe() {}
    disconnect() {}
    unobserve() {}
    takeRecords() {
      return []
    }
    root = null
    rootMargin = ''
    thresholds = []
  } as any
}

/**
 * Mock ResizeObserver for components that use it
 * Useful for responsive components
 */
export function mockResizeObserver(): void {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    disconnect() {}
    unobserve() {}
  } as any
}

/**
 * Mock window.matchMedia for responsive tests
 * @param matches Whether the media query matches
 */
export function mockMatchMedia(matches: boolean = true): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

/**
 * Trigger validation on form field
 * @param input Input element to validate
 */
export async function triggerValidation(
  input: HTMLInputElement | HTMLTextAreaElement,
): Promise<void> {
  // Blur to trigger validation
  input.focus()
  input.blur()

  // Wait for validation to complete
  await new Promise((resolve) => setTimeout(resolve, 100))
}

/**
 * Check if element is visible (not display: none or visibility: hidden)
 * @param element Element to check
 * @returns True if element is visible
 */
export function isVisible(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element)
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0'
  )
}

/**
 * Get ARIA attributes from element
 * @param element Element to inspect
 * @returns Object with ARIA attributes
 */
export function getAriaAttributes(element: HTMLElement): Record<string, string> {
  const ariaAttrs: Record<string, string> = {}

  for (const attr of element.attributes) {
    if (attr.name.startsWith('aria-')) {
      ariaAttrs[attr.name] = attr.value
    }
  }

  return ariaAttrs
}

/**
 * Verify accessibility of an element
 * Basic checks for common accessibility issues
 * @param element Element to check
 * @returns Array of accessibility issues found
 */
export function checkAccessibility(element: HTMLElement): string[] {
  const issues: string[] = []

  // Check for buttons without accessible names
  if (element.tagName === 'BUTTON' && !element.textContent?.trim()) {
    if (!element.getAttribute('aria-label')) {
      issues.push('Button has no accessible name')
    }
  }

  // Check for images without alt text
  if (element.tagName === 'IMG') {
    if (!element.getAttribute('alt')) {
      issues.push('Image missing alt attribute')
    }
  }

  // Check for form inputs without labels
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName)) {
    const id = element.getAttribute('id')
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`)
      if (!label && !element.getAttribute('aria-label')) {
        issues.push('Form input has no associated label')
      }
    }
  }

  return issues
}
