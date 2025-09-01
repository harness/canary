import {
  Children,
  cloneElement,
  forwardRef,
  HTMLAttributes,
  isValidElement,
  ReactNode,
  TdHTMLAttributes,
  ThHTMLAttributes
} from 'react'

import { useRouterContext } from '@/context'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { IconV2 } from './icon-v2'
import { FlexProps, Layout } from './layout'
import { type LinkProps } from './link'
import { Separator } from './separator'
import { Text } from './text'
import { Tooltip, type TooltipProps } from './tooltip'

export const tableVariants = cva('cn-table-v2', {
  variants: {
    size: {
      normal: 'cn-table-v2-normal',
      relaxed: 'cn-table-v2-relaxed',
      compact: 'cn-table-v2-compact'
    }
  },
  defaultVariants: {
    size: 'normal'
  }
})

export interface TableRootV2Props extends HTMLAttributes<HTMLTableElement>, VariantProps<typeof tableVariants> {
  tableClassName?: string
  disableHighlightOnHover?: boolean
}

const TableRoot = forwardRef<HTMLTableElement, TableRootV2Props>(
  ({ size, className, tableClassName, disableHighlightOnHover = false, ...props }, ref) => (
    <div
      className={cn(
        'cn-table-v2-container',
        tableVariants({ size }),
        { 'cn-table-v2-highlight-hover': !disableHighlightOnHover },
        className
      )}
    >
      <table ref={ref} className={cn('cn-table-v2-element', tableClassName)} {...props} />
    </div>
  )
)
TableRoot.displayName = 'TableRoot'

const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('cn-table-v2-header select-none', className)} {...props} />
  )
)
TableHeader.displayName = 'TableHeader'

const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={cn('cn-table-v2-body', className)} {...props} />
)
TableBody.displayName = 'TableBody'

const TableFooter = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tfoot ref={ref} className={cn('cn-table-v2-footer', className)} {...props} />
)
TableFooter.displayName = 'TableFooter'

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children?: ReactNode
  selected?: boolean
  to?: string
  linkProps?: Omit<LinkProps, 'to'>
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(({ className, selected, ...props }, ref) => {
  let rowChildren = props.children
  let isFirstLink = true

  rowChildren = Children.map(rowChildren, (_child, index) => {
    if (!isValidElement(_child)) return

    let child = _child

    if ((_child.type as any).displayName === 'TableHead') {
      if (index === 0) {
        child = cloneElement(child, {
          hideDivider: true
        } as TableHeadProps)
      }

      if (index > 0 && _child.props.hideDivider === undefined) {
        child = cloneElement(child, {
          hideDivider: false
        } as TableHeadProps)
      }
    }

    if (props.to || props.linkProps) {
      if (child.props.disableLink) return child

      const currentTabIndex = isFirstLink ? 0 : -1

      if (child.props.to || child.props.linkProps) {
        const updatedChild = cloneElement(child, {
          linkProps: { ...child.props.linkProps, tabIndex: currentTabIndex }
        } as any)
        isFirstLink = false
        return updatedChild
      }

      const updatedChild = cloneElement(child, {
        to: props.to,
        linkProps: { ...props.linkProps, tabIndex: currentTabIndex }
      } as any)

      isFirstLink = false
      return updatedChild
    }
    return child
  })

  return (
    <tr ref={ref} className={cn('cn-table-v2-row', className)} data-checked={selected ? 'true' : undefined} {...props}>
      {rowChildren}
    </tr>
  )
})
TableRow.displayName = 'TableRow'

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /**
   * Sort direction
   */
  sortDirection?: 'asc' | 'desc' | false
  /**
   * Whether the column is sortable
   */
  sortable?: boolean
  /**
   * Props for the tooltip component
   */
  tooltipProps?: Omit<TooltipProps, 'children'>
  containerProps?: FlexProps
  hideDivider?: boolean
  contentClassName?: string
}

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    {
      className,
      sortDirection,
      sortable,
      children,
      tooltipProps,
      hideDivider,
      containerProps,
      contentClassName,
      ...props
    },
    ref
  ) => {
    const Title = () => (
      <Text
        variant="caption-normal"
        color="foreground-3"
        className={cn({ 'underline decoration-dashed': !!tooltipProps?.content }, contentClassName)}
      >
        {children}
      </Text>
    )

    const childrenWithTooltip = tooltipProps?.content ? (
      <Tooltip {...tooltipProps}>
        <Title />
      </Tooltip>
    ) : (
      <Title />
    )

    const contentElement = children ? (
      <Layout.Horizontal gap="xs" align="center" className="relative" {...containerProps}>
        {!hideDivider && <Separator orientation="vertical" className="cn-table-v2-head-divider" />}
        {childrenWithTooltip}
        {sortable && (
          <span className="ml-1">
            {sortDirection === 'asc' && <IconV2 name="arrow-up" size="2xs" />}
            {sortDirection === 'desc' && <IconV2 name="arrow-down" size="2xs" />}
            {!sortDirection && <IconV2 name="up-down" />}
          </span>
        )}
      </Layout.Horizontal>
    ) : null

    return (
      <th
        ref={ref}
        className={cn(
          'cn-table-v2-head',
          {
            'cn-table-v2-head-sortable': sortable
          },
          className
        )}
        {...props}
      >
        {contentElement}
      </th>
    )
  }
)
TableHead.displayName = 'TableHead'

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  to?: string
  linkProps?: Omit<LinkProps, 'to'>
  disableLink?: boolean
}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, to, linkProps, children, disableLink = false, ...props }, ref) => {
    const { Link } = useRouterContext()
    const shouldRenderLink = !disableLink && (to || linkProps)

    if (shouldRenderLink) {
      return (
        <td ref={ref} className={cn('cn-table-v2-cell', className)} {...props}>
          <Link to={to || ''} {...(linkProps || {})} className={cn('cn-table-v2-cell-link', linkProps?.className)} />

          <div className="relative z-[1] flex">{children}</div>
        </td>
      )
    }

    return (
      <td ref={ref} className={cn('cn-table-v2-cell', className)} {...props}>
        {children}
      </td>
    )
  }
)
TableCell.displayName = 'TableCell'

const TableCaption = forwardRef<HTMLTableCaptionElement, HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => <caption ref={ref} className={cn('cn-table-v2-caption', className)} {...props} />
)
TableCaption.displayName = 'TableCaption'

const Table = {
  Root: TableRoot,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Head: TableHead,
  Row: TableRow,
  Cell: TableCell,
  Caption: TableCaption
}

export { Table }
