import { ControllerRenderProps, FieldValues, UseControllerProps, UseControllerReturn } from 'react-hook-form'

import { useController as rhfUseController } from '@harnessio/forms'

type UseDynamicControllerProps = Omit<UseControllerProps<FieldValues, string>, 'name'> & {
  name: string
}

interface GenericField<TValue> extends Omit<ControllerRenderProps, 'value'> {
  value: TValue
}

export interface UseDynamicControllerReturn<TValue> extends UseControllerReturn<FieldValues, string> {
  field: GenericField<TValue>
}

export function useDynamicController<TValue>(props: UseDynamicControllerProps): UseDynamicControllerReturn<TValue> {
  return rhfUseController<FieldValues, string>(props) as UseDynamicControllerReturn<TValue>
}
