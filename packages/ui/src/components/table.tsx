import * as React from 'react'

import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const tableVariants = cva('w-full text-sm', {
  variants: {
    variant: {
      default: 'caption-bottom ',
      asStackedList:
        'rounded-md border [&_td]:px-4 [&_td]:py-2.5 [&_td]:align-top [&_th]:px-4 [&_thead]:bg-background-2'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export interface TableProps extends React.HTMLAttributes<HTMLTableElement>, VariantProps<typeof tableVariants> {
  disableXScroll?: boolean
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ variant, disableXScroll, className, ...props }, ref) => (
    <div className={cn('relative w-full overflow-auto', tableVariants({ variant }), className)}>
      <table
        ref={ref}
        className={cn('w-full overflow-x-auto', { 'min-w-auto overflow-x-hidden': disableXScroll })}
        {...props}
      />
    </div>
  )
)
Table.displayName = 'Table'

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('[&_tr]:border-b border-borders-1', className)} {...props} />
  )
)
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  )
)
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)} {...props} />
  )
)
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn('hover:bg-background-2 data-[state=selected]:bg-muted border-b transition-colors', className)}
      {...props}
    />
  )
)
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'text-foreground-4 h-11 px-2 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  )
)
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn('p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]', className)}
      {...props}
    />
  )
)
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn('text-muted-foreground mt-4 text-sm', className)} {...props} />
  )
)
TableCaption.displayName = 'TableCaption'

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
