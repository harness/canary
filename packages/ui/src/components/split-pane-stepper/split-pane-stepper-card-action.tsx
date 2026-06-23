import { Button } from '@components/button'
import { Text } from '@components/text'
import { cn } from '@utils/cn'

import { CardActionProps } from './split-pane-stepper-types'

export function SplitPaneStepperCardAction({
  variant,
  message,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary
}: CardActionProps) {
  return (
    <div className={cn('cn-split-pane-stepper-card-action', `cn-split-pane-stepper-card-action-${variant}`)}>
      <Text as="span" variant="body-normal" className="cn-split-pane-stepper-card-action-message">
        {message}
      </Text>
      {(actionLabel || secondaryLabel) && (
        <div className="cn-split-pane-stepper-card-action-buttons">
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
