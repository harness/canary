import { useForm, type SubmitHandler } from 'react-hook-form'

import {
  Alert,
  Button,
  ButtonGroup,
  ControlGroup,
  Fieldset,
  FormSeparator,
  FormWrapper,
  Input,
  Spacer,
  Text
} from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { RadioOption, RadioSelect } from '@views/components/RadioSelect'
import { z } from 'zod'

import { DelegateConnectivityList } from '../components/delegate-connectivity-list'
import { DelegateItem } from '../types'

export enum DelegateTypes {
  ANY = 'any',
  TAGS = 'tags'
}

const delegateSelectorFormSchema = z
  .object({
    type: z.string(),
    tags: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (data.type === DelegateTypes.TAGS && data.tags?.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please provide a Tag',
        path: ['tags']
      })
    }
  })

export type DelegateSelectorFormFields = z.infer<typeof delegateSelectorFormSchema>

export interface DelegateSelectorFormProps {
  delegates: DelegateItem[]
  useTranslationStore: () => TranslationStore
  onFormSubmit: (data: DelegateSelectorFormFields) => void
  onBack: () => void
  apiError?: string
  isLoading: boolean
}

export const DelegateSelectorForm = (props: DelegateSelectorFormProps): JSX.Element => {
  const { delegates, useTranslationStore, onFormSubmit, onBack, apiError = null, isLoading } = props
  const { t: _t } = useTranslationStore()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<DelegateSelectorFormFields>({
    resolver: zodResolver(delegateSelectorFormSchema),
    mode: 'onChange',
    defaultValues: {
      type: DelegateTypes.ANY,
      tags: ''
    }
  })

  const onSubmit: SubmitHandler<DelegateSelectorFormFields> = data => {
    onFormSubmit(data)
    reset()
  }

  const delegateType = watch('type')
  const selectedTags = watch('tags')

  const options: Array<RadioOption<DelegateTypes>> = [
    {
      id: 'any',
      title: 'Any delegate',
      description: 'Use any available delegate',
      value: DelegateTypes.ANY
    },
    {
      id: 'tags',
      title: 'Delegate with tags',
      description: 'Use delegate with following tags',
      value: DelegateTypes.TAGS
    }
  ]

  return (
    <SandboxLayout.Content className="h-full px-0 pt-0">
      <Spacer size={5} />
      <FormWrapper className="flex h-full flex-col" onSubmit={handleSubmit(onSubmit)}>
        <Fieldset className="mb-0">
          <RadioSelect
            id="type"
            {...register('type')}
            options={options}
            value={delegateType}
            onValueChange={value => setValue('type', value)}
          />
        </Fieldset>

        {apiError && (
          <Alert.Container variant="destructive" className="mb-8">
            <Alert.Description>{apiError?.toString()}</Alert.Description>
          </Alert.Container>
        )}
        <FormSeparator />

        {delegateType === DelegateTypes.TAGS && (
          <Fieldset className="py-2">
            {/* TAGS */}
            <Input
              id="tags"
              {...register('tags')}
              label="Tags"
              caption="Seperate tags with commas or press Enter. Use key:value for objects."
              placeholder="Enter tags"
              size="md"
              error={errors.tags?.message?.toString()}
            />
          </Fieldset>
        )}

        <Text size={4}>Test Delegate connectivity</Text>
        <DelegateConnectivityList
          delegates={delegates}
          useTranslationStore={useTranslationStore}
          isLoading={isLoading}
          selectedTags={selectedTags?.split(',') || []}
        />

        <div className="absolute inset-x-0 bottom-0 bg-cn-background-2 p-4 shadow-md">
          <ControlGroup>
            <ButtonGroup className="flex flex-row justify-between">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit">Connect delegates</Button>
            </ButtonGroup>
          </ControlGroup>
        </div>

        <div className="pb-16"></div>
      </FormWrapper>
    </SandboxLayout.Content>
  )
}
