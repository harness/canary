import { TranslationStore } from '@/views'
import { makeValidationUtils } from '@utils/validation'
import { z } from 'zod'

import { SSLVerificationEnum, TriggerEventsEnum, WebhookTriggerEnum } from '../types'

export const makeCreateWebhookFormSchema = (t: TranslationStore['t']) => {
  const { required, specialSymbols, noSpaces, invalid } = makeValidationUtils(t)

  return z.object({
    enabled: z.boolean(),
    identifier: z
      .string()
      .nonempty(required(t('views:repos.name')))
      .regex(...specialSymbols(t('views:repos.name')))
      .refine(...noSpaces(t('views:repos.name'))),
    description: z.string().optional(),
    url: z.string().url(invalid(t('views:repos.urlLabel'))),
    secret: z.string().optional(),
    insecure: z.string(z.nativeEnum(SSLVerificationEnum)),
    trigger: z.string(z.nativeEnum(TriggerEventsEnum)),
    triggers: z.array(z.nativeEnum(WebhookTriggerEnum)).optional()
  })
}
