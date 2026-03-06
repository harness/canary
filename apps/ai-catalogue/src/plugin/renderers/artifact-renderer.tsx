import { ArtifactContent, Message } from '@harnessio/ai-chat-core'

export const ArtifactRenderer = ({ content }: { message: Message; content: ArtifactContent }) => {
  const artifactData = content.data

  return (
    <div className="flex items-center gap-2 border border-cn-borders-3 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-cn-background-3 transition-colors max-w-[320px]">
      <div className="flex items-center justify-center w-7 h-7 rounded bg-cn-background-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm text-cn-foreground-1 truncate">{artifactData.displayData.name}</span>
        {artifactData.displayData.type && (
          <span className="text-xs text-cn-foreground-3">{artifactData.displayData.type}</span>
        )}
      </div>
    </div>
  )
}
