import { FC, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import {
  Alert,
  Button,
  ButtonLayout,
  ControlGroup,
  Fieldset,
  FormInput,
  FormWrapper,
  IconV2,
  Label,
  Layout,
  SkeletonForm,
  Tag,
  Text
} from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@/utils'
import {
  ColorsEnum,
  CreateLabelFormFields,
  createLabelFormSchema,
  ILabelsStore,
  LabelType,
  NotFoundPage,
  SandboxLayout
} from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'

import { LabelFormColorAndNameGroup } from './components/label-form-color-and-name-group'

export interface LabelFormPageProps {
  useLabelsStore: () => ILabelsStore
  onSubmit: (data: CreateLabelFormFields) => void
  isSaving: boolean
  onFormCancel: () => void
  error?: string
  labelId?: string
  className?: string
}

export const LabelFormPage: FC<LabelFormPageProps> = ({
  useLabelsStore,
  onSubmit,
  isSaving,
  onFormCancel,
  error,
  labelId,
  className
}) => {
  const { t } = useTranslation()
  const { values: storeValues, labels: storeLabels, isLoading } = useLabelsStore()

  /**
   * Get full data of edit label with values
   * TODO: Fix this part of the code when the API for retrieving a specific label with values becomes available.
   */
  const fullLabelData: null | CreateLabelFormFields = useMemo(() => {
    if (!storeLabels.length || !labelId) return null

    const currentLabel = storeLabels.length > 1 ? storeLabels.find(it => it.key === labelId) : storeLabels[0]

    if (!currentLabel) return null

    const currentValues = storeValues?.[currentLabel.key]?.map(({ value, color, id }) => ({ value, color, id })) ?? []

    return {
      id: currentLabel.id,
      key: currentLabel.key,
      description: currentLabel.description ?? '',
      color: currentLabel.color,
      type: currentLabel.type,
      isDynamic: currentLabel.type === LabelType.DYNAMIC,
      values: currentValues
    }
  }, [storeLabels, storeValues, labelId])

  const formMethods = useForm<CreateLabelFormFields>({
    resolver: zodResolver(createLabelFormSchema),
    mode: 'onChange',
    defaultValues: {
      key: '',
      description: '',
      color: ColorsEnum.BLUE,
      type: LabelType.STATIC,
      isDynamic: false,
      values: []
    }
  })

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    trigger,
    formState: { isValid }
  } = formMethods

  useEffect(() => {
    if (!fullLabelData) return

    reset({ ...fullLabelData })
  }, [fullLabelData, reset])

  const values = watch('values')
  const key = watch('key')
  const color = watch('color')
  const isDynamic = watch('isDynamic')

  useEffect(() => {
    setValue('type', isDynamic ? LabelType.DYNAMIC : LabelType.STATIC)
  }, [isDynamic, setValue])

  const handleAddValue = () => {
    if (!isValid) {
      trigger()
      return
    }

    setValue('values', [...values, { color, value: '' }])
  }

  const handleDeleteValue = (idx: number) => {
    const newValues = values.reduce<CreateLabelFormFields['values']>((acc, item, index) => {
      if (index !== idx) {
        acc.push(item)
      }

      return acc
    }, [])

    setValue('values', newValues)
    trigger()
  }

  if (!fullLabelData && !!labelId && !isLoading) {
    return <NotFoundPage />
  }

  return (
    <SandboxLayout.Content className={cn('!flex-none w-[610px]', className)}>
      <Text as="h1" variant="heading-section" className="mb-6">
        {labelId
          ? t('views:labelData.form.editTitle', 'Label details')
          : t('views:labelData.form.createTitle', 'Create a label')}
      </Text>

      {isLoading && <SkeletonForm />}

      {!isLoading && (
        <FormWrapper {...formMethods} className="gap-y-10" onSubmit={handleSubmit(onSubmit)}>
          <Fieldset className="gap-y-6">
            <ControlGroup>
              <Label htmlFor="label-name">{t('views:labelData.form.labelName', 'Label name')}</Label>

              <LabelFormColorAndNameGroup
                selectProps={{ ...register('color') }}
                inputProps={{ id: 'label-name', ...register('key'), autoFocus: !key }}
              />
            </ControlGroup>

            <FormInput.Text
              {...register('description')}
              placeholder={t('views:repos.descriptionPlaceholder', 'Enter a short description for the label')}
              label={t('views:repos.description', 'Description')}
              name="description"
              id="description"
              optional
            />

            <ControlGroup>
              <Label optional>{t('views:labelData.form.valueName', 'Label value')}</Label>
              {values.map((_, idx) => (
                <LabelFormColorAndNameGroup
                  isValue
                  key={idx}
                  className=" first-of-type:mt-0"
                  handleDeleteValue={() => handleDeleteValue(idx)}
                  selectProps={{ ...register(`values.${idx}.color`) }}
                  inputProps={{ ...register(`values.${idx}.value` as keyof CreateLabelFormFields) }}
                />
              ))}

              <Button className="mt-1 h-auto gap-x-1 self-start" variant="link" onClick={handleAddValue}>
                <IconV2 name="plus" size="2xs" />
                {t('views:labelData.form.addValue', 'Add a value')}
              </Button>
            </ControlGroup>

            <FormInput.Checkbox
              id="isDynamic"
              label={t('views:labelData.form.allowUsersCheckboxLabel', 'Allow users to add values')}
              {...register('isDynamic')}
            />
          </Fieldset>

          <Layout.Vertical className="mt-1 " gap="lg">
            <Text as="h3" variant="body-single-line-normal">
              {t('views:labelData.form.previewLabel', 'Label preview')}
            </Text>

            <Layout.Vertical gap="xs" align="start">
              <Tag
                variant="secondary"
                size="sm"
                theme={color}
                value={key.length ? key : t('views:labelData.form.labelName', 'Label name')}
              />
              {values.map((value, idx) => (
                <Tag
                  key={`${value.value}-${idx}`}
                  variant="secondary"
                  size="sm"
                  theme={value.color}
                  label={key.length ? key : t('views:labelData.form.labelName', 'Label name')}
                  value={value.value.length ? value.value : t('views:labelData.form.valueName', 'Label value')}
                />
              ))}
            </Layout.Vertical>
          </Layout.Vertical>

          {!!error?.length && (
            <Alert.Root theme="danger">
              <Alert.Title>
                {t('views:repos.error', 'Error:')} {error}
              </Alert.Title>
            </Alert.Root>
          )}

          <Fieldset>
            <ButtonLayout horizontalAlign="start">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? t('views:repos.saving', 'Saving…') : t('views:repos.save', 'Save')}
              </Button>
              <Button type="reset" variant="outline" onClick={onFormCancel}>
                {t('views:repos.cancel', 'Cancel')}
              </Button>
            </ButtonLayout>
          </Fieldset>
        </FormWrapper>
      )}
    </SandboxLayout.Content>
  )
}
