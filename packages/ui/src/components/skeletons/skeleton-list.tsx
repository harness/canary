import { FC, Fragment } from 'react'

import { Skeleton, StackedList } from '@/components'
import { cn } from '@utils/cn'

export interface SkeletonListProps {
  className?: string
  linesCount?: number
  hasActions?: boolean
  classNames?: {
    item?: string
    leftTitle?: string
    leftDescription?: string
    rightTitle?: string
    rightDescription?: string
    actions?: string
  }
  onlyItems?: boolean
}

export const SkeletonList: FC<SkeletonListProps> = ({
  classNames = {},
  linesCount = 8,
  hasActions,
  className,
  onlyItems
}) => {
  const { item, leftTitle, leftDescription, rightTitle, rightDescription, actions } = classNames
  const Wrapper = onlyItems ? Fragment : StackedList.Root
  return (
    <Wrapper className={cn('cn-skeleton-list', className)}>
      {Array.from({ length: linesCount }).map((_, index) => (
        <StackedList.Item
          key={index}
          className={item}
          actions={hasActions && <Skeleton.Box className={cn('cn-skeleton-list-actions', actions)} />}
          disableHover
        >
          <StackedList.Field
            title={<Skeleton.Typography variant="body-single-line-normal" className={cn('w-[129px]', leftTitle)} />}
            description={
              <Skeleton.Typography variant="body-single-line-normal" className={cn('w-[240px]', leftDescription)} />
            }
          />
          <StackedList.Field
            title={<Skeleton.Typography variant="body-single-line-normal" className={cn('w-[147px]', rightTitle)} />}
            description={
              <Skeleton.Typography variant="body-single-line-normal" className={cn('w-[68px]', rightDescription)} />
            }
            right
          />
        </StackedList.Item>
      ))}
    </Wrapper>
  )
}
