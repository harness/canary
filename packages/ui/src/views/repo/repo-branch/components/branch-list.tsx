import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  CommitCopyActions,
  CopyButton,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text
} from '@/components'
import { getInitials } from '@utils/stringUtils'

import { BranchListPageProps } from '../types'
import { DivergenceGauge } from './divergence-gauge'
import { MoreActionsTooltip } from './more-actions-tooltip'

export const BranchesList = ({
  branches,
  spaceId,
  repoId,
  defaultBranch,
  useTranslationStore
}: BranchListPageProps) => {
  const { t } = useTranslationStore()
  return (
    <Table variant="asStackedList">
      <TableHeader>
        <TableRow>
          <TableHead>{t('views:repos.branch', 'Branch')}</TableHead>
          <TableHead>{t('views:repos.update', 'Updated')}</TableHead>
          {branches[0]?.checks?.done && branches[0]?.checks?.total && branches[0]?.checks?.status && (
            <TableHead>{t('views:repos.checkStatus', 'Check status')}</TableHead>
          )}
          <TableHead>
            <div className="mx-auto grid w-28 grid-flow-col grid-cols-[1fr_auto_1fr] items-center justify-items-end gap-x-2">
              <Text as="p" size={1} truncate color="tertiaryBackground" className="leading-none">
                {t('views:repos.behind', 'Behind')}
              </Text>
              <div className="h-full border-r-2 border-tertiary-background/30" />
              <Text as="p" size={1} truncate color="tertiaryBackground" className="place-self-start leading-none">
                {t('views:repos.ahead', 'Ahead')}
              </Text>
            </div>
          </TableHead>
          {/* since we don't have the data for pull request, we can change data to Commit to match the original gitness */}
          {branches[0]?.sha && <TableHead>{t('views:repos.commit', 'Commit')}</TableHead>}
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
                        {branch?.name}
                      </Button>
                    </Text>
                    <CopyButton name={branch?.name} />
                  </div>
                </TableCell>
                {/* user avatar and timestamp */}
                <TableCell className="content-center">
                  <div className="flex items-center gap-1.5">
                    <Avatar className="size-6">
                      {branch?.user?.avatarUrl && <AvatarImage src={branch?.user?.avatarUrl} />}
                      <AvatarFallback className="p-1 text-center text-xs">
                        {getInitials(branch?.user?.name ?? '', 2)}
                      </AvatarFallback>
                    </Avatar>
                    <Text wrap="nowrap" truncate className="text-primary">
                      {branch?.timestamp}
                    </Text>
                  </div>
                </TableCell>
                {/* checkstatus: show in the playground, hide the check status column if the checks are null in the gitness without data */}
                {branch?.checks?.done && branch?.checks?.total && branch?.checks?.status && (
                  <TableCell className="content-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Icon name="tick" size={11} className="text-success" />
                      <Text size={2} wrap="nowrap" truncate className="text-tertiary-background">
                        {branch?.checks?.done} / {branch?.checks?.total}
                      </Text>
                    </div>
                  </TableCell>
                )}
                {/* calculated divergence bar & default branch */}
                <TableCell className="content-center">
                  <div className="flex justify-center items-center gap-1.5 align-middle">
                    {branch?.behindAhead?.default ? (
                      <Badge
                        variant="outline"
                        size="xs"
                        className="m-auto h-5 rounded-full p-2 text-center text-xs font-normal text-tertiary-background"
                      >
                        {t('views:repos.default', 'Default')}
                      </Badge>
                    ) : (
                      <DivergenceGauge behindAhead={branch?.behindAhead || {}} />
                    )}
                  </div>
                </TableCell>
                {/* change commit data instead: SHA */}
                {branch.sha && (
                  <TableCell className="content-center">
                    <div className="flex items-center gap-1.5">
                      {/* <Icon name="open-pr" size={11} className="text-success" /> */}
                      <Text wrap="nowrap" size={1} truncate className="font-mono text-tertiary-background">
                        <CommitCopyActions sha={branch.sha} />
                      </Text>
                    </div>
                  </TableCell>
                )}
                <TableCell className="content-center">
                  <div className="flex justify-end">
                    <MoreActionsTooltip
                      branchInfo={branch}
                      spaceId={spaceId}
                      repoId={repoId}
                      defaultBranch={defaultBranch}
                      useTranslationStore={useTranslationStore}
                    />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
      </TableBody>
    </Table>
  )
}
