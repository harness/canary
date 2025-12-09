import { useEffect } from 'react'

import { CapabilityConfig } from '../../types/capability'
import { useAssistantRuntime } from './useAssistantRuntime'

export function useCapability<TArgs = any, TResult = any>(config: CapabilityConfig<TArgs, TResult>): void {
  const runtime = useAssistantRuntime()

  useEffect(() => {
    // Register handler
    if (config.execute) {
      runtime.capabilityRegistry.registerHandler(config.name, { execute: config.execute })
    }

    // Register renderer
    if (config.render) {
      runtime.capabilityRegistry.registerRenderer(config.name, {
        component: config.render
      })
    }

    // Cleanup on unmount
    return () => {
      runtime.capabilityRegistry.unregister(config.name)
    }
  }, [config.name, runtime])
}
