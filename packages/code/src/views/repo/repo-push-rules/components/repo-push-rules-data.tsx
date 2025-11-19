import { TFunctionWithFallback } from '@harnessio/ui/context'

import { PushRuleId } from '../types'

export interface PushRuleType {
  id: PushRuleId
  label: string
  description: string
  hasInput?: boolean
}

export const getPushRules = (t: TFunctionWithFallback): PushRuleType[] => [
  {
    id: PushRuleId.SECRET_SCANNING_ENABLED,
    label: t('views:repos.SecretScanningEnabled', 'Secret scanning enabled'),
    description: t(
      'views:repos.SecretScanningEnabledDescription',
      'Only allow users with bypass permission to push commits containing secrets'
    )
  },
  {
    id: PushRuleId.PRINCIPAL_COMMITTER_MATCH,
    label: t('views:repos.PrincipalCommitterMatch', 'Principal committer match'),
    description: t(
      'views:repos.PrincipalCommitterMatchDescription',
      'Only allow users with bypass permission to push commits in case of principal committer mismatch'
    )
  },
  {
    id: PushRuleId.FILE_SIZE_LIMIT,
    label: t('views:repos.FileSizeLimit', 'File size limit'),
    description: t(
      'views:repos.FileSizeLimitDescription',
      'Only allow users with bypass permission to push files larger than the specified size'
    ),
    hasInput: true
  }
]
