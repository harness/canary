import {
  Children,
  CSSProperties,
  forwardRef,
  isValidElement,
  PropsWithChildren,
  ReactNode,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import { Button } from '@components/button'
import { Icon, IconNameMap } from '@components/icon'
import { useResizeObserver } from '@hooks/use-resize-observer'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { AlertTitle } from './AlertTitle'

const alertVariants = cva('cn-alert', {
  variants: {
    theme: {
      info: 'cn-alert-info',
      danger: 'cn-alert-danger',
      warning: 'cn-alert-warning'
    }
  },
  defaultVariants: {
    theme: 'info'
  }
})

const iconMap: Record<NonNullable<VariantProps<typeof alertVariants>['theme']>, keyof typeof IconNameMap> = {
  info: 'info-circle',
  danger: 'cross-circle',
  warning: 'warning-triangle-outline'
}

const MAX_HEIGHT_WITH_TITLE = 138
const MAX_HEIGHT_WITHOUT_TITLE = 134

export interface AlertRootProps extends PropsWithChildren<VariantProps<typeof alertVariants>> {
  className?: string
  dismissible?: boolean
  onDismiss?: () => void
  expandable?: boolean
}

export const AlertRoot = forwardRef<HTMLDivElement, AlertRootProps>(
  ({ className, theme, children, dismissible, onDismiss, expandable }, ref) => {
    const [isVisible, setIsVisible] = useState(true)
    const [isExpanded, setIsExpanded] = useState(false)
    const [isOverflowing, setIsOverflowing] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)

    const handleDismiss = () => {
      setIsVisible(false)
      onDismiss?.()
    }

    const iconName: keyof typeof IconNameMap = iconMap[theme ?? 'info']

    const toggleExpand = () => setIsExpanded(prev => !prev)

    const shouldShowButton = expandable && isOverflowing

    const hasTitle = Children.toArray(children).some(
      (child: ReactNode) => isValidElement(child) && child?.type === AlertTitle
    )

    const MAX_HEIGHT = useMemo(() => (hasTitle ? MAX_HEIGHT_WITH_TITLE : MAX_HEIGHT_WITHOUT_TITLE), [hasTitle])
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
            aria-label="Close alert"
          >
            <Icon className="cn-alert-close-button-icon" name="close" skipSize />
          </Button>
        )}

        <Icon className="cn-alert-icon" name={iconName} skipSize />

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
              aria-label="Alert content"
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
                {isExpanded ? 'Show less' : 'Show more'}
                <Icon
                  className={cn('cn-alert-expand-button-icon', {
                    'cn-alert-expand-button-icon-rotate-180': isExpanded
                  })}
                  name="chevron-down"
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
