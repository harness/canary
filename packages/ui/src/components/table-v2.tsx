import { forwardRef, HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes, ReactNode } from 'react'

import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

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
  disableXScroll?: boolean
  tableClassName?: string
}

const TableRoot = forwardRef<HTMLTableElement, TableRootV2Props>(
  ({ variant, disableXScroll, className, tableClassName, ...props }, ref) => (
    <div className={cn('cn-table-v2-container', tableVariants({ variant }), className)}>
      <table
        ref={ref}
        className={cn('cn-table-v2-element', { 'cn-table-v2-disable-x-scroll': disableXScroll }, tableClassName)}
        {...props}
      />
    </div>
  )
)
TableRoot.displayName = 'TableRoot'

const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn('cn-table-v2-header', className)} {...props} />
)
TableHeader.displayName = 'TableHeader'

const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement> & { hasHighlightOnHover?: boolean }
>(({ className, hasHighlightOnHover, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('cn-table-v2-body', { 'cn-table-v2-highlight-hover': hasHighlightOnHover }, className)}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

const TableFooter = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tfoot ref={ref} className={cn('cn-table-v2-footer', className)} {...props} />
)
TableFooter.displayName = 'TableFooter'

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  expanded?: boolean;
  expandedContent?: ReactNode;
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, expanded, expandedContent, ...props }, ref) => (
    <>
      <tr ref={ref} className={cn('cn-table-v2-row', className)} {...props} />
      {expanded && expandedContent && (
        <tr className="cn-table-v2-row-expanded">
          {expandedContent}
        </tr>
      )}
    </>
  )
)
TableRow.displayName = 'TableRow'

const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => <th ref={ref} className={cn('cn-table-v2-head', className)} {...props} />
)
TableHead.displayName = 'TableHead'

const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => <td ref={ref} className={cn('cn-table-v2-cell', className)} {...props} />
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
