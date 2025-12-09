import { useEffect, useReducer, useState } from 'react'

import { CapabilityExecution } from '../../types/capability'
import { useAssistantRuntime } from './useAssistantRuntime'

export function useCapabilityExecution(capabilityId: string): CapabilityExecution | undefined {
  const runtime = useAssistantRuntime()
  const [execution, setExecution] = useState<CapabilityExecution | undefined>(() =>
    runtime.capabilityExecutionManager.getExecution(capabilityId)
  )
  const [, forceUpdate] = useReducer(x => x + 1, 0)

  useEffect(() => {
    // Get initial state
    const initialExecution = runtime.capabilityExecutionManager.getExecution(capabilityId)
    setExecution(initialExecution)

    // Subscribe to updates
    const unsubscribe = runtime.capabilityExecutionManager.subscribe(id => {
      if (id === capabilityId) {
        const updatedExecution = runtime.capabilityExecutionManager.getExecution(capabilityId)
        setExecution(updatedExecution)
        forceUpdate()
      }
    })

    return unsubscribe
  }, [capabilityId, runtime])

  return execution
}
