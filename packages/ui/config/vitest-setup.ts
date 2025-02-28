import { cleanup } from '@testing-library/react'

import '@testing-library/jest-dom'

afterEach(() => {
  cleanup()
})

process.env.TZ = 'UTC'
