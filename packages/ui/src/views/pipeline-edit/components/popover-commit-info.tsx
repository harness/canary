import { Avatar } from '@/components'

export const PopoverCommitInfo = {
  Root: function Root({ children }: { children: React.ReactNode }) {
    return <>{children}</>
  },

  CommitInfo: function Root({
    avatarUrl,
    initials,
    authorName,
    commit
  }: {
    avatarUrl?: string
    initials?: string
    authorName?: string
    commit?: string
  }) {
    return (
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-x-3">
          <Avatar.Root size="8" className="inline-flex">
            {avatarUrl ? <Avatar.Image src={avatarUrl} alt="@shadcn" /> : <Avatar.Fallback>{initials}</Avatar.Fallback>}
          </Avatar.Root>
          <span>{authorName}</span>
        </div>
        <div className="text-primary-muted">{commit}</div>
      </div>
    )
  },

  CommitMessage: function Root({ children }: { children: string | React.ReactNode }) {
    return <div className="bg-background p-3">{children}</div>
  }
}
