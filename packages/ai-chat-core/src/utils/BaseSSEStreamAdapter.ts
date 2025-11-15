import { StreamAdapter, StreamChunk } from '../types/adapters'
import { Message } from '../types/message'

export interface SSEEvent {
  event: string
  data: any
}

export abstract class BaseSSEStreamAdapter<TAllowedEvents extends readonly string[] = readonly string[]>
  implements StreamAdapter
{
  protected abstract prepareRequest(params: { messages: Message[]; signal?: AbortSignal }): {
    url: string
    options: RequestInit
  }

  protected abstract convertEvent(event: SSEEvent & { event: TAllowedEvents[number] }): StreamChunk | null

  protected getAllowedEvents(): TAllowedEvents | null {
    return null
  }

  protected shouldProcessEvent(eventType: string): boolean {
    const allowedEvents = this.getAllowedEvents()
    if (!allowedEvents) return true
    return allowedEvents.includes(eventType)
  }

  async *stream(params: { messages: Message[]; signal?: AbortSignal }): AsyncGenerator<StreamChunk, void, unknown> {
    const { signal } = params
    const { url, options } = this.prepareRequest(params)

    const response = await fetch(url, { ...options, signal })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (!response.body) {
      throw new Error('Response body is null')
    }

    yield* this.parseSSEStream(response.body, signal)
  }

  private async *parseSSEStream(
    body: ReadableStream<Uint8Array>,
    signal?: AbortSignal
  ): AsyncGenerator<StreamChunk, void, unknown> {
    const reader = body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let currentEvent: string | null = null

    try {
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const { done, value } = await reader.read()

        if (done) break
        if (signal?.aborted) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmedLine = line.trim()

          if (!trimmedLine) {
            currentEvent = null
            continue
          }

          if (trimmedLine === ': ping') {
            continue
          }

          if (trimmedLine.startsWith('event:')) {
            currentEvent = trimmedLine.substring(6).trim()
            continue
          }

          if (trimmedLine.startsWith('data:')) {
            const dataStr = trimmedLine.substring(5).trim()

            if (dataStr === 'eof' || trimmedLine === 'eof') {
              break
            }

            try {
              const data = JSON.parse(dataStr)

              console.log('currentEvent', currentEvent)

              console.log('this.getAllowedEvents()', this.getAllowedEvents())
              if (currentEvent && this.shouldProcessEvent(currentEvent)) {
                const chunk = this.convertEvent({
                  event: currentEvent as TAllowedEvents[number],
                  data
                })
                if (chunk) {
                  yield chunk
                }
              }
            } catch (e) {
              // handle error
            }

            currentEvent = null
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }
}
