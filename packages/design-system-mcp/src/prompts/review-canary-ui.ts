import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

export const REVIEW_CANARY_UI_PROMPT_NAME = 'review_canary_ui'

const REVIEW_STEPS = [
  'This review is advisory. Do not fail CI.',
  'Call search_components for any new or swapped UI. Import from @harnessio/ui/components.',
  'For Button (and any other stable contract), call validate_props with the props used. No constraints → unknown, not supported.',
  'Flag lucide-react or lucide imports. Use <IconV2 name="…" /> from @harnessio/ui/components. Never lucide-react.',
  'Flag @/components/ui and other shadcn paths. Canary is @harnessio/ui/components.',
  'Flag raw <button> when Canary Button exists. Flag raw <a> for in-app navigation when Canary Link exists.',
  'If confidence is not stable, still use the Canary export. Do not invent a parallel component.'
]

export function buildReviewCanaryUiPrompt(options: { path?: string; diff?: string } = {}): string {
  const parts = ['Review this UI change for Canary design-system mistakes.', ...REVIEW_STEPS]

  if (options.path?.trim()) {
    parts.push(`Path: ${options.path.trim()}`)
  }
  if (options.diff?.trim()) {
    parts.push('Diff or file:', options.diff.trim())
  }

  return parts.join('\n\n')
}

export function registerReviewCanaryUiPrompt(server: McpServer) {
  server.registerPrompt(
    REVIEW_CANARY_UI_PROMPT_NAME,
    {
      title: 'Review Canary UI',
      description:
        'Advisory review of a diff or file for Canary UI mistakes (Lucide, shadcn, raw button, Button validate_props). Does not fail CI.',
      argsSchema: {
        path: z.string().optional().describe('File path being reviewed'),
        diff: z.string().optional().describe('Unified diff or file contents to review')
      }
    },
    async ({ path, diff }) => ({
      description: 'Advisory Canary UI review. Does not fail CI.',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: buildReviewCanaryUiPrompt({ path, diff })
          }
        }
      ]
    })
  )
}
