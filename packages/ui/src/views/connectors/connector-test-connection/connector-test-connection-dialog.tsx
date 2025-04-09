import { ReactNode } from 'react'

import { Button } from '@components/button'
import { Dialog } from '@components/dialog'
import { Icon } from '@components/icon'
import { Layout } from '@components/layout'
import { MarkdownViewer } from '@components/markdown-viewer'
import { Progress } from '@components/progress'
import { cn } from '@utils/cn'
import { ExecutionStatus } from '@views/execution/execution-status'
import { TranslationStore } from '@views/repo'
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
  useTranslationStore: () => TranslationStore
}

export const ConnectorTestConnectionDialog = ({
  isOpen,
  onClose,
  status,
  apiUrl,
  title = 'Test Connection',
  description = 'Validating connector authentication and permissions',
  className,
  percentageFilled = 50,
  errorMessage,
  errorData,
  viewDocClick,
  useTranslationStore
}: ConnectorTestConnectionDialogProps): JSX.Element => {
  const { t } = useTranslationStore()
  return (
    <Dialog.Root open={isOpen} onOpenChange={open => !open && onClose()}>
      <Dialog.Content className={cn('sm:max-w-[689px]', className)}>
        <Dialog.Header>
          <Dialog.Title className="letter-spacing-1 text-xl font-medium">{title}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Description className="gap-y-0.5">
          <div className="text-cn-foreground-4 text-sm font-normal">
            <Layout.Horizontal className="items-center justify-between gap-x-0 space-x-2">
              <div className="mb-2.5 flex flex-row items-start gap-x-0 space-x-2">
                <span className="items-center">{t('views:connectors.connector', 'Connector:')}</span>
                <span className="text-cn-foreground-1">{apiUrl}</span>
              </div>
              {status === 'error' && (
                <Button type="button" variant="outline">
                  {t('views:connectors.viewConnectorDetails', 'View Connector Details')}
                </Button>
              )}
            </Layout.Horizontal>
            <Layout.Horizontal className="gap-x-0 space-x-2">
              <span>{t('views:connectors.status', 'Status:')}</span>

              <div className="text-cn-foreground-1">
                <ExecutionStatus.Badge minimal inConnector status={status as ExecutionState} />
              </div>
            </Layout.Horizontal>
          </div>

          <div className="mb-2 mt-4 gap-y-3">
            <Layout.Horizontal className="items-center gap-x-0 space-x-2 text-center">
              {(status === 'success' || status === 'error') && (
                <Icon
                  className={status === 'success' ? 'text-cn-foreground-success' : 'text-cn-foreground-danger'}
                  name={status === 'success' ? 'success' : 'triangle-warning'}
                  size={14}
                />
              )}
              <div className="letter-spacing-1 text-cn-foreground-1 text-base font-medium">{description}</div>
            </Layout.Horizontal>

            {status === 'running' && (
              <div className="mb-1 mt-4">
                <Progress value={percentageFilled} size="sm" color="accent" rounded="sm" />
              </div>
            )}
            {status === 'error' && (
              <>
                {errorMessage && (
                  <div className="mb-1 mt-2">
                    <div className="gap-x-0 space-x-2">
                      <span className="text-cn-foreground-4 text-sm font-normal">
                        {errorMessage}
                        {viewDocClick && (
                          <span className="text-cn-foreground-accent ml-1">
                            <Button
                              variant="link"
                              onClick={viewDocClick}
                              className={cn('h-auto', 'p-0', 'font-inherit', 'text-cn-foreground-accent')}
                            >
                              {t('views:connectors.viewDocumentation', 'View Documentation')}
                              <Icon name="attachment-link" className="ml-1 text-cn-foreground-accent" size={12} />
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
        </Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  )
}
