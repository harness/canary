import { useMemo } from 'react'

import { Table } from '@/components'
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
  // Calculate random widths only once on mount
  const randomWidths = useMemo(() => {
    const widths: string[][] = []
    for (let i = 0; i < countRows; i++) {
      widths[i] = []
      for (let j = 0; j < countColumns; j++) {
        widths[i][j] = getRandomPercentageWidth(30, 80)
      }
    }
    return widths
  }, [countRows, countColumns]) // Only recalculate if rows or columns count changes

  return (
    <Table.Root>
      <Table.Body className={cn('relative h-full w-full', className)}>
        {Array.from({ length: countRows }).map((_, rowIndex) => (
          <Table.Row key={`row-${rowIndex}`}>
            {Array.from({ length: countColumns }).map((_, columnIndex) => (
              <Table.Cell className="h-12 flex-1 content-center" key={`cell-${rowIndex}-${columnIndex}`}>
                <Skeleton className="h-2.5" style={{ width: randomWidths[rowIndex][columnIndex] }} />
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
