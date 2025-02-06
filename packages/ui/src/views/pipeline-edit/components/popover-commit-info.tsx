import { Avatar, AvatarFallback, AvatarImage } from '@/components'

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
          <Avatar size="8" className="inline-flex">
            <AvatarImage src={avatarUrl} alt="@shadcn" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
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
