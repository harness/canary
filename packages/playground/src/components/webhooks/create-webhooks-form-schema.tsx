import { z } from 'zod'
import { BranchEvents, TagEvents, PREvents } from './types'

export const createWebhookFormSchema = z.object({
  enabled: z.boolean(),
  identifier: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  url: z.string().url('Please enter a valid URL'),
  secret: z.string().optional(),
  insecure: z.enum(['1', '2'], {
    errorMap: () => ({ message: 'Please select if SSL verification should be enabled' })
  }),
  trigger: z.enum(['1', '2'], { errorMap: () => ({ message: 'Please select the trigger event' }) }),
  branchEvents: z.array(z.nativeEnum(BranchEvents)).optional(),
  tagEvents: z.array(z.nativeEnum(TagEvents)).optional(),
  prEvents: z.array(z.nativeEnum(PREvents)).optional()
})
