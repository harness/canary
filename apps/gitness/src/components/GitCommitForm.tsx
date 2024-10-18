import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Icon,
  Input,
  RadioGroup,
  RadioGroupItem,
  Spacer,
  Text,
  Textarea,
  useZodForm
} from '@harnessio/canary'
import { z } from 'zod'
import { GitCommitFormType } from '../types'
import { FormFieldSet, Layout } from '@harnessio/playground'
import { UsererrorError } from '@harnessio/code-service-client'
import { useRuleViolationCheck } from '../framework/hooks/useRuleViolationCheck'

interface GitCommitFormProps {
  onCancel: () => void
  onSubmit: (formValues: GitCommitFormType) => Promise<void>
  commitTitlePlaceHolder: string
  error?: UsererrorError
  disableCTA: boolean
  dryRun: (commitToGitRef: CommitToGitRefOption) => void
  violation: boolean
  bypassable: boolean
}

export enum CommitToGitRefOption {
  DIRECTLY = 'directly',
  NEW_BRANCH = 'new-branch'
}

const gitCommitSchema = z
  .object({
    message: z.string().optional(),
    description: z.string().optional(),
    commitToGitRef: z.string(),
    newBranchName: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (data.commitToGitRef === CommitToGitRefOption.NEW_BRANCH) {
      if (!data.newBranchName || data.newBranchName.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Branch Name is required ',
          path: ['newBranchName']
        })
      }
    }
  })

export function GitCommitForm({
  onCancel,
  onSubmit,
  commitTitlePlaceHolder,
  error,
  disableCTA,
  dryRun,
  violation,
  bypassable
}: GitCommitFormProps) {
  const { setAllStates } = useRuleViolationCheck()
  const form = useZodForm({
    schema: gitCommitSchema,
    defaultValues: {
      message: '',
      commitToGitRef: CommitToGitRefOption.DIRECTLY
    }
  })

  return (
    <Form className="space-y-6" form={form} onSubmit={onSubmit}>
      <div className="grid gap-2">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Commit Message</FormLabel>
              <FormControl>
                <Input className="text-primary" {...field} placeholder={commitTitlePlaceHolder} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea className="text-primary" {...field} placeholder="Optional extended description" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="commitToGitRef"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                value={field.value}
                id="commitToGitRef"
                onValueChange={value => {
                  dryRun(value as CommitToGitRefOption)
                  field.onChange(value)
                }}>
                <FormFieldSet.Option
                  control={<RadioGroupItem value={CommitToGitRefOption.DIRECTLY} id="directly" />}
                  id="directly"
                  label="Commit to Master directly"
                  description=""
                />
                {violation && form.getValues().commitToGitRef === CommitToGitRefOption.DIRECTLY && (
                  <Text size={1} className="text-destructive pl-8">
                    {bypassable
                      ? 'Some rules will be bypassed to commit directly'
                      : "Some rules don't allow you to commit directly"}
                  </Text>
                )}
                <FormFieldSet.Option
                  control={<RadioGroupItem value={CommitToGitRefOption.NEW_BRANCH} id="new-branch" />}
                  id="new-branch"
                  label="Create a new branch for this commit and start a pull request"
                  description=""
                />
                {violation && form.getValues().commitToGitRef === CommitToGitRefOption.NEW_BRANCH && (
                  <Text size={1} className="text-destructive pl-8">
                    {bypassable
                      ? 'Some rules will be bypassed to commit by creating branch'
                      : "Some rules don't allow you to create new branch for commit"}
                  </Text>
                )}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.getValues().commitToGitRef === CommitToGitRefOption.NEW_BRANCH && (
        <div className="pl-5">
          <FormField
            control={form.control}
            name="newBranchName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div>
                    <Input
                      className="text-primary"
                      {...field}
                      placeholder="New Branch Name"
                      left={<Icon name="branch" size={24} className="min-w-[12px] text-tertiary-background pr-2" />}
                      onChange={() => {
                        setAllStates({ violation: false, bypassable: false, bypassed: false })
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {error?.message && (
        <>
          <Layout.Horizontal className="items-center">
            <Icon name="triangle-warning" className="text-destructive" />
            <Text size={1} className="text-destructive">
              {error?.message}
            </Text>
          </Layout.Horizontal>
          <Spacer size={4} />
        </>
      )}

      <div className="flex gap-3 justify-end">
        <Button onClick={onCancel} className="text-primary" variant="outline">
          Cancel
        </Button>
        {!bypassable ? (
          <Button type="submit" disabled={disableCTA}>
            Commit
          </Button>
        ) : (
          <Button variant="destructive" type="submit">
            {form.getValues().commitToGitRef === CommitToGitRefOption.NEW_BRANCH
              ? 'Bypass rules and commit via new branch'
              : 'Bypass rules and commit directly'}
          </Button>
        )}
      </div>
    </Form>
  )
}
