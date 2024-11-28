import { useState } from 'react'

function useLocalStorage<T>(key: string, initialValue: T) {
  // Initialize state from localStorage or fallback to initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  })

  // Update both state and localStorage
  const setValue = (value: T) => {
    setStoredValue(value)
    localStorage.setItem(key, JSON.stringify(value))
  }

  return [storedValue, setValue] as const
}

export default useLocalStorage
