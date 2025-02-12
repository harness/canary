import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

import '@testing-library/jest-dom'

globalThis.document.queryCommandSupported = () => true

afterEach(() => {
  cleanup()
})
