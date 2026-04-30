import { z } from 'zod'

import {
  AICR_CRITERION_DISPLAY_MAX_LENGTH,
  AICR_CRITERION_IDENTIFIER_MAX_LENGTH,
  AICR_CRITERION_PROMPT_MAX_LENGTH,
  AICR_SYSTEM_PROMPT_MAX_LENGTH
} from './repo-aicr-settings.constants'
import { AicrCriterionSeverity } from './repo-aicr-settings.types'

/**
 * Inline editor schema for adding / editing one criterion.
 * Identifier is generated from display when adding new entries, so the
 * editor surface only validates display + prompt.
 */
export const aicrCriterionEditorSchema = z.object({
  display: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(AICR_CRITERION_DISPLAY_MAX_LENGTH, `Name must be at most ${AICR_CRITERION_DISPLAY_MAX_LENGTH} characters`),
  prompt: z.string().trim().max(AICR_CRITERION_PROMPT_MAX_LENGTH, 'Description is too long').default('')
})

export type AicrCriterionEditorFields = z.infer<typeof aicrCriterionEditorSchema>

export const aicrCriterionSchema = z.object({
  identifier: z.string().trim().min(1).max(AICR_CRITERION_IDENTIFIER_MAX_LENGTH),
  display: z.string().trim().min(1).max(AICR_CRITERION_DISPLAY_MAX_LENGTH),
  prompt: z.string().trim().max(AICR_CRITERION_PROMPT_MAX_LENGTH).default(''),
  severity: z.nativeEnum(AicrCriterionSeverity),
  enabled: z.boolean(),
  bypass: z.boolean(),
  githubCheck: z.boolean()
})

export const aicrSystemPromptSchema = z.object({
  systemPrompt: z
    .string()
    .max(AICR_SYSTEM_PROMPT_MAX_LENGTH, `Prompt must be at most ${AICR_SYSTEM_PROMPT_MAX_LENGTH} characters`)
    .default('')
})

export type AicrSystemPromptFields = z.infer<typeof aicrSystemPromptSchema>

/**
 * Helper for converting a freshly-typed display name into a stable identifier
 * slug. Kept here so the editor and the page agree on the rule.
 */
export function deriveAicrCriterionIdentifier(display: string): string {
  const slug = display
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, AICR_CRITERION_IDENTIFIER_MAX_LENGTH)

  return slug || `criterion_${Date.now()}`
}
