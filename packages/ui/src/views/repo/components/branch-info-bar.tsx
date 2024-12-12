import { FC } from 'react'
import { Link } from 'react-router-dom'

import { Badge, Button, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, Icon, StyledLink } from '@/components'

interface BranchInfoBarProps {
  defaultBranchName?: string
  spaceId: string
  repoId: string
  currentBranch: {
    behindAhead: {
      ahead: number
      behind: number
    }
  }
}

export const BranchInfoBar: FC<BranchInfoBarProps> = ({
  defaultBranchName = 'main',
  spaceId,
  repoId,
  currentBranch
}) => {
  const { behindAhead } = currentBranch
  const hasBehind = behindAhead.behind > 0
  const hasAhead = behindAhead.ahead > 0

  return (
    <div className="bg-background-2 pl-4 pr-1.5 h-11 border border-borders-1 rounded-md flex justify-between items-center">
      <div className="flex items-center gap-x-1.5">
        <span className="text-foreground-1 text-14 leading-tight">
          This branch is{' '}
          {hasAhead && (
            <>
              <StyledLink to={`/${spaceId}/repos/${repoId}/pull-requests/compare/`}>
                <span className="text-foreground-accent">{behindAhead.ahead} commits ahead of</span>
              </StyledLink>
              {hasBehind && ', '}
            </>
          )}
          {hasBehind && (
            <StyledLink to={`/${spaceId}/repos/${repoId}/pull-requests/compare/`}>
              <span className="text-foreground-accent">{behindAhead.behind} commits behind</span>
            </StyledLink>
          )}
        </span>
        <Badge className="gap-x-1" variant="tertiary" borderRadius="base" size="md">
          <Icon className="text-icons-9" name="branch" size={14} />
          <span className="text-foreground-8">{defaultBranchName}</span>
        </Badge>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="gap-x-2 data-[state=open]:border-borders-8 [&_svg]:data-[state=open]:text-foreground-1 px-2.5"
            variant="outline"
          >
            <Icon name="merged" size={14} />
            <span>Contribute</span>
            <Icon className="text-icons-7 chevron-down" name="chevron-down" size={12} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60 p-4" align="end">
          <div className="flex gap-x-2">
            <div className="flex-shrink-0 border border-borders-4 rounded-full flex items-center justify-center h-6 w-6">
              <Icon name="merged" size={12} />
            </div>
            <div>
              <span className="text-foreground-1 text-14 leading-snug">
                This branch is {behindAhead.ahead} commits ahead of{' '}
              </span>
              <Badge className="gap-x-1" variant="tertiary" borderRadius="base" size="sm">
                <Icon className="text-icons-9" name="branch" size={14} />
                <span className="text-foreground-8">{defaultBranchName}</span>
              </Badge>
              .
              <p className="mt-2.5 text-foreground-4 text-14 leading-tight">
                Open a pull request to contribute your changes upstream.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-2.5 mt-4">
            <Button className="w-full" variant="outline" asChild>
              <Link to={`/${spaceId}/repos/${repoId}/pull-requests/compare/`}>Compare</Link>
            </Button>

            <Button className="w-full" asChild>
              <Link to={`/${spaceId}/repos/${repoId}/pull-requests/compare/`}>Open pull request</Link>
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
