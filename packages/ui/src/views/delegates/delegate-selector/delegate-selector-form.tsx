import { ElementType, FC, useEffect, useMemo, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'

import {
  Alert,
  Button,
  ButtonLayout,
  CardSelect,
  Drawer,
  EntityFormLayout,
  Fieldset,
  FormInput,
  FormSeparator,
  FormWrapper,
  Spacer,
  Text
} from '@/components'
import { useTranslation } from '@/context'
import { DelegateConnectivityList, DelegateItem } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { RadioSelectOption } from '@views/components/RadioSelect'
import { z } from 'zod'

const componentsMap: Record<
  'true' | 'false',
  {
    Footer: ElementType
    Body: ElementType
  }
> = {
  true: {
    Body: Drawer.Body,
    Footer: Drawer.Footer
  },
  false: {
    Body: 'div',
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
        key: z.string()
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
  const { t } = useTranslation()

  const [searchTag, setSearchTag] = useState('')
  const [matchedDelegates, setMatchedDelegates] = useState(0)

  const { Body, Footer } = componentsMap[isDrawer ? 'true' : 'false']
  const bodyProps = isDrawer ? { classNameContent: 'min-w-0' } : {}

  const formMethods = useForm<DelegateSelectorFormFields>({
    resolver: zodResolver(delegateSelectorFormSchema),
    mode: 'onChange',
    defaultValues: {
      type: preSelectedTags?.length || disableAnyDelegate ? DelegateSelectionTypes.TAGS : DelegateSelectionTypes.ANY,
      tags: preSelectedTags?.length ? preSelectedTags?.map(tag => ({ id: tag, key: tag })) : []
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
    onFormSubmit(data)
    reset()
  }

  const delegateType = watch('type')
  const selectedTags = watch('tags')

  useEffect(() => {
    setMatchedDelegates(
      getMatchedDelegatesCount(
        delegates,
        selectedTags?.map(tag => tag.id)
      )
    )
  }, [getMatchedDelegatesCount, delegates, selectedTags])

  const options: Array<RadioSelectOption<DelegateSelectionTypes>> = [
    {
      id: 'any',
      title: t('views:delegates.anyDelegate', 'Any delegate'),
      description: t('views:delegates.useAnyDelegate', 'Use any available delegate'),
      value: DelegateSelectionTypes.ANY,
      disabled: disableAnyDelegate
    },
    {
      id: 'tags',
      title: t('views:delegates.delegateTags', 'Delegate with tags'),
      description: t('views:delegates.useDelegateTags', 'Use delegate with following tags'),
      value: DelegateSelectionTypes.TAGS
    }
  ]

  const filteredTags = useMemo(() => {
    return tagsList?.filter(tag => tag?.toLowerCase().includes(searchTag?.toLowerCase()))
  }, [searchTag, tagsList])

  return (
    <>
      <Body {...bodyProps}>
        <Spacer size={5} />
        <FormWrapper {...formMethods} className="flex h-full flex-col" onSubmit={handleSubmit(onSubmit)}>
          <Fieldset className="mb-0">
            <CardSelect.Root
              type="single"
              {...register('type')}
              value={delegateType}
              onValueChange={(value: unknown) => setValue('type', value as DelegateSelectionTypes)}
            >
              {options.map(option => (
                <CardSelect.Item value={option.value} key={option.value?.toString()} disabled={option.disabled}>
                  <CardSelect.Title>{option.title}</CardSelect.Title>
                  {option.description && <CardSelect.Description>{option.description}</CardSelect.Description>}
                </CardSelect.Item>
              ))}
            </CardSelect.Root>
          </Fieldset>

          {apiError && (
            <Alert.Root theme="danger" className="mb-8">
              <Alert.Description>{apiError?.toString()}</Alert.Description>
            </Alert.Root>
          )}
          <FormSeparator />

          {delegateType === DelegateSelectionTypes.TAGS && (
            <>
              <Fieldset className="py-2">
                {/* TAGS */}
                <FormInput.MultiSelect
                  label={t('views:repos.tags', 'Tags')}
                  name="tags"
                  placeholder={t('views:delegates.enterTags', 'Enter tags')}
                  defaultValue={selectedTags}
                  options={filteredTags?.map(tag => {
                    return { id: tag, key: tag }
                  })}
                  searchQuery={searchTag}
                  setSearchQuery={setSearchTag}
                  error={errors.tags?.message?.toString()}
                />
              </Fieldset>
              <Text variant="heading-base">{t('views:delegates.testDelegate', 'Test Delegate connectivity')}</Text>
              <p>
                {t('views:delegates.delegateMatches', 'Matches: ')}
                {matchedDelegates}
              </p>
              <DelegateConnectivityList
                delegates={delegates}
                isLoading={isLoading}
                selectedTags={selectedTags?.map(tag => tag.id)}
                isDelegateSelected={isDelegateSelected}
              />
            </>
          )}
        </FormWrapper>
      </Body>
      <Footer>
        <ButtonLayout.Root>
          <ButtonLayout.Primary>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={delegateType === DelegateSelectionTypes.TAGS && selectedTags.length === 0}
            >
              {t('views:delegates.connectDelegates', 'Connect ')}
              {delegateType === DelegateSelectionTypes.TAGS ? (matchedDelegates > 0 ? matchedDelegates : '') : 'any'}
              &nbsp;
              {delegateType === DelegateSelectionTypes.TAGS && matchedDelegates > 1 ? 'delegates' : 'delegate'}
            </Button>
          </ButtonLayout.Primary>
          <ButtonLayout.Secondary>
            <Button variant="outline" onClick={onBack}>
              {t('views:createProject.backButton', 'Back')}
            </Button>
          </ButtonLayout.Secondary>
        </ButtonLayout.Root>
      </Footer>
    </>
  )
}
