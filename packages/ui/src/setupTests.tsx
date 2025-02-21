import '@testing-library/jest-dom'

jest.mock('*.svg', () => {
  return () => <svg data-testid="mock-svg" />
})
