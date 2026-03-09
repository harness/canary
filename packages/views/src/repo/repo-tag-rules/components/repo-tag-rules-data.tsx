import { TFunctionWithFallback } from '@harnessio/ui/context'

import { TagRuleId } from '../types'

export interface TagRuleType {
  id: TagRuleId
  label: string
  description: string
}

export const getTagRules = (t: TFunctionWithFallback): TagRuleType[] => [
  {
    id: TagRuleId.BLOCK_TAG_CREATION,
    label: t('views:repos.BlockTagCreation', 'Block tag creation'),
    description: t(
      'views:repos.BlockTagCreationDescription',
      'Only allow users with bypass permission to create matching tags'
    )
  },
  {
    id: TagRuleId.BLOCK_TAG_DELETION,
    label: t('views:repos.BlockTagDeletion', 'Block tag deletion'),
    description: t(
      'views:repos.BlockTagDeletionDescription',
      'Only allow users with bypass permission to delete matching tags'
    )
  },
  {
    id: TagRuleId.BLOCK_TAG_UPDATE,
    label: t('views:repos.BlockTagUpdate', 'Block tag update'),
    description: t(
      'views:repos.BlockTagUpdateDescription',
      'Only allow users with bypass permission to update matching tags'
    )
  }
]
