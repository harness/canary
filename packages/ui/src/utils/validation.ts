import { TranslationStore } from '@/views'
import { z } from 'zod'

export const makeValidationUtils = (t: TranslationStore['t']) => ({
  required: (name: string): string => t('views:utils.validation.required', `${name} is required`, { name }),
  invalid: (name: string): string => t('views:utils.validation.invalid', `${name} is invalid`, { name }),
  minLength: (length: number, name: string): [number, string] => [
    length,
    t('views:utils.validation.minLength', `${name} must be at least ${length} characters`, { name, length })
  ],
  maxLength: (length: number, name: string): [number, string] => [
    length,
    t('views:utils.validation.maxLength', `${name} must be no longer than ${length} characters`, { name, length })
  ],
  specialSymbols: (name: string): [RegExp, string] => [
    /^[a-zA-Z0-9._-\s]+$/,
    t(
      'views:utils.validation.specialSymbols',
      `${name} must contain only letters, numbers, and the characters: - _ .`,
      { name }
    )
  ],
  noSpaces: (name: string): [(data: string) => boolean, string] => [
    data => !data.includes(' '),
    t('views:utils.validation.noSpaces', `${name} cannot contain spaces`, { name })
  ]
})

export const makeFloatValidationUtils =
  (t: TranslationStore['t'], ctx: z.RefinementCtx) =>
  ({ value: v, path, name }: { value: string | undefined; path: string; name: string }) => {
    const { required, invalid, maxLength, specialSymbols, noSpaces } = makeValidationUtils(t)
    const value = v?.trim()

    const addIssue = (message: string) => ctx.addIssue({ code: 'custom', path: [path], message })

    return {
      requiredFloat: (): void => {
        if (value) return

        addIssue(required(name))
      },
      maxLengthFloat: (length: number): void => {
        if (!value) return
        const [maxLen, errorMessage] = maxLength(length, name)
        if (value.length <= maxLen) return

        addIssue(errorMessage)
      },
      specialSymbolsFloat: (): void => {
        if (!value) return
        const [regex, errorMessage] = specialSymbols(name)
        if (regex.test(value)) return

        addIssue(errorMessage)
      },
      noSpacesFloat: (): void => {
        if (!value) return
        const [checkFn, errorMessage] = noSpaces(name)
        if (checkFn(value)) return

        addIssue(errorMessage)
      },
      urlFloat: (): void => {
        if (!value) return

        try {
          new URL(value)
        } catch (error) {
          addIssue(invalid(name))
        }
      }
    }
  }
