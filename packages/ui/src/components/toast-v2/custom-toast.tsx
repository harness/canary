import { ReactNode, useCallback, useMemo, useRef, useState } from 'react'

import { useTranslation } from '@/context'
import { Button } from '@components/button'
import { IconV2 } from '@components/icon-v2'
import { Layout } from '@components/layout'
import { Text } from '@components/text'
import { useResizeObserver } from '@hooks/use-resize-observer'
import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

const toastVariants = cva('cn-toast', {
  variants: {
    variant: {
      default: '',
      danger: 'cn-toast-danger',
      info: 'cn-toast-info',
      success: 'cn-toast-success'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

interface CustomToastProps {
  variant?: VariantProps<typeof toastVariants>['variant']
  title?: string
  description: ReactNode
  onClose?: () => void
  className?: string
  closeButton?: boolean
}

const MAX_HEIGHT = 100

export function CustomToast({
  variant = 'default',
  title,
  description,
  onClose,
  closeButton = true
}: CustomToastProps) {
  const { t } = useTranslation()

  const contentRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const showExpandButton = isOverflowing

  const toggleExpand = useCallback(() => setIsExpanded(prev => !prev), [])

  useResizeObserver(
    contentRef,
    el => {
      if (!el) return
      const { scrollHeight } = el
      setIsOverflowing(scrollHeight > MAX_HEIGHT)
    },
    100
  )

  const titleIcon = useMemo(() => {
    switch (variant) {
      case 'default':
        return null
      case 'danger':
        return <IconV2 size="lg" name="warning-triangle" />
      case 'info':
        return <IconV2 size="lg" name="info-circle" />
      case 'success':
        return <IconV2 color="success" size="lg" name="check-circle" />
    }
  }, [variant])

  return (
    <Layout.Vertical className={toastVariants({ variant })}>
      <Layout.Flex justify="between" className="cn-toast-title">
        <Layout.Horizontal align="center" gap="xs">
          {titleIcon}
          <Text>{title}</Text>
        </Layout.Horizontal>
        {closeButton && (
          <Button size="3xs" ignoreIconOnlyTooltip title="Close" variant="transparent" iconOnly onClick={onClose}>
            <IconV2 size="xs" name="xmark" />
          </Button>
        )}
      </Layout.Flex>

      {description && (
        <div
          ref={contentRef}
          className={cn('cn-toast-description-container', { 'cn-toast-description-container-expanded': isExpanded })}
        >
          <Text className="cn-toast-description">{description}</Text>

          {showExpandButton && (
            <>
              <Button
                variant="transparent"
                className="cn-toast-expand-button"
                onClick={toggleExpand}
                aria-expanded={isExpanded}
              >
                {isExpanded ? t('component:alert.showLess', 'Show less') : t('component:alert.showMore', 'Show more')}
                <IconV2
                  className={cn({
                    'cn-toast-expand-button-icon-rotate-180': isExpanded
                  })}
                  name="nav-arrow-down"
                />
              </Button>

              <div className={cn('cn-toast-fade-overlay', { 'cn-toast-fade-overlay-not-visible': isExpanded })} />
            </>
          )}
        </div>
      )}
    </Layout.Vertical>
  )
}
