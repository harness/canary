import React from 'react'
import { SandboxLayout } from '..'
import {
  Button,
  ButtonGroup,
  Checkbox,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spacer,
  Text,
  Textarea
} from '@harnessio/canary'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormField } from '../index'

export interface CreateRepoProps {
  name: string
  description: string
  gitignore: string
  license: string
  access: string
  readme: boolean
}
interface SandboxRepoCreatePageProps {
  isLoading?: boolean
  onFormSubmit: (data: CreateRepoProps) => void
  apiError?: string | null
}
const formSchema = z.object({
  name: z.string().min(1, { message: 'Please provide a name' }),
  description: z.string().min(1, { message: 'Please provide a description' }),
  gitignore: z.string().min(1, { message: 'Please select a file' }),
  license: z.string().min(1, { message: 'Please select a license' }),
  access: z.string().min(1, { message: 'Please select who has access' }),
  readme: z.boolean()
})

const SandboxRepoCreatePage: React.FC<SandboxRepoCreatePageProps> = ({ onFormSubmit, isLoading = false, apiError }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<CreateRepoProps>({
    resolver: zodResolver(formSchema)
  })

  const onSubmit: SubmitHandler<CreateRepoProps> = data => {
    onFormSubmit(data)
  }

  return (
    <>
      {/* <SandboxLayout.Main hasLeftPanel hasHeader> */}
      <SandboxLayout.Content maxWidth="2xl">
        <Spacer size={10} />
        <Text size={5} weight={'medium'}>
          Create a new repository
        </Text>
        <Spacer size={3} />
        <Text size={2} as="p" className="text-primary/80 max-w-[100%]">
          A repository contains all project files, including the revision history. Already have a project repository
          elsewhere? Import a repository.
        </Text>
        <Spacer size={8} />
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <FormField.Root>
            <FormField.Label htmlFor="name">Name</FormField.Label>
            <FormField.Control>
              <Input id="name" {...register('name')} placeholder="Enter repository name" autoFocus />
            </FormField.Control>
            {errors.name && (
              <FormField.Message theme={FormField.MessageTheme.ERROR}>
                {errors.name.message?.toString()}
              </FormField.Message>
            )}
          </FormField.Root>

          {/* Description */}
          <FormField.Root>
            <FormField.Label htmlFor="description">Description</FormField.Label>
            <FormField.Control>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Enter a description of this repository..."
              />
            </FormField.Control>
            {errors.description && (
              <FormField.Message theme={FormField.MessageTheme.ERROR}>
                {errors.description.message?.toString()}
              </FormField.Message>
            )}
          </FormField.Root>

          {/* Separator */}
          <FormField.Root>
            <FormField.Separator dashed />
          </FormField.Root>

          {/* Git Ignore */}
          <FormField.Root>
            <FormField.Label htmlFor="gitignore">Add a .gitignore</FormField.Label>
            <FormField.Control>
              <Controller
                name="gitignore"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="gitignore">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">.gitignore option 1</SelectItem>
                      <SelectItem value="2">.gitignore option 2</SelectItem>
                      <SelectItem value="3">.gitignore option 3</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField.Control>
            {errors.gitignore && (
              <FormField.Message theme={FormField.MessageTheme.ERROR}>
                {errors.gitignore.message?.toString()}
              </FormField.Message>
            )}
          </FormField.Root>

          {/* License*/}
          <FormField.Root>
            <FormField.Label htmlFor="license">Choose a license</FormField.Label>
            <FormField.Control>
              <Controller
                name="license"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="license">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">License option 1</SelectItem>
                      <SelectItem value="2">License option 2</SelectItem>
                      <SelectItem value="3">License option 3</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField.Control>
            <FormField.Caption>A license tells others what they can and can't do with your code.</FormField.Caption>
            {errors.license && (
              <FormField.Message theme={FormField.MessageTheme.ERROR}>
                {errors.license.message?.toString()}
              </FormField.Message>
            )}
          </FormField.Root>

          <FormField.Root>
            <FormField.Separator dashed />
          </FormField.Root>

          {/* Access*/}
          <FormField.Root box shaded>
            <FormField.Label htmlFor="access">Who has access?</FormField.Label>
            <FormField.Control>
              <Controller
                name="access"
                control={control}
                render={({ field }) => (
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <FormField.Option
                      control={<RadioGroupItem value="1" id="1" />}
                      id="1"
                      label="Public"
                      description="Anyone with access to the environment can clone this repo."
                    />
                    <FormField.Option
                      control={<RadioGroupItem value="2" id="2" />}
                      id="2"
                      label="Private"
                      description="You choose who can see and commit to this repository."
                    />
                  </RadioGroup>
                )}
              />
            </FormField.Control>
            {errors.access && (
              <FormField.Message theme={FormField.MessageTheme.ERROR}>
                {errors.access.message?.toString()}
              </FormField.Message>
            )}
          </FormField.Root>

          {/* Initialize*/}
          <FormField.Root box shaded>
            <FormField.Label htmlFor="readme">Initialize this repository with...</FormField.Label>
            <FormField.Control>
              <Controller
                name="readme"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <RadioGroup id="access" defaultValue="1" {...register('readme')}>
                    <FormField.Option
                      control={<Checkbox id="readme" checked={field.value} onCheckedChange={field.onChange} />}
                      id="readme"
                      label="Add a README file"
                      description="This is where you can write a long description for your project."
                    />
                  </RadioGroup>
                )}
              />
            </FormField.Control>
          </FormField.Root>

          {/* Separator */}
          <FormField.Root>
            <FormField.Separator />
          </FormField.Root>

          {/* Buttons */}
          {apiError && (
            <>
              <Spacer size={2} />
              <Text size={1} className="text-destructive">
                {apiError?.toString()}
              </Text>
            </>
          )}
          <FormField.Root>
            <FormField.Control>
              <ButtonGroup.Root>
                {/* <Button size="sm">Create repository</Button> */}
                <Button size="sm" type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create repository'}
                </Button>

                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              </ButtonGroup.Root>
            </FormField.Control>
          </FormField.Root>
        </form>
      </SandboxLayout.Content>
      {/* </SandboxLayout.Main> */}
    </>
  )
}

export { SandboxRepoCreatePage }
