import { AccordionContent, AccordionItem, AccordionTrigger, Icon, StackedList } from '@components/index'
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
      <AccordionTrigger className="text-left" hideChevron={mergeable || unchecked}>
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
                <p className="text-foreground-4 text-14 font-normal">
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
                </p>
              </div>
            ) : (
              ''
            )
          }
        />
        {!mergeable && !unchecked && <span className="px-2 py-1.5 text-14 text-foreground-2">Show more</span>}
      </AccordionTrigger>
      {!mergeable && !unchecked && (
        <AccordionContent>
          <div className="ml-6">
            <span className="text-14 text-foreground-2">
              Conflicting files <span className="text-foreground-4">{`(${conflictingFiles?.length || 0})`}</span>
            </span>

            {!isEmpty(conflictingFiles) && (
              <div className="mt-2">
                {conflictingFiles?.map((file, idx) => (
                  <div className="py-1.5 flex items-center gap-x-2" key={`${file}-${idx}`}>
                    <Icon className="text-icons-1" size={16} name="file" />
                    <span className="text-14 text-foreground-1">{file}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </AccordionContent>
      )}
    </AccordionItem>
  )
}

export default PullRequestMergeSection
