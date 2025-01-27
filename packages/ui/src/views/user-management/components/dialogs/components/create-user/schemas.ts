import { z } from 'zod'

export const newUserSchema = z.object({
  uid: z.string().min(1, { message: 'Please provide a user ID' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  display_name: z.string().min(1, { message: 'Please provide a display name' })
})
