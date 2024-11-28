import { useEffect, useRef, useState } from 'react'

import { EventSourcePolyfill } from 'event-source-polyfill'
import { isEqual } from 'lodash-es'

type UseSpaceSSEProps = {
  space: string
  events: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEvent: (data: any, type: string) => void
  onError?: (event: Event) => void
  shouldRun?: boolean
}

const useSpaceSSE = ({ space, events: _events, onEvent, onError, shouldRun = true }: UseSpaceSSEProps) => {
  //   const { standalone, routingId, hooks } = useAppContext()
  const [events, setEvents] = useState(_events)
  const eventSourceRef = useRef<EventSource | null>(null)
  useEffect(() => {
    if (!isEqual(events, _events)) {
      setEvents(_events)
    }
  }, [_events, setEvents, events])

  useEffect(() => {
    // Conditionally establish the event stream - don't want to open on a finished execution
    if (shouldRun && events.length > 0) {
      if (!eventSourceRef.current) {
        const pathAndQuery = `/api/v1/spaces/${space}/+/events`

        const options: { heartbeatTimeout: number; headers?: { Authorization?: string } } = {
          heartbeatTimeout: 999999999
        }

        eventSourceRef.current = new EventSourcePolyfill(pathAndQuery, options)
        const handleMessage = (event: MessageEvent) => {
          const data = JSON.parse(event.data)
          onEvent(data, event.type)
        }

        const handleError = (event: Event) => {
          if (onError) onError(event)
          eventSourceRef?.current?.close()
        }

        // always register error
        eventSourceRef?.current?.addEventListener('error', handleError)

        // register requested events
        for (const i in events) {
          const eventType = events[i]
          eventSourceRef?.current?.addEventListener(eventType, handleMessage)
        }

        return () => {
          eventSourceRef.current?.removeEventListener('error', handleError)
          for (const i in events) {
            const eventType = events[i]
            eventSourceRef.current?.removeEventListener(eventType, handleMessage)
          }
          eventSourceRef.current?.close()
          eventSourceRef.current = null
        }
      }
    } else {
      // If shouldRun is false, close and cleanup any existing stream
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    }
  }, [space, events, shouldRun, onEvent, onError])
}

export default useSpaceSSE
