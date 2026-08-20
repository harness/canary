import { Children, ComponentProps, forwardRef, isValidElement, ReactElement, ReactNode } from 'react'

import { Link, LinkProps, TimeAgoCard } from '@/components'
import { Layout } from '@components/layout'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { AlertItemDescription } from './AlertItemDescription'
import { AlertItemLink } from './AlertItemLink'
import { AlertItemTitle } from './AlertItemTitle'

function extractTextContent(node: ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (!node) return ''
  if (Array.isArray(node)) return node.map(extractTextContent).join('')
  if (isValidElement(node)) return extractTextContent((node.props as { children?: ReactNode }).children)
  return ''
}

export type AlertItemTheme = 'info' | 'success' | 'warning' | 'danger'

export const alertItemVariants = cva('cn-alert-item', {
  variants: {
    theme: {
      info: 'cn-alert-item-info',
      success: 'cn-alert-item-success',
      warning: 'cn-alert-item-warning',
      danger: 'cn-alert-item-danger'
    },
    read: {
      true: '',
      false: 'cn-alert-item-unread bg-[var(--cn-set-brand-outline-bg)]'
    },
    clickable: {
      true: 'hover:bg-cn-hover cursor-pointer duration-150 ease-in-out',
      false: ''
    }
  },
  defaultVariants: {
    read: true,
    clickable: false
  }
})

export interface AlertItemProps extends Omit<ComponentProps<'div'>, 'ref'>, VariantProps<typeof alertItemVariants> {
  theme: AlertItemTheme
  read?: boolean
  timestamp?: string | number | null
  to?: string
  linkProps?: Omit<LinkProps, 'to'>
  onClick?: () => void
  children: ReactNode
}

function partitionChildren(children: ReactNode) {
  let title: ReactElement | null = null
  let description: ReactElement | null = null
  let link: ReactElement | null = null

  Children.forEach(children, child => {
    if (!isValidElement(child)) return

    if (child.type === AlertItemTitle) {
      title = child
    } else if (child.type === AlertItemDescription) {
      description = child
    } else if (child.type === AlertItemLink) {
      link = child
    }
  })

  return { title, description, link }
}

export const AlertItemComp = forwardRef<HTMLDivElement, AlertItemProps>(
  ({ className, children, theme, read = true, timestamp, to, linkProps, onClick, ...props }, ref) => {
    const { title, description, link } = partitionChildren(children)

    const withLink = Boolean(to)
    const withButton = !to && !!onClick
    const isClickable = withLink || withButton

    const titleText = extractTextContent(title)
    const overlayAriaLabel = linkProps?.['aria-label'] ?? titleText

    const handleLinkClick = (e: React.MouseEvent) => {
      // If modifier keys are pressed (Cmd+click, Ctrl+click, Shift+click),
      // let the browser handle it (opens in new tab/window) - don't call onClick
      if (e.metaKey || e.ctrlKey || e.shiftKey) {
        return
      }
      onClick?.()
    }

    return (
      <Layout.Horizontal
        ref={ref}
        className={cn(alertItemVariants({ theme, read, clickable: isClickable }), className)}
        {...props}
      >
        {to && (
          <Link
            className="cn-alert-item-clickable-block absolute inset-0 z-0 !w-full"
            to={to}
            {...(linkProps || {})}
            aria-label={overlayAriaLabel}
            onClick={handleLinkClick}
          />
        )}
        {withButton && (
          <button
            type="button"
            className="cn-alert-item-clickable-block absolute inset-0 z-0 !w-full"
            aria-label={overlayAriaLabel}
            onClick={() => onClick?.()}
          />
        )}
        <Layout.Horizontal align="start" gap="2xs" className="px-cn-xl py-cn-md flex-1 truncate">
          <Layout.Vertical gap="2xs" className="flex-1">
            {title}
            {description}
            {link}
          </Layout.Vertical>
          <TimeAgoCard
            triggerClassName="shrink-0 z-10"
            timestamp={timestamp}
            textProps={{ variant: 'body-normal', color: 'foreground-3' }}
          />
          <span
            className={cn('cn-alert-item-indicator', !read && 'cn-alert-item-indicator-unread')}
            aria-label={read ? 'Read' : 'Unread'}
          />
        </Layout.Horizontal>
      </Layout.Horizontal>
    )
  }
)

AlertItemComp.displayName = 'AlertItem'
