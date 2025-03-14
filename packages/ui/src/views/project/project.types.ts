import { makeValidationUtils } from '@utils/validation'
import { TranslationStore } from '@views/repo'
import { z } from 'zod'

export interface MemberData {
  display_name: string
  role: string
  email: string
  avatarUrl: string
  timestamp: string
  uid: string
}

export interface TypesSpace {
  created?: number
  created_by?: number
  deleted?: number | null
  description?: string
  id?: number
  identifier?: string
  parent_id?: number
  path?: string
  updated?: number
}

export interface IMemberListStore {
  memberList: MemberData[]
  spaceId: string
  totalPages: number
  page: number
  setPage: (page: number) => void
}

export const makeProjectNameSchema = (t: TranslationStore['t'], name: string) => {
  const { required, maxLength, minLength, specialSymbols, noSpaces } = makeValidationUtils(t)

  return z
    .string()
    .trim()
    .nonempty(required(name))
    .min(...minLength(4, name))
    .max(...maxLength(100, name))
    .regex(...specialSymbols(name))
    .refine(...noSpaces(name))
}

export const makeProjectDescriptionSchema = (t: TranslationStore['t'], name: string) => {
  const { maxLength } = makeValidationUtils(t)
  return z
    .string()
    .trim()
    .max(...maxLength(1024, name))
}
