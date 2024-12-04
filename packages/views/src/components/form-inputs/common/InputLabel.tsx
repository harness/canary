import { Icon, Tooltip, TooltipContent, TooltipTrigger } from '@harnessio/canary'

export interface InputLabelProps {
  label?: string
  description?: string
  required?: boolean
}

function InputLabel(props: InputLabelProps): JSX.Element {
  const { label, description, required } = props

  const labelText = required && label ? `${label} *` : label

  return (
    <div className="flex">
      <div className="text-muted-foreground">{labelText}</div>
      {description && (
        <Tooltip>
          <TooltipTrigger>
            <Icon name="info-circle" className="text-muted-foreground ml-2 h-5" />
          </TooltipTrigger>
          <TooltipContent>{description}</TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}

export default InputLabel
