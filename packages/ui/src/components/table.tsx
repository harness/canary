import {
  Children,
  cloneElement,
  CSSProperties,
  forwardRef,
  HTMLAttributes,
  isValidElement,
  MouseEvent,
  ReactNode,
  Ref,
  TdHTMLAttributes,
  ThHTMLAttributes
} from 'react'

import {
  FlexProps,
  IconV2,
  Layout,
  Pagination,
  PaginationProps,
  Separator,
  Text,
  Tooltip,
  type LinkProps,
  type TooltipProps
} from '@/components'
import { useRouterContext } from '@/context'
import { cn } from '@/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import omit from 'lodash-es/omit'

export const tableVariants = cva('cn-table-v2', {
  variants: {
    size: {
      normal: 'cn-table-v2-normal',
      relaxed: 'cn-table-v2-relaxed',
      compact: 'cn-table-v2-compact'
    },
    variant: {
      default: '',
      transparent: 'cn-table-v2-transparent'
    }
  },
  defaultVariants: {
    size: 'normal',
    variant: 'default'
  }
})

export interface TableRootV2Props extends HTMLAttributes<HTMLTableElement>, VariantProps<typeof tableVariants> {
  tableClassName?: string
  disableHighlightOnHover?: boolean
  paginationProps?: PaginationProps
  /**
   * Opt-in sticky mode. Renders a single, well-defined scroll viewport
   * (`cn-table-v2-viewport`) so sticky-positioned cells (e.g. sticky headers)
   * resolve against one deterministic scroll container.
   * When unset, the DOM structure and overflow behavior are unchanged.
   */
  stickyHeader?: boolean
  /**
   * Maximum height of the scroll viewport. Only applies in sticky mode.
   */
  maxHeight?: CSSProperties['maxHeight']
  /**
   * Ref forwarded to the scroll viewport element. Only applies in sticky mode.
   */
  viewportRef?: Ref<HTMLDivElement>
  /**
   * Optional overlay rendered as a sibling of `<table>` inside the scroll
   * viewport. Used by DataTable for a column-resize indicator that is not
   * clipped by header cells.
   */
  overlay?: ReactNode
}

const TableRoot = forwardRef<HTMLTableElement, TableRootV2Props>(
  (
    {
      size,
      variant,
      className,
      tableClassName,
      disableHighlightOnHover = false,
      paginationProps: { className: paginationClassName, ...paginationProps } = {} as PaginationProps,
      stickyHeader = false,
      maxHeight,
      viewportRef,
      overlay,
      style,
      ...props
    },
    ref
  ) => (
    <div
      className={cn(
        'cn-table-v2-container',
        tableVariants({ size, variant }),
        { 'cn-table-v2-highlight-hover': !disableHighlightOnHover },
        { 'cn-table-v2-sticky': stickyHeader },
        className
      )}
    >
      <div
        className={cn(stickyHeader ? 'cn-table-v2-viewport' : 'overflow-x-auto')}
        style={{ maxHeight: stickyHeader ? maxHeight : undefined }}
        ref={stickyHeader ? viewportRef : undefined}
      >
        {overlay !== undefined ? (
          <div className="cn-table-v2-overlay-host" style={style}>
            <table ref={ref} className={cn('cn-table-v2-element', tableClassName)} style={style} {...props} />
            {overlay}
          </div>
        ) : (
          <table ref={ref} className={cn('cn-table-v2-element', tableClassName)} style={style} {...props} />
        )}
      </div>
      {paginationProps && (
        <Pagination
          {...paginationProps}
          className={cn('!mt-0 px-cn-md py-cn-md border-t border-cn-3', paginationClassName)}
        />
      )}
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
  disabled?: boolean
  to?: string
  linkProps?: Omit<LinkProps, 'to'>
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(({ className, selected, disabled, ...props }, ref) => {
  let rowChildren = props.children
  let isFirstLink = true

  rowChildren = Children.map(rowChildren, (_child, index) => {
    if (!isValidElement(_child)) return

    let child = _child

    if (child.type === TableHead && index === 0) {
      child = cloneElement(child, {
        hideDivider: true
      } as TableHeadProps)
    }

    if (!disabled && (props.to || props.linkProps || props?.onClick)) {
      if (child.props.disableLink) return child

      // One tab stop per row. The first interactive cell's overlay gets 0; the rest get -1.
      // Table.Cell places this index on the overlay, which is the focused element.
      const currentTabIndex = isFirstLink ? 0 : -1

      if (child.props?.to || child.props?.linkProps || child.props?.onClick) {
        const updatedChild = cloneElement(child, {
          ...(child.props?.to ? { to: child.props.to } : {}),
          ...(child.props?.linkProps ? { linkProps: child.props.linkProps } : {}),
          tabIndex: currentTabIndex,
          onClick: child.props?.onClick
        } as any)
        isFirstLink = false
        return updatedChild
      }

      const updatedChild = cloneElement(child, {
        ...(props?.to ? { to: props.to } : {}),
        ...(props?.linkProps ? { linkProps: props.linkProps } : {}),
        tabIndex: currentTabIndex,
        onClick: props?.onClick
      } as any)

      isFirstLink = false
      return updatedChild
    }

    return child
  })

  return (
    <tr
      ref={ref}
      className={cn('cn-table-v2-row', className)}
      data-checked={selected ? 'true' : undefined}
      data-disabled={disabled ? 'true' : undefined}
      {...omit(props, ['onClick'])}
    >
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
  /**
   * Optional chrome rendered as a direct child of the `<th>`, outside the
   * label/sort layout. Used by DataTable for column resize handles so they
   * can be positioned against the cell boundary.
   */
  resizeHandle?: ReactNode
}

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    {
      className,
      sortDirection,
      sortable,
      children,
      tooltipProps,
      hideDivider = false,
      containerProps,
      contentClassName,
      resizeHandle,
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
          <span className="ml-cn-3xs">
            {sortDirection === 'asc' && <IconV2 name="arrow-up" size="2xs" />}
            {sortDirection === 'desc' && <IconV2 name="arrow-down" size="2xs" />}
            {!sortDirection && <IconV2 name="up-down" size="2xs" />}
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
            'cn-table-v2-head-sortable': sortable,
            'cn-table-v2-head-resizable': !!resizeHandle
          },
          className
        )}
        {...props}
      >
        {contentElement}
        {resizeHandle}
      </th>
    )
  }
)
TableHead.displayName = 'TableHead'

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  to?: string
  linkProps?: Omit<LinkProps, 'to'>
  disableLink?: boolean
  onClick?: () => void
}

const NESTED_ROW_CONTROL_SELECTOR =
  'a, button, input, select, textarea, label, [role="button"], [role="link"], [role="menuitem"], [role="checkbox"], [role="switch"]'

/** A control inside the cell owns the click. The row overlay button is included so keyboard activation does not run twice. */
function isNestedRowControlClick(event: MouseEvent<HTMLTableCellElement>): boolean {
  const target = event.target
  if (!(target instanceof Element)) return false

  const control = target.closest(NESTED_ROW_CONTROL_SELECTOR)
  return !!control && event.currentTarget.contains(control)
}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, to, linkProps, children, disableLink = false, onClick, tabIndex, ...props }, ref) => {
    const { Link } = useRouterContext()
    const shouldRenderLink = !disableLink && (!!to || !!linkProps)
    const shouldRenderButton = !disableLink && !to && !linkProps && !!onClick

    // Click and focus are split on purpose.
    //
    // Focus: Table.Row passes tabIndex 0 for the first interactive cell and -1 for the rest.
    // The index is set on the overlay, not the <td>, so each row is a single tab stop.
    // The row focus ring keys off .cn-table-v2-cell-clickable-block:focus-visible.
    //
    // Link (`to` / `linkProps`): the overlay is a real anchor and receives the pointer,
    // so Cmd-click and "open in new tab" work. The <td> has no onClick. The anchor's
    // onClick runs the cell callback.
    //
    // Button (`onClick` only): the overlay does not receive the pointer. A mouse click
    // hits the cell content and bubbles to the <td>, which runs the callback. The button
    // stays as the keyboard target: Enter or Space fires its onClick, that event bubbles,
    // and isNestedRowControlClick ignores the overlay so the callback runs once. Nested
    // links, buttons, and inputs match that check and keep their own click.
    return (
      <td
        ref={ref}
        className={cn('cn-table-v2-cell', shouldRenderButton && 'cursor-pointer', className)}
        {...props}
        onClick={
          shouldRenderButton
            ? event => {
                if (isNestedRowControlClick(event)) return
                onClick?.()
              }
            : undefined
        }
      >
        {shouldRenderLink && (
          <Link
            to={to || ''}
            {...(linkProps || {})}
            className={cn('cn-table-v2-cell-clickable-block', linkProps?.className)}
            onClick={() => onClick?.()}
            tabIndex={tabIndex}
          />
        )}
        {shouldRenderButton && (
          <button
            type="button"
            className="cn-table-v2-cell-clickable-block pointer-events-none"
            onClick={() => onClick?.()}
            tabIndex={tabIndex}
          />
        )}
        {children}
      </td>
    )
  }
)
TableCell.displayName = 'TableCell'

const TableCaption = forwardRef<HTMLTableCaptionElement, HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <Text
      as="caption"
      ref={ref}
      className={cn('cn-table-v2-caption', className)}
      {...props}
      color="foreground-3"
      variant="caption-normal"
    />
  )
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
