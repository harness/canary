import { Alert, Button, Dialog, IconV2, Layout, MarkdownViewer, Progress, Text } from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@utils/cn'
import { ExecutionState } from '@views/repo/pull-request'
import { isEmpty } from 'lodash-es'

import { ConnectorDisplayNameMap } from '../connectors-list/utils'
import { ConnectorConfigType, ConnectorEntity } from '../types'

export type ConnectorStatusType = 'running' | 'success' | 'error'
export interface ErrorDetail {
  code?: number
  message?: string
  reason?: string
}

export interface ConnectorURLDetails {
  key: string
  url: string
}
interface ConnectorTestConnectionDialogProps {
  isOpen: boolean
  onClose: () => void
  connectorType: ConnectorConfigType
  status: ConnectorStatusType
  urlData?: ConnectorURLDetails
  inProgressMessage?: string
  title?: string
  errorMessage?: string
  className?: string
  connector?: ConnectorEntity
  percentageFilled?: number
  errorData?: { errors?: ErrorDetail[] }
  viewDocClick?: () => void
}

export const ConnectorTestConnectionDialog = ({
  isOpen,
  onClose,
  connectorType,
  status,
  urlData,
  inProgressMessage,
  title = 'Test Connection',
  percentageFilled = 50,
  errorMessage,
  errorData,
  viewDocClick
}: ConnectorTestConnectionDialogProps): JSX.Element => {
  const { t } = useTranslation()

  const ConnectivityStatus = ({ status }: { status: string }): JSX.Element => {
    const getStatus = (): { status: string; color: string } | undefined => {
      switch (status) {
        case ExecutionState.SUCCESS.toLowerCase():
          return { status: 'Success', color: 'bg-cn-foreground-success' }
        case ExecutionState.ERROR.toLowerCase():
          return { status: 'Failed', color: 'bg-cn-foreground-danger' }
        case ExecutionState.RUNNING.toLowerCase():
          return { status: 'Running', color: 'bg-cn-foreground-warning' }
      }
    }
    const currentStatus = getStatus()
    return (
      <div className="inline-flex items-center gap-2">
        <div className={cn('size-2 rounded-full', currentStatus?.color)} />

        <span className="text-cn-1">{currentStatus?.status}</span>
      </div>
    )
  }

  const connectorDisplayName = connectorType ? ConnectorDisplayNameMap.get(connectorType) : ''

  return (
    <Dialog.Root open={isOpen} onOpenChange={open => !open && onClose()}>
      <Dialog.Content size="lg">
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <Layout.Vertical>
            {!isEmpty(urlData?.url) ? (
              <Layout.Horizontal gap="xs" align="center">
                <span className="items-center">
                  {urlData?.key ?? t('views:connectors.connector', 'Connector')}&#58;{' '}
                </span>
                <span className="text-cn-1">{urlData?.url}</span>
              </Layout.Horizontal>
            ) : null}
            <Layout.Horizontal gap="xs">
              <span>{t('views:connectors.status', 'Status') + ':'}</span>
              <ConnectivityStatus status={status as ExecutionState} />
            </Layout.Horizontal>
          </Layout.Vertical>
          <div>
            {status === 'success' && (
              <Alert.Root theme="success">
                <Alert.Title>
                  {t(
                    'views:connectors.successfullConnection',
                    `${connectorDisplayName} is connected and ready to use`,
                    {
                      connector: connectorDisplayName
                    }
                  )}
                </Alert.Title>
              </Alert.Root>
            )}

            {status === 'running' && (
              <Layout.Vertical>
                <Text className="letter-spacing-1 text-cn-1 text-base font-medium">
                  {inProgressMessage ??
                    t(
                      'views:connectors.validatingConnection',
                      `Validating ${connectorDisplayName} authentication and permissions`,
                      {
                        connector: connectorDisplayName
                      }
                    )}
                </Text>
                <Progress value={percentageFilled / 100} state="processing" size="sm" hideIcon hidePercentage />
              </Layout.Vertical>
            )}
            {status === 'error' && (
              <Layout.Vertical>
                <Alert.Root theme="danger">
                  <Alert.Title>
                    {t('views:connectors.failedConnection', `${connectorDisplayName} connection failed`, {
                      connector: connectorDisplayName
                    })}
                  </Alert.Title>
                  {errorMessage ? (
                    <Alert.Description>
                      {errorMessage}
                      {viewDocClick && (
                        <Button
                          variant="link"
                          onClick={viewDocClick}
                          className="font-inherit text-cn-brand ml-1 h-auto p-0"
                        >
                          {t('views:connectors.viewDocumentation', 'View Documentation')}
                          <IconV2 name="open-new-window" className="text-cn-brand ml-1" size="2xs" />
                        </Button>
                      )}
                    </Alert.Description>
                  ) : null}
                </Alert.Root>

                {errorData && (
                  <Layout.Vertical>
                    <MarkdownViewer
                      source={`
\`\`\`text
${JSON.stringify(errorData, null, 2)}
\`\`\`
`}
                      showLineNumbers
                    />
                  </Layout.Vertical>
                )}
              </Layout.Vertical>
            )}
          </div>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  )
}
