import { useEffect, useState } from 'react'

import { ContentFocusState, FocusContext } from '../../runtime/ContentFocusRuntime/ContentFocusRuntime'
import { Message, MessageContent } from '../../types/message'
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
    focus: (content: MessageContent, message: Message, contentIndex: number, context?: FocusContext) =>
      runtime.contentFocus.focus(content, message, contentIndex, context),
    blur: () => runtime.contentFocus.blur(),
    toggle: (content: MessageContent, message: Message, contentIndex: number, context?: FocusContext) =>
      runtime.contentFocus.toggle(content, message, contentIndex, context),
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
