import { Link } from 'react-router-dom'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text
} from '@harnessio/canary'
import { CommitCopyActions } from '@harnessio/ui/components'

import { getInitials } from '../utils/utils'
import { CopyButton } from './copy-button'
import { DivergenceGauge } from './divergence-gauge'

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
        <DropdownMenuContent className="bg-primary-background w-[180px] rounded-[10px] border border-gray-800 py-2 shadow-sm">
          <DropdownMenuGroup>
            <Link
              replace
              to={`/spaces/${spaceId}/repos/${repoId}/pull-requests/compare/${defaultBranch}...${branchInfo.name}`}
            >
              <DropdownMenuItem className="cursor-pointer">
                <DropdownMenuShortcut className="ml-0">
                  <Icon name="pr-open" className="mr-2" />
                </DropdownMenuShortcut>
                New pull request
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem title="Coming soon" className="cursor-pointer">
              <DropdownMenuShortcut className="ml-0">
                <Icon name="cog-6" className="mr-2" />
              </DropdownMenuShortcut>
              View Rules
            </DropdownMenuItem>
            <DropdownMenuItem title="Coming soon" className="cursor-pointer">
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
          <TableHead className="box-border text-center">
            <span className="border-gray-20 w-[50%] border-r-2 px-1.5 text-right">Behind</span>
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
              <TableRow key={branch.id}>
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
                    <Avatar className="size-5">
                      {branch.user.avatarUrl && <AvatarImage src={branch.user.avatarUrl} />}
                      <AvatarFallback className="p-1 text-center text-xs">
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
                    <div className="flex items-center gap-1.5">
                      <Icon name="tick" size={11} className="text-success" />
                      <Text size={2} wrap="nowrap" truncate className="text-tertiary-background">
                        {branch?.checks?.done} / {branch?.checks?.total}
                      </Text>
                    </div>
                  </TableCell>
                )}
                {/* calculated divergence bar & default branch */}
                <TableCell className="content-center">
                  <div className="flex content-center items-center gap-1.5 align-middle">
                    {branch.behindAhead.default ? (
                      <Badge
                        variant="outline"
                        size="xs"
                        className="text-tertiary-background m-auto h-5 rounded-full p-2 text-center text-xs font-normal"
                      >
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
                    <div className="flex items-center justify-center gap-1.5">
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
