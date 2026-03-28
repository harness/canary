import { FC, ReactNode, useMemo } from 'react'

import { Popover, StatusBadge, Text } from '@harnessio/ui/components'
import { ColorType, ContrastType, FullTheme, ModeType, useTheme, useTranslation } from '@harnessio/ui/context'
import { formatDate } from '@harnessio/ui/utils'

import { CommitSignatureResult, TypesCommitSignature } from '../repo.types'


function swapMode(theme: FullTheme): FullTheme {
  const parts = theme.split('-')
  if (parts.length !== 3) return theme

  const [, color, contrast] = parts as [string, ColorType, ContrastType]
  const currentMode = parts[0] as ModeType

  const swappedMode = currentMode === ModeType.Light ? ModeType.Dark : ModeType.Light

  return `${swappedMode}-${color}-${contrast}` as FullTheme
}

export interface CommitVerificationBadgeProps {
  signature?: TypesCommitSignature | null
}

const getVerificationLabel = (result: CommitSignatureResult): string => {
  switch (result) {
    case 'good':
      return 'Verified'
    case 'unverified':
      return 'Unverified'
    case 'revoked':
      return 'Revoked'
    default:
      return ''
  }
}

const getVerificationTheme = (result: CommitSignatureResult): 'success' | 'warning' | 'danger' => {
  switch (result) {
    case 'good':
      return 'success'
    case 'unverified':
      return 'warning'
    case 'revoked':
      return 'danger'
    default:
      return 'warning'
  }
}

const getPopoverContent = (
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
    case 'revoked':
      return { title: 'The key used to sign this commit has been revoked.' }
    default:
      return { title: '' }
  }
}

export const CommitVerificationBadge: FC<CommitVerificationBadgeProps> = ({ signature }) => {
  const { t } = useTranslation()
  const { theme: currentTheme } = useTheme()

  // Swap theme mode for popover content to match Tooltip default behavior
  const swappedTheme = useMemo(() => {
    return currentTheme ? swapMode(currentTheme) : currentTheme
  }, [currentTheme])

  if (!signature || !signature.result) {
    return null
  }

  const { result, key_fingerprint, key_scheme, created } = signature
  const label = getVerificationLabel(result)
  const badgeTheme = getVerificationTheme(result)
  const content = getPopoverContent(result)

  const keyLabel = key_scheme?.toUpperCase() || 'GPG'

  const popoverContent = (
    <div className={swappedTheme}>
      <div className="flex flex-col gap-cn-4xs">
        <Text color="foreground-1">{content.title}</Text>
        {content.hint && <Text className="break-words">{content.hint}</Text>}
        {key_fingerprint && <Text className="break-all">{keyLabel} Key ID: {key_fingerprint}</Text>}
        {created && (
          <Text>
            {t('views:commits.verifiedOn', 'Verified on')} {formatDate(created)}
          </Text>
        )}
      </div>
    </div>
  )

  return (
    <Popover
      content={popoverContent}
      side="bottom"
      align="center"
      theme="default"
      className="max-w-80"
    >
      <button type="button" className="cursor-pointer">
        <StatusBadge variant="outline" size="sm" theme={badgeTheme}>
          {label}
        </StatusBadge>
      </button>
    </Popover>
  )
}

CommitVerificationBadge.displayName = 'CommitVerificationBadge'
