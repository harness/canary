import React, {
  ComponentPropsWithoutRef,
  createContext,
  ElementRef,
  forwardRef,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

import { IconV2 } from '@components/icon-v2'
import { Shimmer } from '@components/shimmer'
import { Text } from '@components/text'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { cn } from '@utils/cn'

interface ReasoningContextValue {
  isStreaming: boolean
  isOpen: boolean
  duration: number | undefined
}

const ReasoningContext = createContext<ReasoningContextValue | null>(null)

const useReasoning = () => {
  const context = useContext(ReasoningContext)
  if (!context) {
    throw new Error('Reasoning components must be used within Reasoning.Root')
  }
  return context
}

const AUTO_CLOSE_DELAY = 1000
const MS_IN_S = 1000

export type ReasoningRootProps = ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root> & {
  isStreaming?: boolean
  duration?: number
}

const ReasoningRoot = forwardRef<ElementRef<typeof CollapsiblePrimitive.Root>, ReasoningRootProps>(
  (
    {
      className,
      isStreaming = false,
      open,
      defaultOpen = true,
      onOpenChange,
      duration: durationProp,
      children,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(open ?? defaultOpen)
    const [duration, setDuration] = useState<number | undefined>(durationProp)
    const [hasAutoClosed, setHasAutoClosed] = useState(false)
    const startTimeRef = useRef<number | null>(null)

    // Sync with controlled open prop
    useEffect(() => {
      if (open !== undefined) {
        setIsOpen(open)
      }
    }, [open])

    // Sync with controlled duration prop
    useEffect(() => {
      if (durationProp !== undefined) {
        setDuration(durationProp)
      }
    }, [durationProp])

    // Track duration when streaming starts and ends
    useEffect(() => {
      if (isStreaming) {
        if (startTimeRef.current === null) {
          startTimeRef.current = Date.now()
        }
      } else if (startTimeRef.current !== null) {
        setDuration(Math.ceil((Date.now() - startTimeRef.current) / MS_IN_S))
        startTimeRef.current = null
      }
    }, [isStreaming])

    // Auto-close when streaming ends (once only)
    useEffect(() => {
      if (defaultOpen && !isStreaming && isOpen && !hasAutoClosed) {
        const timer = setTimeout(() => {
          setIsOpen(false)
          setHasAutoClosed(true)
          onOpenChange?.(false)
        }, AUTO_CLOSE_DELAY)

        return () => clearTimeout(timer)
      }
    }, [isStreaming, isOpen, defaultOpen, hasAutoClosed, onOpenChange])

    const handleOpenChange = useCallback(
      (newOpen: boolean) => {
        setIsOpen(newOpen)
        onOpenChange?.(newOpen)
      },
      [onOpenChange]
    )

    return (
      <ReasoningContext.Provider value={{ isStreaming, isOpen, duration }}>
        <CollapsiblePrimitive.Root
          ref={ref}
          className={cn('cn-reasoning', className)}
          open={isOpen}
          onOpenChange={handleOpenChange}
          {...props}
        >
          {children}
        </CollapsiblePrimitive.Root>
      </ReasoningContext.Provider>
    )
  }
)

ReasoningRoot.displayName = 'ReasoningRoot'

export type ReasoningTriggerProps = ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger> & {
  getThinkingMessage?: (isStreaming: boolean, duration?: number) => ReactNode
}

const defaultGetThinkingMessage = (isStreaming: boolean, duration?: number): ReactNode => {
  if (isStreaming || duration === 0) {
    return (
      <Shimmer variant={'caption-light'} color={'foreground-3'} duration={1}>
        Thinking...
      </Shimmer>
    )
  }
  if (duration === undefined) {
    return (
      <Text variant={'caption-light'} color={'foreground-3'}>
        Thought for a few seconds
      </Text>
    )
  }
  return (
    <Text variant={'caption-light'} color={'foreground-3'}>
      Thought for {duration} seconds
    </Text>
  )
}

const ReasoningTrigger = forwardRef<ElementRef<typeof CollapsiblePrimitive.Trigger>, ReasoningTriggerProps>(
  ({ className, children, getThinkingMessage = defaultGetThinkingMessage, ...props }, ref) => {
    const { isStreaming, isOpen, duration } = useReasoning()

    return (
      <CollapsiblePrimitive.Trigger ref={ref} className={cn('cn-reasoning-trigger', className)} {...props}>
        {children ?? (
          <>
            <IconV2
              name="nav-arrow-down"
              size="xs"
              className={cn('cn-reasoning-trigger-indicator', isOpen && 'cn-reasoning-trigger-indicator-open')}
            />
            {getThinkingMessage(isStreaming, duration)}
          </>
        )}
      </CollapsiblePrimitive.Trigger>
    )
  }
)

ReasoningTrigger.displayName = 'ReasoningTrigger'

export type ReasoningContentProps = ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content> & {
  children: React.ReactNode
}

const ReasoningContent = forwardRef<ElementRef<typeof CollapsiblePrimitive.Content>, ReasoningContentProps>(
  ({ className, children, ...props }, ref) => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const { isStreaming } = useReasoning()

    // Auto-scroll to bottom when content changes during streaming
    useEffect(() => {
      if (isStreaming && scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }, [children, isStreaming])

    return (
      <CollapsiblePrimitive.Content ref={ref} className={cn('cn-reasoning-content', className)} {...props}>
        <div ref={scrollRef} className="max-h-[200px] overflow-y-auto scrollbar-hidden">
          {children}
        </div>
      </CollapsiblePrimitive.Content>
    )
  }
)

ReasoningContent.displayName = 'ReasoningContent'

export const Reasoning = {
  Root: ReasoningRoot,
  Trigger: ReasoningTrigger,
  Content: ReasoningContent
}

export { useReasoning }
