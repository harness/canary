import { FocusContext } from '../../runtime/ContentFocusRuntime/ContentFocusRuntime'
import { useAssistantRuntime } from './useAssistantRuntime'


export function useContentRenderer(contentType: string, context?: FocusContext) {
  const runtime = useAssistantRuntime()
  const renderer = runtime.pluginRegistry.getBestRendererForType(contentType)

  if (!renderer) {
    return {
      component: null,
      auxiliaryComponent: null,
      supportsFocus: false,
      supportsPreview: false,
      supportsFullscreen: false
    }
  }

  // Get auxiliary component for specific context
  const auxiliaryComponent = context ? renderer.auxiliary?.[context] : null

  return {
    component: renderer.component,
    auxiliaryComponent,
    supportsFocus: renderer.capabilities?.supportsFocus ?? false,
    supportsPreview: renderer.capabilities?.supportsPreview ?? false,
    supportsFullscreen: renderer.capabilities?.supportsFullscreen ?? false
  }
}

export function useHasAuxiliaryView(contentType: string, context: FocusContext): boolean {
  const runtime = useAssistantRuntime()
  const renderer = runtime.pluginRegistry.getBestRendererForType(contentType)
  return !!renderer?.auxiliary?.[context]
}

export function useSupportsFocus(contentType: string): boolean {
  const runtime = useAssistantRuntime()
  const renderer = runtime.pluginRegistry.getBestRendererForType(contentType)
  return renderer?.capabilities?.supportsFocus ?? false
}
