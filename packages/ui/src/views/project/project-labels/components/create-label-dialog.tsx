import { useForm } from 'react-hook-form'

import {
  Alert,
  Button,
  ButtonGroup,
  ControlGroup,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Fieldset,
  FormWrapper,
  Input,
  Select,
  SelectContent,
  SelectItem
} from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@radix-ui/react-dropdown-menu'
import { z } from 'zod'

// import { InviteMemberDialogProps, InviteMemberFormFields } from '../types'
import { ColorsEnum, CreateLabelDialogProps, CreateLabelFormFields } from '../types'

export const createLabelFormSchema = z.object({
  name: z.string().min(1, { message: 'Label name is required' }),
  color: z.nativeEnum(ColorsEnum),
  description: z.string().optional()
})

export function CreateLabelDialog({
  open,
  onClose,
  onSubmit,
  useTranslationStore,
  isCreatingLabel,
  error
}: CreateLabelDialogProps) {
  const { t } = useTranslationStore()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CreateLabelFormFields>({
    resolver: zodResolver(createLabelFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      color: ColorsEnum.BLUE
    }
  })

  const colorValue = watch('color')

  //   const memberRole = watch('role')

  const handleSelectChange = (fieldName: keyof CreateLabelFormFields, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] border-border bg-background-1">
        <DialogHeader>
          <DialogTitle>Create Label</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <FormWrapper className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Fieldset>
              <Label>Label name</Label>
              <ControlGroup className="flex flex-row gap-2">
                <div className="min-w-[100px]">
                  <Select
                    {...register('color')}
                    name="coloor"
                    value={colorValue}
                    onValueChange={value => handleSelectChange('color', value)}
                    placeholder="Select a color"
                    error={
                      errors.color?.message
                        ? t('views:forms.selectMemberError', errors.color?.message?.toString())
                        : undefined
                    }
                  >
                    <SelectContent>
                      {Object.values(ColorsEnum)?.map(color => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  {...register('name')}
                  name="name"
                  placeholder="Enter label name"
                  error={errors.name?.message?.toString()}
                  className="min-w-[352px]"
                  size="md"
                  autoFocus
                />
              </ControlGroup>
              <ControlGroup>
                <Input
                  {...register('description')}
                  label="Description"
                  name="description"
                  placeholder="Enter description"
                  error={errors.description?.message?.toString()}
                  size="md"
                />
              </ControlGroup>
            </Fieldset>
            {error ? (
              <Alert.Container variant="destructive">
                <Alert.Title>
                  {t('views:repos.error', 'Error:')} {error}
                </Alert.Title>
              </Alert.Container>
            ) : null}
            <ButtonGroup className="flex justify-end">
              <Button onClick={onClose} className="text-primary" variant="outline" loading={isCreatingLabel}>
                {t('views:repos.cancel', 'Cancel')}
              </Button>
              <Button type="submit">Save</Button>
            </ButtonGroup>
          </FormWrapper>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
