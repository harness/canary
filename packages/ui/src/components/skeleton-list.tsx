import { Skeleton, StackedList } from '@/components'
import { cn } from '@utils/cn'

// Helper function to generate random percentage width within a range
const getRandomPercentageWidth = (min: number, max: number) => `${Math.floor(Math.random() * (max - min + 1)) + min}%`

// Helper function to generate random pixel width within a range
const getRandomPixelWidth = (min: number, max: number) => `${Math.floor(Math.random() * (max - min + 1)) + min}px`

const listItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

interface SkeletonListProps {
  className?: string
}

export const SkeletonList = ({ className }: SkeletonListProps) => {
  return (
    <div className={cn('relative h-full w-full transition-opacity delay-500 duration-500 ease-in-out', className)}>
      <StackedList.Root>
        {listItems.map(itm => (
          <StackedList.Item key={itm} className="py-4" isLast={listItems.length === itm}>
            <StackedList.Field
              // Randomized percentage width for title skeleton
              title={<Skeleton className="mb-2 h-2.5" style={{ width: getRandomPercentageWidth(20, 60) }} />}
              // Randomized percentage width for description skeleton
              description={<Skeleton className="h-2.5" style={{ width: getRandomPercentageWidth(30, 80) }} />}
            />
            <StackedList.Field
              // Randomized pixel width for secondary title skeleton
              title={<Skeleton className="mb-2 h-2.5" style={{ width: getRandomPixelWidth(80, 150) }} />}
              // Randomized pixel width for secondary description skeleton
              description={<Skeleton className="h-2.5" style={{ width: getRandomPixelWidth(150, 250) }} />}
              right
              secondary
            />
          </StackedList.Item>
        ))}
      </StackedList.Root>
      <div className="absolute bottom-0 z-10 size-full bg-gradient-to-b from-transparent to-background" />
    </div>
  )
}
