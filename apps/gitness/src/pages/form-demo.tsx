import { FormInput } from '@harnessio/ui/components'

import { SimpleForm } from '../components/simple-form'

export const FormDemoPage = () => {
  return (
    <div className="flex flex-col gap-2 items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center">React Hook Form with Zod Demo</h1>
        <SimpleForm />
      </div>
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center">Simple input</h1>
        <FormInput.FormText name="inputField" label="Input Field" placeholder="Enter something you like" />
      </div>
    </div>
  )
}

export default FormDemoPage
