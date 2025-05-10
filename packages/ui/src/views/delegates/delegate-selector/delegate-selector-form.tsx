import { ElementType, FC, useCallback, useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'

import {
  Alert,
  Button,
  Drawer,
  EntityFormLayout,
  Fieldset,
  FormSeparator,
  FormWrapper,
  Link,
  MultiSelect,
  MultiSelectOptionType,
  Spacer,
  Text
} from '@/components'
import { DelegateConnectivityList, DelegateItem, TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { RadioSelect, RadioSelectOption } from '@views/components/RadioSelect'
import { z } from 'zod'

const componentsMap: Record<
  'true' | 'false',
  {
    Footer: ElementType
    Inner: ElementType
  }
> = {
  true: {
    Inner: Drawer.Inner,
    Footer: Drawer.Footer
  },
  false: {
    Inner: 'div',
    Footer: EntityFormLayout.Footer
  }
}

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
  isDrawer?: boolean
}

export const DelegateSelectorForm: FC<DelegateSelectorFormProps> = ({
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
  disableAnyDelegate,
  isDrawer = false
}) => {
  const { t } = useTranslationStore()
  const [searchTag, setSearchTag] = useState('')
  const [matchedDelegates, setMatchedDelegates] = useState(0)

  const { Inner, Footer } = componentsMap[isDrawer ? 'true' : 'false']

  const formMethods = useForm<DelegateSelectorFormFields>({
    resolver: zodResolver(delegateSelectorFormSchema),
    mode: 'onChange',
    defaultValues: {
      type: preSelectedTags?.length || disableAnyDelegate ? DelegateSelectionTypes.TAGS : DelegateSelectionTypes.ANY,
      tags: preSelectedTags?.length ? preSelectedTags.map(tag => ({ id: tag, label: tag })) : []
    }
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = formMethods

  const onSubmit: SubmitHandler<DelegateSelectorFormFields> = data => {
    console.log('onSubmit')
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
    <>
      <Inner>
        <div className="flex">
          Haven&apos;t installed a delegate yet?
          <Link className="ml-1 flex flex-row items-center" to="#" suffixIcon="attachment-link">
            Install delegate
          </Link>
        </div>
        <Spacer size={5} />
        <FormWrapper {...formMethods} className="flex h-full flex-col" onSubmit={handleSubmit(onSubmit)}>
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
        </FormWrapper>
      </Inner>
      <Footer>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit(onSubmit)}>
          Connect&nbsp;
          {delegateType === DelegateSelectionTypes.TAGS ? matchedDelegates : 'any'}&nbsp;
          {delegateType === DelegateSelectionTypes.TAGS && matchedDelegates > 1 ? 'delegates' : 'delegate'}
        </Button>
      </Footer>
    </>
  )
}
