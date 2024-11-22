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

function Legend({ children, className }: CompProps) {
  return (
    <Text size={3} weight={'medium'} className={cn('mb-0', className)} as="p" role="heading">
      {children}
    </Text>
  )
}

function SubLegend({ children, className }: CompProps) {
  return (
    <Text size={2} weight={'normal'} className={cn('text-primary/70 mb-0', className)} as="p" id="fieldset-description">
      {children}
    </Text>
  )
}

function Item({ children, className }: CompProps) {
  return (
    <div className={cn('item-wrapper', className)} role="presentation">
      {children}
    </div>
  )
}

function Label({ htmlFor, required, children, className }: LabelProps) {
  return (
    <ShadLabel htmlFor={htmlFor} variant="sm" className={cn('text-primary/80 font-normal', className)}>
      {children}
      {required && <span className="pl-0.5 align-top text-destructive">*</span>}
    </ShadLabel>
  )
}

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

function Caption({ children, className }: CompProps) {
  return (
    <Text as="p" size={1} color="tertiaryBackground" role="note" aria-live="polite" className={cn('mt-1', className)}>
      {children}
    </Text>
  )
}

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

function Separator({ dashed, dotted, className }: SeparatorProps) {
  return (
    <div
      className={cn('border-b', { 'border-dashed': dashed, 'border-dotted': dotted }, className)}
      role="separator"
      aria-orientation="horizontal"
    />
  )
}

function Spacer({ className }: SpacerProps) {
  return <div className={cn('mt-1', className)} role="presentation" aria-hidden="true" />
}

export { Root, Legend, SubLegend, Item, Label, ControlGroup, Caption, Message, Option, Separator, Spacer, MessageTheme }
