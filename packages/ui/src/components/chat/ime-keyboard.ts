import { useCallback, useRef, type CompositionEvent, type KeyboardEvent } from 'react'

/** True when Enter is part of IME candidate confirmation, not intentional submit. */
export function shouldBlockEnterForIme(e: KeyboardEvent<Element>, compositionSessionActive: boolean): boolean {
  return compositionSessionActive || e.nativeEvent.isComposing || e.keyCode === 229
}

/**
 * Tracks an IME composition session. WebKit can fire compositionend before the
 * confirming Enter keydown (isComposing already false); defer clearing the ref
 * one tick so that Enter is still swallowed.
 */
export function useImeCompositionSession() {
  const composingRef = useRef(false)
  const endTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onCompositionStart = useCallback((_e: CompositionEvent) => {
    if (endTimerRef.current) {
      clearTimeout(endTimerRef.current)
      endTimerRef.current = null
    }
    composingRef.current = true
  }, [])

  const onCompositionEnd = useCallback((_e: CompositionEvent) => {
    endTimerRef.current = setTimeout(() => {
      composingRef.current = false
      endTimerRef.current = null
    }, 0)
  }, [])

  return { composingRef, onCompositionStart, onCompositionEnd }
}
