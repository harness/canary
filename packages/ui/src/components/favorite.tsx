import { FC } from 'react'

import { Toggle } from '@/components'

interface FavoriteIconProps {
  isFavorite?: boolean
  onFavoriteToggle: (isFavorite: boolean) => void
  className?: string
}

const Favorite: FC<FavoriteIconProps> = ({ isFavorite = false, onFavoriteToggle, className }) => (
  <Toggle
    className={className}
    iconOnly
    size="sm"
    variant="transparent"
    selectedVariant="primary"
    selected={isFavorite}
    prefixIcon={isFavorite ? 'star-solid' : 'star'}
    prefixIconProps={{
      className: isFavorite ? 'text-cn-icon-warning' : 'text-cn-2',
      size: '2xs'
    }}
    onChange={(selected: boolean) => onFavoriteToggle(selected)}
    tooltipProps={{
      content: isFavorite ? 'Remove from favorite' : 'Add to favorite'
    }}
  />
)

export { Favorite, type FavoriteIconProps }
