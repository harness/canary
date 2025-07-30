import React from 'react'

import { Toggle } from '@/components'

interface FavoriteIconProps {
  isFavorite?: boolean
  onFavoriteToggle: (isFavorite: boolean) => void
}

const Favorite: React.FC<FavoriteIconProps> = ({ isFavorite = false, onFavoriteToggle }) => (
  <Toggle
    iconOnly
    size="sm"
    variant="transparent"
    selectedVariant="primary"
    prefixIcon={isFavorite ? 'star-solid' : 'star'}
    prefixIconProps={{
      className: isFavorite ? 'text-cn-icon-yellow' : 'text-cn-foreground-2',
      size: '2xs'
    }}
    onChange={onFavoriteToggle}
  />
)

export { Favorite }
