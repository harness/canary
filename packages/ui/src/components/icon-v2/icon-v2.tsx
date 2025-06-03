import { FC, SVGProps } from 'react'

import { useTheme } from '@/context'
import { cn } from '@utils/cn'

import { IconNameMapV2 } from './icon-name-map'

export interface IconPropsV2 extends SVGProps<SVGSVGElement> {
  name: keyof typeof IconNameMapV2
  size?: number
  // This value should be true if the icon has separate files for different color themes or needs to be inverted.
  themeDependent?: boolean

  // incase size will be added through CSS
  skipSize?: boolean
}

const IconV2: FC<IconPropsV2> = ({
  name,
  size = 16,
  height,
  width,
  className,
  themeDependent = false,
  skipSize = false
}) => {
  const { isLightTheme } = useTheme()

  const isLightIconAvailable = !!IconNameMapV2[`${name}-light` as keyof typeof IconNameMapV2]

  const Component =
    themeDependent && isLightTheme && isLightIconAvailable
      ? IconNameMapV2[`${name}-light` as keyof typeof IconNameMapV2]
      : IconNameMapV2[name]

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

export { IconV2 }

IconV2.displayName = 'IconV2'
