import type { Problem } from '../components/pipeline-studio/problems'

export const problemsMock: Problem[] = [
  {
    severity: 'error',
    message: 'Error message',
    position: {
      row: 10,
      column: 30
    }
  },
  {
    severity: 'warning',
    message: 'Warning message',
    position: {
      row: 11,
      column: 33
    }
  },
  {
    severity: 'info',
    message: 'Info message',
    position: {
      row: 133,
      column: 444
    }
  }
]
