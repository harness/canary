import { forwardRef, SVGProps } from 'react'

import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

import { IconNameMapV2 } from './icon-name-map'

export type IconV2NamesType = keyof typeof IconNameMapV2

export const iconVariants = cva('cn-icon', {
  variants: {
    size: {
      '2xs': 'cn-icon-2xs',
      xs: 'cn-icon-xs',
      sm: 'cn-icon-sm',
      md: 'cn-icon-md',
      lg: 'cn-icon-lg',
      xl: 'cn-icon-xl'
    }
  },
  defaultVariants: {
    size: 'sm'
  }
})

interface BaseIconPropsV2 extends SVGProps<SVGSVGElement> {
  size?: VariantProps<typeof iconVariants>['size']
  // incase size will be added through CSS
  skipSize?: boolean
}

interface IconDefaultPropsV2 extends BaseIconPropsV2 {
  name: IconV2NamesType
  fallback?: never
}

interface IconFallbackPropsV2 extends BaseIconPropsV2 {
  name?: IconV2NamesType
  fallback: IconV2NamesType
}

export type IconPropsV2 = IconDefaultPropsV2 | IconFallbackPropsV2

const IconV2 = forwardRef<SVGSVGElement, IconPropsV2>(
  ({ name, size = 'sm', className, skipSize = false, fallback }, ref) => {
    const Component = name ? IconNameMapV2[name] : undefined
    const sizeClasses = skipSize ? '' : iconVariants({ size })

    if (!Component && fallback) {
      console.warn(`Icon "${name}" not found, falling back to "${fallback}".`)
      const FallbackComponent = IconNameMapV2[fallback]

      return <FallbackComponent className={cn(sizeClasses, className)} ref={ref} />
    }

    if (!Component) {
      console.warn(`Icon "${name}" not found in IconNameMapV2.`)
      return null
    }

    return <Component className={cn(sizeClasses, className)} ref={ref} />
  }
)

export { IconV2 }

IconV2.displayName = 'IconV2'
