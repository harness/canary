import type { ToolError } from './types.js'

export function jsonResult(data: unknown, isError = false) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data) }],
    ...(isError ? { isError: true } : {})
  }
}

export function errorResult(error: ToolError) {
  return jsonResult(error, true)
}
