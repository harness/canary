import { AccordionContent, AccordionItem, AccordionTrigger, Icon, StackedList, Text } from '@components/index'
import { isEmpty } from 'lodash-es'

import { LineDescription, LineTitle } from './pull-request-line-title'

interface PullRequestMergeSectionProps {
  unchecked: boolean
  mergeable: boolean
  pullReqMetadata: { target_branch?: string | undefined } | undefined
  conflictingFiles?: string[]
}
const PullRequestMergeSection = ({
  unchecked,
  mergeable,
  pullReqMetadata,
  conflictingFiles
}: PullRequestMergeSectionProps) => {
  return (
    <AccordionItem value="item-4" isLast>
      <AccordionTrigger
        className="text-left"
        hideChevron
        // hideChevron={!mergeable || !unchecked}
      >
        <StackedList.Field
          title={
            <LineTitle
              text={
                unchecked
                  ? 'Merge check in progress...'
                  : !mergeable
                    ? 'Conflicts found in this branch'
                    : `This branch has no conflicts with ${pullReqMetadata?.target_branch} branch`
              }
              icon={
                unchecked ? (
                  // TODO: update icon for unchecked status
                  <Icon name="clock" className="text-warning" />
                ) : (
                  <>
                    {mergeable ? (
                      <Icon name="success" className="text-success" />
                    ) : (
                      <Icon name="triangle-warning" className="text-destructive" />
                    )}
                  </>
                )
              }
            />
          }
          description={
            unchecked ? (
              <LineDescription text={'Checking for ability to merge automatically...'} />
            ) : !mergeable ? (
              <div className="ml-6 inline-flex items-center gap-2">
                <Text size={1} weight="normal" color={'tertiaryBackground'}>
                  Use the
                  <span
                    // onClick={() => {
                    //   // TODO:add commandline information modal
                    //   // toggleShowCommandLineInfo(!showCommandLineInfo)
                    // }}
                    // className="pl-1 pr-1 text-blue-500 cursor-pointer">

                    className="px-1 text-blue-500"
                  >
                    {/* {getString('commandLine')} */}
                    command line
                  </span>
                  to resolve conflicts
                  {/* {getString('pr.useCmdLineToResolveConflicts')} */}
                </Text>
              </div>
            ) : (
              ''
            )
          }
        />
        {!mergeable && !unchecked && (
          <Text className="pr-2" size={1}>
            Show more
          </Text>
        )}
      </AccordionTrigger>
      {!mergeable && !unchecked && (
        <AccordionContent>
          <StackedList.Root className="ml-2 border-transparent bg-inherit">
            <StackedList.Item className="ml-2 px-0.5 pt-0.5">
              <Text
                size={1}
                weight="normal"
                color={'tertiaryBackground'}
              >{`Conflicting files (${conflictingFiles?.length || 0})`}</Text>
            </StackedList.Item>
            {!isEmpty(conflictingFiles) &&
              conflictingFiles?.map((file, idx) => (
                <StackedList.Item className="ml-2 px-2 py-1" key={`${file}-${idx}`}>
                  <Icon size={14} name="changes" />
                  <Text size={1} className="pl-1">
                    {file}
                  </Text>
                </StackedList.Item>
              ))}
          </StackedList.Root>
        </AccordionContent>
      )}
    </AccordionItem>
  )
}

export default PullRequestMergeSection
