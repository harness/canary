import { forwardRef, useState } from 'react'

import { useRouterContext } from '@/context'
import { Button } from '@components/button'
import { IconV2 } from '@components/icon-v2'
import { Layout } from '@components/layout'
import { useSidebar } from '@components/sidebar/sidebar-context'
import { Tooltip } from '@components/tooltip'
import { cn } from '@utils/cn'

import { SidebarItemV2LinkProps, SidebarItemV2Props } from './types'

export type { SidebarItemV2Props } from './types'

function isSidebarItemLink(props: SidebarItemV2Props): props is SidebarItemV2LinkProps {
  return 'to' in props && typeof props.to === 'string'
}

export const SidebarItemV2 = forwardRef<HTMLButtonElement | HTMLAnchorElement, SidebarItemV2Props>((props, ref) => {
  const { NavLink } = useRouterContext()
  const { state } = useSidebar()
  const collapsed = state === 'collapsed'
  const isLink = isSidebarItemLink(props)
  const {
    iconName,
    content,
    tooltip,
    selected = false,
    className,
    disabled: isDisabled,
    children,
    defaultExpand = false,
    itemAction
  } = props

  const [expandSubContent, setExpandSubContent] = useState(defaultExpand)
  const [isHovering, setIsHovering] = useState(false)

  const itemClasses = cn(
    'cn-sidebarv2-item',
    {
      'cn-sidebarv2-item-selected': selected,
      'cn-sidebarv2-item-collapsed': collapsed
    },
    className
  )

  const renderSuffix = () => {
    return (
      <Layout.Horizontal align="center" gap="none" className="pr-cn-4xs">
        {typeof itemAction === 'function' ? itemAction({ hovering: isHovering }) : itemAction}
        {!!children && (
          <Button
            size="xs"
            variant="ghost"
            iconOnly
            onClick={e => {
              e.stopPropagation()
              e.preventDefault()
              setExpandSubContent(prev => !prev)
            }}
          >
            <IconV2 name={expandSubContent ? 'nav-arrow-down' : 'nav-arrow-right'} />
          </Button>
        )}
      </Layout.Horizontal>
    )
  }

  const itemContent = (
    <>
      <div className="cn-sidebarv2-item-prefix">{iconName && <IconV2 name={iconName} size="md" />}</div>
      {!collapsed && (
        <div className="cn-sidebarv2-item-content">
          <span className="cn-sidebarv2-item-text">{content}</span>
        </div>
      )}
      {!collapsed && renderSuffix()}
    </>
  )

  const renderItem = () => {
    let triggerContent = (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={itemClasses}
        onClick={props.onClick}
        disabled={isDisabled}
        type="button"
      >
        {itemContent}
      </button>
    )

    if (isLink) {
      const { to } = props
      triggerContent = (
        <NavLink ref={ref as React.Ref<HTMLAnchorElement>} to={to} className={itemClasses} aria-disabled={isDisabled}>
          {itemContent}
        </NavLink>
      )
    }

    if (tooltip || collapsed) {
      return (
        <Tooltip side="right" align="center" hideArrow content={tooltip || content}>
          {triggerContent}
        </Tooltip>
      )
    }

    return triggerContent
  }

  return (
    <Layout.Vertical
      gap="none"
      align="stretch"
      className="w-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {renderItem()}
      {children && !collapsed && (
        <div className="cn-sidebarv2-item-subcontent" data-subcontent-expanded={expandSubContent}>
          {children}
        </div>
      )}
    </Layout.Vertical>
  )
})

SidebarItemV2.displayName = 'SidebarItemV2'
