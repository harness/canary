import React, { useState } from 'react'
import {
  Input,
  Textarea,
  Text,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Button,
  Icon,
  Checkbox,
  StackedList,
  Switch,
  Badge,
  RadioGroup,
  RadioGroupItem
} from '@harnessio/canary'
import { FormFieldSet, MessageTheme } from '../../index'

export const WebhookToggleField: React.FC = ({ register, watch, setValue }) => (
  <StackedList.Root className="border-none">
    <StackedList.Item disableHover isHeader>
      <StackedList.Field
        title="Enable the webhook"
        description="We will deliver event details when this hook is triggered"
      />
      <StackedList.Field
        label
        secondary
        title={
          <div className="flex gap-1.5 items-center justify-end cursor-pointer">
            <Switch
              {...register!('state')}
              checked={watch!('state')}
              onCheckedChange={() => setValue!('state', !watch!('state'))}
            />
          </div>
        }
        right
      />
    </StackedList.Item>
  </StackedList.Root>
)

export const WebhookNameField: React.FC = ({ register, errors, disabled }) => (
  <FormFieldSet.ControlGroup>
    <FormFieldSet.Label htmlFor="name" required>
      Name
    </FormFieldSet.Label>
    <Input id="name" {...register!('name')} placeholder="Name your webhook" autoFocus disabled={disabled} />
    {errors!.name && (
      <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors!.name.message?.toString()}</FormFieldSet.Message>
    )}
  </FormFieldSet.ControlGroup>
)

export const WebhookDescriptionField: React.FC = ({ register, errors }) => (
  <FormFieldSet.ControlGroup>
    <FormFieldSet.Label htmlFor="description" required>
      Description
    </FormFieldSet.Label>
    <Textarea id="description" {...register!('description')} placeholder="Enter a description of this rule..." />
    {errors!.description && (
      <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors!.description.message?.toString()}</FormFieldSet.Message>
    )}
  </FormFieldSet.ControlGroup>
)

export const WebhookPayloadUrlField: React.FC = ({ register, errors }) => (
  <FormFieldSet.ControlGroup>
    <FormFieldSet.Label htmlFor="payloadUrl" required>
      Payload URL
    </FormFieldSet.Label>
    <Input id="payloadUrl" {...register!('payloadUrl')} placeholder="https://example.com/harness" />
    {errors!.payloadUrl && (
      <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors!.payloadUrl.message?.toString()}</FormFieldSet.Message>
    )}
  </FormFieldSet.ControlGroup>
)

export const WebhookSecretField: React.FC = ({ register, errors }) => (
  <FormFieldSet.ControlGroup>
    <FormFieldSet.Label htmlFor="secret" required>
      Secret
    </FormFieldSet.Label>
    <Input id="secret" {...register!('secret')} type="password" />
    {errors!.secret && (
      <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors!.secret.message?.toString()}</FormFieldSet.Message>
    )}
  </FormFieldSet.ControlGroup>
)

export const WebhookSSLVerificationField: React.FC = ({ errors, watch, setValue }) => {
  const sslVerificationValue = watch('sslVerification')
  const handleAccessChange = (value: string) => {
    setValue('sslVerification', value)
  }

  return (
    <FormFieldSet.Root>
      <FormFieldSet.ControlGroup>
        <FormFieldSet.Label htmlFor="access" required>
          SSL Verification
        </FormFieldSet.Label>
        <RadioGroup value={sslVerificationValue} onValueChange={handleAccessChange} id="access">
          <FormFieldSet.Option
            control={<RadioGroupItem value="1" id="enable-ssl" />}
            id="enable-ssl"
            label="Enable SSL Verification"
          />
          <FormFieldSet.Option
            control={<RadioGroupItem value="2" id="disable-ssl" />}
            id="disable-ssl"
            label="Disable SSL verification"
            description="Not recommended for production use"
          />
        </RadioGroup>
        {errors.sslVerification && (
          <FormFieldSet.Message theme={MessageTheme.ERROR}>
            {errors.sslVerification.message?.toString()}
          </FormFieldSet.Message>
        )}
      </FormFieldSet.ControlGroup>
    </FormFieldSet.Root>
  )
}
// export const BranchSettingsRuleTargetPatternsField: React.FC<FieldProps> = ({ setValue, watch, register, errors }) => {
//   const [selectedOption, setSelectedOption] = useState<PatternsButtonType.INCLUDE | PatternsButtonType.EXCLUDE>(
//     PatternsButtonType.INCLUDE
//   )

//   const patterns = watch!('patterns') || []

//   const handleAddPattern = () => {
//     const pattern = watch!('pattern')
//     if (pattern && !patterns.some(p => p.pattern === pattern)) {
//       setValue!('patterns', [...patterns, { pattern, option: selectedOption }])
//       setValue!('pattern', '')
//     }
//   }

//   const handleRemovePattern = (patternVal: string) => {
//     const updatedPatterns = patterns.filter(({ pattern }) => pattern !== patternVal)
//     setValue!('patterns', updatedPatterns)
//   }

//   return (
//     <FormFieldSet.ControlGroup>
//       <FormFieldSet.Label htmlFor="target-patterns">Target Patterns</FormFieldSet.Label>
//       <div className="grid grid-rows-1 grid-cols-5">
//         <div className="col-span-4 mr-2">
//           <Input
//             id="pattern"
//             {...register!('pattern')}
//             leftStyle={true}
//             left={
//               <Button
//                 variant="split"
//                 type="button"
//                 className="pl-0 pr-0 min-w-28"
//                 dropdown={
//                   <DropdownMenu key="dropdown-menu">
//                     <span>
//                       <DropdownMenuTrigger insideSplitButton>
//                         <Icon name="chevron-down" className="chevron-down" />
//                       </DropdownMenuTrigger>
//                     </span>
//                     <DropdownMenuContent align="end" className="mt-1">
//                       <DropdownMenuGroup>
//                         <DropdownMenuItem onSelect={() => setSelectedOption(PatternsButtonType.INCLUDE)}>
//                           Include
//                         </DropdownMenuItem>
//                         <DropdownMenuItem onSelect={() => setSelectedOption(PatternsButtonType.EXCLUDE)}>
//                           Exclude
//                         </DropdownMenuItem>
//                       </DropdownMenuGroup>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 }>
//                 {selectedOption}
//               </Button>
//             }
//           />
//         </div>
//         <Button variant="outline" type="button" className="col-span-1" onClick={handleAddPattern}>
//           Add
//         </Button>
//         {errors!.pattern && (
//           <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors!.pattern.message?.toString()}</FormFieldSet.Message>
//         )}
//       </div>
//       <Text size={2} as="p" color="tertiaryBackground" className="max-w-[100%]">
//         Match branches using globstar patterns (e.g.”golden”, “feature-*”, “releases/**”)
//       </Text>
//       <div className="flex flex-wrap">
//         {patterns &&
//           patterns.map(pattern => (
//             <Badge
//               variant="outline"
//               theme={pattern.option === PatternsButtonType.INCLUDE ? 'success' : 'destructive'}
//               key={pattern.pattern}
//               pattern={pattern}
//               className="mx-1 my-1 inline-flex">
//               {pattern.pattern}
//               <button className="ml-2" onClick={() => handleRemovePattern(pattern.pattern)}>
//                 <Icon name="x-mark" size={12} className="text-current" />
//               </button>
//             </Badge>
//           ))}
//       </div>
//     </FormFieldSet.ControlGroup>
//   )
// }

// export const BranchSettingsRuleDefaultBranchField: React.FC<FieldProps> = ({ register, errors, watch, setValue }) => (
//   <FormFieldSet.ControlGroup className="min-h-8 justify-center">
//     <FormFieldSet.Option
//       control={
//         <Checkbox
//           {...register!('default')}
//           checked={watch!('default')}
//           onCheckedChange={() => setValue!('default', !watch!('default'))}
//           id="default-branch"
//         />
//       }
//       id="default-branch"
//       label="Default Branch"
//       className="mt-0"
//     />

//     {errors!.default && (
//       <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
//         {errors!.default.message?.toString()}
//       </FormFieldSet.Message>
//     )}
//   </FormFieldSet.ControlGroup>
// )

// export const BranchSettingsRuleBypassListField: React.FC<FieldProps & { bypassOptions: BypassUsersList[] }> = ({
//   watch,
//   setValue,
//   bypassOptions
// }) => {
//   const selectedBypassUsers = watch!('bypass') || []

//   const handleCheckboxChange = (optionId: number) => {
//     setValue!(
//       'bypass',
//       selectedBypassUsers.includes(optionId)
//         ? selectedBypassUsers.filter(item => item !== optionId)
//         : [...selectedBypassUsers, optionId],
//       { shouldValidate: true }
//     )
//   }
//   const triggerText = selectedBypassUsers.length
//     ? selectedBypassUsers
//         .map(id => bypassOptions.find(option => option.id === id)?.display_name)
//         .filter(Boolean)
//         .join(', ')
//     : 'Select Users'

//   return (
//     <FormFieldSet.ControlGroup>
//       <FormFieldSet.Label htmlFor="bypassValue">Bypass list</FormFieldSet.Label>

//       <DropdownMenu>
//         <DropdownMenuTrigger>
//           <div className=" flex justify-between border rounded-md items-center">
//             <Button variant="ghost w-full">
//               <Text color={selectedBypassUsers.length ? 'primary' : 'tertiaryBackground'}>{triggerText}</Text>
//             </Button>
//             <Icon name="chevron-down" className="mr-2" />
//           </div>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
//           <DropdownMenuLabel>Users</DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           {bypassOptions &&
//             bypassOptions.map(option => {
//               return (
//                 <DropdownMenuCheckboxItem
//                   onCheckedChange={() => handleCheckboxChange(option.id)}
//                   checked={selectedBypassUsers.includes(option.id)}
//                   onSelect={event => event.preventDefault()}>
//                   {option.display_name}
//                 </DropdownMenuCheckboxItem>
//               )
//             })}
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </FormFieldSet.ControlGroup>
//   )
// }

// export const BranchSettingsRuleEditPermissionsField: React.FC<FieldProps> = ({ register, errors, watch, setValue }) => (
//   <FormFieldSet.ControlGroup className="min-h-8 justify-center">
//     <FormFieldSet.Option
//       control={
//         <Checkbox
//           {...register!('repo_owners')}
//           checked={watch!('repo_owners')}
//           onCheckedChange={() => setValue!('repo_owners', !watch!('repo_owners'))}
//           id="edit-permissons"
//         />
//       }
//       id="edit-permissons"
//       label="Allow users with edit permission on the repository to bypass"
//       className="mt-0"
//     />

//     {errors!.repo_owners && (
//       <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
//         {errors!.repo_owners.message?.toString()}
//       </FormFieldSet.Message>
//     )}
//   </FormFieldSet.ControlGroup>
// )
