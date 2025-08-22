import { useEffect, useRef } from 'react'

import { EventSourcePolyfill } from 'event-source-polyfill'

import { useAPIPath } from '../../hooks/useAPIPath'
import { SSEEvent } from '../../types'
import { eventManager } from '../event/EventManager'

type UseSpaceSSEProps = {
  space: string
}

/**
 * Hook that establishes a single SSE connection and publishes all events to the EventManager
 * regardless of the events array
 */
const useSpaceSSEWithPubSub = ({ space }: UseSpaceSSEProps) => {
  const apiPath = useAPIPath()
  const eventSourceRef = useRef<EventSource | null>(null)

  // Get all event types from the SSEEvent enum
  const allEventTypes = Object.values(SSEEvent)

  useEffect(() => {
    // Conditionally establish the event stream
    if (!eventSourceRef.current) {
      const pathAndQuery = apiPath(`/api/v1/spaces/${space}/+/events`)

      const options: { heartbeatTimeout: number; headers?: { Authorization?: string } } = {
        heartbeatTimeout: 999999999
      }

      eventSourceRef.current = new EventSourcePolyfill(pathAndQuery, options)

      // Handle messages by publishing to the EventManager
      const handleMessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data)
          eventManager.publish(event.type, data)
        } catch (error) {
          console.error('Error parsing event data:', error)
        }
      }

      // Handle errors
      const handleError = (event: Event) => {
        eventManager.publish('error', event)
        eventSourceRef?.current?.close()
      }

      // Register error handler
      eventSourceRef?.current?.addEventListener('error', handleError)

      // Register listeners for all event types from the SSEEvent enum
      for (const eventType of allEventTypes) {
        eventSourceRef?.current?.addEventListener(eventType, handleMessage)
      }

      return () => {
        eventSourceRef.current?.removeEventListener('error', handleError)

        // Remove all event type listeners
        for (const eventType of allEventTypes) {
          eventSourceRef.current?.removeEventListener(eventType, handleMessage)
        }

        eventSourceRef.current?.close()
        eventSourceRef.current = null
      }
    }
  }, [space])
}

export default useSpaceSSEWithPubSub
