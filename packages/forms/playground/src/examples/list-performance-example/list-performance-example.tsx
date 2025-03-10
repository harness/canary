import { useMemo } from 'react'

import { RenderForm, RootForm, useZodValidationResolver } from '../../../../src'
import inputComponentFactory from '../../implementation/factory/factory'
import { defaultValues, formDefinition } from './form-definition'

function ListPerformanceExample() {
  const onSubmit = values => {
    console.log(values)
  }

  const resolver = useZodValidationResolver(formDefinition)

  const defaultValues2 = useMemo(() => defaultValues, [])

  return (
    <RootForm onSubmit={onSubmit} resolver={resolver} mode={undefined} defaultValues={defaultValues2}>
      {rootForm => (
        <>
          <RenderForm factory={inputComponentFactory} inputs={formDefinition} />
          <button onClick={() => rootForm.submitForm()}>Submit</button>
        </>
      )}
    </RootForm>
  )
}

export default ListPerformanceExample
