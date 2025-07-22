import { Accordion, IconV2, StackedList, Text } from '@/components'

import { LineDescription, LineTitle } from './pull-request-line-title'

interface PullRequestMergeSectionProps {
  commentsInfo: { header: string; content?: string | undefined; status: string }
  handleAction?: () => void
}
const PullRequestCommentSection = ({ commentsInfo, handleAction }: PullRequestMergeSectionProps) => {
  const isSuccess = commentsInfo.status === 'success'

  return (
    <Accordion.Item value="item-2">
      <Accordion.Trigger className="py-3 [&>.cn-accordion-trigger-indicator]:hidden">
        <StackedList.Field
          className="flex gap-y-1"
          title={
            <LineTitle
              textClassName={isSuccess ? '' : 'text-cn-foreground-danger'}
              text={commentsInfo.header}
              icon={
                <IconV2
                  className={isSuccess ? 'text-cn-foreground-success' : 'text-cn-foreground-danger'}
                  name={isSuccess ? 'check-circle-solid' : 'warning-triangle'}
                />
              }
            />
          }
          description={!!commentsInfo?.content && <LineDescription text={commentsInfo.content} />}
        />
        {commentsInfo.status === 'failed' && !!handleAction && (
          <Text className="pr-2" onClick={() => handleAction()}>
            View
          </Text>
        )}
      </Accordion.Trigger>
    </Accordion.Item>
  )
}

export default PullRequestCommentSection
