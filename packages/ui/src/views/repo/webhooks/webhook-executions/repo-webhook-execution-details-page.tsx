import { FC, useMemo, useState } from 'react'

import { Button, Layout, ListActions, StackedList, StatusBadge, Tabs, Text, TimeAgoCard } from '@/components'
import { ModeType, useTheme, useTranslation } from '@/context'
import { WebhookStore } from '@/views'
import { formatDuration } from '@utils/TimeUtils'

import { CodeEditor } from '@harnessio/yaml-editor'

import {
  getBranchAndTagEvents,
  getPrActivityEvents,
  getPrEvents
} from '../webhook-create/components/create-webhook-form-data'

enum WebhookExecutionView {
  PAYLOAD = 'payload',
  SERVER_RESPONSE = 'server-response'
}

interface RepoWebhookExecutionDetailsPageProps {
  useWebhookStore: () => WebhookStore
  isLoading: boolean
  handleRetriggerExecution: () => void
}

export const RepoWebhookExecutionDetailsPage: FC<RepoWebhookExecutionDetailsPageProps> = ({
  useWebhookStore,
  isLoading,
  handleRetriggerExecution
}) => {
  const { t } = useTranslation()
  const { executionId, executions } = useWebhookStore()
  const [view, setView] = useState('payload')
  const { isLightTheme } = useTheme()

  const monacoTheme = useMemo(() => (isLightTheme ? ModeType.Light : ModeType.Dark), [isLightTheme])
  const themeConfig = useMemo(() => ({ defaultTheme: monacoTheme }), [monacoTheme])
  const execution = useMemo(() => executions?.find(e => e.id === executionId), [executions, executionId])

  const unescapeAndEscapeToJson = (escapedString: string) => {
    try {
      const unescapedValue = JSON.parse(escapedString)
      const escapedJson = JSON.stringify(unescapedValue, null, 4)

      return escapedJson
    } catch (error) {
      return ''
    }
  }
  const formatHtml = (htmlString: string) => {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlString, 'text/html')
      return doc.documentElement.outerHTML.replace(/></g, '>\n<')
    } catch (error) {
      return htmlString
    }
  }

  const events = useMemo(() => {
    return [...getBranchAndTagEvents(t), ...getPrEvents(t), ...getPrActivityEvents(t)]
  }, [t])

  const onChangeView = (value: string) => {
    setView(value)
  }

  const isError = ['fatal_error', 'retriable_error'].includes(execution?.result ?? '')
  const isSuccess = execution?.result === 'success'

  return (
    <Layout.Vertical gap="xl" grow>
      <ListActions.Root>
        <ListActions.Left>
          <Layout.Flex gapX="sm" align="center">
            <Text as="h1" variant="heading-section">
              #{executionId}
            </Text>
            <StatusBadge variant="status" theme={isSuccess ? 'success' : isError ? 'danger' : 'muted'}>
              {isSuccess
                ? t('views:repos.webhookExecution.status.success', 'Success')
                : isError
                  ? t('views:repos.webhookExecution.status.failed', 'Failed')
                  : t('views:repos.webhookExecution.status.invalid', 'Invalid')}
            </StatusBadge>
          </Layout.Flex>
        </ListActions.Left>
        <ListActions.Right>
          <Button onClick={handleRetriggerExecution} disabled={isLoading}>
            {isLoading
              ? t('views:repos.webhookExecution.retrigger.loading', 'Re-triggering Execution')
              : t('views:repos.webhookExecution.retrigger.default', 'Re-trigger Execution')}
          </Button>
        </ListActions.Right>
      </ListActions.Root>

      <Layout.Vertical gapY="2xl" grow>
        <Layout.Grid flow="column" gapX="3xl" align="center" className="w-fit">
          <Layout.Grid flow="column" gapX="xs" align="center">
            <Text variant="body-single-line-normal" color="foreground-3">
              {t('views:repos.webhookExecution.topBar.triggerEvent', 'Trigger Event:')}
            </Text>
            <Text variant="body-single-line-normal" color="foreground-1" truncate>
              {events.find(event => event.id === execution?.trigger_type)?.event || execution?.trigger_type}
            </Text>
          </Layout.Grid>
          <Layout.Grid flow="column" gapX="xs" align="center">
            <Text variant="body-single-line-normal" color="foreground-3">
              {t('views:repos.webhookExecution.topBar.time', 'Time:')}
            </Text>
            <TimeAgoCard
              timestamp={execution?.created}
              textProps={{ variant: 'body-single-line-normal', color: 'foreground-1', truncate: true }}
            />
          </Layout.Grid>
          <Layout.Grid flow="column" gapX="xs" align="center">
            <Text variant="body-single-line-normal" color="foreground-3">
              {t('views:repos.webhookExecution.topBar.duration', 'Duration:')}
            </Text>
            <Text variant="body-single-line-normal" color="foreground-1">
              {formatDuration(execution?.duration ?? 0, 'ns')}
            </Text>
          </Layout.Grid>
        </Layout.Grid>

        <Tabs.Root defaultValue={view} onValueChange={onChangeView} className="w-full">
          <StackedList.Item disableHover isHeader className="py-cn-2xs px-cn-md rounded-t-3 border">
            <Tabs.List variant="ghost">
              <Tabs.Trigger value={WebhookExecutionView.PAYLOAD}>
                {t('views:repos.webhookExecution.code.payload', 'Payload')}
              </Tabs.Trigger>
              <Tabs.Trigger value={WebhookExecutionView.SERVER_RESPONSE}>
                {t('views:repos.webhookExecution.code.serverResponse', 'Server Response')}
              </Tabs.Trigger>
            </Tabs.List>
          </StackedList.Item>

          <Tabs.Content value={WebhookExecutionView.PAYLOAD}>
            <CodeEditor
              height="500px"
              language="json"
              codeRevision={{ code: unescapeAndEscapeToJson(execution?.request?.body ?? '') }}
              themeConfig={themeConfig}
              theme={monacoTheme}
              options={{ readOnly: true }}
            />
          </Tabs.Content>
          <Tabs.Content value={WebhookExecutionView.SERVER_RESPONSE}>
            <CodeEditor
              height="500px"
              language="html"
              codeRevision={{ code: formatHtml(execution?.response?.body ?? '') }}
              themeConfig={themeConfig}
              theme={monacoTheme}
              options={{ readOnly: true }}
            />
          </Tabs.Content>
        </Tabs.Root>
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
