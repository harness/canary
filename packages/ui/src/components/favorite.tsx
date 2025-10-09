import { FC } from 'react'

import { Toggle } from '@/components'
import { cn } from '@/utils/cn'

interface FavoriteIconProps {
  isFavorite?: boolean
  onFavoriteToggle: (isFavorite: boolean) => void
  className?: string
}

const Favorite: FC<FavoriteIconProps> = ({ isFavorite = false, onFavoriteToggle, className }) => (
  <Toggle
    className={cn('hover:bg-cn-hover', className)}
    iconOnly
    size="sm"
    variant="transparent"
    selectedVariant="primary"
    selected={isFavorite}
    prefixIcon={isFavorite ? 'pin-solid' : 'pin'}
    onChange={(selected: boolean) => onFavoriteToggle(selected)}
    tooltipProps={{
      content: isFavorite ? 'Unpin' : 'Pin'
    }}
  />
)

export { Favorite, type FavoriteIconProps }
