import { FC, useMemo, useState } from 'react'

import { Badge, Button, ListActions, MarkdownViewer, Spacer, Text } from '@/components'
import { SandboxLayout, TranslationStore, WebhookStore } from '@/views'

import { CodeEditor } from '@harnessio/yaml-editor'

import { getBranchEvents, getPrEvents, getTagEvents } from '../webhook-create/components/create-webhook-form-data'
// import { timeAgo } from '@utils/utils'
import { WebhookExecutionEditorControlBar } from './components/webhook-executions-editor-control-bar'

interface RepoWebhookExecutionDeatilsPageProps {
  useWebhookStore: () => WebhookStore
  useTranslationStore: () => TranslationStore
  //   toRepoWebhooks: (repoRef?: string) => string
  //   repo_ref: string
  isLoading: boolean
  execution?: any
}
export const RepoWebhookExecutionDetailsPage: FC<RepoWebhookExecutionDeatilsPageProps> = ({
  useWebhookStore,
  useTranslationStore,
  //   toRepoWebhooks,
  //   repo_ref,
  isLoading = false,
  execution
}) => {
  const { t } = useTranslationStore()
  const { executions, webhookExecutionPage, setWebhookExecutionPage, totalWebhookExecutionPages } = useWebhookStore()
  console.log('execution', execution)
  const monacoTheme = 'light'

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
              #124567
            </Text>
            <Badge size="md" borderRadius="full" theme="success" className="mt-1">
              Success
            </Badge>
          </ListActions.Left>
          <ListActions.Right>
            <Button variant="default" size="md">
              Re-trigger Execution
            </Button>
          </ListActions.Right>
        </ListActions.Root>

        <Spacer size={6} />
        <div className="flex gap-10">
          <div className="flex gap-1">
            <Text color="foreground-5">Triggered Event:</Text>
            <Text>Branch Updates</Text>
          </div>
          <div className="flex gap-1">
            <Text color="foreground-5">At:</Text>
            <Text>2 days ago</Text>
          </div>
          <div className="flex gap-1">
            <Text color="foreground-5">Duration:</Text>
            <Text>5s</Text>
          </div>
        </div>
        <Spacer size={6} />
        {/* {execution && <MarkdownViewer source={execution} withBorderWrapper />} */}
        <WebhookExecutionEditorControlBar view={view} onChangeView={onChangeView} />
        <CodeEditor
          height="100%"
          language="json"
          codeRevision={{ code: execution }}
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
