import { FC } from 'react'

import { CapabilityConfig } from '../../types'
import { useCapability } from '../hooks/useCapability'

export function makeCapability<TArgs = any, TResult = any>(config: CapabilityConfig<TArgs, TResult>): FC {
  const Capability: FC = () => {
    useCapability(config)
    return null
  }

  Capability.displayName = `Capability(${config.name})`

  return Capability
}
