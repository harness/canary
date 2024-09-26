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
  AvatarFallback
} from '@harnessio/canary'
import React from 'react'
import { getInitials } from '../utils/utils'
import AvatarUrl from '../../public/images/user-avatar.svg'
import { CopyButton } from './copy-button'

interface BranchProps {
  // id: string
  name: string
  sha: string
  timestamp: string
  user: {
    name: string
    avatarUrl?: string
  }
  checks: {
    done: number
    total: number
    status: number
  }
  behindAhead: {
    behind: number
    ahead: number
  }
}

interface PageProps {
  branches: BranchProps[]
}

export const BranchesList = ({ branches }: PageProps) => {
  return (
    <Table variant="asStackedList">
      <TableHeader>
        <TableRow>
          <TableHead>Branch</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead className="hidden">Check status</TableHead>
          <TableHead className="text-center hidden">Behind | Ahead</TableHead>
          {/* since we don't have the data for pull request, we can temporary hide this column */}
          <TableHead className="hidden">Pull request</TableHead>
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
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Text wrap="nowrap" truncate className="text-primary/90">
                      <Button variant="secondary" size="xs">
                        <Icon name="branch" size={11} className="text-tertiary-background" />
                        &nbsp;
                        {branch.name}
                      </Button>
                    </Text>
                    <CopyButton name={branch.name} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={branch.user.avatarUrl === '' ? AvatarUrl : branch.user.avatarUrl} />
                      <AvatarFallback className="text-xs p-1 text-center">
                        {getInitials(branch.user.name, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <Text wrap="nowrap" truncate className="text-primary">
                      {branch.timestamp}
                    </Text>
                  </div>
                </TableCell>
                <TableCell className="hidden">
                  <div className="flex gap-1.5 items-center">
                    <Icon name="tick" size={11} className="text-success" />
                    <Text size={2} wrap="nowrap" truncate className="text-tertiary-background">
                      {branch.checks.done} / {branch.checks.total}
                    </Text>
                  </div>
                </TableCell>
                <TableCell className="hidden">
                  <div className="flex gap-1.5 items-center">
                    <Text wrap="nowrap" truncate className="text-tertiary-background text-center flex-grow">
                      {branch.behindAhead.behind} | {branch.behindAhead.ahead}
                    </Text>
                  </div>
                </TableCell>
                {/* since we don't have the data for pull request, we can temporary hide this column */}
                <TableCell className="hidden">
                  <div className="flex gap-1.5 items-center">
                    <Icon name="open-pr" size={11} className="text-success" />
                    <Text wrap="nowrap" size={1} truncate className="text-tertiary-background">
                      #{branch.sha}{' '}
                    </Text>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1.5 items-center justify-end">
                    <Icon name="vertical-ellipsis" size={14} className="text-tertiary-background" />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
      </TableBody>
    </Table>
  )
}
