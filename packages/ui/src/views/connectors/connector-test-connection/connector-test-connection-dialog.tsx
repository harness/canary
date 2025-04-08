import { ReactNode } from 'react'

import { Button } from '@components/button'
import { Dialog } from '@components/dialog'
import { Icon } from '@components/icon'
import { Layout } from '@components/layout'
import { MarkdownViewer } from '@components/markdown-viewer'
import { Progress } from '@components/progress'
import { cn } from '@utils/cn'
import { ExecutionStatus } from '@views/execution/execution-status'
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
  errorData?: ErrorDetail[]
}

export const ConnectorTestConnectionDialog = ({
  isOpen,
  onClose,
  status = 'error',
  apiUrl = 'https://docker.harness.io',
  title = 'Test Connection',
  description = 'Validating connector authentication and permissions',
  className,
  percentageFilled = 50,
  errorMessage = 'Error Encountered (Update the username & password. Check if the provided credentials are correct. Invalid Docker Registry credentials).',
  errorData
}: ConnectorTestConnectionDialogProps): JSX.Element => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={open => !open && onClose()}>
      <Dialog.Content className={cn('sm:max-w-[689px]', className)}>
        <Dialog.Header className="items-center justify-between ">
          <Dialog.Title className="letter-spacing-1 text-xl font-medium">{title}</Dialog.Title>
          {status === 'error' && (
            <Button type="button" variant="outline">
              View connector details
            </Button>
          )}
        </Dialog.Header>
        <Dialog.Description className="gap-y-0.5">
          <div className="text-sm font-normal text-foreground-4">
            <Layout.Horizontal className="items-center justify-between gap-x-0 space-x-2">
              <div className="mb-2.5 flex flex-row items-start gap-x-0 space-x-2">
                <span className="items-center">Connector:</span>
                <span className="text-foreground-1">{apiUrl}</span>
              </div>
            </Layout.Horizontal>
            <Layout.Horizontal className="gap-x-0 space-x-2">
              <span>Status:</span>

              <div className="text-foreground-1">
                <ExecutionStatus.Badge minimal status={status as ExecutionState} />
              </div>
            </Layout.Horizontal>
          </div>

          <div className="mb-2 mt-4 gap-y-3">
            <Layout.Horizontal className="items-center gap-x-0 space-x-2 text-center">
              {(status === 'success' || status === 'error') && (
                <Icon
                  className={status === 'success' ? 'text-success' : 'text-destructive'}
                  name={status === 'success' ? 'success' : 'triangle-warning'}
                  size={14}
                />
              )}
              <div className="letter-spacing-1 text-base font-medium text-foreground-1">{description}</div>
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
                    <span className="text-sm font-normal text-foreground-4">{errorMessage}</span>
                  </div>
                )}
                {errorData && (
                  <div className="mb-1 mt-2">
                    <MarkdownViewer
                      source={`
\`\`\`text
${errorData}
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
