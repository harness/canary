import { FC, SVGProps } from 'react'

import { useTheme } from '@/context'
import { cn } from '@utils/cn'
import { isLightTheme } from '@utils/is-light-theme'

import { IconNameMap } from './icon-name-map'

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: keyof typeof IconNameMap
  size?: number
  // This value should be true if the icon has separate files for different color themes or needs to be inverted.
  themeDependent?: boolean
}

const Icon: FC<IconProps> = ({ name, size = 16, height, width, className, themeDependent = false }) => {
  const { theme } = useTheme()

  const isLightIconAvailable = !!IconNameMap[`${name}-light` as keyof typeof IconNameMap]

  const Component =
    themeDependent && isLightTheme(theme) && isLightIconAvailable
      ? IconNameMap[`${name}-light` as keyof typeof IconNameMap]
      : IconNameMap[name]

  const shouldInvert = themeDependent && isLightTheme(theme) && !isLightIconAvailable

  return (
    <Component
      className={cn({ invert: shouldInvert }, className)}
      width={width || size}
      height={height || size}
      style={{ minWidth: `${width || size}px`, minHeight: `${height || size}px` }}
    />
  )
}

export { Icon }
