import { Accordion, IconV2, Layout, StackedList, Text } from '@/components'

import { LineDescription, LineTitle } from './pull-request-line-title'

interface PullRequestMergeSectionProps {
  commentsInfo: { header: string; content?: string | undefined; status: string }
  handleAction?: () => void
}
const PullRequestCommentSection = ({ commentsInfo, handleAction }: PullRequestMergeSectionProps) => {
  const isSuccess = commentsInfo.status === 'success'

  return (
    <Accordion.Item value="item-2">
      <Accordion.Trigger className="py-3 [&>.cn-accordion-trigger-indicator]:hidden" onClick={handleAction}>
        <Layout.Flex>
          <StackedList.Field
            title={
              <LineTitle
                textClassName={isSuccess ? '' : 'text-cn-danger'}
                text={commentsInfo.header}
                icon={
                  <IconV2
                    size="lg"
                    className={isSuccess ? 'text-cn-success' : 'text-cn-danger'}
                    name={isSuccess ? 'check-circle-solid' : 'warning-triangle'}
                  />
                }
              />
            }
            description={!!commentsInfo?.content && <LineDescription text={commentsInfo.content} />}
          />
          {commentsInfo.status === 'failed' && !!handleAction && <Text className="pr-2">View</Text>}
        </Layout.Flex>
      </Accordion.Trigger>
    </Accordion.Item>
  )
}

export default PullRequestCommentSection
