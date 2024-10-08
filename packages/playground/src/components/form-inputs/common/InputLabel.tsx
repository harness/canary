import React from 'react'
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@harnessio/canary'
import { InfoCircle } from '@harnessio/icons-noir'

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
          <TooltipTrigger asChild>
            <Button size="sm" variant="icon" className="ml-2 h-5 p-1 cursor-default">
              <InfoCircle />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{description}</TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}

export default InputLabel
