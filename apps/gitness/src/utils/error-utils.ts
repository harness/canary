import { get } from 'react-hook-form'

export const getErrorMessage = (error: unknown): string | undefined =>
  error ? (get(error, 'data.error', get(error, 'data.message', get(error, 'message', error))) as string) : undefined
