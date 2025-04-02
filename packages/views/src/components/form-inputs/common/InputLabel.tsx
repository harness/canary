export interface InputLabelProps {
  label?: string
  description?: string
  required?: boolean
}

function InputLabel(props: InputLabelProps): JSX.Element {
  const { label, required } = props

  const labelText = required && label ? `${label} *` : label

  return (
    <div className="flex">
      <div className="text-muted-foreground">{labelText}</div>
      {/* TODO: TooltipProvider not available */}
      {/* {description && (
        <Tooltip>
          <TooltipTrigger>
            <Icon name="info-circle" className="ml-2 h-5 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>{description}</TooltipContent>
        </Tooltip>
      )} */}
    </div>
  )
}

export default InputLabel
