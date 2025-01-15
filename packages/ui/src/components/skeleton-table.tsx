import { useEffect, useState } from 'react'

import { Skeleton, TableBody, TableCell, TableRow } from '@/components'
import { cn } from '@utils/cn'

// Helper function to generate random percentage width within a range
const getRandomPercentageWidth = (min: number, max: number) => `${Math.floor(Math.random() * (max - min + 1)) + min}%`

interface SkeletonTableProps {
  className?: string
  countRows?: number
  countColumns?: number
}

export const SkeletonTable = ({ className, countRows = 12, countColumns = 5 }: SkeletonTableProps) => {
  // do a first render with visible=false
  const [visible, setVisible] = useState(false)

  // immediately re-render with visible=true to trigger the transition delay
  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <TableBody
      className={cn(
        'relative h-full w-full transition-opacity delay-500 duration-500 ease-in-out',
        {
          'opacity-0': !visible
        },
        className
      )}
    >
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
