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

import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { Link, type LinkProps } from './link'

const tableVariants = cva('cn-table-v2', {
  variants: {
    variant: {
      default: 'cn-table-v2-default',
      relaxed: 'cn-table-v2-relaxed',
      compact: 'cn-table-v2-compact'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export interface TableRootV2Props extends HTMLAttributes<HTMLTableElement>, VariantProps<typeof tableVariants> {
  tableClassName?: string
  disableHighlightOnHover?: boolean
}

const TableRoot = forwardRef<HTMLTableElement, TableRootV2Props>(
  ({ variant, className, tableClassName, disableHighlightOnHover = false, ...props }, ref) => (
    <div
      className={cn(
        'cn-table-v2-container',
        tableVariants({ variant }),
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
  ({ className, ...props }, ref) => <thead ref={ref} className={cn('cn-table-v2-header', className)} {...props} />
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
  if (props.to || props.linkProps) {
    rowChildren = Children.map(rowChildren, child => {
      if (isValidElement(child)) {
        return cloneElement(child, {
          to: props.to,
          linkProps: props.linkProps
        } as any)
      }
      return child
    })
  }

  return (
    <tr
      ref={ref}
      className={cn('cn-table-v2-row', props.to || props.linkProps ? 'row-link-no-underline' : '', className)}
      data-checked={selected ? 'true' : undefined}
      {...props}
    >
      {rowChildren}
    </tr>
  )
})
TableRow.displayName = 'TableRow'

const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => <th ref={ref} className={cn('cn-table-v2-head', className)} {...props} />
)
TableHead.displayName = 'TableHead'

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  to?: string
  linkProps?: Omit<LinkProps, 'to'>
}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, to, linkProps, children, ...props }, ref) => {
    const shouldRenderLink = to || linkProps

    if (shouldRenderLink) {
      return (
        <td ref={ref} className={cn('cn-table-v2-cell !p-0', className)} {...props}>
          <Link to={to || ''} className={cn('cn-table-v2-cell-link', linkProps?.className)} {...(linkProps || {})}>
            {children}
          </Link>
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

const TableV2 = {
  Root: TableRoot,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Head: TableHead,
  Row: TableRow,
  Cell: TableCell,
  Caption: TableCaption
}

export { TableV2 }
