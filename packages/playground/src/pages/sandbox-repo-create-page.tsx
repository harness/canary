import React from 'react'
import { SandboxLayout } from '..'
import {
  Button,
  ButtonGroup,
  Checkbox,
  Input,
  Label,
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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export interface DataProps {
  email?: string
  password?: string
}

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
})

function SandboxRepoCreatePage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signInSchema)
  })

  const onSubmit = (data: DataProps) => {
    console.log(data)
  }

  return (
    <>
      <SandboxLayout.Main hasLeftPanel hasHeader>
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
            <Label htmlFor="email" variant="sm">
              Name
            </Label>
            <Spacer size={1} />
            <Input id="email" type="email" {...register('email')} placeholder="Enter repository name" autoFocus />
            {errors.email && (
              <>
                <Spacer size={2} />
                <Text size={1} className="text-destructive">
                  {errors.email.message?.toString()}
                </Text>
              </>
            )}
            <Spacer size={8} />
            {/* Description */}
            <Label htmlFor="email" variant="sm">
              Description
            </Label>
            <Spacer size={1} />
            <Textarea id="email" {...register('email')} placeholder="Enter a description of this repository..." />
            {errors.email && (
              <>
                <Spacer size={2} />
                <Text size={1} className="text-destructive">
                  {errors.email.message?.toString()}
                </Text>
              </>
            )}
            <Spacer size={8} />
            {/* .gitignore */}
            <Label htmlFor="email" variant="sm">
              Add a .gitignore
            </Label>
            <Spacer size={2} />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">.gitignore option 1</SelectItem>
                <SelectItem value="2">.gitignore option 2</SelectItem>
                <SelectItem value="3">.gitignore option 3</SelectItem>
              </SelectContent>
            </Select>
            {errors.email && (
              <>
                <Spacer size={2} />
                <Text size={1} className="text-destructive">
                  {errors.email.message?.toString()}
                </Text>
              </>
            )}
            <Spacer size={8} />
            {/* License */}
            <Label htmlFor="email" variant="sm">
              Choose a license
            </Label>
            <Spacer size={2} />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">License option 1</SelectItem>
                <SelectItem value="2">License option 2</SelectItem>
                <SelectItem value="3">License option 3</SelectItem>
              </SelectContent>
            </Select>
            <Spacer size={2} />
            <Text as="p" size={1} color="tertiaryBackground">
              A license tells others what they can and can't do with your code.
            </Text>
            {errors.email && (
              <>
                <Spacer size={2} />
                <Text size={1} className="text-destructive">
                  {errors.email.message?.toString()}
                </Text>
              </>
            )}
            <Spacer size={12} />
            {/* Access */}
            <Label htmlFor="email" variant="sm">
              Who has access?
            </Label>
            <Spacer size={4} />
            {/* TODO: COMPONENTIZE RADIO/CHECK DIV GROUPINGS BELOW */}
            <RadioGroup defaultValue="1" className="gap-4">
              <div className="flex gap-4 items-start">
                <RadioGroupItem value="1" id="1" className="mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <Label htmlFor="1">Public</Label>
                  <Text size={1} color="tertiaryBackground">
                    Anyone with access to the Gitness environment can clone this repo.
                  </Text>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <RadioGroupItem value="2" id="2" className="mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <Label htmlFor="2">Private</Label>
                  <Text size={1} color="tertiaryBackground">
                    You choose who can see and commit to this repository.
                  </Text>
                </div>
              </div>
            </RadioGroup>
            <Spacer size={12} />
            {/* Initialize */}
            <Label htmlFor="email" variant="sm">
              Initialize this repository with:
            </Label>
            <Spacer size={4} />
            <div className="flex gap-4 items-start">
              <Checkbox id="readme" className="mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="readme">Add a README file</Label>
                <Text size={1} color="tertiaryBackground">
                  This is where you can write a long description for your project.
                </Text>
              </div>
            </div>
            <Spacer size={16} />
            {/* Buttons */}
            <ButtonGroup.Root>
              <Button size="sm">Create repository</Button>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </ButtonGroup.Root>
          </form>
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    </>
  )
}

export { SandboxRepoCreatePage }
