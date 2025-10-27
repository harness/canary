import { Accordion, IconV2, Layout, Text } from '@/components'
import { useTranslation } from '@/context'

import { LineDescription, LineTitle } from './pull-request-line-title'

interface PullRequestMergeSectionProps {
  commentsInfo: { header: string; content?: string | undefined; status: string }
  handleAction?: () => void
}
const PullRequestCommentSection = ({ commentsInfo, handleAction }: PullRequestMergeSectionProps) => {
  const { t } = useTranslation()
  const isSuccess = commentsInfo.status === 'success'

  return (
    <Accordion.Item value="item-2">
      <Accordion.Trigger className="group py-cn-sm [&>.cn-accordion-trigger-indicator]:hidden" onClick={handleAction}>
        <Layout.Horizontal align="center" justify="between">
          <Layout.Grid gapY="4xs">
            <LineTitle
              textClassName={isSuccess ? '' : 'text-cn-danger'}
              text={commentsInfo.header}
              icon={
                <IconV2
                  size="lg"
                  className={isSuccess ? 'text-cn-success' : 'text-cn-danger'}
                  name={isSuccess ? 'check-circle-solid' : 'warning-triangle-solid'}
                />
              }
            />
            {!!commentsInfo?.content && <LineDescription text={commentsInfo.content} />}
          </Layout.Grid>

          {commentsInfo.status === 'failed' && !!handleAction && (
            <Text className="group-hover:text-cn-1">{t('views:repo.pullRequest.commentSection.view', 'View')}</Text>
          )}
        </Layout.Horizontal>
      </Accordion.Trigger>
    </Accordion.Item>
  )
}

export default PullRequestCommentSection
