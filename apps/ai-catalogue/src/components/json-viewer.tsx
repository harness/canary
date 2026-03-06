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
    <div className="border border-cn-3 rounded-cn-2 overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-cn-sm py-cn-3xs bg-cn-3 border-b border-cn-3">
          <span className="text-cn-size-0 font-medium text-cn-3 uppercase tracking-wider">{title}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="text-cn-size-0 text-cn-4 hover:text-cn-1 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      <pre
        className="px-cn-sm py-cn-xs text-cn-size-0 text-cn-2 bg-cn-1 overflow-auto font-mono leading-relaxed"
        style={{ maxHeight }}
      >
        {jsonString}
      </pre>
    </div>
  )
}
