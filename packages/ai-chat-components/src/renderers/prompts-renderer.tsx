import { useCurrentThread } from '@harnessio/ai-chat-core'
import { Button, Card, IconV2, Text } from '@harnessio/ui/components'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface Prompt {
  text: string
}

interface PromptsContent {
  data: {
    title?: string
    prompts: Prompt[]
  }
}

export const PromptsRenderer = ({ content }: { content: PromptsContent }) => {
  const prompts = useMemo(() => content?.data?.prompts ?? [], [content?.data?.prompts])
  const title = content?.data?.title ?? 'Explore Further'
  const totalPrompts = prompts.length

  const thread = useCurrentThread()
  const containerRef = useRef<HTMLDivElement>(null)
  const promptRefs = useRef<(HTMLButtonElement | null)[]>([])

  const [activeIndex, setActiveIndex] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    containerRef.current?.focus()
  }, [])

  useEffect(() => {
    const el = promptRefs.current[activeIndex]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [activeIndex])

  const handleSelect = useCallback(
    (index: number) => {
      const prompt = prompts[index]
      if (prompt) {
        thread.send(prompt.text)
        setDismissed(true)
      }
    },
    [prompts, thread]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (dismissed) return
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          setActiveIndex(prev => Math.max(0, prev - 1))
          break
        case 'ArrowDown':
          e.preventDefault()
          setActiveIndex(prev => Math.min(totalPrompts - 1, prev + 1))
          break
        case 'Enter':
          e.preventDefault()
          handleSelect(activeIndex)
          break
        case 'Escape':
          e.preventDefault()
          setDismissed(true)
          break
      }
    },
    [dismissed, totalPrompts, activeIndex, handleSelect]
  )

  if (dismissed || totalPrompts === 0) {
    return null
  }

  return (
    <Card.Root size="sm" interactive={false} className="max-w-[560px] overflow-hidden focus:outline-none">
      <div ref={containerRef} tabIndex={0} onKeyDown={handleKeyDown} className="flex flex-col">
        <div className="flex justify-between items-center px-3.5 py-2.5 border-b border-cn-borders-3 shrink-0">
          <Text variant="body-strong" color="foreground-1" className="text-[13px]">
            {title}
          </Text>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="xs"
              iconOnly
              ignoreIconOnlyTooltip
              onClick={() => setActiveIndex(prev => Math.max(0, prev - 1))}
              disabled={activeIndex === 0}
            >
              <IconV2 name="nav-arrow-up" size="xs" />
            </Button>
            <Text color="foreground-3" className="text-xs tabular-nums min-w-[3ch] text-center">
              {activeIndex + 1}/{totalPrompts}
            </Text>
            <Button
              variant="ghost"
              size="xs"
              iconOnly
              ignoreIconOnlyTooltip
              onClick={() => setActiveIndex(prev => Math.min(totalPrompts - 1, prev + 1))}
              disabled={activeIndex === totalPrompts - 1}
            >
              <IconV2 name="nav-arrow-down" size="xs" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3.5 py-2.5">
          {prompts.map((prompt, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={index}
                ref={el => {
                  promptRefs.current[index] = el
                }}
                type="button"
                onClick={() => {
                  setActiveIndex(index)
                  handleSelect(index)
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={[
                  'w-full text-left rounded-md px-2.5 py-2 mb-1 last:mb-0 transition-colors duration-150',
                  isActive ? 'bg-cn-background-3 opacity-100' : 'bg-transparent opacity-50 hover:opacity-75'
                ].join(' ')}
              >
                <Text color="foreground-1" className="text-[13px] leading-relaxed">
                  {prompt.text}
                </Text>
              </button>
            )
          })}
        </div>
      </div>
    </Card.Root>
  )
}
