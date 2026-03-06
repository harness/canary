import { StreamAdapter, StreamChunk, StreamRequest } from '@harnessio/ai-chat-core'

let idCounter = 0
function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${++idCounter}`
}

export class CatalogueMockStreamAdapter implements StreamAdapter {
  async *stream(request: StreamRequest): AsyncIterable<StreamChunk> {
    const { signal } = request
    const userText = request.messages[request.messages.length - 1]?.content[0]?.data ?? ''

    await this.delay(400)
    if (signal?.aborted) return

    yield {
      event: {
        type: 'part-start',
        part: { type: 'assistant_thought' as const }
      }
    }

    await this.delay(200)
    if (signal?.aborted) return

    yield {
      event: {
        type: 'assistant_thought',
        delta: `Processing your request: "${userText.slice(0, 50)}..."`
      }
    }

    await this.delay(300)
    if (signal?.aborted) return

    yield {
      event: {
        type: 'assistant_thought',
        delta: 'Analyzing context and preparing a response.'
      }
    }

    await this.delay(200)
    if (signal?.aborted) return

    yield { event: { type: 'part-finish' } }

    await this.delay(300)
    if (signal?.aborted) return

    yield {
      event: {
        type: 'part-start',
        part: { type: 'text' as const }
      }
    }

    const responseChunks = [
      "I've analyzed your request. ",
      'Here is what I found:\n\n',
      '- The pipeline configuration looks correct\n',
      '- All stages are properly connected\n',
      '- Dependencies are resolved\n\n',
      'Would you like me to proceed with the deployment?'
    ]

    for (const chunk of responseChunks) {
      yield {
        event: {
          type: 'text-delta',
          delta: chunk
        }
      }
      await this.delay(80)
      if (signal?.aborted) return
    }

    yield { event: { type: 'part-finish' } }

    await this.delay(200)
    if (signal?.aborted) return

    yield {
      event: {
        type: 'capability_execution',
        capabilityName: 'open_drawer',
        capabilityId: generateId('cap'),
        args: { title: 'Pipeline Details', content: 'Detailed pipeline information here' },
        strategy: 'queue'
      }
    }

    await this.delay(200)
    if (signal?.aborted) return

    yield {
      event: {
        type: 'prompts',
        data: {
          title: 'What next?',
          prompts: [
            { text: 'Deploy to production' },
            { text: 'Run tests first' },
            { text: 'Show me the YAML' }
          ]
        }
      }
    }

    await this.delay(200)
    if (signal?.aborted) return

    yield {
      event: {
        type: 'suggested_actions',
        data: {
          actions: ['Accept', 'Regenerate', 'Edit']
        }
      }
    }

    await this.delay(100)
    if (signal?.aborted) return

    yield {
      event: {
        type: 'feedback',
        data: {
          conversation_id: 'demo-conv',
          interaction_id: 'demo-int'
        }
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
