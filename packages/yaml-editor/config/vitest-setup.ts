import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'

import '@testing-library/jest-dom'

import { installObserverMocks, resetObservers } from './test-observers'

beforeAll(() => {
  // jsdom lacks these APIs the editor components touch.
  installObserverMocks()
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  cleanup()
  resetObservers()
})

process.env.TZ = 'UTC'
