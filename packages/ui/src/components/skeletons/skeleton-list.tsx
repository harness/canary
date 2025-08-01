import { useMemo } from 'react'

import { StackedList } from '@/components'
import { cn } from '@utils/cn'

import { Skeleton } from './components/skeleton'

// Helper function to generate random percentage width within a range
const getRandomPercentageWidth = (min: number, max: number) => `${Math.floor(Math.random() * (max - min + 1)) + min}%`

// Helper function to generate random pixel width within a range
const getRandomPixelWidth = (min: number, max: number) => `${Math.floor(Math.random() * (max - min + 1)) + min}px`

const listItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

interface SkeletonListProps {
  className?: string
}

interface RandomWidths {
  titleWidth: string
  descriptionWidth: string
  secondaryTitleWidth: string
  secondaryDescriptionWidth: string
}

export const SkeletonList = ({ className }: SkeletonListProps) => {
  // Calculate random widths only once on mount
  const randomWidths = useMemo<RandomWidths[]>(() => {
    return listItems.map(() => ({
      titleWidth: getRandomPercentageWidth(20, 60),
      descriptionWidth: getRandomPercentageWidth(30, 80),
      secondaryTitleWidth: getRandomPixelWidth(80, 150),
      secondaryDescriptionWidth: getRandomPixelWidth(150, 250)
    }))
  }, []) // Empty dependency array ensures this runs only once on mount

  return (
    <div className={cn('relative h-full w-full transition-opacity delay-500 duration-500 ease-in-out', className)}>
      <StackedList.Root>
        {listItems.map((itm, index) => (
          <StackedList.Item key={itm} className="py-4" isLast={listItems.length === itm}>
            <StackedList.Field
              // Use pre-calculated widths from the randomWidths array
              title={<Skeleton className="mb-2 h-2.5" style={{ width: randomWidths[index].titleWidth }} />}
              description={<Skeleton className="h-2.5" style={{ width: randomWidths[index].descriptionWidth }} />}
            />
            <StackedList.Field
              title={<Skeleton className="mb-2 h-2.5" style={{ width: randomWidths[index].secondaryTitleWidth }} />}
              description={
                <Skeleton className="h-2.5" style={{ width: randomWidths[index].secondaryDescriptionWidth }} />
              }
              right
            />
          </StackedList.Item>
        ))}
      </StackedList.Root>
      <div className="to-background absolute bottom-0 z-10 size-full bg-gradient-to-b from-transparent" />
    </div>
  )
}
