import { FC, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import {
  Alert,
  Button,
  ButtonGroup,
  Checkbox,
  ControlGroup,
  Fieldset,
  FormWrapper,
  Icon,
  Input,
  Label,
  Option,
  SkeletonForm
} from '@/components'
import { cn } from '@/utils'
import {
  ColorsEnum,
  CreateLabelFormFields,
  createLabelFormSchema,
  ILabelsStore,
  LabelMarker,
  LabelType,
  NotFoundPage,
  SandboxLayout,
  TranslationStore
} from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'

import { LabelFormColorAndNameGroup } from './components/label-form-color-and-name-group'

export interface LabelFormPageProps {
  useLabelsStore: () => ILabelsStore
  useTranslationStore: () => TranslationStore
  onSubmit: (data: CreateLabelFormFields) => void
  isSaving: boolean
  onFormCancel: () => void
  error?: string
  labelId?: string
  className?: string
}

export const LabelFormPage: FC<LabelFormPageProps> = ({
  useLabelsStore,
  useTranslationStore,
  onSubmit,
  isSaving,
  onFormCancel,
  error,
  labelId,
  className
}) => {
  const { t } = useTranslationStore()
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
      values: currentValues
    }
  }, [storeLabels, storeValues, labelId])

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    trigger,
    formState: { errors, isValid }
  } = useForm<CreateLabelFormFields>({
    resolver: zodResolver(createLabelFormSchema),
    mode: 'onChange',
    defaultValues: {
      key: '',
      description: '',
      color: ColorsEnum.BLUE,
      type: LabelType.STATIC,
      values: []
    }
  })

  useEffect(() => {
    if (!fullLabelData) return

    reset({ ...fullLabelData })
  }, [fullLabelData, reset])

  const type = watch('type')
  const values = watch('values')
  const key = watch('key')
  const color = watch('color')
  const isDynamicValue = watch('type') === LabelType.DYNAMIC

  const handleDynamicChange = (val: boolean) => {
    setValue('type', val ? LabelType.DYNAMIC : LabelType.STATIC)
  }

  const handleLabelColorChange = (val: ColorsEnum) => {
    setValue('color', val)
  }

  const makeHandleValueColorChange = (idx: number) => (val: ColorsEnum) => {
    const newValues = values.map((item, index) => (index === idx ? { ...item, color: val } : item))
    setValue('values', newValues)
  }

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
    return <NotFoundPage useTranslationStore={useTranslationStore} />
  }

  return (
    <SandboxLayout.Content className={cn('!flex-none w-[610px]', className)}>
      <h1 className="mb-10 text-2xl font-medium text-cn-foreground-1">
        {labelId
          ? t('views:labelData.form.editTitle', 'Label details')
          : t('views:labelData.form.createTitle', 'Create a label')}
      </h1>

      {isLoading && <SkeletonForm />}

      {!isLoading && (
        <FormWrapper className="gap-y-10" onSubmit={handleSubmit(onSubmit)}>
          <Fieldset>
            <ControlGroup>
              <Label className="mb-2" htmlFor="label-name">
                {t('views:labelData.form.labelName', 'Label name')}
              </Label>

              <LabelFormColorAndNameGroup
                useTranslationStore={useTranslationStore}
                selectProps={{
                  name: 'color-label',
                  onValueChange: handleLabelColorChange,
                  value: color,
                  error: errors.color?.message?.toString()
                }}
                inputProps={{
                  id: 'label-name',
                  ...register('key'),
                  error: errors.key?.message?.toString(),
                  autoFocus: !key
                }}
              />
            </ControlGroup>

            <Input
              {...register('description')}
              placeholder={t('views:repos.descriptionPlaceholder', 'Enter a short description for the label')}
              label={t('views:repos.description', 'Description')}
              name="description"
              id="description"
              error={errors.description?.message?.toString()}
              size="md"
              optional
            />

            <ControlGroup>
              <Label className="mb-2" optional>
                {t('views:labelData.form.valueName', 'Label value')}
              </Label>
              {values.map((value, idx) => (
                <LabelFormColorAndNameGroup
                  isValue
                  key={idx}
                  className="mt-5 first-of-type:mt-0"
                  useTranslationStore={useTranslationStore}
                  handleDeleteValue={() => handleDeleteValue(idx)}
                  selectProps={{
                    name: `value-${idx}`,
                    value: value.color,
                    error: errors.values?.[idx]?.color?.message?.toString(),
                    onValueChange: makeHandleValueColorChange(idx)
                  }}
                  inputProps={{
                    ...register(`values.${idx}.value` as keyof CreateLabelFormFields),
                    error: errors.values?.[idx]?.value?.message?.toString()
                  }}
                />
              ))}

              <Button className="mt-3.5 h-auto gap-x-1 self-start" variant="link" onClick={handleAddValue}>
                <Icon name="bold-plus" size={10} />
                {t('views:labelData.form.addValue', 'Add a value')}
              </Button>
            </ControlGroup>

            <Option
              control={<Checkbox checked={isDynamicValue} onCheckedChange={handleDynamicChange} id="type" />}
              id="type"
              label={t('views:labelData.form.allowUsersCheckboxLabel', 'Allow users to add values')}
            />
          </Fieldset>

          <section className="mt-1 flex flex-col gap-y-5">
            <h3 className="text-sm leading-none text-cn-foreground-2">
              {t('views:labelData.form.previewLabel', 'Label preview')}
            </h3>

            <div className="flex flex-col items-start gap-y-2.5">
              <LabelMarker
                color={color}
                label={key.length ? key : t('views:labelData.form.labelName', 'Label name')}
                type={type}
              />
              {values.map((value, idx) => (
                <LabelMarker
                  key={`${value.value}-${idx}`}
                  color={value.color}
                  label={key.length ? key : t('views:labelData.form.labelName', 'Label name')}
                  value={value.value.length ? value.value : t('views:labelData.form.valueName', 'Label value')}
                />
              ))}
            </div>
          </section>

          {!!error?.length && (
            <Alert.Container variant="destructive">
              <Alert.Title>
                {t('views:repos.error', 'Error:')} {error}
              </Alert.Title>
            </Alert.Container>
          )}

          <Fieldset>
            <ButtonGroup spacing="3">
              <Button type="submit" disabled={!isValid || isSaving}>
                {isSaving ? t('views:repos.saving', 'Saving…') : t('views:repos.save', 'Save')}
              </Button>
              <Button type="reset" variant="outline" onClick={onFormCancel}>
                {t('views:repos.cancel', 'Cancel')}
              </Button>
            </ButtonGroup>
          </Fieldset>
        </FormWrapper>
      )}
    </SandboxLayout.Content>
  )
}
