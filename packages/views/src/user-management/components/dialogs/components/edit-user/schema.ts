import { z } from 'zod'

export const createEditUserSchema = (t: (key: string, defaultValue: string) => string) =>
  z.object({
    email: z.string().email({
      message: t('views:userManagement.editUser.validation.invalidEmail', 'Please enter a valid email address')
    }),
    displayName: z.string().min(1, {
      message: t('views:userManagement.editUser.validation.displayNameRequired', 'Please provide a display name')
    }),
    userID: z.string()
  })

export type EditUserFields = z.infer<ReturnType<typeof createEditUserSchema>>
