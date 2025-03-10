export function useId({ namespace }: { namespace?: string }) {
  return `${namespace}-${crypto.randomUUID()}`
}
