import { useEffect } from 'react'

import { ChatContextItem } from '../../types/context'
import { useChatContext } from '../providers/ChatContextProvider'

export interface UsePageContextOptions extends Omit<ChatContextItem, 'id'> {
  /**
   * Optional ID for the context. Defaults to 'currentPage'.
   * Use a custom ID if you need multiple page contexts or want to namespace your context.
   */
  id?: string
}

/**
 * Hook for pages to easily register their context with the chat system.
 * Automatically cleans up the context when the component unmounts.
 *
 * @param options - Context configuration
 *
 * @example
 * ```tsx
 * function ConnectorListPage() {
 *   usePageContext({
 *     displayName: 'Connectors',
 *     data: {
 *       currentPage: { page_id: 'connectors' }
 *     },
 *     priority: 0
 *   })
 *
 *   // Rest of component...
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom ID
 * function PipelineStudio({ pipelineId, pipelineName }) {
 *   usePageContext({
 *     id: 'currentPipeline',
 *     displayName: `Pipeline: ${pipelineName}`,
 *     data: {
 *       selectedPipeline: { id: pipelineId, name: pipelineName }
 *     },
 *     priority: 1
 *   })
 * }
 * ```
 */
export function usePageContext(options: UsePageContextOptions): void {
  const { setContext, removeContext } = useChatContext()
  const { id = 'currentPage', ...contextData } = options

  useEffect(() => {
    setContext(id, contextData)

    return () => {
      removeContext(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, contextData.displayName, JSON.stringify(contextData.data), contextData.priority, contextData.icon])
}
