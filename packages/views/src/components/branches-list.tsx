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
  Text
} from '@harnessio/canary'
import { CommitCopyActions, CopyButton, Table } from '@harnessio/ui/components'

import { getInitials } from '../utils/utils'
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
        <DropdownMenuContent className="w-[180px] rounded-[10px] border border-gray-800 bg-primary-background py-2 shadow-sm">
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
    <Table.Root variant="asStackedList">
      <Table.Header>
        <Table.Row>
          <Table.Head>Branch</Table.Head>
          <Table.Head>Updated</Table.Head>
          {branches[0]?.checks?.done && branches[0]?.checks?.total && branches[0]?.checks?.status && (
            <Table.Head>Check status</Table.Head>
          )}
          <Table.Head className="box-border text-center">
            <span className="border-gray-20 w-[50%] border-r-2 px-1.5 text-right">Behind</span>
            <span className="w-[50%] px-1.5 text-left">Ahead</span>
          </Table.Head>
          {/* since we don't have the data for pull request, we can change data to Commit to match the original gitness */}
          {branches[0]?.sha && <Table.Head className="text-center">Commit</Table.Head>}
          <Table.Head>
            <></>
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {branches &&
          branches.map(branch => {
            return (
              <Table.Row key={branch.id}>
                {/* branch name */}
                <Table.Cell className="content-center">
                  <div className="flex items-center gap-1.5">
                    <Text wrap="nowrap" truncate className="text-primary/90">
                      <Button variant="secondary" size="xs">
                        &nbsp;
                        {branch.name}
                      </Button>
                    </Text>
                    <CopyButton name={branch.name} />
                  </div>
                </Table.Cell>
                {/* user avatar and timestamp */}
                <Table.Cell className="content-center">
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
                </Table.Cell>
                {/* checkstatus: show in the playground, hide the check status column if the checks are null in the gitness without data */}
                {branch?.checks?.done && branch?.checks?.total && branch?.checks?.status && (
                  <Table.Cell className="content-center">
                    <div className="flex items-center gap-1.5">
                      <Icon name="tick" size={11} className="text-success" />
                      <Text size={2} wrap="nowrap" truncate className="text-tertiary-background">
                        {branch?.checks?.done} / {branch?.checks?.total}
                      </Text>
                    </div>
                  </Table.Cell>
                )}
                {/* calculated divergence bar & default branch */}
                <Table.Cell className="content-center">
                  <div className="flex content-center items-center gap-1.5 align-middle">
                    {branch.behindAhead.default ? (
                      <Badge
                        variant="outline"
                        size="xs"
                        className="m-auto h-5 rounded-full p-2 text-center text-xs font-normal text-tertiary-background"
                      >
                        Default
                      </Badge>
                    ) : (
                      <DivergenceGauge behindAhead={branch.behindAhead} />
                    )}
                  </div>
                </Table.Cell>
                {/* change commit data instead: SHA */}
                {branch.sha && (
                  <Table.Cell className="content-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* <Icon name="open-pr" size={11} className="text-success" /> */}
                      <Text wrap="nowrap" size={1} truncate className="font-mono text-tertiary-background">
                        <CommitCopyActions sha={branch.sha} />
                      </Text>
                    </div>
                  </Table.Cell>
                )}
                <Table.Cell className="content-center">{moreActionsTooltip(branch)}</Table.Cell>
              </Table.Row>
            )
          })}
      </Table.Body>
    </Table.Root>
  )
}
