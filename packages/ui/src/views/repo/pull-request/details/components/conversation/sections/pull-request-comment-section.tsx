import { Accordion, Icon, StackedList, Text } from '@/components'

import { LineDescription, LineTitle } from './pull-request-line-title'

interface PullRequestMergeSectionProps {
  commentsInfo: { header: string; content?: string | undefined; status: string }
  handleAction?: () => void
}
const PullRequestCommentSection = ({ commentsInfo, handleAction }: PullRequestMergeSectionProps) => {
  const isSuccess = commentsInfo.status === 'success'

  return (
    <Accordion.Item value="item-2">
      <Accordion.Trigger
        className="py-3 text-left [&>svg]:-rotate-0 [&>svg]:data-[state=open]:-rotate-180"
        chevronClassName="text-icons-3 self-start mt-1"
        hideChevron
      >
        <StackedList.Field
          className="flex gap-y-1"
          title={
            <LineTitle
              textClassName={isSuccess ? '' : 'text-cn-foreground-danger'}
              text={commentsInfo.header}
              icon={
                <Icon
                  className={isSuccess ? 'text-cn-foreground-success' : 'text-cn-foreground-danger'}
                  name={isSuccess ? 'success' : 'triangle-warning'}
                />
              }
            />
          }
          description={!!commentsInfo?.content && <LineDescription text={commentsInfo.content} />}
        />
        {commentsInfo.status === 'failed' && !!handleAction && (
          <Text className="pr-2" onClick={() => handleAction()} size={1}>
            View
          </Text>
        )}
      </Accordion.Trigger>
    </Accordion.Item>
  )
}

export default PullRequestCommentSection
