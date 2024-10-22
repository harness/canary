import { z } from 'zod'

export const repoBranchSettingsFormSchema = z.object({
  identifier: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  pattern: z.string().min(1, 'Patterns are required'),
  state: z.boolean(),
  bypass: z.string().optional(),
  access: z.enum(['1', '2']),
  default: z.boolean().optional(),
  repo_owners: z.boolean().optional(),
  rules: z.array(
    z.object({
      id: z.string(),
      checked: z.boolean(),
      submenu: z.array(z.string()),
      selectOptions: z.string()
    })
  )
})

export type RepoBranchSettingsFormFields = z.infer<typeof repoBranchSettingsFormSchema>
