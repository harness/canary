export const SEARCH_HIT_TOKEN_BUDGET = 400
export const GET_COMPONENT_TOKEN_BUDGET = 1500

export function estimateTokens(value: unknown): number {
  return Math.ceil(JSON.stringify(value).length / 4)
}

function truncateString(value: string, maxChars: number): string {
  if (value.length <= maxChars) return value
  return `${value.slice(0, Math.max(0, maxChars - 1)).trimEnd()}…`
}

export function enforceTokenBudget<T>(value: T, budget: number): T {
  if (estimateTokens(value) <= budget) return value

  const clone = JSON.parse(JSON.stringify(value)) as T
  const visit = (node: unknown): void => {
    if (typeof node !== 'object' || node === null) return
    if (Array.isArray(node)) {
      while (node.length > 1 && estimateTokens(clone) > budget) node.pop()
      for (const item of node) visit(item)
      return
    }

    for (const [key, child] of Object.entries(node)) {
      if (typeof child === 'string' && estimateTokens(clone) > budget) {
        ;(node as Record<string, unknown>)[key] = truncateString(child, Math.max(24, Math.floor(child.length / 2)))
      } else {
        visit(child)
      }
    }
  }

  let guard = 0
  while (estimateTokens(clone) > budget && guard < 8) {
    visit(clone)
    guard += 1
  }
  return clone
}
