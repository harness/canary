import { i18n, TFunction } from 'i18next'
import { z } from 'zod'

export interface TypesUser {
  admin?: boolean
  blocked?: boolean
  created?: number
  display_name?: string
  email?: string
  uid?: string
  updated?: number
  url?: string
}

export interface TranslationStore {
  t: TFunction
  i18n: i18n
  changeLanguage: (lng: string) => void
}

export const formSchema = z.object({
  title: z.string().min(1, { message: 'Please provide a pull request title' }),
  description: z.string().min(1, { message: 'Please provide a description' })
})
export type FormFields = z.infer<typeof formSchema> // Automatically generate a type from the schema

export interface TypesDiffStats {
  additions?: number | null
  commits?: number | null
  deletions?: number | null
  files_changed?: number | null
}

export interface ViolationState {
  violation: boolean
  bypassable: boolean
  bypassed: boolean
}

// TODO: The error type will need to be properly defined once it's clear what format the errors will have and whether they need to be passed into the UI components. It was migrated from @harnessio/code-service-client.
export interface UsererrorError {
  message?: string
  values?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
}

export type EnumPrincipalType = 'service' | 'serviceaccount' | 'user'

export interface PrincipalType {
  id?: number
  uid: string
  display_name: string
  email: string
  type?: EnumPrincipalType
  created?: number
  updated?: number
  // TODO: need to add avatar
  avatar_url?: string
}
