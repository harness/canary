import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'

import '@testing-library/jest-dom/vitest'

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  cleanup()
})
