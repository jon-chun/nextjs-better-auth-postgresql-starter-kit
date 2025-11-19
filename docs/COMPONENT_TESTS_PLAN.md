# Component Tests Plan

## Overview

Component tests verify that React components render correctly, handle user interactions, and integrate with context/state management. They test UI behavior without requiring a full browser environment.

## Test Strategy

### Approach
- **React Testing Library**: Focus on user behavior, not implementation details
- **Jest DOM Matchers**: Use semantic queries (`getByRole`, `getByLabelText`)
- **No Mocked Props**: Test components with realistic props
- **User Events**: Simulate real user interactions (clicks, typing, etc.)
- **Accessibility**: Verify ARIA attributes and keyboard navigation

### Testing Philosophy

**DO:**
- ✅ Test what users see and do
- ✅ Test accessibility features
- ✅ Test error states and loading states
- ✅ Test form validation
- ✅ Test user interactions

**DON'T:**
- ❌ Test implementation details (state variables, internal functions)
- ❌ Test CSS styles (use visual regression testing instead)
- ❌ Test third-party libraries (assume they work)
- ❌ Shallow render (use full render with React Testing Library)

---

## Test Suites

### 1. Dashboard Components Tests
**File:** `tests/component/dashboard/ImageUploadZone.test.tsx`

#### ImageUploadZone Component

##### Rendering
- ✅ Should render upload zone with drag-and-drop area
- ✅ Should show "Drag & drop" text when empty
- ✅ Should display upload icon
- ✅ Should show file size limit (10MB)
- ✅ Should show accepted file types (JPEG, PNG, WebP)

##### File Selection
- ✅ Should open file picker on click
- ✅ Should accept valid image file (JPEG)
- ✅ Should accept PNG file
- ✅ Should accept WebP file
- ✅ Should show file preview after selection
- ✅ Should display selected filename

##### Drag and Drop
- ✅ Should highlight zone on drag enter
- ✅ Should remove highlight on drag leave
- ✅ Should accept dropped file
- ✅ Should show preview of dropped image

##### Validation
- ✅ Should reject file larger than 10MB
- ✅ Should show error message for oversized file
- ✅ Should reject invalid file type (PDF, GIF)
- ✅ Should show error message for invalid type
- ✅ Should clear error on valid file selection

##### Upload Callback
- ✅ Should call onFileSelect with File object
- ✅ Should not call onFileSelect for invalid file
- ✅ Should call onFileSelect after drag-and-drop

**Props:**
```typescript
{
  onFileSelect: (file: File) => void
  disabled?: boolean
  error?: string
}
```

---

**File:** `tests/component/dashboard/StyleSelector.test.tsx`

#### StyleSelector Component

##### Rendering
- ✅ Should render all 4 plushie styles
- ✅ Should display style names (Cute & Fluffy, Realistic Plush, etc.)
- ✅ Should display style emojis
- ✅ Should show style descriptions

##### Selection
- ✅ Should select "Cute & Fluffy" by default
- ✅ Should highlight selected style
- ✅ Should change selection on click
- ✅ Should call onStyleChange with selected style
- ✅ Should support keyboard navigation (arrow keys)

##### Accessibility
- ✅ Should have proper ARIA labels
- ✅ Should be keyboard accessible (Tab, Enter)
- ✅ Should announce selection to screen readers

**Props:**
```typescript
{
  selectedStyle: string
  onStyleChange: (style: string) => void
  disabled?: boolean
}
```

---

**File:** `tests/component/dashboard/GenerationControls.test.tsx`

#### GenerationControls Component

##### Rendering
- ✅ Should render "Generate Plushie" button
- ✅ Should display user's credit balance
- ✅ Should show cost (1 credit per generation)
- ✅ Should display advanced options toggle

##### Generation Button
- ✅ Should be enabled when user has credits
- ✅ Should be disabled when user has 0 credits
- ✅ Should show "Not enough credits" when disabled
- ✅ Should call onGenerate when clicked
- ✅ Should show loading state during generation

##### Advanced Options
- ✅ Should expand advanced options on toggle
- ✅ Should show quality selector (Standard/HD)
- ✅ Should show size selector (1024x1024, etc.)
- ✅ Should update generation params on change

##### Credit Display
- ✅ Should format credit count correctly (50 → "50", 1000 → "1,000")
- ✅ Should show warning when credits < 5
- ✅ Should link to credits page

**Props:**
```typescript
{
  userCredits: number
  onGenerate: (params: GenerationParams) => void
  isGenerating: boolean
  disabled?: boolean
}
```

---

**File:** `tests/component/dashboard/GenerationStatus.test.tsx`

#### GenerationStatus Component

##### Processing State
- ✅ Should show "Processing..." message
- ✅ Should display animated spinner
- ✅ Should show progress bar (if available)
- ✅ Should show estimated time remaining

##### Completed State
- ✅ Should show "Generation complete!" message
- ✅ Should display generated image preview
- ✅ Should show download button
- ✅ Should show "Generate another" button

##### Failed State
- ✅ Should show error message
- ✅ Should display "Try again" button
- ✅ Should show refund message (credit returned)

##### Idle State
- ✅ Should not render when status is null

**Props:**
```typescript
{
  status: 'idle' | 'processing' | 'completed' | 'failed'
  generatedImageUrl?: string
  error?: string
  onRetry?: () => void
}
```

---

### 2. Shared Components Tests

**File:** `tests/component/shared/PasswordStrengthIndicator.test.tsx`

#### PasswordStrengthIndicator Component

##### Strength Calculation
- ✅ Should show "Too weak" for password < 8 chars
- ✅ Should show "Weak" for password without uppercase
- ✅ Should show "Weak" for password without number
- ✅ Should show "Fair" for password with 8+ chars, uppercase, number
- ✅ Should show "Strong" for password with special char
- ✅ Should show "Very strong" for password 12+ chars with all criteria

##### Visual Indicator
- ✅ Should show red bar for weak password
- ✅ Should show yellow bar for fair password
- ✅ Should show green bar for strong password
- ✅ Should animate bar width on password change

##### Requirements Checklist
- ✅ Should show ✓ for met requirements
- ✅ Should show ✗ for unmet requirements
- ✅ Should update checklist in real-time

**Props:**
```typescript
{
  password: string
  showRequirements?: boolean
}
```

---

**File:** `tests/component/shared/CreditsDisplay.test.tsx`

#### CreditsDisplay Component

##### Rendering
- ✅ Should display credit count
- ✅ Should format large numbers with commas (1,234)
- ✅ Should show credit icon
- ✅ Should link to credits page

##### Warning States
- ✅ Should show warning color when credits < 5
- ✅ Should show critical color when credits = 0
- ✅ Should show normal color when credits >= 5

##### Tooltip
- ✅ Should show tooltip on hover
- ✅ Should display "1 credit = 1 generation" message

**Props:**
```typescript
{
  credits: number
  showWarning?: boolean
  onClick?: () => void
}
```

---

**File:** `tests/component/shared/BeforeAfterSlider.test.tsx`

#### BeforeAfterSlider Component

##### Rendering
- ✅ Should render both before and after images
- ✅ Should show draggable slider handle
- ✅ Should position slider at 50% by default

##### Slider Interaction
- ✅ Should move slider on drag
- ✅ Should update slider position on mouse move
- ✅ Should snap to edges (0% and 100%)
- ✅ Should work with touch events (mobile)

##### Keyboard Control
- ✅ Should move slider with arrow keys
- ✅ Should jump to 0% with Home key
- ✅ Should jump to 100% with End key

##### Accessibility
- ✅ Should have proper ARIA labels
- ✅ Should announce position to screen readers

**Props:**
```typescript
{
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
}
```

---

### 3. Auth Components Tests

**File:** `tests/component/auth/SignUpForm.test.tsx`

#### SignUpForm Component

##### Rendering
- ✅ Should render email input
- ✅ Should render password input
- ✅ Should render confirm password input
- ✅ Should show "Sign Up" button
- ✅ Should show password strength indicator

##### Form Validation
- ✅ Should show error for invalid email
- ✅ Should show error for weak password
- ✅ Should show error when passwords don't match
- ✅ Should show error for empty fields
- ✅ Should clear errors on input change

##### Form Submission
- ✅ Should call onSubmit with valid data
- ✅ Should prevent submission with invalid data
- ✅ Should show loading state during submission
- ✅ Should disable inputs during submission

##### Password Visibility
- ✅ Should toggle password visibility on icon click
- ✅ Should show/hide password text

##### Links
- ✅ Should link to sign-in page
- ✅ Should link to terms of service

**Props:**
```typescript
{
  onSubmit: (data: SignUpData) => Promise<void>
  error?: string
}
```

---

**File:** `tests/component/auth/SignInForm.test.tsx`

#### SignInForm Component

##### Rendering
- ✅ Should render email input
- ✅ Should render password input
- ✅ Should show "Sign In" button
- ✅ Should show "Remember me" checkbox

##### Form Validation
- ✅ Should show error for invalid email
- ✅ Should show error for empty password
- ✅ Should validate on blur

##### Form Submission
- ✅ Should call onSubmit with credentials
- ✅ Should include "remember me" value
- ✅ Should show loading state
- ✅ Should display server error message

##### Links
- ✅ Should link to sign-up page
- ✅ Should link to forgot password page

**Props:**
```typescript
{
  onSubmit: (data: SignInData) => Promise<void>
  error?: string
}
```

---

## Test Utilities

### `tests/helpers/component-utils.tsx`

```typescript
import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'

/**
 * Custom render with providers (if needed for context)
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptions
)

/**
 * Create mock user event
 */
export function createMockFile(
  name: string,
  size: number,
  type: string
): File

/**
 * Simulate drag and drop
 */
export async function simulateDragDrop(
  element: HTMLElement,
  file: File
): Promise<void>

/**
 * Wait for element to appear/disappear
 */
export async function waitForElement(
  selector: string,
  timeout?: number
): Promise<HTMLElement>

/**
 * Simulate form input
 */
export async function fillForm(
  form: HTMLFormElement,
  data: Record<string, string>
): Promise<void>
```

---

## Running Component Tests

```bash
# Run all component tests
npm test -- --testPathPattern=component

# Run specific component
npm test -- ImageUploadZone.test.tsx

# Run with coverage
npm run test:coverage -- --testPathPattern=component

# Watch mode for development
npm run test:watch -- --testPathPattern=component
```

---

## Expected Coverage

After implementing component tests:

| Component Type | Current | Target | Notes |
|----------------|---------|--------|-------|
| **Dashboard Components** | 0% | 85%+ | All major UI tested |
| **Shared Components** | 0% | 90%+ | Reusable components |
| **Auth Components** | 0% | 85%+ | Forms and validation |
| **Overall Components** | 0% | 85%+ | High UI coverage |

---

## Component Test Checklist

For each component:

- [ ] Renders without crashing
- [ ] Displays correct content/props
- [ ] Handles user interactions (clicks, typing)
- [ ] Validates form inputs (if applicable)
- [ ] Shows error states
- [ ] Shows loading states
- [ ] Calls callbacks with correct arguments
- [ ] Handles edge cases (null, empty, large values)
- [ ] Keyboard accessible (Tab, Enter, Escape)
- [ ] Screen reader accessible (ARIA labels)

---

## Success Criteria

✅ All component tests pass
✅ 85%+ coverage for components
✅ No accessibility violations
✅ Tests run in under 5 seconds
✅ No console errors/warnings during tests

---

## Next Steps

1. ✅ Create component test utilities (`component-utils.tsx`)
2. ✅ Implement ImageUploadZone tests
3. ✅ Implement StyleSelector tests
4. ✅ Implement GenerationControls tests
5. ✅ Implement GenerationStatus tests
6. ✅ Implement PasswordStrengthIndicator tests
7. ✅ Implement CreditsDisplay tests
8. ✅ Implement BeforeAfterSlider tests
9. ✅ Implement SignUpForm tests
10. ✅ Implement SignInForm tests
11. ✅ Run all tests and verify coverage
