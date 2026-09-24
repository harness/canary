import { describe, expect, it } from 'vitest'

import { getValidationSchema } from '@harnessio/forms'

import { getRunStepFormDefinition } from '../../run-step-common'
import { RUN_STEP_IDENTIFIER, RUN_TEST_STEP_IDENTIFIER } from '../../types'

describe('run-step-common', () => {
  describe('script validation', () => {
    it('allows an empty script when a container image is set', async () => {
      const formDefinition = getRunStepFormDefinition(RUN_STEP_IDENTIFIER)
      const values = { run: { script: '', container: { image: 'alpine' } } }

      const schema = getValidationSchema(formDefinition, values)
      const result = await schema.safeParseAsync(values)

      expect(result.success).toBe(true)
    })

    it('fails validation when both script and container image are empty', async () => {
      const formDefinition = getRunStepFormDefinition(RUN_STEP_IDENTIFIER)
      const values = { run: { script: '', container: {} } }

      const schema = getValidationSchema(formDefinition, values)
      const result = await schema.safeParseAsync(values)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]).toMatchObject({
          path: ['run', 'script'],
          message: 'Script or container image is required'
        })
      }
    })

    it('passes validation when a script is provided and no container image is set', async () => {
      const formDefinition = getRunStepFormDefinition(RUN_STEP_IDENTIFIER)
      const values = { run: { script: 'echo hello', container: {} } }

      const schema = getValidationSchema(formDefinition, values)
      const result = await schema.safeParseAsync(values)

      expect(result.success).toBe(true)
    })

    it('applies the same conditional requirement to the run-test step', async () => {
      const formDefinition = getRunStepFormDefinition(RUN_TEST_STEP_IDENTIFIER)

      const valuesWithImage = { 'run-test': { script: '', container: { image: 'alpine' } } }
      const schemaWithImage = getValidationSchema(formDefinition, valuesWithImage)
      expect((await schemaWithImage.safeParseAsync(valuesWithImage)).success).toBe(true)

      const valuesWithoutImage = { 'run-test': { script: '', container: {} } }
      const schemaWithoutImage = getValidationSchema(formDefinition, valuesWithoutImage)
      expect((await schemaWithoutImage.safeParseAsync(valuesWithoutImage)).success).toBe(false)
    })
  })
})
