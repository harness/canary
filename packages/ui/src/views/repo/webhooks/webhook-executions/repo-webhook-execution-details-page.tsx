import { FC, useEffect, useMemo, useState } from 'react'

import { Badge, Button, ListActions, Spacer, Text } from '@/components'
import { ModeType, useTheme } from '@/context'
import { SandboxLayout, TranslationStore, WebhookStore } from '@/views'
import { isLightTheme } from '@utils/is-light-theme'
import { formatDuration } from '@utils/TimeUtils'
import { timeAgo } from '@utils/utils'

import { CodeEditor } from '@harnessio/yaml-editor'

import { getBranchEvents, getPrEvents, getTagEvents } from '../webhook-create/components/create-webhook-form-data'
import { WebhookExecutionEditorControlBar } from './components/webhook-executions-editor-control-bar'

interface RepoWebhookExecutionDetailsPageProps {
  useWebhookStore: () => WebhookStore
  useTranslationStore: () => TranslationStore
  isLoading: boolean
  handleRetriggerExecution: () => void
}

export const RepoWebhookExecutionDetailsPage: FC<RepoWebhookExecutionDetailsPageProps> = ({
  useWebhookStore,
  useTranslationStore,
  isLoading,
  handleRetriggerExecution
}) => {
  const { t } = useTranslationStore()
  const { executionId, executions } = useWebhookStore()
  const [codeEditorContent, setCodeEditorContent] = useState({ code: '' })
  const [view, setView] = useState('payload')
  const { theme } = useTheme()

  const monacoTheme = useMemo(() => (isLightTheme(theme) ? ModeType.Light : ModeType.Dark), [theme])

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
    return [...getBranchEvents(t), ...getTagEvents(t), ...getPrEvents(t)]
  }, [])

  const onChangeView = (value: string) => {
    setView(value)
  }

  return (
    <SandboxLayout.Main className="mx-0">
      <SandboxLayout.Content className="pl-0">
        <ListActions.Root>
          <ListActions.Left>
            <Text size={6} className="text-foreground-1" weight="medium">
              #{executionId}
            </Text>
            <Badge
              size="md"
              disableHover
              borderRadius="full"
              className="mt-1"
              theme={
                execution?.result === 'success'
                  ? 'success'
                  : ['fatal_error', 'retriable_error'].includes(execution?.result ?? '')
                    ? 'destructive'
                    : 'muted'
              }
            >
              {execution?.result === 'success'
                ? 'Success'
                : ['fatal_error', 'retriable_error'].includes(execution?.result ?? '')
                  ? 'Failed'
                  : 'Invalid'}
            </Badge>
          </ListActions.Left>
          <ListActions.Right>
            <Button variant="default" size="md" onClick={handleRetriggerExecution} disabled={isLoading}>
              {isLoading ? 'Re-triggering Execution' : 'Re-trigger Execution'}
            </Button>
          </ListActions.Right>
        </ListActions.Root>

        <Spacer size={6} />
        <div className="flex items-center gap-10">
          <div className="flex gap-1">
            <Text color="foreground-5">Triggered Event:</Text>
            <Text> {events.find(event => event.id === execution?.trigger_type)?.event || execution?.trigger_type}</Text>
          </div>
          <div className="flex items-center gap-1">
            <Text color="foreground-5" className="flex items-center">
              At:
            </Text>
            <Text>{timeAgo(execution?.created)}</Text>
          </div>
          <div className="flex gap-1">
            <Text color="foreground-5">Duration:</Text>
            <Text>{formatDuration(execution?.duration ?? 0, 'ns')}</Text>
          </div>
        </div>
        <Spacer size={6} />
        <WebhookExecutionEditorControlBar view={view} onChangeView={onChangeView} />
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
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
