import { z } from 'zod'

export const repoBranchSettingsFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  targetPatterns: z.string().min(1, 'Patterns are required'),
  toggleValue: z.boolean(),
  bypassValue: z.string().optional(),
  access: z.enum(['1', '2']),
  defaultBranchValue: z.boolean().optional(),
  editPermissionsValue: z.boolean().optional(),
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
