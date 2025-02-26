import { FC } from 'react'
import { Link } from 'react-router-dom'

import { Badge, Button, DropdownMenu, Icon, StyledLink } from '@/components'
import { BranchSelectorListItem } from '@/views'

interface BranchInfoBarProps {
  defaultBranchName?: string
  repoId: string
  spaceId: string
  selectedBranchTag: BranchSelectorListItem
  currentBranchDivergence: {
    ahead: number
    behind: number
  }
}

export const BranchInfoBar: FC<BranchInfoBarProps> = ({
  defaultBranchName = 'main',
  repoId,
  spaceId,
  selectedBranchTag,
  currentBranchDivergence
}) => {
  const { behind, ahead } = currentBranchDivergence
  const hasBehind = !!behind
  const hasAhead = !!ahead

  return (
    <div className="flex h-11 items-center justify-between rounded-md border border-borders-1 bg-background-2 pl-4 pr-1.5">
      <div className="flex items-center gap-x-1.5">
        <span className="text-14 leading-tight text-foreground-1">
          This branch is{' '}
          {hasAhead && (
            <>
              <StyledLink to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/`}>
                <span className="text-foreground-accent">{ahead} commits ahead of</span>
              </StyledLink>
              {hasBehind && ', '}
            </>
          )}
          {hasBehind && (
            <StyledLink to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/`}>
              <span className="text-foreground-accent">{behind} commits behind</span>
            </StyledLink>
          )}
        </span>
        <Badge className="gap-x-1" variant="tertiary" borderRadius="base" size="md">
          <Icon className="text-icons-9" name="branch" size={14} />
          <span className="text-foreground-8">{defaultBranchName}</span>
        </Badge>
      </div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button
            className="group/contribute gap-x-2 px-2.5 data-[state=open]:border-borders-9 data-[state=open]:text-foreground-8 [&_svg]:data-[state=open]:text-icons-9"
            variant="outline"
          >
            <Icon name="merged" size={14} />
            <span>Contribute</span>
            <Icon
              className="chevron-down text-icons-7 group-data-[state=open]/contribute:text-icons-2"
              name="chevron-down"
              size={12}
            />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-60 p-4" align="end">
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
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}
