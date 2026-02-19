import '@testing-library/jest-dom'

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))

// Mock requestIdleCallback
global.requestIdleCallback = jest.fn(cb => {
  return setTimeout(cb, 0)
})

global.cancelIdleCallback = jest.fn(id => {
  clearTimeout(id)
})
