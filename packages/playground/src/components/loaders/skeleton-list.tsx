import { useEffect, useState } from 'react'

import { cn, Skeleton, StackedList } from '@harnessio/canary'

// Helper function to generate random percentage width within a range
const getRandomPercentageWidth = (min: number, max: number) => `${Math.floor(Math.random() * (max - min + 1)) + min}%`

// Helper function to generate random pixel width within a range
const getRandomPixelWidth = (min: number, max: number) => `${Math.floor(Math.random() * (max - min + 1)) + min}px`

interface SkeletonListProps {
  className?: string
}

export const SkeletonList = ({ className }: SkeletonListProps) => {
  const listItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  // do a first render with visible=false
  const [visible, setVisible] = useState(false)
  // immediately re-render with visible=true to trigger the transition delay
  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <div
      className={cn(
        'relative h-full w-full transition-opacity delay-500 duration-500 ease-in-out',
        {
          'opacity-0': !visible
        },
        className
      )}
    >
      {listItems && listItems.length > 0 && (
        <StackedList.Root>
          {listItems.map((itm, itm_idx) => (
            <StackedList.Item key={itm_idx} isLast={listItems.length - 1 === itm_idx}>
              <StackedList.Field
                // Randomized percentage width for title skeleton
                title={<Skeleton className="mb-1.5 h-4" style={{ width: getRandomPercentageWidth(20, 60) }} />}
                // Randomized percentage width for description skeleton
                description={<Skeleton className="h-4" style={{ width: getRandomPercentageWidth(30, 80) }} />}
              />
              <StackedList.Field
                // Randomized pixel width for secondary title skeleton
                title={<Skeleton className="mb-1.5 h-4" style={{ width: getRandomPixelWidth(80, 150) }} />}
                // Randomized pixel width for secondary description skeleton
                description={<Skeleton className="h-4" style={{ width: getRandomPixelWidth(150, 250) }} />}
                right
                secondary
              />
            </StackedList.Item>
          ))}
        </StackedList.Root>
      )}
      <div className="absolute bottom-0 z-10 h-1/2 w-full bg-gradient-to-b from-transparent to-background" />
    </div>
  )
}
