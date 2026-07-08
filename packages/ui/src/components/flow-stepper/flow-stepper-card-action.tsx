import { Button } from '@components/button'
import { Text } from '@components/text'
import { cn } from '@utils/cn'

export interface FlowStepperCardActionProps {
  variant: 'warning' | 'danger' | 'info' | 'success'
  message: string
  actionLabel?: string
  onAction?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
}

export function FlowStepperCardAction({
  variant,
  message,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary
}: FlowStepperCardActionProps) {
  return (
    <div className={cn('cn-flow-stepper-card-action', `cn-flow-stepper-card-action-${variant}`)}>
      <Text as="span" variant="body-normal" className="cn-flow-stepper-card-action-message">
        {message}
      </Text>
      {(actionLabel || secondaryLabel) && (
        <div className="cn-flow-stepper-card-action-buttons">
          {secondaryLabel && onSecondary && (
            <Button variant="outline" size="sm" onClick={onSecondary}>
              {secondaryLabel}
            </Button>
          )}
          {actionLabel && onAction && (
            <Button variant="primary" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
