import { useState } from 'react'

import { Button, Icon, IconProps, Layout, Toast, useToast } from '@/components'
import { cn } from '@/utils/cn'
import { TranslationStore } from '@/views'

type ToastContentState = {
  [key in string]: {
    withShowButton?: boolean
    withFullHeight?: boolean
  }
}

const commonIconProps: Omit<IconProps, 'name'> = {
  size: 12,
  'aria-hidden': true
}

export function Toaster({ useTranslationStore }: { useTranslationStore: () => TranslationStore }) {
  const { t } = useTranslationStore()
  const { toasts } = useToast()
  const [contentState, setContentState] = useState<ToastContentState>({})

  const makeHandleContentRef = (id: string) => (node?: HTMLDivElement | null) => {
    if (!node) return

    const scrollHeight = node.scrollHeight
    const nodeHeight = node.clientHeight
    const isOverflowing = scrollHeight > nodeHeight

    if (!contentState[id]?.withShowButton) {
      setContentState(prev => ({ ...prev, [id]: { ...prev[id], withShowButton: isOverflowing } }))
    }
  }

  const makeToggleShowButton = (id: string) => () => {
    setContentState(prev => ({
      ...prev,
      [id]: { ...prev[id], withFullHeight: !prev[id]?.withFullHeight }
    }))
  }

  return (
    <>
      {toasts.map(({ id, title, description, action, variant, withIndicator = true, ...props }) => {
        const { withShowButton = false, withFullHeight = false } = contentState[id] || {}

        return (
          <Toast.Root key={id} variant={variant} {...props} className="gap-x-[18px]">
            <Layout.Horizontal gap="space-x-2.5" className="items-center">
              {withIndicator && (
                <div className="self-start py-[5px]">
                  {variant === 'success' && (
                    <Icon name="checkbox" className="text-icons-success" {...commonIconProps} />
                  )}
                  {variant === 'destructive' && (
                    <Icon
                      name="warning-triangle-outline"
                      className="text-toast-foreground-danger"
                      {...commonIconProps}
                    />
                  )}
                  {variant === 'failed' && <Icon name="cross" className="text-icons-danger" {...commonIconProps} />}
                </div>
              )}
              <Layout.Vertical
                gap={cn('space-y-1', { 'line-clamp-3': !withFullHeight })}
                ref={makeHandleContentRef(id)}
              >
                {!!title && <Toast.Title>{title}</Toast.Title>}
                {!!description && <Toast.Description>{description}</Toast.Description>}
              </Layout.Vertical>
            </Layout.Horizontal>

            <Layout.Vertical gap="space-y-1" className="items-end justify-between">
              {!action && (
                <Toast.Close
                  variant="ghost"
                  className={cn(
                    variant === 'destructive'
                      ? 'text-toast-icons-danger-default hover:text-toast-icons-danger-hover'
                      : 'text-icons-1 hover:text-icons-2'
                  )}
                />
              )}

              {action}

              {withShowButton && (
                <Button variant="link" onClick={makeToggleShowButton(id)} className="min-w-fit self-end">
                  {withFullHeight
                    ? t('component:toaster.showLess', 'Show less')
                    : t('component:toaster.showMore', 'Show more')}
                </Button>
              )}
            </Layout.Vertical>
          </Toast.Root>
        )
      })}
      <Toast.Viewport />
    </>
  )
}
