import { useState } from 'react'

interface JsonViewerProps {
  data: unknown
  title?: string
  maxHeight?: string
}

export function JsonViewer({ data, title, maxHeight = '200px' }: JsonViewerProps) {
  const [copied, setCopied] = useState(false)
  const jsonString = JSON.stringify(data, null, 2)

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border border-cn-borders-3 rounded-md overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-cn-background-3 border-b border-cn-borders-3">
          <span className="text-[11px] font-medium text-cn-foreground-3 uppercase tracking-wider">{title}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="text-[11px] text-cn-foreground-4 hover:text-cn-foreground-1 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      <pre
        className="px-3 py-2 text-xs text-cn-foreground-2 bg-cn-background-1 overflow-auto font-mono leading-relaxed"
        style={{ maxHeight }}
      >
        {jsonString}
      </pre>
    </div>
  )
}
