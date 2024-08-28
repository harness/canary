import React, { useMemo, useState } from 'react'
import cx from 'classnames'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Icon,
  SplitButton,
  StackedList,
  Text
} from '@harnessio/canary'
import { MergeCheckStatus, PullRequestState, TypesPullReq, TypeCheckData, EnumCheckStatus } from './interfaces'
import { NavArrowUp, NavArrowDown, WarningTriangleSolid, CheckCircleSolid, Clock } from '@harnessio/icons-noir'

import PullRequestCheckSection from './sections/pull-request-check-section'
import PullRequestCommentSection from './sections/pull-request-comment-section'
import PullRequestChangesSection from './sections/pull-request-changes-section'

interface PullRequestPanelProps {
  pullReqMetadata: TypesPullReq
  PRStateLoading: boolean
  checks?: TypeCheckData[]
  ruleViolation?: boolean //TODO: fix type
  checksInfo: { header: string; content: string; status: EnumCheckStatus }
  changesInfo: { header: string; content: string }
  commentsInfo: { header: string; content?: string | undefined; status: string }
}

interface HeaderProps {
  isDraft?: boolean
  isClosed: boolean
  unchecked: boolean
  mergeable: boolean
  isOpen: boolean
  ruleViolation: boolean
}

interface LineTitleProps {
  text?: string
  icon?: React.ReactElement
}

interface LineDescriptionProps {
  text?: string
}

const HeaderTitle = ({ ...props }: HeaderProps) => {
  return (
    <div className="inline-flex gap-2 items-center">
      <Text weight="medium">
        {props.isDraft
          ? 'This pull request is still a work in progress'
          : props.isClosed
            ? 'This pull request is closed'
            : props.unchecked
              ? 'Checking for ability to merge automatically...'
              : props.mergeable === false && props.isOpen
                ? 'Cannot merge pull request'
                : props.ruleViolation
                  ? 'Cannot merge pull request'
                  : `Pull request can be merged`}
      </Text>
    </div>
  )
}

const LineTitle = ({ ...props }: LineTitleProps) => {
  return (
    <div className="inline-flex gap-2 items-center">
      {props.icon}
      <Text weight="medium">{props.text}</Text>
    </div>
  )
}

const LineDescription = ({ ...props }: LineDescriptionProps) => {
  return (
    <div className="ml-6 inline-flex gap-2 items-center">
      <Text size={1} weight="normal" color={'tertiaryBackground'}>
        {props.text}
      </Text>
    </div>
  )
}

const PullRequestPanel = ({
  pullReqMetadata,
  PRStateLoading,
  checks,
  changesInfo,
  checksInfo,
  commentsInfo
}: PullRequestPanelProps) => {
  const [isExpanded, setExpanded] = useState(false)

  const mergeable = useMemo(() => pullReqMetadata.merge_check_status === MergeCheckStatus.MERGEABLE, [pullReqMetadata])
  const isClosed = pullReqMetadata.state === PullRequestState.CLOSED
  const isOpen = pullReqMetadata.state === PullRequestState.OPEN
  //   const isConflict = pullReqMetadata.merge_check_status === MergeCheckStatus.CONFLICT
  const isDraft = pullReqMetadata.is_draft
  const unchecked = useMemo(
    () => pullReqMetadata.merge_check_status === MergeCheckStatus.UNCHECKED && !isClosed,
    [pullReqMetadata, isClosed]
  )
  const ruleViolation = false
  const checkData = checks || []

  return (
    <StackedList.Root>
      <StackedList.Item isHeader>
        <StackedList.Field
          title={
            <HeaderTitle
              isDraft={isDraft}
              isClosed={isClosed}
              unchecked={unchecked}
              mergeable={mergeable}
              isOpen={isOpen}
              ruleViolation={ruleViolation}
            />
          }
        />
        <StackedList.Field
          right
          title={
            <SplitButton variant="outline" size="sm">
              Squash and merge
            </SplitButton>
          }
        />
      </StackedList.Item>
      <StackedList.Item className="py-0 hover:bg-transparent cursor-default">
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left" hideChevron>
              <StackedList.Field
                title={<LineTitle text={'No reviews required'} icon={<Icon name="success" size={16} />} />}
                description={<LineDescription text={'Pull request can be merged without any reviews'} />}
              />
            </AccordionTrigger>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left" hideChevron>
              <StackedList.Field
                title={<LineTitle text={'All comments resolved'} icon={<Icon name="success" size={16} />} />}
              />
            </AccordionTrigger>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left">
              <StackedList.Field
                title={<LineTitle text={'All checks have succeeded'} icon={<Icon name="success" size={16} />} />}
                description={<LineDescription text={'2 suceeded'} />}
              />
            </AccordionTrigger>
            <AccordionContent className="pl-6">
              <StackedList.Root>
                <StackedList.Item>
                  <StackedList.Field
                    title={<LineTitle text={'All checks have succeeded'} icon={<Icon name="success" size={16} />} />}
                    description={<LineDescription text={'2 suceeded'} />}
                  />
                </StackedList.Item>
                <StackedList.Item>
                  <StackedList.Field
                    title={<LineTitle text={'All checks have succeeded'} icon={<Icon name="success" size={16} />} />}
                    description={<LineDescription text={'2 suceeded'} />}
                  />
                </StackedList.Item>
              </StackedList.Root>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" isLast>
            <AccordionTrigger className="text-left" hideChevron>
              <StackedList.Field
                title={
                  <LineTitle
                    text={'This branch has no conflicts with main branch'}
                    icon={<Icon name="success" size={16} />}
                  />
                }
              />
            </AccordionTrigger>
          </AccordionItem>
        </Accordion>
      </StackedList.Item>
    </StackedList.Root>
  )

  return (
    <div className="border mt-1 border-border rounded-md">
      <div className="flex flex-col">
        <div
          className={cx('py-2 px-5 border-b w-full flex items-center justify-between rounded-tl-md rounded-tr-md', {
            'bg-gradient-to-r from-[#182c23] to-grey-12 bg-opacity-45': !PRStateLoading,
            '!bg-gradient-to-r !from-[#2a1717] !to-grey-12 !bg-opacity-45':
              ruleViolation || (mergeable === false && !unchecked && !isClosed && !isDraft)
            //   TODO: add the other states like checking mergeability, pr closed, pr draft, pr merged
          })}>
          <Text weight="medium" size={3}>
            {isDraft
              ? 'This pull request is still a work in progress'
              : isClosed
                ? 'This pull request is closed'
                : unchecked
                  ? 'Checking for ability to merge automatically...'
                  : mergeable === false && isOpen
                    ? 'Cannot merge pull request'
                    : ruleViolation
                      ? 'Cannot merge pull request'
                      : `Pull request can be merged`}
          </Text>
          {/* TODO: Add other states in button and think of way to incorporate drymerge callback? */}
          {/* TODO: handle drymerge */}
          <SplitButton variant="outline">Squash and merge</SplitButton>
        </div>
        <div className="px-5">
          {/* TODO: create new components for each new section  */}
          {!pullReqMetadata.merged && <PullRequestChangesSection changesInfo={changesInfo} />}
          {!pullReqMetadata.merged && <PullRequestCommentSection commentsInfo={commentsInfo} />}
          <PullRequestCheckSection checkData={checkData} checksInfo={checksInfo} />
          {!pullReqMetadata.merged && (
            <div className="py-4">
              <div className="flex justify-between">
                <div className="flex">
                  {unchecked ? (
                    // TODO: update icon for unchecked status
                    <Clock className="text-warning mt-1" />
                  ) : (
                    <>
                      {mergeable ? (
                        <CheckCircleSolid className="text-success mt-1" />
                      ) : (
                        <WarningTriangleSolid className="text-destructive mt-1" />
                      )}
                    </>
                  )}

                  {unchecked ? (
                    <div className="pl-4">
                      <p className="pb-1 text-white">Merge check in progress...</p>
                      <p className="text-grey-60">Checking for ability to merge automatically...</p>
                    </div>
                  ) : (
                    <div>
                      {!mergeable && <p className="pl-4 pb-1 text-white">Conflicts found in this branch</p>}
                      <p className={`pl-4 ${mergeable ? 'text-white' : 'text-grey-60'}`}>
                        {mergeable ? (
                          //   getString('prHasNoConflicts')
                          <> {`This branch has no conflicts with ${pullReqMetadata.target_branch} branch`}</>
                        ) : (
                          <>
                            Use the
                            <span
                              onClick={() => {
                                // TODO:add commandline information modal
                                // toggleShowCommandLineInfo(!showCommandLineInfo)
                              }}
                              className="pl-1 pr-1 text-blue-500 cursor-pointer">
                              {/* {getString('commandLine')} */}
                              command line
                            </span>
                            to resolve conflicts
                            {/* {getString('pr.useCmdLineToResolveConflicts')} */}
                          </>
                        )}
                      </p>
                    </div>
                  )}
                </div>
                {!mergeable && (
                  <button
                    // className={cx('text-blue-500 p-0')}
                    onClick={() => {
                      setExpanded(!isExpanded)
                    }}>
                    {isExpanded ? 'Show less' : 'Show more'}
                    {isExpanded ? <NavArrowUp className="pt-1" /> : <NavArrowDown className="pt-1" />}
                  </button>
                )}
              </div>
            </div>
            // TODO: add table to show conflicting files
          )}
        </div>
      </div>
    </div>
  )
}

export default PullRequestPanel
