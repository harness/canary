import { getErrorMessage } from '../error-utils'

// Define a custom error type for testing
interface CustomError {
  data?: {
    error?: string
    message?: string
  }
  message?: string
}

describe('getErrorMessage', () => {
  it('should handle undefined error', () => {
    expect(getErrorMessage(undefined)).toBeUndefined()
  })

  it('should handle null error', () => {
    expect(getErrorMessage(null)).toBeUndefined()
  })

  it('should extract error from data.error', () => {
    const error: CustomError = { data: { error: 'Test error message' } }
    expect(getErrorMessage(error)).toBe('Test error message')
  })

  it('should extract error from data.message', () => {
    const error: CustomError = { data: { message: 'Test message' } }
    expect(getErrorMessage(error)).toBe('Test message')
  })

  it('should extract error from message', () => {
    const error: CustomError = { message: 'Direct message' }
    expect(getErrorMessage(error)).toBe('Direct message')
  })

  it('should return error as string if no structured format is found', () => {
    const error = 'Plain error string'
    expect(getErrorMessage(error)).toBe('Plain error string')
  })
})
