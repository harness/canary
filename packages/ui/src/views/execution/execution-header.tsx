import { Text } from '@/components'

import { ExecutionHeaderProps } from './types'

export const ExecutionHeader: React.FC<ExecutionHeaderProps> = () => {
  return (
    <div className="flex w-full items-center justify-between border-b border-default px-6 py-4">
      <div className="flex items-center space-x-2">
        <Text>Execution Info</Text>
      </div>
    </div>
  )
}
