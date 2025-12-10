import { useEffect, useState } from 'react'

function getVisiblePropEvent(): { hidden?: string; visibilityChange?: string } {
  // Set the name of the hidden property and the change event for visibility
  let hidden: string | undefined = undefined
  let visibilityChange: string | undefined = undefined
  if (typeof document.hidden !== 'undefined') {
    // Opera 12.10 and Firefox 18 and later support
    hidden = 'hidden'
    visibilityChange = 'visibilitychange'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } else if (typeof (document as any).msHidden !== 'undefined') {
    hidden = 'msHidden'
    visibilityChange = 'msvisibilitychange'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } else if (typeof (document as any).webkitHidden !== 'undefined') {
    hidden = 'webkitHidden'
    visibilityChange = 'webkitvisibilitychange'
  }
  return { hidden, visibilityChange }
}

/**
 * Hook to detect if the current browser tab is visible or hidden.
 * Uses the Page Visibility API to track tab visibility changes.
 *
 * @returns boolean - true if tab is visible, false if hidden
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isTabVisible = useTabVisible()
 *
 *   useEffect(() => {
 *     if (isTabVisible) {
 *       // Resume operations when tab becomes visible
 *     } else {
 *       // Pause operations when tab is hidden
 *     }
 *   }, [isTabVisible])
 * }
 * ```
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
 */
export function useTabVisible(): boolean {
  const [visible, setVisibility] = useState<boolean>(true)

  useEffect(() => {
    const { hidden, visibilityChange } = getVisiblePropEvent()

    function handleVisibilityChange(): void {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (hidden && (document as any)[hidden]) {
        setVisibility(false)
      } else {
        setVisibility(true)
      }
    }

    if (
      typeof document.addEventListener === 'undefined' ||
      typeof hidden === 'undefined' ||
      typeof visibilityChange === 'undefined'
    ) {
      console.warn('The Page Visibility API is not supported')
    } else {
      // Handle page visibility change
      document.addEventListener(visibilityChange, handleVisibilityChange, false)
      return () => {
        document.removeEventListener(visibilityChange, handleVisibilityChange, false)
      }
    }
  }, [])

  return visible
}
