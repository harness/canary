import { CSSProperties, forwardRef, PropsWithChildren, useLayoutEffect, useRef, useState } from 'react'

import { useTranslation } from '@/context'
import { Button } from '@components/button'
import { IconNameMapV2, IconV2 } from '@components/icon-v2'
import { useResizeObserver } from '@hooks/use-resize-observer'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const alertVariants = cva('cn-alert', {
  variants: {
    theme: {
      info: 'cn-alert-info',
      danger: 'cn-alert-danger',
      warning: 'cn-alert-warning',
      success: 'cn-alert-success'
    }
  },
  defaultVariants: {
    theme: 'info'
  }
})

const iconMap: Record<NonNullable<VariantProps<typeof alertVariants>['theme']>, keyof typeof IconNameMapV2> = {
  info: 'info-circle',
  danger: 'xmark-circle',
  warning: 'warning-triangle',
  success: 'check-circle'
}

const MAX_HEIGHT = 138

export interface AlertRootProps extends PropsWithChildren<VariantProps<typeof alertVariants>> {
  className?: string
  dismissible?: boolean
  onDismiss?: () => void
  expandable?: boolean
}

export const AlertRoot = forwardRef<HTMLDivElement, AlertRootProps>(
  ({ className, theme, children, dismissible, onDismiss, expandable }, ref) => {
    const { t } = useTranslation()
    const [isVisible, setIsVisible] = useState(true)
    const [isExpanded, setIsExpanded] = useState(false)
    const [isOverflowing, setIsOverflowing] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)

    const handleDismiss = () => {
      setIsVisible(false)
      onDismiss?.()
    }

    const iconName: keyof typeof IconNameMapV2 = iconMap[theme ?? 'info']

    const toggleExpand = () => setIsExpanded(prev => !prev)

    const shouldShowButton = expandable && isOverflowing

    const alertStyle = {
      '--cn-alert-min-h': `${MAX_HEIGHT}px`
    } as CSSProperties

    useResizeObserver(
      contentRef,
      el => {
        if (!el) return
        const { scrollHeight } = el
        setIsOverflowing(scrollHeight > MAX_HEIGHT)
      },
      100
    )

    useLayoutEffect(() => {
      if (!expandable || !contentRef.current) return

      const el = contentRef.current
      setIsOverflowing(el.scrollHeight > MAX_HEIGHT)
    }, [children, expandable])

    if (!isVisible) return null

    return (
      <div ref={ref} role="alert" className={cn(alertVariants({ theme }), className)} style={alertStyle}>
        {dismissible && (
          <Button
            className="cn-alert-close-button"
            onClick={handleDismiss}
            type="button"
            variant="transparent"
            size="sm"
            iconOnly
            aria-label={t('component:alert.close', 'Close alert')}
          >
            <IconV2 className="cn-alert-close-button-icon" name="xmark" skipSize />
          </Button>
        )}

        <IconV2 className="cn-alert-icon" name={iconName} skipSize />

        <div className={cn('cn-alert-text-wrap', { 'cn-alert-text-wrap-expanded': isExpanded })}>
          <div
            className={cn('cn-alert-content-box', {
              'cn-alert-content-expanded': isExpanded,
              'cn-alert-content-overflow': shouldShowButton
            })}
          >
            <div
              ref={contentRef}
              className={cn('cn-alert-content', { 'cn-alert-min-h-content': shouldShowButton })}
              role="region"
              aria-label={t('component:alert.contentRegion', 'Alert content')}
            >
              {children}
            </div>
          </div>

          {shouldShowButton && (
            <>
              <Button
                className="cn-alert-expand-button"
                onClick={toggleExpand}
                type="button"
                variant="transparent"
                aria-expanded={isExpanded}
              >
                {isExpanded ? t('component:alert.showLess', 'Show less') : t('component:alert.showMore', 'Show more')}
                <IconV2
                  className={cn('cn-alert-expand-button-icon', {
                    'cn-alert-expand-button-icon-rotate-180': isExpanded
                  })}
                  name="nav-arrow-down"
                  skipSize
                />
              </Button>
            </>
          )}
        </div>

        {shouldShowButton && (
          <div className={cn('cn-alert-fade-overlay', { 'cn-alert-fade-overlay-not-visible': isExpanded })} />
        )}
      </div>
    )
  }
)

AlertRoot.displayName = 'AlertRoot'
