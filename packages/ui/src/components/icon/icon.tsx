import { FC, SVGProps } from 'react'

import { useTheme } from '@/context'
import { cn } from '@utils/cn'

import { IconNameMap } from './icon-name-map'

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: keyof typeof IconNameMap
  size?: number
  // This value should be true if the icon has separate files for different color themes or needs to be inverted.
  themeDependent?: boolean

  // incase size will be added through CSS
  skipSize?: boolean
}

const Icon: FC<IconProps> = ({
  name,
  size = 16,
  height,
  width,
  className,
  themeDependent = false,
  skipSize = false
}) => {
  const { isLightTheme } = useTheme()

  const isLightIconAvailable = !!IconNameMap[`${name}-light` as keyof typeof IconNameMap]

  const Component =
    themeDependent && isLightTheme && isLightIconAvailable
      ? IconNameMap[`${name}-light` as keyof typeof IconNameMap]
      : IconNameMap[name]

  const shouldInvert = themeDependent && isLightTheme && !isLightIconAvailable

  const sizeProps = skipSize
    ? {}
    : {
        width: width || size,
        height: height || size,
        style: { minWidth: `${width || size}px`, minHeight: `${height || size}px` }
      }

  return <Component className={cn({ invert: shouldInvert }, className)} {...sizeProps} />
}

export { Icon }
