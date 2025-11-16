// src/react/hooks/useContentFocus.ts

import { useEffect, useState } from 'react'

import { ContentFocusState, FocusContext } from '../../runtime/ContentFocusRuntime/ContentFocusRuntime'
import { MessageContent } from '../../types/message'
import { useAssistantRuntime } from './useAssistantRuntime'

export function useContentFocus() {
  const runtime = useAssistantRuntime()
  const [state, setState] = useState<ContentFocusState>(runtime.contentFocus.state)

  useEffect(() => {
    const unsubscribe = runtime.contentFocus.subscribe(() => {
      setState(runtime.contentFocus.state)
    })
    return unsubscribe
  }, [runtime])

  return {
    ...state,
    focus: (content: MessageContent, messageId: string, contentIndex: number, context?: FocusContext) =>
      runtime.contentFocus.focus(content, messageId, contentIndex, context),
    blur: () => runtime.contentFocus.blur(),
    toggle: (content: MessageContent, messageId: string, contentIndex: number, context?: FocusContext) =>
      runtime.contentFocus.toggle(content, messageId, contentIndex, context),
    switchContext: (context: FocusContext) => runtime.contentFocus.switchContext(context),
    focusNext: () => runtime.contentFocus.focusNext(runtime.thread.messages),
    focusPrevious: () => runtime.contentFocus.focusPrevious(runtime.thread.messages)
  }
}

export function useContentFocusState() {
  const runtime = useAssistantRuntime()
  const [state, setState] = useState<ContentFocusState>(runtime.contentFocus.state)

  useEffect(() => {
    const unsubscribe = runtime.contentFocus.subscribe(() => {
      setState(runtime.contentFocus.state)
    })
    return unsubscribe
  }, [runtime])

  return state
}
