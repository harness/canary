import { cleanup } from '@testing-library/react'
import { vi } from 'vitest'

import '@testing-library/jest-dom'

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  // Mock scrollIntoView for cmdk library
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  cleanup()
})

process.env.TZ = 'UTC'

// Mock the usePortal hook to provide a container for tooltips
vi.mock('@/context', async () => {
  const actual = await vi.importActual('@/context')
  return {
    ...actual,
    usePortal: () => ({ portalContainer: document.body }),
    useRouterContext: () => ({
      Link: 'a',
      NavLink: 'a', // Mock NavLink as a simple 'a' tag
      navigate: vi.fn()
    })
  }
})

// Mock the problematic views module that causes circular dependency issues during tests
vi.mock('@/views', () => ({
  // Add minimal mocks for any exports that are imported by components
  default: {}
}))

// Mock specific view files that import components
vi.mock('@/views/repo/pull-request/components/reviewers', () => ({
  PullRequestReviewers: () => null
}))

// Mock form-input components that may have circular dependencies
vi.mock('@harnessio/forms', () => ({
  //  Mock necessary exports from forms package
  default: {},
  InputFactory: class InputFactory {
    createInput() {
      return null
    }
  },
  unsetEmptyStringOutputTransformer: () => (value: any) => value
}))

// Mock form-input to avoid circular dependency with Radio
vi.mock('@/components/form-input', () => ({
  FormInput: {
    Text: () => null,
    Textarea: () => null,
    Number: () => null,
    Radio: () => null,
    Checkbox: () => null
  }
}))

// Mock router context for Link component
vi.mock('@/context/router-context', () => ({
  useRouter: () => ({
    navigate: vi.fn(),
    currentPath: '/'
  })
}))
