import { FC, useEffect, useMemo, useState } from 'react'

import { Badge, Button, ListActions, MarkdownViewer, Spacer, Text } from '@/components'
import { SandboxLayout, TranslationStore, WebhookStore } from '@/views'
import { formatNs, timeAgo } from '@utils/utils'

import { CodeEditor } from '@harnessio/yaml-editor'

import { getBranchEvents, getPrEvents, getTagEvents } from '../webhook-create/components/create-webhook-form-data'
import { WebhookExecutionEditorControlBar } from './components/webhook-executions-editor-control-bar'

interface RepoWebhookExecutionDeatilsPageProps {
  useWebhookStore: () => WebhookStore
  useTranslationStore: () => TranslationStore
  isLoading: boolean
  handleRetriggerExecution: () => void
}
export const RepoWebhookExecutionDetailsPage: FC<RepoWebhookExecutionDeatilsPageProps> = ({
  useWebhookStore,
  useTranslationStore,
  isLoading,
  handleRetriggerExecution
}) => {
  const { t } = useTranslationStore()
  const { executionId, executions } = useWebhookStore()
  const [codeEditorContent, setCodeEditorContent] = useState({ code: '' })

  const execution = useMemo(() => {
    return executions?.find(e => e.id === executionId)
  }, [executions, executionId])

  useEffect(() => {
    if (execution) {
      setCodeEditorContent({ code: execution.request?.body ?? '' })
    }
  }, [execution])

  const monacoTheme = 'dark'

  const themeConfig = useMemo(
    () => ({
      defaultTheme: monacoTheme
      //   themes
    }),
    [monacoTheme]
  )

  const events = useMemo(() => {
    return [...getBranchEvents(t), ...getTagEvents(t), ...getPrEvents(t)]
  }, [])

  const [view, setView] = useState('Payload')

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
        <div className="flex gap-10">
          <div className="flex gap-1">
            <Text color="foreground-5">Triggered Event:</Text>
            <Text> {events.find(event => event.id === execution?.trigger_type)?.event || execution?.trigger_type}</Text>
          </div>
          <div className="flex gap-1">
            <Text color="foreground-5">At:</Text>
            <Text>{timeAgo(execution?.created)}</Text>
          </div>
          <div className="flex gap-1">
            <Text color="foreground-5">Duration:</Text>
            <Text>{formatNs(execution?.duration ?? 0)}</Text>
          </div>
        </div>
        <Spacer size={6} />
        <WebhookExecutionEditorControlBar view={view} onChangeView={onChangeView} />
        <CodeEditor
          height="500px"
          language="json"
          codeRevision={codeEditorContent}
          onCodeRevisionChange={() => {}}
          themeConfig={themeConfig}
          theme={monacoTheme}
          options={{
            readOnly: false
          }}
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
