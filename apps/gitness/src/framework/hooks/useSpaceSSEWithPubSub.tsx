import { useEffect } from 'react'

import { useAPIPath } from '../../hooks/useAPIPath'
import { sseConnectionManager } from '../event/SSEConnectionManager'

type UseSpaceSSEProps = {
  space: string
}

/**
 * Hook that establishes a single SSE connection and publishes all events to the EventManager
 * This uses the SSEConnectionManager singleton to ensure a single persistent connection
 * across component mounts/unmounts and route changes
 */
const useSpaceSSEWithPubSub = ({ space }: UseSpaceSSEProps) => {
  const apiPath = useAPIPath()

  useEffect(() => {
    if (space) {
      // Use the singleton connection manager to establish/maintain the connection
      sseConnectionManager.connect(space, apiPath)
    }

    // No cleanup needed here - the connection is managed by the singleton
    // and will persist even when this component unmounts
  }, [space, apiPath])
}

export default useSpaceSSEWithPubSub
