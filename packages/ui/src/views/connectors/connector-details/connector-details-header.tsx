import { FC } from 'react'

import { Button } from '@/components'
import { Logo } from '@components/logo'
import { Spacer } from '@components/spacer'
import { timeAgo } from '@utils/utils'

import { ConnectorDetailsHeaderProps } from './types'

const ConnectorDetailsHeader: FC<ConnectorDetailsHeaderProps> = ({ connectorDetails, onTest, useTranslationStore }) => {
  const { createdAt, lastModifiedAt, lastTestedAt, lastConnectedAt, status } = connectorDetails
  const { t } = useTranslationStore()
  return (
    <div className="px-6 py-5">
      <Logo name={connectorDetails.icon} />
      <h1 className="text-24 font-medium leading-snug tracking-tight text-foreground-1">{connectorDetails.name}</h1>
      <h2 className="text-14 font-medium text-foreground-1">{connectorDetails.description}</h2>
      <Spacer size={4} />
      <div className="mt-6 flex w-full flex-wrap items-center justify-between gap-6 text-14 leading-none">
        <div className="flex justify-between gap-11">
          {createdAt && (
            <div className="flex flex-col gap-1.5">
              <span className="leading-tight text-foreground-4">Created</span>
              <span className="text-foreground-1">{timeAgo(createdAt)}</span>
            </div>
          )}
          {lastModifiedAt && (
            <div className="flex flex-col gap-1.5">
              <span className="leading-tight text-foreground-4">Last updated</span>
              <span className="text-foreground-1">{timeAgo(lastModifiedAt)}</span>
            </div>
          )}
          {lastTestedAt && (
            <div className="flex flex-col gap-1.5">
              <span className="leading-tight text-foreground-4">Last status check</span>
              <span className="text-foreground-1">{timeAgo(lastTestedAt)}</span>
            </div>
          )}
          {lastConnectedAt && (
            <div className="flex flex-col gap-1.5">
              <span className="leading-tight text-foreground-4">Last successful check</span>
              <span className="text-foreground-1">{timeAgo(lastConnectedAt)}</span>
            </div>
          )}
          {status && (
            <div className="flex flex-col gap-1.5">
              <span className="leading-tight text-foreground-4">Connection status</span>
              <span className="text-foreground-1">{status}</span>
            </div>
          )}
        </div>
        <div className="flex h-full items-end gap-11">
          <Button variant="default" onClick={onTest}>
            Test Connection
          </Button>
        </div>
      </div>
    </div>
  )
}

export { ConnectorDetailsHeader }
