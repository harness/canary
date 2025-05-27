import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button, Checkbox, FormInput, FormWrapper, Radio } from '@harnessio/ui/components'

// Define the validation schema with zod
const formSchema = z.object({
  inputField: z.string().trim().min(3, 'Input must be at least 3 characters'),
  radioField: z.enum(['option1', 'option2', 'option3'], {
    required_error: 'Please select an option.'
  }),
  // checkboxField: z.boolean().refine(val => {return val === true}, { message: 'You must check this box' })
  checkboxField: z.literal(true, {
    errorMap: () => ({
      message: 'You must check this box'
    })
  })
  // checkboxField: z
  //   .string()
  //   .transform(val => val === 'on' || val)
  //   .or(z.boolean())
  //   .refine(val => val === true, { message: 'You must check this box' })
})

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>

export const ExampleFormComponent = () => {
  const [submittedValue, setSubmittedValue] = useState<FormValues | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const numberRef = useRef<HTMLInputElement | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    numberRef?.current?.focus()

    formRef?.current?.addEventListener('submit', e => {
      e.preventDefault()
      console.log('Form submitted')
    })
  }, [])

  // Initialize react-hook-form with zod resolver
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inputField: 'some text',
      radioField: 'option1'
      // checkboxField: false
    }
  })

  const { register, handleSubmit } = formMethods

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    console.log('data', data)
    setSubmittedValue(data)
  }

  return (
    <div className="w-full max-w-md p-6">
      <form action="">
        <Checkbox label="Checkbox Field 2" caption="This is a caption" />
      </form>
      {/* ‼️ It is mandatory to pass all return values from useForm to FormWrapper  */}
      <FormWrapper {...formMethods} formRef={formRef} onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormInput.Text {...register('inputField')} label="Input Field" placeholder="Enter at least 3 characters" />

        {/* <input type="number" {...register('numberField')} /> */}

        <FormInput.Radio {...register('radioField')} label="Radio Field">
          <Radio.Item value="option1" label="Option 1" />
          <Radio.Item value="option2" label="Option 2" />
        </FormInput.Radio>

        <FormInput.Checkbox {...register('checkboxField')} label="Checkbox Field" caption="This is a caption" />

        <Checkbox label="Checkbox Field" />

        <Button type="submit" disabled={formMethods.formState.isSubmitting}>
          {formMethods.formState.isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>

        {submittedValue && (
          <pre className="mt-4 p-3 bg-green-50 text-green-800 rounded">{JSON.stringify(submittedValue, null, 2)}</pre>
        )}
      </FormWrapper>
    </div>
  )
}

ExampleFormComponent.displayName = 'ExampleFormComponent'
