import { vi } from 'vitest'

Object.defineProperty(document, 'queryCommandSupported', {
  value: vi.fn().mockImplementation((command: string) => {
    return command === 'copy' || command === 'cut'
  }),
  writable: true
})
