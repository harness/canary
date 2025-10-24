import { Accordion, Icon, StackedList, Text } from '@/components'

import { LineDescription, LineTitle } from './pull-request-line-title'

interface PullRequestMergeSectionProps {
  commentsInfo: { header: string; content?: string | undefined; status: string }
  handleAction?: () => void
}
const PullRequestCommentSection = ({ commentsInfo, handleAction }: PullRequestMergeSectionProps) => {
  return (
    <Accordion.Item value="item-2">
      <Accordion.Trigger className="text-left" hideChevron>
        <StackedList.Field
          title={
            <LineTitle
              text={commentsInfo.header}
              icon={
                commentsInfo.status === 'success' ? (
                  <Icon name="success" className="text-foreground-success" size={16} />
                ) : (
                  <Icon name="triangle-warning" className="text-destructive" />
                )
              }
            />
          }
          description={commentsInfo.content && <LineDescription text={commentsInfo.content} />}
        />
        {commentsInfo.status === 'failed' && (
          <Text
            onClick={() => {
              handleAction?.()
            }}
            className="pr-2"
            size={1}
          >
            View
          </Text>
        )}
      </Accordion.Trigger>
    </Accordion.Item>
  )
}

export default PullRequestCommentSection
