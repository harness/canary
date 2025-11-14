import { MessageRenderer } from '../../types/plugin'
import { useAssistantRuntime } from './useAssistantRuntime'

export function useContentRenderer(contentType: string): MessageRenderer | undefined {
  const runtime = useAssistantRuntime()
  return runtime.pluginRegistry.getBestRendererForType(contentType)
}

export function useHasDetailView(contentType: string): boolean {
  const runtime = useAssistantRuntime()
  return runtime.pluginRegistry.hasDetailView(contentType)
}

export function useShouldReuseInstance(contentType: string): boolean {
  const runtime = useAssistantRuntime()
  return runtime.pluginRegistry.shouldReuseInstance(contentType)
}
