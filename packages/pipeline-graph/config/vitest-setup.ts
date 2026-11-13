import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll } from 'vitest'

import '@testing-library/jest-dom'

import { installObserverMocks, resetObservers } from './test-observers'

beforeAll(() => {
  // jsdom lacks ResizeObserver, which the graph relies on.
  installObserverMocks()
})

afterEach(() => {
  cleanup()
  resetObservers()
})

process.env.TZ = 'UTC'
