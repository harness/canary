import { useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button, FormInput } from '@harnessio/ui/components'

// Define the validation schema with zod
const formSchema = z.object({
  inputField: z.string().min(3, 'Input must be at least 3 characters')
})

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>

export const SimpleForm = () => {
  const [submittedValue, setSubmittedValue] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Initialize react-hook-form with zod resolver
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inputField: 'some text'
    }
  })

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data)
    setSubmittedValue(data.inputField)
  }

  return (
    <div className="w-full max-w-md">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput.FormText
            ref={inputRef}
            name="inputField"
            label="Input Field"
            placeholder="Enter at least 3 characters"
          />

          <Button type="submit" disabled={methods.formState.isSubmitting}>
            {methods.formState.isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>

          {submittedValue && (
            <div className="mt-4 p-3 bg-green-50 text-green-800 rounded">Submitted value: {submittedValue}</div>
          )}
        </form>
      </FormProvider>
    </div>
  )
}
