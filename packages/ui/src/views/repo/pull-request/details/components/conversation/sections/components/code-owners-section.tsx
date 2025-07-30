import { FC, useMemo } from 'react'

import { IconV2, StackedList, StatusBadge } from '@/components'
import { CodeOwnersSectionProps, TypesOwnerEvaluation } from '@/views'
import { cn } from '@utils/cn'
import { isEmpty } from 'lodash-es'

import { AvatarItem, AvatarUser, HeaderItem } from './commons'

const mapEvaluationsToUsers = (evaluations: TypesOwnerEvaluation[]): AvatarUser[] => {
  return evaluations.map(({ owner }) => ({
    id: owner?.id,
    display_name: owner?.display_name,
    email: owner?.email
  }))
}

export const CodeOwnersSection: FC<CodeOwnersSectionProps> = ({
  codeOwners,
  reqCodeOwnerApproval,
  reqCodeOwnerLatestApproval,
  codeOwnerChangeReqEntries,
  codeOwnerPendingEntries,
  codeOwnerApprovalEntries,
  latestCodeOwnerApprovalArr,
  minReqLatestApproval
}) => {
  const codeOwnerStatus = useMemo(() => {
    const getData = () => {
      if (!!codeOwnerPendingEntries?.length && reqCodeOwnerLatestApproval) {
        return {
          icon: <IconV2 name="warning-triangle-solid" className="text-cn-foreground-warning" />,
          text: 'Waiting on code owner reviews of latest changes'
        }
      }

      if (!!codeOwnerPendingEntries?.length && reqCodeOwnerApproval) {
        return {
          icon: <IconV2 name="warning-triangle-solid" className="text-cn-foreground-warning" />,
          text: 'Changes are pending approval from code owners'
        }
      }

      if (!!codeOwnerApprovalEntries?.length && !!codeOwnerPendingEntries?.length) {
        return {
          icon: <IconV2 name="clock-solid" className="text-cn-foreground-3" />,
          text: 'Some changes were approved by code owners'
        }
      }

      if (!!latestCodeOwnerApprovalArr?.length && reqCodeOwnerLatestApproval) {
        return {
          icon: <IconV2 name="check-circle-solid" className="text-cn-foreground-success" />,
          text: 'Latest changes were approved by code owners'
        }
      }

      if (!!codeOwnerApprovalEntries?.length && reqCodeOwnerApproval) {
        return {
          icon: <IconV2 name="check-circle-solid" className="text-cn-foreground-success" />,
          text: 'Changes were approved by code owners'
        }
      }

      if (codeOwnerApprovalEntries?.length) {
        if (
          reqCodeOwnerLatestApproval &&
          minReqLatestApproval &&
          latestCodeOwnerApprovalArr &&
          latestCodeOwnerApprovalArr?.length < minReqLatestApproval
        ) {
          return {
            icon: <IconV2 name="clock-solid" className="text-cn-foreground-warning" />,
            text: 'Latest changes are pending approval from required reviewers'
          }
        }

        return {
          icon: <IconV2 name="check-circle-solid" className="text-cn-foreground-success" />,
          text: 'Changes were approved by code owners'
        }
      }

      return {
        icon: <IconV2 name="check-circle-solid" className="text-cn-foreground-success" />,
        text: 'No codeowner reviews required'
      }
    }

    const data = getData()

    return (
      <div className="flex items-center gap-x-2">
        {data.icon}
        <span className="text-2 text-cn-foreground-1">{data.text}</span>
      </div>
    )
  }, [
    codeOwnerPendingEntries,
    reqCodeOwnerLatestApproval,
    codeOwnerApprovalEntries,
    latestCodeOwnerApprovalArr,
    minReqLatestApproval,
    reqCodeOwnerApproval
  ])

  if (!codeOwners || isEmpty(codeOwners.evaluation_entries)) {
    return null
  }

  return (
    <>
      <div className="ml-6 flex items-center justify-between">
        {codeOwnerChangeReqEntries && codeOwnerChangeReqEntries?.length > 0 ? (
          <div className="flex items-center gap-x-2">
            <IconV2
              name="warning-triangle-solid"
              className={cn({
                'text-cn-foreground-danger': reqCodeOwnerApproval || reqCodeOwnerLatestApproval,
                'text-cn-foreground-warning': !reqCodeOwnerApproval || !reqCodeOwnerLatestApproval
              })}
            />
            <span className="text-2 text-cn-foreground-1">{'Code owners requested changes to the pull request'}</span>
          </div>
        ) : (
          codeOwnerStatus
        )}
        {(reqCodeOwnerApproval || reqCodeOwnerLatestApproval) && <StatusBadge variant="outline">Required</StatusBadge>}
      </div>
      <div className="ml-6 bg-inherit">
        <StackedList.Root className="ml-2 cursor-default border-transparent bg-inherit">
          <StackedList.Item isHeader disableHover className="cursor-default !bg-transparent px-0 text-cn-foreground-3">
            <StackedList.Field title={<HeaderItem header="Code" />} />
            <StackedList.Field title={<HeaderItem header="Owners" />} />
            <StackedList.Field title={<HeaderItem header="Changes requested by" />} />
            <StackedList.Field title={<HeaderItem header="Approved by" />} />
          </StackedList.Item>

          {codeOwners?.evaluation_entries?.map(entry => {
            const changeReqEvaluations = entry?.owner_evaluations?.filter(
              evaluation => evaluation.review_decision === 'changereq'
            )
            const approvedEvaluations = entry?.owner_evaluations?.filter(
              evaluation => evaluation.review_decision === 'approved'
            )
            return (
              <StackedList.Item key={entry.pattern} disableHover>
                <StackedList.Field title={entry?.pattern} />
                {entry?.owner_evaluations && <AvatarItem users={mapEvaluationsToUsers(entry?.owner_evaluations)} />}
                {changeReqEvaluations && <AvatarItem users={mapEvaluationsToUsers(changeReqEvaluations)} />}
                {approvedEvaluations && <AvatarItem users={mapEvaluationsToUsers(approvedEvaluations)} />}
              </StackedList.Item>
            )
          })}
        </StackedList.Root>
      </div>
    </>
  )
}
