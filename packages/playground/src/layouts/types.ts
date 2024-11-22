import { z } from 'zod'

export interface TypesUser {
  admin?: boolean
  blocked?: boolean
  created?: number
  display_name?: string
  email?: string
  role?: string
  uid?: string
  updated?: number
  url?: string
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
