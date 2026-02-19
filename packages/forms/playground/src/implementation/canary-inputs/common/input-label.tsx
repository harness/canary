import { JSX, ReactNode } from 'react'

import { Label } from '@harnessio/ui/components'

import { formatLabel } from './utils/form-utils'

export interface InputLabelProps {
  label?: string
  disabled?: boolean
  className?: string
  suffix?: ReactNode
  showOptional?: boolean
  appendColon?: boolean
  tooltip?: string
}

function InputLabel(props: InputLabelProps): JSX.Element | null {
  const { label, disabled, className, suffix, showOptional = false, appendColon = true, tooltip } = props

  if (!label) return null
  const formattedLabel = formatLabel(label, appendColon)

  return (
    <Label disabled={disabled} optional={showOptional} className={className} suffix={suffix} tooltipContent={tooltip}>
      {formattedLabel}
    </Label>
  )
}

export { InputLabel }
