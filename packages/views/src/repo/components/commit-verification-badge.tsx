import { FC, ReactNode } from 'react'

import { StatusBadge, Text, Tooltip } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { formatDate } from '@harnessio/ui/utils'

import { CommitSignatureResult, TypesCommitSignature } from '../repo.types'

export interface CommitVerificationBadgeProps {
  signature?: TypesCommitSignature | null
}

const getVerificationLabel = (result: CommitSignatureResult): string => {
  switch (result) {
    case 'good':
      return 'Verified'
    case 'unverified':
    case 'unsupported':
      return 'Unverified'
    case 'revoked':
      return 'Revoked'
    case 'key_expired':
      return 'Expired'
    case 'invalid':
    case 'bad':
      return 'Invalid'
    default:
      return ''
  }
}

const getVerificationTheme = (result: CommitSignatureResult): 'success' | 'warning' | 'danger' => {
  switch (result) {
    case 'good':
      return 'success'
    case 'unverified':
    case 'unsupported':
    case 'key_expired':
      return 'warning'
    case 'revoked':
    case 'invalid':
    case 'bad':
      return 'danger'
    default:
      return 'warning'
  }
}

const getTooltipContent = (
  result: CommitSignatureResult
): { title: ReactNode; hint?: string } => {
  switch (result) {
    case 'good':
      return {
        title: (
          <>
            This commit was signed with the committer&apos;s <strong>verified signature</strong>.
          </>
        )
      }
    case 'unverified':
      return {
        title: 'This commit signature could not be verified.',
        hint: 'Uploading public keys to user profiles enables commit verification.'
      }
    case 'unsupported':
      return { title: 'This signature version is not supported.' }
    case 'revoked':
      return { title: 'The key used to sign this commit has been revoked.' }
    case 'key_expired':
      return { title: 'The key used to sign this commit has expired.' }
    case 'invalid':
    case 'bad':
      return { title: 'This commit has an invalid signature.' }
    default:
      return { title: '' }
  }
}

export const CommitVerificationBadge: FC<CommitVerificationBadgeProps> = ({ signature }) => {
  const { t } = useTranslation()

  if (!signature || !signature.result) {
    return null
  }

  const { result, key_fingerprint, key_scheme, created, updated } = signature
  const label = getVerificationLabel(result)
  const badgeTheme = getVerificationTheme(result)
  const content = getTooltipContent(result)

  const keyLabel = key_scheme?.toUpperCase() || 'GPG'
  const isRevoked = result === 'revoked'
  const showVerifiedDate = result === 'good' || result === 'unverified'
  const dateValue = isRevoked ? updated : created
  const showDate = dateValue && (showVerifiedDate || isRevoked)

  const tooltipContent = (
    <div className="flex flex-col gap-cn-4xs">
      <Text color="foreground-1">{content.title}</Text>
      {content.hint && <Text className="break-words">{content.hint}</Text>}
      {key_fingerprint && <Text className="break-all">{keyLabel} Key ID: {key_fingerprint}</Text>}
      {showDate && (
        <Text>
          {isRevoked
            ? t('views:commits.keyUpdatedOn', 'Key updated on')
            : t('views:commits.verifiedOn', 'Verified on')}{' '}
          {formatDate(dateValue)}
        </Text>
      )}
    </div>
  )

  return (
    <Tooltip content={tooltipContent} side="bottom" align="center" className="max-w-80">
      <button type="button" className="cursor-pointer">
        <StatusBadge variant="outline" size="sm" theme={badgeTheme}>
          {label}
        </StatusBadge>
      </button>
    </Tooltip>
  )
}

CommitVerificationBadge.displayName = 'CommitVerificationBadge'
