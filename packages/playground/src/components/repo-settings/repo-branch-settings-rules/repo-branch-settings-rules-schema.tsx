import { z } from 'zod'
import { PatternsButtonType } from './types'

export const repoBranchSettingsFormSchema = z.object({
  identifier: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  pattern: z.string(),
  patterns: z.array(
    z.object({
      pattern: z.string(),
      option: z.enum([PatternsButtonType.INCLUDE, PatternsButtonType.EXCLUDE])
    })
  ),
  state: z.boolean(),
  bypass: z.array(z.number()),
  default: z.boolean().optional(),
  repo_owners: z.boolean().optional(),
  rules: z.array(
    z.object({
      id: z.string(),
      checked: z.boolean(),
      submenu: z.array(z.enum(['merge', 'rebase', 'squash'])),
      selectOptions: z.array(z.string())
    })
  )
})
