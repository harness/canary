import React from 'react'
import { Input, Textarea } from '@harnessio/canary'
import { FormFieldSet, MessageTheme } from '../../../index'

export const RuleNameField = ({ register, errors }) => (
  <FormFieldSet.ControlGroup>
    <FormFieldSet.Label htmlFor="name" required>
      Name
    </FormFieldSet.Label>
    <Input id="name" {...register('name')} placeholder="Enter rule name" autoFocus />
    {errors.name && (
      <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors.name.message?.toString()}</FormFieldSet.Message>
    )}
  </FormFieldSet.ControlGroup>
)
