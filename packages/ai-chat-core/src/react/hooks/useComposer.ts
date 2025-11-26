import { useState } from 'react'

import { useCurrentThread } from './useCurrentThread'

export function useComposer() {
  const thread = useCurrentThread()
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const send = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!text.trim() || isSubmitting) return

    const messageText = text
    setText('')
    setIsSubmitting(true)

    try {
      await thread.send(messageText)
    } catch (error) {
      console.error('Failed to send message:', error)
      setText(messageText)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    text,
    setText,
    isSubmitting,
    send,
    clear: () => setText(''),
    append: (value: string) => setText(prev => prev + value)
  }
}
