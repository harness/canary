import { memo, useEffect, useRef, useState } from 'react'

import { Text, TextProps } from '@components/text'

export interface TypingAnimationProps extends Omit<TextProps, 'children' | 'ref'> {
  text: string
  typingSpeed?: number
  delay?: number
  onComplete?: () => void
}

const TypingAnimationComponent = ({ text, typingSpeed = 50, delay = 0, onComplete, ...rest }: TypingAnimationProps) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    if (hasAnimatedRef.current) {
      setDisplayText(text)
      return
    }

    setDisplayText('')
    setCurrentIndex(0)
    setIsTyping(false)

    const delayTimer = setTimeout(() => {
      setIsTyping(true)
    }, delay)

    return () => clearTimeout(delayTimer)
  }, [text, delay])

  useEffect(() => {
    if (!isTyping) return

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, typingSpeed)

      return () => clearTimeout(timer)
    } else if (currentIndex === text.length) {
      hasAnimatedRef.current = true
      onComplete?.()
    }
  }, [currentIndex, isTyping, text, typingSpeed, onComplete])

  return (
    <Text lineClamp={1} {...rest}>
      {displayText}
    </Text>
  )
}

export const TypingAnimation = memo(TypingAnimationComponent)
