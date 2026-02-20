import { Avatar } from '@harnessio/ui/components'

export const PopoverCommitInfo = {
  Root: function Root({ children }: { children: React.ReactNode }) {
    return <>{children}</>
  },

  CommitInfo: function Root({
    avatarUrl,
    authorName,
    commit
  }: {
    avatarUrl?: string
    authorName?: string
    commit?: string
  }) {
    return (
      <div className="flex items-center justify-between p-cn-sm">
        <div className="flex items-center gap-x-cn-sm">
          <Avatar name={authorName} src={avatarUrl} size="lg" rounded />
          <span>{authorName}</span>
        </div>
        <div className="text-cn-3">{commit}</div>
      </div>
    )
  },

  CommitMessage: function Root({ children }: { children: string | React.ReactNode }) {
    return <div className="bg-cn-1 p-cn-sm">{children}</div>
  }
}
