import { z } from 'zod'

import { SSLVerificationEnum, TriggerEventsEnum, WebhookTriggerEnum } from './types'

export const createWebhookFormSchema = z.object({
  enabled: z.boolean(),
  identifier: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  url: z.string().url('Please enter a valid URL'),
  secret: z.string().optional(),
  insecure: z.string(z.nativeEnum(SSLVerificationEnum)),
  trigger: z.string(z.nativeEnum(TriggerEventsEnum)),
  triggers: z.array(z.nativeEnum(WebhookTriggerEnum)).optional()
})
