import { TableBody, TableCell, TableRow } from '@/components'
import { cn } from '@utils/cn'

import { Skeleton } from './components/skeleton'

// Helper function to generate random percentage width within a range
const getRandomPercentageWidth = (min: number, max: number) => `${Math.floor(Math.random() * (max - min + 1)) + min}%`

interface SkeletonTableProps {
  className?: string
  countRows?: number
  countColumns?: number
}

export const SkeletonTable = ({ className, countRows = 12, countColumns = 5 }: SkeletonTableProps) => {
  return (
    <TableBody className={cn('relative h-full w-full', className)}>
      {Array.from({ length: countRows }).map((_, index) => (
        <TableRow key={`row-${index}`}>
          {Array.from({ length: countColumns }).map((_, columnIndex) => (
            <TableCell className="h-12 content-center" key={`cell-${index}-${columnIndex}`}>
              <Skeleton className="h-2.5" style={{ width: getRandomPercentageWidth(30, 80) }} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  )
}
