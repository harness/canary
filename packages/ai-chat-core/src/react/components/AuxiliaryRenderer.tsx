import { AuxiliaryRendererProps } from '../../types/plugin'
import { useContentRenderer } from '../hooks'

export function AuxiliaryRenderer({
  message,
  content,
  context,
  onClose,
  onNavigate,
  onSwitchContext
}: AuxiliaryRendererProps) {
  const { auxiliaryComponent } = useContentRenderer(content.type, context)

  if (!auxiliaryComponent) {
    return null
  }

  const Component = auxiliaryComponent
  return (
    <Component
      content={content}
      message={message}
      context={context}
      onClose={onClose}
      onNavigate={onNavigate}
      onSwitchContext={onSwitchContext}
    />
  )
}
