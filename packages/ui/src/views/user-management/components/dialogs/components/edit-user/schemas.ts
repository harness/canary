import { z } from 'zod'

export const editUserSchema = z.object({
  userID: z.string(),
  email: z.string().email({ message: 'Please enter a valid email' }),
  displayName: z.string().min(1, { message: 'Display name is required' })
})
