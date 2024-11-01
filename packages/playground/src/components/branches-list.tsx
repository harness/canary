import React from 'react'
import {
  Button,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@harnessio/canary'
import { getInitials } from '../utils/utils'
import { CopyButton } from './copy-button'
import { DivergenceGauge } from './divergence-gauge'
import { CommitCopyActions } from './commit-copy-actions'
import { Link } from 'react-router-dom'

interface BranchProps {
  id: number
  name: string
  sha: string
  timestamp: string
  user: {
    name: string
    avatarUrl?: string
  }
  checks?: {
    done?: number
    total?: number
    status?: number
  }
  behindAhead: {
    behind?: number
    ahead?: number
    default?: boolean
  }
}

interface PageProps {
  branches: BranchProps[]
  spaceId?: string
  repoId?: string
  defaultBranch?: string
}

export const BranchesList = ({ branches, spaceId, repoId, defaultBranch }: PageProps) => {
  const moreActionsTooltip = (branchInfo: BranchProps) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="xs">
            <Icon name="vertical-ellipsis" size={14} className="text-tertiary-background" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="shadow-sm py-2 bg-primary-background border border-gray-800 rounded-[10px] w-[180px]">
          <DropdownMenuGroup>
            <Link
              replace
              to={`/spaces/${spaceId}/repos/${repoId}/pull-requests/compare/${defaultBranch}...${branchInfo.name}`}>
              <DropdownMenuItem className="cursor-pointer">
                <DropdownMenuShortcut className="ml-0">
                  <Icon name="pr-open" className="mr-2" />
                </DropdownMenuShortcut>
                New pull request
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="cursor-pointer">
              <DropdownMenuShortcut className="ml-0">
                <Icon name="cog-6" className="mr-2" />
              </DropdownMenuShortcut>
              View Rules
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <DropdownMenuShortcut className="ml-0">
                <Icon name="edit-pen" className="mr-2" />
              </DropdownMenuShortcut>
              Rename Branch
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  return (
    <Table variant="asStackedList">
      <TableHeader>
        <TableRow>
          <TableHead>Branch</TableHead>
          <TableHead>Updated</TableHead>
          {branches[0]?.checks?.done && branches[0]?.checks?.total && branches[0]?.checks?.status && (
            <TableHead>Check status</TableHead>
          )}
          <TableHead className="text-center box-border">
            <span className="w-[50%] px-1.5 border-r-2 border-gray-20 text-right">Behind</span>
            <span className="w-[50%] px-1.5 text-left">Ahead</span>
          </TableHead>
          {/* since we don't have the data for pull request, we can change data to Commit to match the original gitness */}
          {branches[0]?.sha && <TableHead className="text-center">Commit</TableHead>}
          <TableHead>
            <></>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {branches &&
          branches.map(branch => {
            return (
              <TableRow>
                {/* branch name */}
                <TableCell className="content-center">
                  <div className="flex items-center gap-1.5">
                    <Text wrap="nowrap" truncate className="text-primary/90">
                      <Button variant="secondary" size="xs">
                        &nbsp;
                        {branch.name}
                      </Button>
                    </Text>
                    <CopyButton name={branch.name} />
                  </div>
                </TableCell>
                {/* user avatar and timestamp */}
                <TableCell className="content-center">
                  <div className="flex items-center gap-1.5">
                    <Avatar className="w-5 h-5">
                      {branch.user.avatarUrl && <AvatarImage src={branch.user.avatarUrl} />}
                      <AvatarFallback className="text-xs p-1 text-center">
                        {getInitials(branch.user.name, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <Text wrap="nowrap" truncate className="text-primary">
                      {branch.timestamp}
                    </Text>
                  </div>
                </TableCell>
                {/* checkstatus: show in the playground, hide the check status column if the checks are null in the gitness without data */}
                {branch?.checks?.done && branch?.checks?.total && branch?.checks?.status && (
                  <TableCell className="content-center">
                    <div className="flex gap-1.5 items-center">
                      <Icon name="tick" size={11} className="text-success" />
                      <Text size={2} wrap="nowrap" truncate className="text-tertiary-background">
                        {branch?.checks?.done} / {branch?.checks?.total}
                      </Text>
                    </div>
                  </TableCell>
                )}
                {/* calculated divergence bar & default branch */}
                <TableCell className="content-center">
                  <div className="flex gap-1.5 items-center content-center align-middle">
                    {branch.behindAhead.default ? (
                      <Badge
                        variant="outline"
                        size="xs"
                        className="rounded-full font-normal text-xs p-2 h-5 text-tertiary-background text-center m-auto">
                        Default
                      </Badge>
                    ) : (
                      <DivergenceGauge behindAhead={branch.behindAhead} />
                    )}
                  </div>
                </TableCell>
                {/* change commit data instead: SHA */}
                {branch.sha && (
                  <TableCell className="content-center">
                    <div className="flex gap-1.5 items-center justify-center">
                      {/* <Icon name="open-pr" size={11} className="text-success" /> */}
                      <Text wrap="nowrap" size={1} truncate className="text-tertiary-background font-mono">
                        <CommitCopyActions sha={branch.sha} />
                      </Text>
                    </div>
                  </TableCell>
                )}
                <TableCell className="content-center">{moreActionsTooltip(branch)}</TableCell>
              </TableRow>
            )
          })}
      </TableBody>
    </Table>
  )
}
