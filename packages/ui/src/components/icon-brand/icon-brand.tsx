import { ComponentType, FC, SVGProps } from 'react'

import { useTheme } from '@/context'
import { cn } from '@utils/cn'

import { IconBrandConfig, IconBrandMap } from './icon-brand-map'

/**
 * Enum for icon color type
 */
export enum IconBrandColorType {
  WHITE = 'white',
  BLACK = 'black',
  MULTICOLOR = 'multicolor'
}

/**
 * Icon Brand Component Props
 * @property {keyof typeof IconBrandMap} name - The name of the brand icon to display
 * @property {number} size - Size of the icon (default: 32)
 * @property {IconBrandColorType} color - Type of icon color (default: WHITE)
 */
export interface IconBrandProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: keyof typeof IconBrandMap
  size?: number
  color?: IconBrandColorType
}

/**
 * Brand Icon Component
 *
 * Displays brand icons following specific design guidelines:
 * - White icons (default): Original SVG (black) is filtered to white, with the brand's colored background
 * - Black icons: Original SVG with white background
 * - Multicolor icons: Original SVG with white background
 */
const IconBrand: FC<IconBrandProps> = ({ name, size = 32, className, color = IconBrandColorType.WHITE, ...props }) => {
  const { isLightTheme } = useTheme()

  const iconConfig = IconBrandMap[name] as IconBrandConfig
  const IconComponent = iconConfig.component as ComponentType<SVGProps<SVGSVGElement>>

  if (color === IconBrandColorType.WHITE && !iconConfig.backgroundColor) {
    throw new Error(
      `Icon ${name} requires a background color in the icon brand map when using white color type. If the icon is not meant to be white, please specify the appropriate color type using the color property.`
    )
  }

  const bgColor = color === IconBrandColorType.WHITE ? iconConfig.backgroundColor : '#FFFFFF' // White background for black or multicolor icons

  // Calculate shadow thickness proportionally to size (1px for size=32px)
  const shadowThickness = (size / 32).toFixed(2)

  // Determine outline color based on theme
  const shadowColor = isLightTheme ? 'hsl(var(--canary-border-04))' : 'var(--cn-border-2)'

  // Box shadow for border effect
  const boxShadow = `0 0 0 ${shadowThickness}px ${shadowColor}`

  const logoSize = size * 0.625

  return (
    <div
      className={cn('flex items-center justify-center rounded-[4px]', className)}
      style={{
        backgroundColor: bgColor,
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        boxShadow
      }}
    >
      <IconComponent
        className={cn({
          invert: color === IconBrandColorType.WHITE
        })}
        style={{
          width: `${logoSize}px`,
          height: `${logoSize}px`,
          minWidth: `${logoSize}px`,
          minHeight: `${logoSize}px`
        }}
        {...props}
      />
    </div>
  )
}

export { IconBrand }
