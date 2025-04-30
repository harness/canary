import { TranslationStore } from '@views/repo'
import { z } from 'zod'

export const makeCreateTagFormSchema = (t: TranslationStore['t']) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: t('views:repos.createTagDialog.validation.name', 'Tag name is required') })
      .refine(data => !data.includes(' '), {
        message: t('views:repos.createTagDialog.validation.noSpaces', 'Name cannot contain spaces')
      }),
    target: z
      .string()
      .min(1, { message: t('views:repos.createTagDialog.validation.target', 'Base branch is required') })
      .trim(),
    message: z.string().min(1, { message: t('views:createTagDialog.validation.message', 'Description is required') })
  })

export type CreateTagFormFields = z.infer<ReturnType<typeof makeCreateTagFormSchema>>
