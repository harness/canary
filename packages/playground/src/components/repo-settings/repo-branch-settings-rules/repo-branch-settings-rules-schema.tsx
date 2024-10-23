import { z } from 'zod'

export const repoBranchSettingsFormSchema = z.object({
  identifier: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  pattern: z.string(),
  patterns: z.array(
    z.object({
      pattern: z.string(),
      option: z.enum(['Include', 'Exclude'])
    })
  ),
  state: z.boolean(),
  bypass: z.array(z.number()),
  access: z.enum(['1', '2']),
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
