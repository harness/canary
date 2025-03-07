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

export const makeProjectNameSchema = (t: TranslationStore['t']) =>
  z
    .string()
    .trim()
    .nonempty(t('views:createProject.validation.nameNoEmpty', 'Name can’t be blank'))
    .min(4, t('views:createProject.validation.nameMinLength', 'Name should be at least 4 characters'))
    .max(100, t('views:createProject.validation.nameMax', 'Name must be no longer than 100 characters'))
    .regex(
      /^[a-zA-Z0-9._-\s]+$/,
      t(
        'views:createProject.validation.nameRegex',
        'Name must contain only letters, numbers, and the characters: - _ .'
      )
    )
    .refine(data => !data.includes(' '), t('views:createProject.validation.noSpaces', 'Name cannot contain spaces'))

export const makeProjectDescriptionSchema = (t: TranslationStore['t']) =>
  z
    .string()
    .trim()
    .max(1024, t('views:createProject.validation.descriptionMax', 'Description must be no longer than 1024 characters'))
