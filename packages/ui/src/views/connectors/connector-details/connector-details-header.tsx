import { FC } from 'react'

import { Badge, Button, MoreActionsTooltip } from '@/components'
import { Logo, LogoName } from '@components/logo'
import { Spacer } from '@components/spacer'
import { timeAgo } from '@utils/utils'

import { ConnectorDetailsHeaderProps } from './types'

const ConnectorDetailsHeader: FC<ConnectorDetailsHeaderProps> = ({
  connectorDetails,
  onTest,
  onDelete,
  useTranslationStore
}) => {
  const { createdAt, lastModifiedAt, lastTestedAt, lastConnectedAt, status } = connectorDetails
  const { t } = useTranslationStore()
  return (
    <div className="px-8 py-5">
      <div className="flex size-full cursor-pointer flex-row gap-2 p-2">
        <div className="pt-1">
          <Logo name={connectorDetails.type.toLowerCase() as LogoName} />
        </div>
        <h1 className="text-6 font-medium leading-snug tracking-tight text-cn-foreground-1">{connectorDetails.name}</h1>
      </div>
      <h2 className="text-2 font-medium text-cn-foreground-1">{connectorDetails.description}</h2>
      <Spacer size={4} />
      <div className="mt-6 flex w-full flex-wrap items-center justify-between gap-6 text-2 leading-none">
        <div className="flex justify-between gap-11">
          {createdAt ? (
            <div className="flex flex-col gap-1.5">
              <span className="leading-tight text-cn-foreground-3">Created</span>
              <span className="text-cn-foreground-1">{timeAgo(createdAt)}</span>
            </div>
          ) : null}
          {lastModifiedAt ? (
            <div className="flex flex-col gap-1.5">
              <span className="leading-tight text-cn-foreground-3">Last updated</span>
              <span className="text-cn-foreground-1">{timeAgo(lastModifiedAt)}</span>
            </div>
          ) : null}
          {lastTestedAt ? (
            <div className="flex flex-col gap-1.5">
              <span className="leading-tight text-cn-foreground-3">Last status check</span>
              <span className="text-cn-foreground-1">{timeAgo(lastTestedAt)}</span>
            </div>
          ) : null}
          {lastConnectedAt ? (
            <div className="flex flex-col gap-1.5">
              <span className="leading-tight text-cn-foreground-3">Last successful check</span>
              <span className="text-cn-foreground-1">{timeAgo(lastConnectedAt)}</span>
            </div>
          ) : null}
          {status ? (
            <div className="flex flex-col gap-1.5">
              <span className="leading-tight text-cn-foreground-3">Connection status</span>
              <Badge
                className="leading-none"
                size="sm"
                variant="status"
                theme={status.toLowerCase() === 'success' ? 'success' : 'danger'}
              >
                <span className="text-cn-foreground-1">{status}</span>
              </Badge>
            </div>
          ) : null}
        </div>
        <div className="flex h-full items-end gap-11">
          <Button variant="default" onClick={() => onTest(connectorDetails.identifier)}>
            Test Connection
          </Button>
          <MoreActionsTooltip
            actions={[
              {
                isDanger: true,
                title: t('views:connectors.delete', 'Delete connector'),
                onClick: () => onDelete(connectorDetails.identifier)
              }
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export { ConnectorDetailsHeader }
