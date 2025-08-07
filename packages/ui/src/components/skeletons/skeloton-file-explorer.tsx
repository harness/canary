import { FC } from 'react'

import { Layout, Skeleton } from '@/components'
import { cn } from '@utils/cn'

import { getRandomPixelWidth } from './skeleton-utils'

export interface SkeletonFileExplorerProps {
  className?: string
  linesCount?: number
}

export const SkeletonFileExplorer: FC<SkeletonFileExplorerProps> = ({ className, linesCount = 1 }) => {
  return (
    <Layout.Vertical gap="4xs" className={cn({ 'cn-skeleton-file-explorer': linesCount > 1 }, className)}>
      {Array.from({ length: linesCount }).map((_, index) => (
        <Layout.Horizontal key={index} gap="2xs" className="p-cn-2xs">
          <Skeleton.Icon size="md" />

          <Skeleton.Typography style={{ width: getRandomPixelWidth(30, 120) }} className="w-full" />
        </Layout.Horizontal>
      ))}
    </Layout.Vertical>
  )
}
