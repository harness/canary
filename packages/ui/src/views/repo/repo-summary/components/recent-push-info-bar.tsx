import { FC } from 'react'
import { Link } from 'react-router-dom'

import { Button, Icon } from '@/components'

interface RecentPush {
  branchName: string
  // Formatted string representing time since push (e.g. "5 minutes ago")
  timeAgo: string
}

interface RecentPushInfoBarProps {
  recentPushes: RecentPush[]
  spaceId: string
  repoId: string
}

export const RecentPushInfoBar: FC<RecentPushInfoBarProps> = ({ recentPushes, spaceId, repoId }) => (
  <div className="rounded-md border border-borders-success bg-background-success px-4">
    {recentPushes.map(({ branchName, timeAgo }, index) => (
      <div className="flex items-center justify-between py-5 last:border-t last:border-borders-8/10" key={index}>
        <div className="flex items-center gap-x-1.5">
          <Icon className="text-icons-success" name="branch" size={14} />
          <span className="text-14 text-foreground-2">
            <span className="font-medium text-foreground-1">{branchName}</span> had recent pushes {timeAgo}
          </span>
        </div>

        <Button asChild>
          <Link to={`/${spaceId}/repos/${repoId}/pull-requests/new?source=${branchName}`}>Compare & pull request</Link>
        </Button>
      </div>
    ))}
  </div>
)
