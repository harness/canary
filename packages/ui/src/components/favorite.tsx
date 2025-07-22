import { Button } from './button'
import { IconV2 } from './icon-v2'

interface FavoriteIconProps {
  isFavorite?: boolean
  onFavoriteToggle: (isFavorite: boolean) => void
}

const Favorite: React.FC<FavoriteIconProps> = ({ isFavorite = false, onFavoriteToggle }) => (
  <Button
    size="sm"
    iconOnly
    variant="ghost"
    onClick={e => {
      e.preventDefault()
      e.stopPropagation()
      onFavoriteToggle(!isFavorite)
    }}
  >
    <IconV2
      name={isFavorite ? 'star-solid' : 'star'}
      size="md"
      className={isFavorite ? 'text-cn-foreground-warning' : 'text-icons-6'}
    />
  </Button>
)

export { Favorite }
