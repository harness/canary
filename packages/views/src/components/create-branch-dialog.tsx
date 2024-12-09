import { z } from 'zod'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spacer,
  useZodForm
} from '@harnessio/canary'
import { Alert } from '@harnessio/ui/components'

export interface Branch {
  name?: string
}

export interface CreateBranchDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (formValues: ICreateBranchForm) => void
  isLoadingBranches: boolean
  isSaving: boolean
  branches?: Array<Branch>
  error?: string
}

export interface ICreateBranchForm {
  name: string
  target: string
}

const createBranchFormSchema = z.object({
  name: z.string().min(1, { message: 'Branch name is required' }),
  target: z.string().min(1, { message: 'Base branch is required' })
})

export function CreateBranchDialog({
  open,
  onClose,
  onSubmit,
  branches,
  isLoadingBranches,
  isSaving,
  error
}: CreateBranchDialogProps) {
  const form = useZodForm({
    schema: createBranchFormSchema,
    defaultValues: {
      name: '',
      target: 'main'
    }
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] border-border bg-primary-background">
        <DialogHeader>
          <DialogTitle>Create Branch</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Spacer size={6} />
          <Form className="space-y-6" form={form} onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">Branch name*</FormLabel>
                  <FormControl>
                    <Input className="text-primary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">Base Branch*</FormLabel>
                  <Select
                    disabled={isLoadingBranches || !branches?.length}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="text-primary">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a branch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branches?.map(
                        branch =>
                          branch?.name && (
                            <SelectItem key={branch?.name} value={branch?.name as string}>
                              {branch?.name}
                            </SelectItem>
                          )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error ? (
              <Alert.Container variant="destructive">
                <Alert.Title>Error: {error}</Alert.Title>
              </Alert.Container>
            ) : null}

            <div className="flex justify-end gap-3">
              <Button onClick={onClose} className="text-primary" variant="outline" loading={isSaving}>
                Cancel
              </Button>
              <Button type="submit">Create Branch</Button>
            </div>
          </Form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
