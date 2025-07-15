import { forwardRef, SVGProps } from 'react'

import { useTheme } from '@/context'
import { cn } from '@utils/cn'

import { IllustrationsNameMap } from './illustrations-name-map'

export type IllustrationsNameType = keyof typeof IllustrationsNameMap

export interface IllustrationProps extends SVGProps<SVGSVGElement> {
  name: IllustrationsNameType
  size?: number
  // This value should be true if the icon has separate files for different color themes or needs to be inverted.
  themeDependent?: boolean
}

const Illustration = forwardRef<SVGSVGElement, IllustrationProps>(
  ({ name, size = 112, height, width, className, themeDependent = false }, ref) => {
    const { isLightTheme } = useTheme()

    const isLightIconAvailable = !!IllustrationsNameMap[`${name}-light` as keyof typeof IllustrationsNameMap]

    const Component =
      themeDependent && isLightTheme && isLightIconAvailable
        ? IllustrationsNameMap[`${name}-light` as keyof typeof IllustrationsNameMap]
        : IllustrationsNameMap[name]

    if (!Component) {
      console.warn(`Icon "${name}" not found in IllustrationsNameMap.`)
      return null
    }

    const shouldInvert = themeDependent && isLightTheme && !isLightIconAvailable

    const sizeProps = {
      width: width || size,
      height: height || size,
      style: { minWidth: `${width || size}px`, minHeight: `${height || size}px` }
    }

    return <Component ref={ref} className={cn({ invert: shouldInvert }, className)} {...sizeProps} />
  }
)
Illustration.displayName = 'Illustration'

export { Illustration }
