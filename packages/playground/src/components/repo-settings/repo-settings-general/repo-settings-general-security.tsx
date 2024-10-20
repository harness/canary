import React, { useEffect } from 'react'
import { Text, Checkbox } from '@harnessio/canary'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { FormFieldSet } from '../../../index'

const formSchema = z.object({
  secretScanning: z.boolean().optional()
})

export type FormFields = z.infer<typeof formSchema> // Automatically generate a type from the schema

// interface RepoSettingsSecurityFormProps {
//   onFormSubmit?: (data: FormFields) => void
//   apiError: string | null
// }
export const RepoSettingsSecurityForm: React.FC /*<RepoSettingsSecurityFormProps>*/ = ({
  securityScanning,
  handleUpdateSecuritySettings
}) =>
  // {
  // onFormSubmit apiError = null
  // }
  {
    const {
      handleSubmit,
      setValue,
      watch,
      formState: { errors }
    } = useForm<FormFields>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
      defaultValues: {
        secretScanning: securityScanning || null
      }
    })

    const onCheckboxChange = (checked: boolean) => {
      setValue('secretScanning', checked)
      handleSubmit(data => {
        console.log(data)
        handleUpdateSecuritySettings(data)
        // onFormSubmit(data)
      })()
    }

    useEffect(() => {
      setValue('secretScanning', securityScanning)
    }, [securityScanning])

    return (
      <>
        <Text size={4} weight="medium">
          Security
        </Text>
        <FormFieldSet.Root className="mb-0">
          <FormFieldSet.ControlGroup>
            <FormFieldSet.Option
              className="mt-0"
              control={
                <Checkbox checked={watch('secretScanning')} id="secret-scanning" onCheckedChange={onCheckboxChange} />
              }
              id="secret-scanning"
              label="Secret scanning"
              description="Block commits containing secrets like passwords, API keys and tokens."
            />
            {errors.secretScanning && (
              <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
                {errors.secretScanning.message?.toString()}
              </FormFieldSet.Message>
            )}
          </FormFieldSet.ControlGroup>

          {/* {apiError && (
          <>
            <Spacer size={2} />
            <Text size={1} className="text-destructive">
              {apiError?.toString()}
            </Text>
          </>
        )} */}
        </FormFieldSet.Root>
      </>
    )
  }
