import { ReactNode, useCallback, useMemo, useRef, useState } from 'react'

import { useTranslation } from '@/context'
import { Button } from '@components/button'
import { IconV2 } from '@components/icon-v2'
import { Layout } from '@components/layout'
import { Text } from '@components/text'
import { useResizeObserver } from '@hooks/use-resize-observer'
import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'
import { Action, toast as sonnerToast } from 'sonner'

const toastVariants = cva('cn-toast', {
  variants: {
    variant: {
      default: '',
      loading: '',
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
  toastId: string | number
  variant?: VariantProps<typeof toastVariants>['variant']
  title: string
  description?: ReactNode
  onClose?: () => void
  className?: string
  closeButton?: boolean
  action?: Action
  promise?: Promise<any>
  successMessage?: string
  errorMessage?: string
}

const MAX_HEIGHT = 100

export function CustomToast({
  toastId,
  variant = 'default',
  title,
  description,
  onClose,
  closeButton = true,
  action,
  promise = undefined,
  successMessage,
  errorMessage
}: CustomToastProps) {
  const { t } = useTranslation()

  const [internalVariant, setInternalVariant] = useState(variant)
  const [internalTitle, setInternalTitle] = useState(title)

  const contentRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const showExpandButton = description && isOverflowing

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

  if (promise) {
    promise
      .then(() => {
        setInternalVariant('success')
        setInternalTitle(successMessage ?? title)
      })
      .catch(() => {
        setInternalVariant('danger')
        setInternalTitle(errorMessage ?? title)
      })
      .finally(() => {
        setTimeout(() => {
          sonnerToast.dismiss(toastId)
        }, 7000)
      })
  }

  const titleIcon = useMemo(() => {
    switch (internalVariant) {
      case 'danger':
        return <IconV2 size="lg" name="warning-triangle" />
      case 'info':
        return <IconV2 size="lg" name="info-circle" />
      case 'success':
        return <IconV2 color="success" size="lg" name="check-circle" />
      case 'loading':
        return <IconV2 className="animate-spin" size="lg" name="loader" />
      default:
        return null
    }
  }, [internalVariant])

  return (
    <Layout.Vertical gap="xs" className={toastVariants({ variant: internalVariant })}>
      <Layout.Flex align="center" gap="2xs" justify="between" className="cn-toast-title">
        <Layout.Horizontal className="flex-1" align="center" gap="xs">
          {titleIcon}
          <Text variant="body-strong" color="inherit">
            {internalTitle}
          </Text>
        </Layout.Horizontal>

        {action && (
          <Button
            className="cn-toast-action-button"
            size="sm"
            // TODO: remove this cast
            title={action.label as string}
            onClick={e => {
              action.onClick?.(e)
            }}
          >
            {action.label}
          </Button>
        )}

        {closeButton && (
          <Button size="xs" ignoreIconOnlyTooltip title="Close" variant="transparent" iconOnly onClick={onClose}>
            <IconV2 size="xs" name="xmark" />
          </Button>
        )}
      </Layout.Flex>

      {description && (
        <div
          ref={contentRef}
          className={cn('cn-toast-description-container', {
            'cn-toast-description-container-expanded': isExpanded
          })}
        >
          <Text variant="body-normal" className={cn('cn-toast-description')}>
            {description}
          </Text>
        </div>
      )}

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
    </Layout.Vertical>
  )
}
