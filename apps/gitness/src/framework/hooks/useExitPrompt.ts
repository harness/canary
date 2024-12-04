import { useCallback, useEffect } from 'react'
import { useBlocker } from 'react-router-dom'

import { useExitConfirm } from './useExitConfirm'

export interface UseExitPromptProps {
  title?: string
  subtitle?: string
  confirmText?: string
  cancelText?: string
}

export const useExitPrompt = (props: UseExitPromptProps & { isDirty: boolean }) => {
  const { isDirty, ...restExitPromptProps } = props

  const blocker = useBlocker(isDirty)
  const { show } = useExitConfirm()

  const confirmExit = useCallback(() => {
    if (!isDirty) return Promise.resolve(true)
    return new Promise<boolean>(resolve => {
      show({
        ...restExitPromptProps,
        onConfirm: () => {
          resolve(true)
        },
        onCancel: () => {
          resolve(false)
        }
      })
    })
  }, [isDirty, show, restExitPromptProps])

  // handle route change
  useEffect(() => {
    if (blocker.state === 'blocked') {
      confirmExit().then(result => {
        if (result) blocker.proceed()
        else blocker.reset()
      })
    }
  }, [blocker, confirm])

  // handle page exit
  useEffect(() => {
    const onBeforeUnload = (e: Event) => {
      if (isDirty) {
        e.preventDefault()
      }
    }

    window.addEventListener('beforeunload', onBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [isDirty])

  return {
    confirmExit
  }
}
