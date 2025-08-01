import { ReactNode } from 'react'

import { useTranslation } from '@/context'
import { Button } from '@components/button'
import { Dialog } from '@components/dialog'
import { IconV2 } from '@components/icon-v2'
import { Layout } from '@components/layout'
import { MarkdownViewer } from '@components/markdown-viewer'
import { Progress } from '@components/progress'
import { cn } from '@utils/cn'
import { ExecutionState } from '@views/repo/pull-request'

import { ConnectorEntity } from '../types'

export type ConnectorIconType = 'running' | 'success' | 'error'
export interface ErrorDetail {
  code?: number
  message?: string
  reason?: string
}

interface ConnectorTestConnectionDialogProps {
  isOpen: boolean
  onClose: () => void
  status?: ConnectorIconType
  apiUrl?: string
  title?: string
  description?: ReactNode
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
  status,
  apiUrl,
  title = 'Test Connection',
  description = 'Validating connector authentication and permissions',
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

        <span className="text-cn-foreground-1">{currentStatus?.status}</span>
      </div>
    )
  }
  return (
    <Dialog.Root open={isOpen} onOpenChange={open => !open && onClose()}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Body>
            <div className="gap-y-0.5">
              <div className="text-sm font-normal text-cn-foreground-4">
                <Layout.Horizontal gap="xs" align="center">
                  <span className="items-center">{t('views:connectors.connector', 'Connector') + ':'}</span>
                  <span className="text-cn-foreground-1">{apiUrl}</span>

                  {status === 'error' && (
                    <Button type="button" variant="outline" className="ml-auto">
                      {t('views:connectors.viewConnectorDetails', 'View Connector Details')}
                    </Button>
                  )}
                </Layout.Horizontal>
                <Layout.Horizontal gap="xs">
                  <span>{t('views:connectors.status', 'Status') + ':'}</span>

                  <div className="text-cn-foreground-1">
                    <ConnectivityStatus status={status as ExecutionState} />
                  </div>
                </Layout.Horizontal>
              </div>

              <div className="mb-2 mt-4 gap-y-3">
                <Layout.Horizontal gap="xs" align="center" className="text-center">
                  {(status === 'success' || status === 'error') && (
                    <IconV2
                      className={status === 'success' ? 'text-cn-foreground-success' : 'text-cn-foreground-danger'}
                      name={status === 'success' ? 'check-circle-solid' : 'warning-triangle-solid'}
                      size="xs"
                    />
                  )}
                  <div className="letter-spacing-1 text-base font-medium text-cn-foreground-1">{description}</div>
                </Layout.Horizontal>

                {status === 'running' && (
                  <div className="mb-1 mt-4">
                    <Progress value={percentageFilled / 100} state="processing" size="sm" hideIcon hidePercentage />
                  </div>
                )}
                {status === 'error' && (
                  <>
                    {errorMessage && (
                      <div className="mb-1 mt-2">
                        <div className="gap-x-0 space-x-2">
                          <span className="text-sm font-normal text-cn-foreground-4">
                            {errorMessage}
                            {viewDocClick && (
                              <span className="ml-1 text-cn-foreground-accent">
                                <Button
                                  variant="link"
                                  onClick={viewDocClick}
                                  className={cn('h-auto', 'p-0', 'font-inherit', 'text-cn-foreground-accent')}
                                >
                                  {t('views:connectors.viewDocumentation', 'View Documentation')}
                                  <IconV2
                                    name="open-new-window"
                                    className="ml-1 text-cn-foreground-accent"
                                    size="2xs"
                                  />
                                </Button>
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                    {errorData && (
                      <div className="mb-1 mt-2">
                        <MarkdownViewer
                          source={`
\`\`\`text
${JSON.stringify(errorData, null, 2)}
\`\`\`
`}
                          showLineNumbers
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </Dialog.Body>
        </Dialog.Header>
      </Dialog.Content>
    </Dialog.Root>
  )
}
