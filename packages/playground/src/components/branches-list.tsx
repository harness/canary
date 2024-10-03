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
  Badge
} from '@harnessio/canary'
import React from 'react'
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
}

export const BranchesList = ({ branches }: PageProps) => {
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
                {/* pull request: hidden without data */}
                <TableCell className="hidden">
                  <div className="flex gap-1.5 items-center">
                    <Icon name="open-pr" size={11} className="text-success" />
                    <Text wrap="nowrap" size={1} truncate className="text-tertiary-background">
                      #{branch.sha}
                    </Text>
                  </div>
                </TableCell>
                <TableCell className="content-center">
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
