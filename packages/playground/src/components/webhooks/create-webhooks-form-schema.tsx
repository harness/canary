import { z } from 'zod'

export const createWebhookFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  payloadUrl: z.string().url('Please enter a valid URL'),
  secret: z.string().min(1, 'Secret is required'),
  sslVerification: z.enum(['1', '2'], {
    errorMap: () => ({ message: 'Please select if SSL verification should be enabled' })
  })
  //   trigger: z.enum(['1', '2'], { errorMap: () => ({ message: 'Please select the trigger event' }) })
})

export type CreateWebhookFormFields = z.infer<typeof createWebhookFormSchema>
