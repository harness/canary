import { Checkbox, cn, RadioGroupItem, Label as ShadLabel, Text } from '@harnessio/canary'

interface CompProps {
  children: React.ReactNode
  className?: string
}

interface RootProps {
  children: React.ReactNode
  box?: boolean
  shaded?: boolean
  className?: string
}

enum MessageTheme {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  DEFAULT = 'default'
}

interface MessageProps {
  children: React.ReactNode
  className?: string
  theme: MessageTheme
}

interface ControlProps {
  children: React.ReactNode
  type?: 'button'
  className?: string
}

type ControlType = React.ReactElement<typeof RadioGroupItem> | React.ReactElement<typeof Checkbox>

interface OptionProps {
  control: ControlType
  id: string
  label?: string
  description?: string
  className?: string
}

interface LabelProps {
  children: React.ReactNode
  htmlFor?: string
  required?: boolean
  className?: string
}

interface SeparatorProps {
  className?: string
  dashed?: boolean
  dotted?: boolean
}

interface SpacerProps {
  className?: string
}

const themeClassMap: Record<MessageTheme, string> = {
  [MessageTheme.SUCCESS]: 'text-success',
  [MessageTheme.WARNING]: 'text-warning',
  [MessageTheme.ERROR]: 'text-destructive',
  [MessageTheme.DEFAULT]: 'text-tertiary-background'
}

/** @deprecated: Use Fieldset from @harnessio/ui/components instead */
function Root({ children, box, shaded, className }: RootProps) {
  return (
    <fieldset
      className={cn(
        'mb-8 flex flex-col gap-6',
        { 'rounded-md border px-5 py-3.5 pb-5': box, 'bg-primary/[0.02]': shaded },
        className
      )}
      role="group"
      aria-describedby="fieldset-description"
    >
      {children}
    </fieldset>
  )
}

/** @deprecated: Use FormLegend from @harnessio/ui/components instead */
function Legend({ children, className }: CompProps) {
  return (
    <Text size={3} weight={'medium'} className={cn('mb-0', className)} as="p" role="heading">
      {children}
    </Text>
  )
}

/** @deprecated: Use FormLegend from @harnessio/ui/components instead */
function SubLegend({ children, className }: CompProps) {
  return (
    <Text size={2} weight={'normal'} className={cn('text-primary/70 mb-0', className)} as="p" id="fieldset-description">
      {children}
    </Text>
  )
}

/** @deprecated */
function Item({ children, className }: CompProps) {
  return (
    <div className={cn('item-wrapper', className)} role="presentation">
      {children}
    </div>
  )
}

/** @deprecated: Use Label from @harnessio/ui/components instead */
function Label({ htmlFor, required, children, className }: LabelProps) {
  return (
    <ShadLabel htmlFor={htmlFor} variant="sm" className={cn('text-primary/80 font-normal', className)}>
      {children}
      {required && <span className="text-destructive pl-0.5 align-top">*</span>}
    </ShadLabel>
  )
}

/** @deprecated */
function ControlGroup({ children, type, className }: ControlProps) {
  return (
    <div
      className={cn('flex flex-col gap-2', { 'mt-2': type === 'button' }, className)}
      role="group"
      aria-label={type === 'button' ? 'Button control group' : 'Input control group'}
    >
      {children}
    </div>
  )
}

/** @deprecated: Use Text from @harnessio/ui/components instead */
function Caption({ children, className }: CompProps) {
  return (
    <Text as="p" size={1} color="tertiaryBackground" role="note" aria-live="polite" className={cn('mt-1', className)}>
      {children}
    </Text>
  )
}

/** @deprecated: Use FormErrorMessage from @harnessio/ui/components instead */
function Message({ children, theme, className }: MessageProps) {
  const textClass = themeClassMap[theme]
  const role = theme === MessageTheme.ERROR ? 'alert' : 'status'
  const ariaLive = theme === MessageTheme.ERROR ? 'assertive' : 'polite'

  return (
    <div className={cn('', textClass, className)} role={role} aria-live={ariaLive}>
      <Text as="p" size={1} className="text-inherit">
        {children}
      </Text>
    </div>
  )
}

/** @deprecated: Use RadioGroupItem from @harnessio/ui/components instead */
function Option({ control, id, label, description, className }: OptionProps) {
  return (
    // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
    <div className={cn('mt-2 flex items-start gap-x-4', className)} role="option" aria-labelledby={`${id}-label`}>
      <div className="mt-0.5">{control}</div>
      <div className="flex flex-col gap-0">
        <Label htmlFor={id} className="font-medium">
          {label}
        </Label>
        {description && (
          <Text as="p" size={1} color="tertiaryBackground" id={`${id}-description`} role="note">
            {description}
          </Text>
        )}
      </div>
    </div>
  )
}

/** @deprecated: Use FormSeparator from @harnessio/ui/components instead */
function Separator({ dashed, dotted, className }: SeparatorProps) {
  return (
    <div
      className={cn('border-b', { 'border-dashed': dashed, 'border-dotted': dotted }, className)}
      role="separator"
      aria-orientation="horizontal"
    />
  )
}

/** @deprecated: Use Spacer from @harnessio/ui/components instead */
function Spacer({ className }: SpacerProps) {
  return <div className={cn('mt-1', className)} role="presentation" aria-hidden="true" />
}

export { Root, Legend, SubLegend, Item, Label, ControlGroup, Caption, Message, Option, Separator, Spacer, MessageTheme }
