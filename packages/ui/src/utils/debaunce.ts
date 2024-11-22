export const debounce = <T extends (...args: Parameters<T>) => void>(func: T, wait: number): T => {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return ((...args: Parameters<T>) => {
    const later = () => {
      timeout = null
      func(...args)
    }
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }) as T
}
