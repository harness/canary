import { cn } from '@utils/cn'

import { Skeleton } from './components/skeleton'

const listItems = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const SkeletonFormItem = () => {
  return (
    <div className="flex flex-col gap-y-2.5">
      <Skeleton className="h-2.5 w-[24%]" />
      <div className="border-cn-borders-4 rounded border px-3 py-3.5">
        <Skeleton className="h-2.5 w-[41%]" />
      </div>
    </div>
  )
}

export const SkeletonForm = ({
  className,
  linesCount = 9
}: {
  className?: string
  linesCount?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
}) => {
  return (
    <div className={cn('relative flex flex-col gap-y-7', className)}>
      {listItems.slice(0, linesCount).map(item => (
        <SkeletonFormItem key={item} />
      ))}
      <div className="to-background absolute bottom-0 z-10 size-full bg-gradient-to-b from-transparent" />
    </div>
  )
}
