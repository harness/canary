import { FC, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import {
  Alert,
  Button,
  ButtonLayout,
  ControlGroup,
  FormInput,
  FormWrapper,
  IconV2,
  Label,
  Layout,
  Skeleton,
  Text
} from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { cn } from '@harnessio/ui/utils'
import {
  ColorsEnum,
  CreateLabelFormFields,
  createLabelFormSchema,
  ILabelsStore,
  LabelTag,
  LabelType,
  NotFoundPage
} from '@views'
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

    setValue('values', [...values, { color, value: '', id: Math.ceil(Math.random() * 1000) }])
  }

  const handleDeleteValue = (idx: number) => {
    const newValues = values.filter((_, index) => index !== idx)

    setValue('values', newValues)
    trigger()
  }

  if (!fullLabelData && !!labelId && !isLoading) {
    return <NotFoundPage />
  }

  return (
    <Layout.Vertical gapY="xl" className={cn('settings-form-width', className)}>
      <Text as="h1" variant="heading-section">
        {labelId
          ? t('views:labelData.form.editTitle', 'Label details')
          : t('views:labelData.form.createTitle', 'Create a label')}
      </Text>

      <Layout.Vertical>
        {isLoading && <Skeleton.Form />}

        {!isLoading && (
          <FormWrapper {...formMethods} onSubmit={handleSubmit(onSubmit)}>
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

            <Layout.Vertical gap={values.length > 0 ? 'sm' : 'xs'}>
              <ControlGroup>
                <Label optional>{t('views:labelData.form.valueName', 'Label value')}</Label>
                {values.map(({ id }, idx) => (
                  <LabelFormColorAndNameGroup
                    isValue
                    key={id}
                    handleDeleteValue={() => handleDeleteValue(idx)}
                    selectProps={{ ...register(`values.${idx}.color`) }}
                    inputProps={{ ...register(`values.${idx}.value` as keyof CreateLabelFormFields) }}
                  />
                ))}
              </ControlGroup>

              <Button className="h-auto self-start" variant="link" onClick={handleAddValue}>
                <IconV2 name="plus" />
                {t('views:labelData.form.addValue', 'Add a value')}
              </Button>
            </Layout.Vertical>

            <FormInput.Checkbox
              id="isDynamic"
              label={t('views:labelData.form.allowUsersCheckboxLabel', 'Allow users to add values')}
              {...register('isDynamic')}
            />

            <Layout.Vertical className="mt-cn-lg" gap="md">
              <Text as="h3" color="foreground-1">
                {t('views:labelData.form.previewLabel', 'Label preview')}
              </Text>

              <Layout.Vertical gap="xs" align="start">
                <LabelTag
                  theme={color}
                  label={key.length ? key : t('views:labelData.form.labelName', 'Label name')}
                  value={values.length > 0 ? String(values.length) : ''}
                  withIndicator={isDynamic}
                />
                {values.map((value, idx) => (
                  <LabelTag
                    key={`${value.value}-${idx}`}
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

            <ButtonLayout className="gap-cn-sm mt-cn-md" horizontalAlign="start">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? t('views:repos.saving', 'Saving…') : t('views:repos.save', 'Save')}
              </Button>
              <Button type="reset" variant="outline" onClick={onFormCancel}>
                {t('views:repos.cancel', 'Cancel')}
              </Button>
            </ButtonLayout>
          </FormWrapper>
        )}
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
