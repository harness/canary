import { useState } from 'react'

interface Prompt {
  text: string
}

interface PromptsContent {
  type: 'prompts'
  data: {
    title?: string
    prompts: Prompt[]
  }
}

export const PromptsRenderer = ({ content }: { content: PromptsContent }) => {
  const prompts = content?.data?.prompts ?? []
  const title = content?.data?.title ?? 'Suggested Prompts'
  const [activeIndex, setActiveIndex] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || prompts.length === 0) return null

  return (
    <div className="border border-cn-borders-3 rounded-lg overflow-hidden max-w-[480px]">
      <div className="flex justify-between items-center px-3.5 py-2.5 border-b border-cn-borders-3">
        <span className="text-sm font-medium text-cn-foreground-1">{title}</span>
        <div className="flex items-center gap-1">
          <span className="text-xs text-cn-foreground-3 tabular-nums">
            {activeIndex + 1}/{prompts.length}
          </span>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="ml-2 text-xs text-cn-foreground-4 hover:text-cn-foreground-2"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="px-3.5 py-2.5">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`w-full text-left rounded-md px-2.5 py-2 mb-1 last:mb-0 transition-colors text-sm ${
              index === activeIndex
                ? 'bg-cn-background-3 text-cn-foreground-1'
                : 'text-cn-foreground-3 hover:text-cn-foreground-2'
            }`}
          >
            {prompt.text}
          </button>
        ))}
      </div>
    </div>
  )
}
