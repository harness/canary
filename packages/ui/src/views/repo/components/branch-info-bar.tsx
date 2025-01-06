import { FC } from 'react'
import { Link } from 'react-router-dom'

import { Badge, Button, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, Icon, StyledLink } from '@/components'
import { IBranchSelectorStore } from '@/views'

interface BranchInfoBarProps {
  defaultBranchName?: string
  useRepoBranchesStore: () => IBranchSelectorStore
  currentBranchDivergence: {
    ahead: number
    behind: number
  }
}

export const BranchInfoBar: FC<BranchInfoBarProps> = ({
  defaultBranchName = 'main',
  useRepoBranchesStore,
  currentBranchDivergence
}) => {
  const { behind, ahead } = currentBranchDivergence
  const { repoId, spaceId, selectedBranchTag } = useRepoBranchesStore()
  const hasBehind = !!behind
  const hasAhead = !!ahead

  return (
    <div className="flex h-11 items-center justify-between rounded-md border border-borders-1 bg-background-2 pl-4 pr-1.5">
      <div className="flex items-center gap-x-1.5">
        <span className="text-14 leading-tight text-foreground-1">
          This branch is{' '}
          {hasAhead && (
            <>
              <StyledLink to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pull-requests/compare/`}>
                <span className="text-foreground-accent">{ahead} commits ahead of</span>
              </StyledLink>
              {hasBehind && ', '}
            </>
          )}
          {hasBehind && (
            <StyledLink to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pull-requests/compare/`}>
              <span className="text-foreground-accent">{behind} commits behind</span>
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
            className="gap-x-2 px-2.5 data-[state=open]:border-borders-8 [&_svg]:data-[state=open]:text-foreground-1"
            variant="outline"
          >
            <Icon name="merged" size={14} />
            <span>Contribute</span>
            <Icon className="chevron-down text-icons-7" name="chevron-down" size={12} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60 p-4" align="end">
          <div className="flex gap-x-2">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full border border-borders-4">
              <Icon name="merged" size={12} />
            </div>
            <div>
              <span className="text-14 leading-snug text-foreground-1">This branch is {ahead} commits ahead of </span>
              <Badge className="gap-x-1" variant="tertiary" borderRadius="base" size="sm">
                <Icon className="text-icons-9" name="branch" size={14} />
                <span className="text-foreground-8">{defaultBranchName}</span>
              </Badge>
              .
              <p className="mt-2.5 text-14 leading-tight text-foreground-4">
                Open a pull request to contribute your changes upstream.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-y-2.5">
            <Button className="w-full" variant="outline" asChild>
              <Link
                to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/${defaultBranchName}...${selectedBranchTag?.name}`}
              >
                Compare
              </Link>
            </Button>

            <Button className="w-full" asChild>
              <Link
                to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/${defaultBranchName}...${selectedBranchTag?.name}`}
              >
                Open pull request
              </Link>
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
