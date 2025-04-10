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
const IconBrand: FC<IconBrandProps> = ({
  name,
  size = 32,
  height,
  width,
  className,
  color = IconBrandColorType.WHITE,
  ...props
}) => {
  const { isLightTheme } = useTheme()

  const iconConfig = IconBrandMap[name] as IconBrandConfig
  const IconComponent = iconConfig.component as ComponentType<SVGProps<SVGSVGElement>>

  if (color === IconBrandColorType.WHITE && !iconConfig.backgroundColor) {
    throw new Error(
      `Icon ${name} requires a background color in the icon brand map when using white color type. If the icon is not meant to be white, please specify the appropriate color type using the color property.`
    )
  }

  const bgColor = color === IconBrandColorType.WHITE ? iconConfig.backgroundColor : '#FFFFFF' // White background for black or multicolor icons

  const outlineColorClass = isLightTheme ? 'border-borders-4' : 'border-cn-borders-2'

  const logoSize = size ? size * 0.625 : 20
  const logoWidth = width ? Number(width) * 0.625 : logoSize
  const logoHeight = height ? Number(height) * 0.625 : logoSize

  return (
    <div
      className={cn('flex items-center justify-center border rounded-[4px]', outlineColorClass, className)}
      style={{
        backgroundColor: bgColor,
        width: `${width || size}px`,
        height: `${height || size}px`,
        minWidth: `${width || size}px`,
        minHeight: `${height || size}px`
      }}
    >
      <IconComponent
        className={cn({
          invert: color === IconBrandColorType.WHITE
        })}
        width={logoWidth}
        height={logoHeight}
        style={{
          minWidth: `${logoWidth}px`,
          minHeight: `${logoHeight}px`
        }}
        {...props}
      />
    </div>
  )
}

export { IconBrand }
