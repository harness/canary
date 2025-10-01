import { useState } from 'react'

export enum UserPreference {
  SPACE_ID = 'spaceId',
  SIDEBAR_WIDTH = 'sidebarWidth',
  CURRENT_USER = 'currentUser',
  DIFF_VIEW_STYLE = 'DIFF_VIEW_STYLE',
  PULL_REQUEST_CREATION_OPTION = 'PULL_REQUEST_CREATION_OPTION',
  PULL_REQUEST_ACTIVITY_FILTER = 'PULL_REQUEST_ACTIVITY_FILTER',
  PULL_REQUEST_ACTIVITY_ORDER = 'PULL_REQUEST_ACTIVITY_ORDER'
}

export function useLocalStorage<T>(key: UserPreference | string, initialValue: T) {
  // Initialize state from localStorage or fallback to initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return initialValue
    }
  })

  // Update both state and localStorage
  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  }

  return [storedValue, setValue] as const
}
