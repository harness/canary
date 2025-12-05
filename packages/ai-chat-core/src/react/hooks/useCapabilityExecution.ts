import { useEffect, useState } from 'react'

import { CapabilityExecution } from '../../types/capability'
import { useAssistantRuntime } from './useAssistantRuntime'

export function useCapabilityExecution(capabilityId: string): CapabilityExecution | undefined {
  const runtime = useAssistantRuntime()
  const [execution, setExecution] = useState<CapabilityExecution | undefined>(() =>
    runtime.capabilityExecutionManager.getExecution(capabilityId)
  )

  useEffect(() => {
    // Get initial state
    setExecution(runtime.capabilityExecutionManager.getExecution(capabilityId))

    // Subscribe to updates
    const unsubscribe = runtime.capabilityExecutionManager.subscribe(id => {
      if (id === capabilityId) {
        setExecution(runtime.capabilityExecutionManager.getExecution(capabilityId))
      }
    })

    return unsubscribe
  }, [capabilityId, runtime])

  return execution
}
