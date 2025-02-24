import '@testing-library/jest-dom'

jest.mock('*.svg', () => {
  const MockSVG = () => <svg data-testid="mock-svg" />
  MockSVG.displayName = 'MockSVG'
  return MockSVG
})
