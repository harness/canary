import { useCallback, useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'

import {
  Alert,
  Button,
  ButtonGroup,
  ControlGroup,
  Fieldset,
  FormSeparator,
  FormWrapper,
  MultiSelect,
  MultiSelectOptionType,
  Spacer,
  Text
} from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { RadioSelect, RadioSelectOption } from '@views/components/RadioSelect'
import { z } from 'zod'

import { DelegateConnectivityList } from '../components/delegate-connectivity-list'
import { DelegateItem } from '../types'

export enum DelegateSelectionTypes {
  ANY = 'any',
  TAGS = 'tags'
}

const delegateSelectorFormSchema = z
  .object({
    type: z.string(),
    tags: z.array(
      z.object({
        id: z.string(),
        label: z.string()
      })
    )
  })
  .superRefine((data, ctx) => {
    if (data.type === DelegateSelectionTypes.TAGS && data.tags?.length === 0) {
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
  tagsList: string[]
  useTranslationStore: () => TranslationStore
  onFormSubmit: (data: DelegateSelectorFormFields) => void
  onBack: () => void
  apiError?: string
  isLoading: boolean
  isDelegateSelected: (selectors: string[], tags: string[]) => boolean
  getMatchedDelegatesCount: (delegates: DelegateItem[], tags: string[]) => number
  preSelectedTags?: string[]
  disableAnyDelegate?: boolean
}

export const DelegateSelectorForm = (props: DelegateSelectorFormProps): JSX.Element => {
  const {
    delegates,
    tagsList,
    useTranslationStore,
    onFormSubmit,
    onBack,
    apiError = null,
    isLoading,
    isDelegateSelected,
    getMatchedDelegatesCount,
    preSelectedTags,
    disableAnyDelegate
  } = props
  const { t } = useTranslationStore()
  const [searchTag, setSearchTag] = useState('')
  const [matchedDelegates, setMatchedDelegates] = useState(0)
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
      type: preSelectedTags?.length || disableAnyDelegate ? DelegateSelectionTypes.TAGS : DelegateSelectionTypes.ANY,
      tags: preSelectedTags?.length ? preSelectedTags.map(tag => ({ id: tag, label: tag })) : []
    }
  })

  const onSubmit: SubmitHandler<DelegateSelectorFormFields> = data => {
    onFormSubmit(data)
    reset()
  }

  const delegateType = watch('type')
  const selectedTags = watch('tags')

  useEffect(() => {
    setMatchedDelegates(
      getMatchedDelegatesCount(
        delegates,
        selectedTags.map(tag => tag.id)
      )
    )
  }, [getMatchedDelegatesCount, delegates, selectedTags])

  const options: Array<RadioSelectOption<DelegateSelectionTypes>> = [
    {
      id: 'any',
      title: 'Any delegate',
      description: 'Use any available delegate',
      value: DelegateSelectionTypes.ANY,
      disabled: disableAnyDelegate
    },
    {
      id: 'tags',
      title: 'Delegate with tags',
      description: 'Use delegate with following tags',
      value: DelegateSelectionTypes.TAGS
    }
  ]

  const handleTagChange = useCallback(
    (option: MultiSelectOptionType) => {
      const selectedTagIds = selectedTags.map(tag => tag.id)

      setValue!(
        'tags',
        selectedTagIds.includes(option.id as string)
          ? selectedTags.filter(tag => tag.id !== option.id)
          : [
              ...selectedTags,
              {
                id: option.id as string,
                label: option.label
              }
            ],
        { shouldValidate: true }
      )
    },
    [selectedTags, setValue]
  )

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

        {delegateType === DelegateSelectionTypes.TAGS && (
          <>
            <Fieldset className="py-2">
              {/* TAGS */}
              <MultiSelect
                {...register('tags')}
                selectedItems={selectedTags}
                t={t}
                label="Tags"
                placeholder="Enter tags"
                handleChange={handleTagChange}
                options={tagsList.map(tag => {
                  return { id: tag, label: tag }
                })}
                searchValue={searchTag}
                handleChangeSearchValue={setSearchTag}
                error={errors.tags?.message?.toString()}
              />
            </Fieldset>
            <Text size={4}>Test Delegate connectivity</Text>
            <p>Matches: {matchedDelegates}</p>
            <DelegateConnectivityList
              delegates={delegates}
              useTranslationStore={useTranslationStore}
              isLoading={isLoading}
              selectedTags={selectedTags.map(tag => tag.id)}
              isDelegateSelected={isDelegateSelected}
            />
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-cn-background-2 p-4 shadow-md">
          <ControlGroup>
            <ButtonGroup className="flex flex-row justify-between">
              <Button type="button" variant="ghost" onClick={onBack}>
                Back
              </Button>
              <Button type="submit">
                Connect&nbsp;
                {delegateType === DelegateSelectionTypes.TAGS ? matchedDelegates : 'any'}&nbsp;
                {delegateType === DelegateSelectionTypes.TAGS && matchedDelegates > 1 ? 'delegates' : 'delegate'}
              </Button>
            </ButtonGroup>
          </ControlGroup>
        </div>

        <div className="pb-16"></div>
      </FormWrapper>
    </SandboxLayout.Content>
  )
}
