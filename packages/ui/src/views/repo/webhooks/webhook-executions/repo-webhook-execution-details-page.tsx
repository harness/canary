import { FC, useEffect, useMemo, useState } from 'react'

import { Button, ListActions, Spacer, StatusBadge, Text, TimeAgoCard } from '@/components'
import { ModeType, useTheme, useTranslation } from '@/context'
import { SandboxLayout, WebhookStore } from '@/views'
import { formatDuration } from '@utils/TimeUtils'

import { CodeEditor } from '@harnessio/yaml-editor'

import {
  getBranchAndTagEvents,
  getPrActivityEvents,
  getPrEvents
} from '../webhook-create/components/create-webhook-form-data'
import { WebhookExecutionEditorControlBar } from './components/webhook-executions-editor-control-bar'

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
  const [codeEditorContent, setCodeEditorContent] = useState({ code: '' })
  const [view, setView] = useState('payload')
  const { isLightTheme } = useTheme()

  const monacoTheme = useMemo(() => (isLightTheme ? ModeType.Light : ModeType.Dark), [isLightTheme])

  const themeConfig = useMemo(
    () => ({
      defaultTheme: monacoTheme
      //   themes
    }),
    [monacoTheme]
  )

  const execution = useMemo(() => {
    return executions?.find(e => e.id === executionId)
  }, [executions, executionId])

  const unescapeAndEscapeToJson = (escapedString: string) => {
    try {
      //  Unescape the string by parsing it
      const unescapedValue = JSON.parse(escapedString)

      //  Escape the unescaped value back into a JSON string
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
  useEffect(() => {
    if (execution) {
      if (view === 'payload') {
        setCodeEditorContent({ code: unescapeAndEscapeToJson(execution.request?.body ?? '') })
      } else if (view === 'server-response') {
        setCodeEditorContent({ code: formatHtml(execution.response?.body ?? '') })
      }
    }
  }, [execution, view])

  const events = useMemo(() => {
    return [...getBranchAndTagEvents(t), ...getPrEvents(t), ...getPrActivityEvents(t)]
  }, [])

  const onChangeView = (value: string) => {
    setView(value)
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content maxWidth="5xl" className="ml-0.5">
        <ListActions.Root>
          <ListActions.Left>
            <Text variant="heading-section">#{executionId}</Text>
            <StatusBadge
              variant="status"
              theme={
                execution?.result === 'success'
                  ? 'success'
                  : ['fatal_error', 'retriable_error'].includes(execution?.result ?? '')
                    ? 'danger'
                    : 'muted'
              }
            >
              {execution?.result === 'success'
                ? 'Success'
                : ['fatal_error', 'retriable_error'].includes(execution?.result ?? '')
                  ? 'Failed'
                  : 'Invalid'}
            </StatusBadge>
          </ListActions.Left>
          <ListActions.Right>
            <Button onClick={handleRetriggerExecution} disabled={isLoading}>
              {isLoading ? 'Re-triggering Execution' : 'Re-trigger Execution'}
            </Button>
          </ListActions.Right>
        </ListActions.Root>

        <Spacer size={5} />
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-1">
            <Text variant="body-single-line-normal" className="text-cn-foreground-3">
              Trigger Event:
            </Text>
            <Text className="text-cn-foreground-1" variant="body-single-line-normal">
              {' '}
              {events.find(event => event.id === execution?.trigger_type)?.event || execution?.trigger_type}
            </Text>
          </div>
          <div className="flex items-center gap-1">
            <Text className="flex items-center text-cn-foreground-3" variant="body-single-line-normal">
              Time:
            </Text>
            <TimeAgoCard timestamp={execution?.created} />
          </div>
          <div className="flex items-center gap-1">
            <Text className="text-cn-foreground-3" variant="body-single-line-normal">
              Duration:
            </Text>
            <Text className="text-cn-foreground-1" variant="body-single-line-normal">
              {formatDuration(execution?.duration ?? 0, 'ns')}
            </Text>
          </div>
        </div>
        <Spacer size={8} />
        <WebhookExecutionEditorControlBar view={view} onChangeView={onChangeView} />
        {/* <div className="rounded-b-3 border-cn-borders-3 border-x border-b"> */}
        <CodeEditor
          height="500px"
          language={view === 'payload' ? 'json' : 'html'}
          codeRevision={codeEditorContent}
          onCodeRevisionChange={() => {}}
          themeConfig={themeConfig}
          theme={monacoTheme}
          options={{
            readOnly: true
          }}
          className="rounded-b-3 border-cn-borders-3 max-w-full"
        />
        {/* </div> */}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
