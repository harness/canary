import { ChatPlugin, MessageRenderer } from '@harnessio/ai-chat-core'

import { ArtifactRenderer } from './renderers/artifact-renderer'
import { ErrorRenderer } from './renderers/error-renderer'
import { FeedbackRenderer } from './renderers/feedback-renderer'
import { PromptsRenderer } from './renderers/prompts-renderer'
import { SuggestedActionsRenderer } from './renderers/suggested-actions-renderer'
import { TextRenderer } from './renderers/text-renderer'
import { ThoughtProcessRenderer } from './renderers/thought-process-renderer'

const textRenderer: MessageRenderer = {
  type: 'text',
  component: TextRenderer,
  priority: 0,
  catalogue: {
    displayName: 'Text Message',
    description: 'Renders plain or markdown text content. Used for both user messages and assistant responses.',
    category: 'core',
    backendEvents: [
      { eventName: 'part_start', examplePayload: { type: 'text' } },
      { eventName: 'text-delta', examplePayload: { delta: 'Hello, I can help you with...' } },
      { eventName: 'part_end', examplePayload: {} }
    ],
    mockContent: {
      type: 'text',
      data: "Here is a response from the assistant. It supports **bold**, *italic*, and `inline code`.\n\n- Bullet points work too\n- Second item\n\n```yaml\npipeline:\n  name: Example\n  stages:\n    - stage:\n        name: Build\n```"
    },
    tags: ['text', 'markdown', 'streaming'],
    supportsStreaming: true
  }
}

const thoughtProcessRenderer: MessageRenderer = {
  type: 'assistant_thought',
  component: ThoughtProcessRenderer,
  priority: 1,
  catalogue: {
    displayName: 'Thought Process',
    description:
      'Collapsible reasoning display. Shows the assistant thinking steps while processing a request. Auto-expands during streaming.',
    category: 'core',
    backendEvents: [
      { eventName: 'part_start', examplePayload: { type: 'assistant_thought', id: 'thought-1' } },
      {
        eventName: 'assistant_thought',
        examplePayload: { id: 'thought-1', delta: { v: 'Analyzing the pipeline configuration...' } }
      },
      { eventName: 'part_end', examplePayload: { id: 'thought-1' } }
    ],
    mockContent: {
      type: 'assistant_thought',
      data: [
        'Analyzing the user request for a CI/CD pipeline...',
        'I need to create a pipeline with build, test, and deploy stages.',
        'Using the Custom stage type with appropriate step configurations.'
      ]
    },
    tags: ['reasoning', 'thinking', 'collapsible'],
    supportsStreaming: true
  }
}

const promptsRenderer: MessageRenderer = {
  type: 'prompts',
  component: PromptsRenderer,
  priority: 1,
  catalogue: {
    displayName: 'Suggested Prompts',
    description:
      'Displays a list of follow-up prompts the user can select. Supports keyboard navigation (arrows, Enter, Escape).',
    category: 'core',
    backendEvents: [
      {
        eventName: 'prompts',
        examplePayload: {
          title: 'Explore Further',
          prompts: [
            { text: 'How do I add a deployment stage?' },
            { text: 'Can you add approval steps?' },
            { text: 'Show me pipeline triggers' }
          ]
        }
      }
    ],
    mockContent: {
      type: 'prompts',
      data: {
        title: 'Explore Further',
        prompts: [
          { text: 'How do I add a deployment stage?' },
          { text: 'Can you add approval steps to the pipeline?' },
          { text: 'Show me how to configure pipeline triggers' },
          { text: 'What are the best practices for CI/CD?' }
        ]
      }
    },
    tags: ['prompts', 'suggestions', 'interactive']
  }
}

const feedbackRenderer: MessageRenderer = {
  type: 'feedback',
  component: FeedbackRenderer,
  priority: 1,
  catalogue: {
    displayName: 'Feedback Widget',
    description: 'Thumbs up/down feedback component. Allows users to rate assistant responses.',
    category: 'feedback',
    backendEvents: [
      {
        eventName: 'collect_feedback',
        examplePayload: {
          conversation_id: 'conv-123',
          interaction_id: 'int-456',
          session_id: 'sess-789'
        }
      }
    ],
    mockContent: {
      type: 'feedback',
      data: {
        conversation_id: 'conv-demo-123',
        interaction_id: 'int-demo-456'
      }
    },
    tags: ['feedback', 'rating']
  }
}

const artifactRenderer: MessageRenderer = {
  type: 'artifact',
  component: ArtifactRenderer,
  priority: 1,
  catalogue: {
    displayName: 'Artifact Card',
    description:
      'Displays an entity artifact (pipeline, template, etc.) as a clickable card. Clicking re-executes the capability.',
    category: 'capability',
    backendEvents: [
      {
        eventName: 'capability_execution',
        examplePayload: {
          capability_id: 'create_pipeline',
          action_id: 'action-123',
          args: { name: 'My Pipeline' },
          artifact: {
            displayName: 'Wait Pipeline',
            displayType: 'pipeline'
          }
        }
      }
    ],
    mockContent: {
      type: 'artifact',
      data: {
        capabilityName: 'create_pipeline',
        originalArgs: { name: 'Wait Pipeline', identifier: 'wait_pipeline' },
        displayData: {
          name: 'Wait Pipeline',
          type: 'pipeline'
        }
      }
    },
    tags: ['artifact', 'entity', 'pipeline', 'clickable']
  }
}

const suggestedActionsRenderer: MessageRenderer = {
  type: 'suggested_actions',
  component: SuggestedActionsRenderer,
  priority: 1,
  catalogue: {
    displayName: 'Suggested Actions',
    description: 'Displays action buttons as chips/pills. Used for quick actions the user can take.',
    category: 'custom',
    backendEvents: [
      {
        eventName: 'suggested_actions',
        examplePayload: {
          title: 'Quick Actions',
          actions: ['View Pipeline', 'Run Pipeline', 'Edit Configuration']
        }
      }
    ],
    mockContent: {
      type: 'suggested_actions',
      data: {
        title: 'Quick Actions',
        actions: ['View Pipeline', 'Run Pipeline', 'Edit Configuration', 'View Logs']
      }
    },
    tags: ['actions', 'buttons', 'quick-actions']
  }
}

const errorRenderer: MessageRenderer = {
  type: 'error',
  component: ErrorRenderer,
  priority: 1,
  catalogue: {
    displayName: 'Error Message',
    description: 'Displays an error message when something goes wrong during streaming or processing.',
    category: 'core',
    backendEvents: [
      {
        eventName: 'error',
        examplePayload: { error: 'Failed to generate pipeline: invalid stage configuration' }
      }
    ],
    mockContent: {
      type: 'error',
      data: 'Failed to generate pipeline: invalid stage configuration. Please check your inputs and try again.'
    },
    tags: ['error', 'failure']
  }
}

export const cataloguePlugin: ChatPlugin = {
  id: 'ai-catalogue',
  name: 'AI Catalogue Plugin',
  renderers: [
    textRenderer,
    thoughtProcessRenderer,
    promptsRenderer,
    feedbackRenderer,
    artifactRenderer,
    suggestedActionsRenderer,
    errorRenderer
  ]
}
