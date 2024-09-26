import React from 'react'
import {
  Text,
  Icon,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@harnessio/canary'

interface BranchListProps {
  name: string
}

interface PageProps {
  name: string
  branchList: BranchListProps[]
  size?: 'default' | 'sm'
  selectBranch: (branch: string) => void
}

export const BranchSelector = ({ ...props }: PageProps) => {
  const { name, branchList, size = 'default', selectBranch } = props

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size={size}
          className="w-full overflow-hidden flex gap-1.5 items-center px-3 bg-muted">
          <Icon name="branch" size={12} className="min-w-[12px] text-tertiary-background" />
          <Text as="p" align="left" className="w-full text-primary/90 truncate">
            {name}
          </Text>
          <Icon name="chevron-down" size={10} className="min-w-[10px] chevron-down ml-0 text-tertiary-background" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {branchList &&
          branchList.map(branch => {
            return <DropdownMenuItem onClick={() => selectBranch(branch.name)}>{branch.name}</DropdownMenuItem>
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
