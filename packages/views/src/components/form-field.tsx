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

// Root component for grouping form elements
function Root({ children, box, shaded, className }: RootProps) {
  return (
    <fieldset
      className={cn(
        'mb-8 flex flex-col gap-2',
        { 'rounded-md border px-5 py-3.5 pb-5': box, 'bg-primary/[0.02]': shaded },
        className
      )}
    >
      {children}
    </fieldset>
  )
}

// Form item wrapper, using div for layout purposes
function Item({ children, className }: CompProps) {
  return (
    <div className={cn('item-wrapper', className)} role="presentation">
      {children}
    </div>
  )
}

// Label component associated with its control using htmlFor
function Label({ htmlFor, children, className }: LabelProps) {
  return (
    <ShadLabel htmlFor={htmlFor} variant="sm" className={cn('font-medium', className)}>
      {children}
    </ShadLabel>
  )
}

// Control component for managing nested form inputs
function Control({ children, className }: CompProps) {
  return (
    <div className={cn('control-wrapper', className)} role="presentation">
      {children}
    </div>
  )
}

// Caption component to display supplementary information about a form field
function Caption({ children, className }: CompProps) {
  return (
    <Text as="p" size={1} color="tertiaryBackground" role="note" className={cn(className)}>
      {children}
    </Text>
  )
}

// Accessible message component for showing alerts, errors, or status updates
function Message({ children, theme, className }: MessageProps) {
  const textClass = themeClassMap[theme]
  const role = theme === MessageTheme.ERROR ? 'alert' : 'status'
  const ariaLive = theme === MessageTheme.ERROR ? 'assertive' : 'polite'

  return (
    <div className={cn('', textClass, className)} role={role} aria-live={ariaLive}>
      <Text size={1} className="text-inherit">
        {children}
      </Text>
    </div>
  )
}

// Option component for form controls like radio buttons or checkboxes
function Option({ control, id, label, description, className }: OptionProps) {
  return (
    <div className={cn('mt-2 flex items-start gap-x-4', className)}>
      <div className="mt-0.5">{control}</div>
      <div className="flex flex-col gap-0">
        <Label htmlFor={id}>{label}</Label>
        {description && (
          <Text size={1} color="tertiaryBackground" id={`${id}-description`} role="note">
            {description}
          </Text>
        )}
      </div>
    </div>
  )
}

function Separator({ dashed, dotted, className }: SeparatorProps) {
  return <div className={cn('border-b', { 'border-dashed': dashed, 'border-dotted': dotted }, className)} />
}

function Spacer({ className }: SpacerProps) {
  return <div className={cn('mt-1', className)} />
}

export { Root, Item, Label, Control, Caption, Message, Option, Separator, Spacer, MessageTheme }
