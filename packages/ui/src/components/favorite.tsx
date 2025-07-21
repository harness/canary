import { IconV2 } from './icon-v2'

interface FavoriteIconProps {
  isFavorite?: boolean
}

const Favorite: React.FC<FavoriteIconProps> = ({ isFavorite }) => {
  return isFavorite ? (
    <IconV2 name="star-solid" size="md" className="text-label-background-yellow" />
  ) : (
    <IconV2 name="star" size="md" className="text-icons-6" />
  )
}

export { Favorite }
