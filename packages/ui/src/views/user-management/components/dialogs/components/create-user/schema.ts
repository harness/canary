import { z } from 'zod'

export const createNewUserSchema = (t: (key: string, defaultValue: string) => string) =>
  z.object({
    uid: z.string().min(1, {
      message: t('views:userManagement.createUser.validation.userIdRequired', 'Please provide a user ID')
    }),
    email: z.string().email({
      message: t('views:userManagement.createUser.validation.invalidEmail', 'Please enter a valid email address')
    }),
    display_name: z.string().min(1, {
      message: t('views:userManagement.createUser.validation.displayNameRequired', 'Please provide a display name')
    })
  })

export type NewUserFields = z.infer<ReturnType<typeof createNewUserSchema>>
