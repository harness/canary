import { Skeleton, Table } from '@/components'
import { cn } from '@utils/cn'

export interface SkeletonTableProps {
  className?: string
  classNameHeader?: string
  classNameBody?: string
  countRows?: number
  countColumns?: number
  hideHeader?: boolean
}

export const SkeletonTable = ({
  className,
  classNameHeader,
  classNameBody,
  countRows = 12,
  countColumns = 5,
  hideHeader = false
}: SkeletonTableProps) => {
  return (
    <Table.Root className={cn('cn-skeleton-table', className)} disableHighlightOnHover>
      {!hideHeader && (
        <Table.Header className={classNameHeader}>
          <Table.Row>
            {Array.from({ length: countColumns }).map((_, columnIndex) => (
              <Table.Head key={`header-cell-${columnIndex}`}>
                <Skeleton.Typography variant="caption-normal" className="w-[65px]" />
              </Table.Head>
            ))}
          </Table.Row>
        </Table.Header>
      )}
      <Table.Body className={classNameBody}>
        {Array.from({ length: countRows }).map((_, rowIndex) => (
          <Table.Row key={`row-${rowIndex}`}>
            {Array.from({ length: countColumns }).map((_, columnIndex) => (
              <Table.Cell key={`cell-${rowIndex}-${columnIndex}`}>
                <Skeleton.Typography className="w-full" />
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
