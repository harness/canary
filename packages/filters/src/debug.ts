import { stringify } from 'flatted' // Import flatted library

const isDebugEnabled = () => {
  // Check if localStorage is available
  try {
    if (typeof localStorage === 'undefined') {
      return false
    }
    const test = 'debug-test'
    localStorage.setItem(test, test)
    const isStorageAvailable = localStorage.getItem(test) === test
    localStorage.removeItem(test)
    if (!isStorageAvailable) {
      return false
    }
  } catch (error) {
    console.error('[debugUtils]: Debug mode is disabled (localStorage unavailable).', error)
    return false
  }
  const debug = localStorage.getItem('debug') ?? ''
  return debug.includes('enable-debug') // Change this as needed
}

const enabled = isDebugEnabled()

// Utility function to log messages with optional arguments.
export function debug(message: string, ...args: any[]) {
  if (!enabled) {
    return
  }
  const msg = sprintf(message, ...args)
  performance.mark(msg)
  console.log(`[DEBUG]: ${msg}`, ...args)
}

// Utility function to log warnings.
export function warn(message: string, ...args: any[]) {
  if (!enabled) {
    return
  }
  console.warn(`[WARN]: ${message}`, ...args)
}

// Function to format messages like `sprintf`.
export function sprintf(base: string, ...args: any[]) {
  return base.replace(/%[sfdO]/g, match => {
    const arg = args.shift()
    if (match === '%O' && arg) {
      try {
        return stringify(arg) // Use `flatted.stringify` instead of `JSON.stringify`
      } catch (e) {
        console.error('Error stringifying object', e)
        return '[Circular Object]'
      }
    } else {
      return String(arg)
    }
  })
}
