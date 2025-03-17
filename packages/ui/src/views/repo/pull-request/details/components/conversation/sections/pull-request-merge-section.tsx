import { Dispatch, MouseEvent, SetStateAction, useState } from 'react'

import { Accordion, Button, CopyButton, Icon, Layout, StackedList } from '@/components'
import { cn } from '@utils/cn'
import { PanelAccordionShowButton } from '@views/repo/pull-request/details/components/conversation/sections/panel-accordion-show-button'
import { isEmpty } from 'lodash-es'

import { LineDescription, LineTitle } from './pull-request-line-title'

const stepInfo = (item: { step: string; description: string; code?: string; comment?: string }, index: number) => {
  return (
    <li key={index}>
      <Layout.Horizontal className="gap-x-1">
        <h3 className="text-14 font-medium text-foreground-1">{item.step}</h3>
        <Layout.Vertical className="w-[90%] max-w-full">
          <p className="text-14 text-foreground-4">{item.description}</p>
          <div
            className={cn('text-14 text-foreground-4 ', {
              'border border-border rounded-md px-2 py-1 !my-2': item.code,
              '!my-1': item.comment
            })}
          >
            <Layout.Horizontal className="items-center justify-between">
              <p>{item.code ? item.code : item.comment}</p>
              {!!item.code && <CopyButton name={item.code} />}
            </Layout.Horizontal>
          </div>
        </Layout.Vertical>
      </Layout.Horizontal>
    </li>
  )
}

const ACCORDION_VALUE = 'item-4'

interface PullRequestMergeSectionProps {
  unchecked: boolean
  mergeable: boolean
  pullReqMetadata: { target_branch?: string | undefined; source_branch?: string | undefined } | undefined
  conflictingFiles?: string[]
  accordionValues: string[]
  setAccordionValues: Dispatch<SetStateAction<string[]>>
}
const PullRequestMergeSection = ({
  unchecked,
  mergeable,
  pullReqMetadata,
  conflictingFiles,
  accordionValues,
  setAccordionValues
}: PullRequestMergeSectionProps) => {
  const [showCommandLineInfo, setShowCommandLineInfo] = useState(false)

  const isConflicted = !mergeable && !unchecked

  const stepMap = [
    {
      step: 'Step 1',
      description: 'Clone the repository or update your local repository with the latest changes',
      code: `git pull origin ${pullReqMetadata?.target_branch}`
    },
    {
      step: 'Step 2',
      description: 'Switch to the head branch of the pull request',
      code: `git checkout ${pullReqMetadata?.source_branch}`
    },
    {
      step: 'Step 3',
      description: 'Merge the base branch into the head branch',
      code: `git merge ${pullReqMetadata?.target_branch}`
    },
    {
      step: 'Step 4',
      description: ' Fix the conflicts and commit the result',
      comment:
        'See Resolving a merge conflict using the command line for step-by-step instruction on resolving merge conflicts'
    },
    {
      step: 'Step 5',
      description: 'Push the changes',
      code: `git push origin ${pullReqMetadata?.source_branch}`
    }
  ]

  const handleCommandLineClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    setAccordionValues(prevState => [...prevState, ACCORDION_VALUE])
    setShowCommandLineInfo(!showCommandLineInfo)
  }

  return (
    <Accordion.Item value={ACCORDION_VALUE} isLast>
      <Accordion.Trigger
        className="py-3 text-left [&>svg]:-rotate-0 [&>svg]:data-[state=open]:-rotate-180"
        chevronClassName="text-icons-3 self-start mt-1"
        hideChevron={mergeable || unchecked}
      >
        <StackedList.Field
          className="flex gap-y-1"
          title={
            <LineTitle
              textClassName={isConflicted ? 'text-foreground-danger' : ''}
              text={
                unchecked
                  ? 'Merge check in progress...'
                  : !mergeable
                    ? 'Conflicts found in this branch'
                    : `This branch has no conflicts with ${pullReqMetadata?.target_branch} branch`
              }
              icon={
                unchecked ? (
                  <Icon name="clock" className="text-icons-alert" />
                ) : (
                  <Icon
                    className={mergeable ? 'text-icons-success' : 'text-icons-danger'}
                    name={mergeable ? 'success' : 'triangle-warning'}
                  />
                )
              }
            />
          }
          description={
            <>
              {unchecked && <LineDescription text={'Checking for ability to merge automatically...'} />}
              {isConflicted && (
                <Layout.Vertical className="ml-6">
                  <p className="text-14 font-normal text-foreground-4">
                    Use the&nbsp;
                    <Button variant="link_accent" size="text" onClick={handleCommandLineClick} asChild>
                      <span>command line</span>
                    </Button>
                    &nbsp;to resolve conflicts
                  </p>
                </Layout.Vertical>
              )}
            </>
          }
        />
        <PanelAccordionShowButton
          isShowButton={isConflicted}
          value={ACCORDION_VALUE}
          accordionValues={accordionValues}
        />
      </Accordion.Trigger>
      {isConflicted && (
        <Accordion.Content className="ml-6">
          <>
            {showCommandLineInfo && (
              <div className="mb-3.5 rounded-md border border-border p-1 px-4 py-2">
                <h3 className="text-14 text-foreground-1">Resolve conflicts via command line</h3>
                <p className="pb-4 pt-1 text-14 text-foreground-4">
                  If the conflicts on this branch are too complex to resolve in the web editor, you can check it out via
                  command line to resolve the conflicts
                </p>
                <ol className="flex flex-col gap-y-3">{stepMap.map((item, index) => stepInfo(item, index))}</ol>
              </div>
            )}
            <span className="text-14 text-foreground-2">
              Conflicting files <span className="text-foreground-4">{`(${conflictingFiles?.length || 0})`}</span>
            </span>

            {!isEmpty(conflictingFiles) && (
              <div className="mt-1">
                {conflictingFiles?.map((file, idx) => (
                  <div className="flex items-center gap-x-2 py-1.5" key={`${file}-${idx}`}>
                    <Icon className="text-icons-1" size={16} name="file" />
                    <span className="text-14 text-foreground-1">{file}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        </Accordion.Content>
      )}
    </Accordion.Item>
  )
}

export default PullRequestMergeSection
