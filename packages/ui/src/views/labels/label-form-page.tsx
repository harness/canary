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
  LabelMarker,
  Option,
  SkeletonForm
} from '@/components'
import {
  ColorsEnum,
  CreateLabelFormFields,
  createLabelFormSchema,
  ILabelsStore,
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
  isLoading: boolean
  isDataLoading: boolean
  onFormCancel: () => void
  error?: string
  labelId?: string
}

export const LabelFormPage: FC<LabelFormPageProps> = ({
  useLabelsStore,
  useTranslationStore,
  onSubmit,
  isLoading,
  isDataLoading,
  onFormCancel,
  error,
  labelId
}) => {
  const { t } = useTranslationStore()
  const { values: storeValues, labels: storeLabels } = useLabelsStore()

  /**
   * Get full data of edit label with values
   * TODO: Fix this part of the code when the API for retrieving a specific label with values becomes available.
   */
  const fullLabelData: null | CreateLabelFormFields = useMemo(() => {
    if (!storeLabels.length || !labelId) return null

    const currentLabel = storeLabels.length > 1 ? storeLabels.find(it => it.key === labelId) : storeLabels[0]

    if (!currentLabel) return null

    const currentValues =
      storeValues?.[currentLabel.key]?.map(({ value, color, id }) => ({
        value,
        color,
        id
      })) ?? []

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

  const isDynamicValue = watch('type') === LabelType.DYNAMIC
  const values = watch('values')
  const key = watch('key')
  const color = watch('color')

  const handleDynamicChange = (val: boolean) => {
    setValue('type', val ? LabelType.DYNAMIC : LabelType.STATIC)
  }

  const handleLabelColorChange = (val: ColorsEnum) => {
    setValue('color', val)
  }

  const handleValueColorChange = (idx: number) => (val: ColorsEnum) => {
    const newValues = values.map((item, index) => (index === idx ? { ...item, color: val } : item))
    setValue('values', newValues)
  }

  const handleAddValue = () => {
    if (!isValid) {
      trigger()
      return
    }

    setValue('values', [
      ...values,
      {
        color,
        value: ''
      }
    ])
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

  if (!fullLabelData && !!labelId && !isDataLoading) {
    return <NotFoundPage useTranslationStore={useTranslationStore} />
  }

  return (
    <SandboxLayout.Content className="mx-auto w-[610px]">
      <h1 className="mb-10 text-2xl font-medium text-foreground-1">
        {labelId
          ? t('views:labelData.form.editTitle', 'Label details')
          : t('views:labelData.form.createTitle', 'Create a label')}
      </h1>
      {isDataLoading ? (
        <SkeletonForm />
      ) : (
        <FormWrapper className="gap-y-10" onSubmit={handleSubmit(onSubmit)}>
          <Fieldset>
            <ControlGroup>
              <Label className="mb-2.5" color="secondary" htmlFor="name-label">
                {t('views:labelData.form.labelName', 'Label name')}
              </Label>
              <LabelFormColorAndNameGroup
                name="label"
                colorValue={watch('color')}
                handleColorChange={handleLabelColorChange}
                colorError={errors.color?.message?.toString()}
                nameError={errors.key?.message?.toString()}
                useTranslationStore={useTranslationStore}
                register={register}
                registerName="key"
              />
            </ControlGroup>
            <ControlGroup>
              <Input
                {...register('description')}
                placeholder={t('views:repos.descriptionPlaceholder', 'Enter a description')}
                label={t('views:repos.description', 'Description')}
                name="description"
                error={errors.description?.message?.toString()}
                size="md"
                optional
              />
            </ControlGroup>
            <ControlGroup>
              <Label className="mb-2.5" color="secondary" htmlFor="name-value-1" optional>
                {t('views:labelData.form.valueName', 'Label value')}
              </Label>
              <div className="flex flex-col gap-y-5">
                {values.map((value, idx) => (
                  <LabelFormColorAndNameGroup
                    key={idx}
                    name={`value-${idx}`}
                    colorValue={value.color}
                    handleColorChange={handleValueColorChange(idx)}
                    colorError={errors.values?.[idx]?.color?.message?.toString()}
                    nameError={errors.values?.[idx]?.value?.message?.toString()}
                    useTranslationStore={useTranslationStore}
                    register={register}
                    registerName={`values.${idx}.value` as keyof CreateLabelFormFields}
                    handleDeleteValue={() => handleDeleteValue(idx)}
                    isValue
                  />
                ))}
              </div>
              <Button
                className={`h-auto gap-x-1 self-start p-0 ${!!values.length && 'mt-5'}`}
                variant="link_accent"
                size="md_split"
                onClick={() => handleAddValue()}
              >
                <Icon name="bold-plus" size={10} />
                {t('views:labelData.form.addValue', 'Add a value')}
              </Button>
            </ControlGroup>
            <ControlGroup>
              <Option
                control={<Checkbox checked={isDynamicValue} onCheckedChange={handleDynamicChange} id="type" />}
                id="type"
                label={t('views:labelData.form.allowUsersCheckboxLabel', 'Allow users to add values')}
              />
            </ControlGroup>
          </Fieldset>

          <div className="mt-1 flex flex-col gap-y-5">
            <h3 className="text-sm leading-none text-foreground-2">
              {t('views:labelData.form.previewLabel', 'Label preview')}
            </h3>
            <div className="flex flex-col items-start gap-y-2.5">
              {values.map((value, idx) => (
                <LabelMarker
                  key={`${value.value}-${idx}`}
                  color={value.color}
                  label={key.length ? key : t('views:labelData.form.labelName', 'Label name')}
                  value={value.value.length ? value.value : t('views:labelData.form.valueName', 'Label value')}
                />
              ))}
              {(!values.length || isDynamicValue) && (
                <LabelMarker
                  color={color}
                  label={key.length ? key : t('views:labelData.form.labelName', 'Label name')}
                  value={
                    isDynamicValue
                      ? t('views:labelData.form.previewDynamicValue', '*can be added by users*')
                      : undefined
                  }
                />
              )}
            </div>
          </div>

          {!!error?.length && (
            <Alert.Container variant="destructive">
              <Alert.Title>
                {t('views:repos.error', 'Error:')} {error}
              </Alert.Title>
            </Alert.Container>
          )}

          <Fieldset>
            <ButtonGroup>
              <Button type="submit" disabled={!isValid || isLoading}>
                {isLoading ? t('views:repos.saving', 'Saving…') : t('views:repos.save', 'Save')}
              </Button>
              <Button type="button" variant="outline" onClick={onFormCancel}>
                {t('views:repos.cancel', 'Cancel')}
              </Button>
            </ButtonGroup>
          </Fieldset>
        </FormWrapper>
      )}
    </SandboxLayout.Content>
  )
}
