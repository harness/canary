import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Alert, Button, ButtonLayout, ControlGroup, Dialog, FormInput, FormWrapper, Label } from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { BranchSelectorContainerProps } from '@views/repo/components'
import { z } from 'zod'

interface PullRequestHeaderEditDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (newTitle: string, newDescription: string, branch: string) => void
  initialTitle: string
  initialDescription?: string
  branchSelectorRenderer: React.ComponentType<BranchSelectorContainerProps>
  sourceBranch?: string
  targetBranch?: string
}

// Field names as constants to avoid lint warnings with string literals
const FIELD_TITLE = 'title'
const FIELD_DESCRIPTION = 'description'
const FIELD_BRANCH = 'branch'

const createFormSchema = (sourceBranch?: string) =>
  z
    .object({
      [FIELD_TITLE]: z.string().min(1, { message: 'Title is required' }),
      [FIELD_DESCRIPTION]: z.string().optional(),
      [FIELD_BRANCH]: z.string().optional()
    })
    .refine(data => data[FIELD_BRANCH] !== sourceBranch, {
      message: 'Target branch cannot be the same as source branch',
      path: [FIELD_BRANCH]
    })

type FormFields = z.infer<ReturnType<typeof createFormSchema>>

export const PullRequestHeaderEditDialog: FC<PullRequestHeaderEditDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialTitle,
  initialDescription = '',
  branchSelectorRenderer,
  sourceBranch,
  targetBranch
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const BranchSelector = branchSelectorRenderer

  const formMethods = useForm<FormFields>({
    resolver: zodResolver(createFormSchema(sourceBranch)),
    mode: 'onChange',
    defaultValues: {
      title: initialTitle,
      description: initialDescription,
      branch: targetBranch || ''
    }
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    reset,
    watch
  } = formMethods

  const branchValue = watch(FIELD_BRANCH)

  const handleFormSubmit = async (data: FormFields) => {
    if (!data.title) return

    setIsLoading(true)

    try {
      await onSubmit(data.title, data.description || '', data.branch || '')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const isDisabled = isSubmitting || isLoading

  useEffect(() => {
    reset({
      title: initialTitle,
      description: initialDescription,
      branch: targetBranch || ''
    })
  }, [initialTitle, initialDescription, reset])

  const handleDialogClose = () => {
    reset({
      title: initialTitle,
      description: initialDescription,
      branch: targetBranch || ''
    })
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleDialogClose}>
      <Dialog.Content aria-describedby={undefined}>
        <FormWrapper
          {...formMethods}
          onSubmit={handleSubmit(handleFormSubmit)}
          id="edit-pr-title-form"
          className="block"
        >
          <Dialog.Header>
            <Dialog.Title>Edit Pull Request</Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <div className="my-7 space-y-7">
              <FormInput.Text
                id={FIELD_TITLE}
                {...register(FIELD_TITLE)}
                placeholder="Enter pull request title"
                label="Title"
                onFocus={event => event.target.select()}
                autoFocus
              />

              <ControlGroup>
                <Label>Target Branch</Label>
                <BranchSelector
                  {...register(FIELD_BRANCH)}
                  onSelectBranchorTag={value => setValue(FIELD_BRANCH, value.name)}
                  isBranchOnly={true}
                  dynamicWidth={true}
                  selectedBranch={{ name: branchValue || targetBranch || '', sha: '' }}
                />
              </ControlGroup>

              <FormInput.Textarea
                {...register(FIELD_DESCRIPTION)}
                placeholder="Enter pull request description"
                label="Description"
                rows={5}
              />

              {errors[FIELD_BRANCH] && (
                <Alert.Root theme="danger">
                  <Alert.Description>{errors[FIELD_BRANCH]?.message}</Alert.Description>
                </Alert.Root>
              )}

              {error && <p className="text-cn-foreground-danger">{error}</p>}
            </div>
          </Dialog.Body>

          <Dialog.Footer>
            <ButtonLayout>
              <Dialog.Close onClick={handleDialogClose}>Cancel</Dialog.Close>
              <Button type="submit" disabled={isDisabled}>
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </ButtonLayout>
          </Dialog.Footer>
        </FormWrapper>
      </Dialog.Content>
    </Dialog.Root>
  )
}
