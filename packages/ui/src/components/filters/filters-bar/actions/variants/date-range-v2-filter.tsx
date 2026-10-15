import { useMemo } from 'react'

import { DateRangeV2Content } from '../../../../date-range-v2/date-range-v2'
import type { DateRangeV2Config, DateRangeV2Value } from '../../../../date-range-v2/types'
import type { FilterFieldConfig } from '../../../types'

interface DateRangeV2FilterProps {
  filter: FilterFieldConfig<DateRangeV2Value>
  onUpdateFilter: (value?: DateRangeV2Value) => void
  onCancel: () => void
  config?: DateRangeV2Config
  disabled?: boolean
  readOnly?: boolean
}

const DateRangeV2Filter = ({
  filter,
  onUpdateFilter,
  onCancel,
  config,
  disabled,
  readOnly
}: DateRangeV2FilterProps) => {
  const pickerConfig = useMemo(() => ({ ...config, clearable: false }), [config])

  return (
    <DateRangeV2Content
      value={filter.value}
      config={pickerConfig}
      disabled={disabled}
      readOnly={readOnly}
      onApply={onUpdateFilter}
      onCancel={onCancel}
    />
  )
}

export default DateRangeV2Filter
