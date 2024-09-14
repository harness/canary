import { useEffect } from 'react'

function useShortcut(shortcutLetter: string, callback: () => void) {
  useEffect(() => {
    const handleShortcutKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === shortcutLetter.toLowerCase()) {
        e.preventDefault() // Prevents default browser action
        callback()
      }
    }

    window.addEventListener('keydown', handleShortcutKey)

    return () => {
      window.removeEventListener('keydown', handleShortcutKey)
    }
  }, [shortcutLetter, callback])
}

export default useShortcut
