import { forwardRef, Ref, SVGProps } from 'react'

import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

import { IconNameMapV2 } from './icon-name-map'

export type IconV2NamesType = keyof typeof IconNameMapV2

const iconVariants = cva('cn-icon', {
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

interface IconPropsV2Base extends SVGProps<SVGSVGElement> {
  name: IconV2NamesType
  size?: VariantProps<typeof iconVariants>['size']
  skipSize?: boolean
}

export type IconPropsV2 = IconPropsV2Base & {
  ref?: Ref<SVGSVGElement>
}

const IconV2 = forwardRef<SVGSVGElement, IconPropsV2>(({ name, size = 'sm', className, skipSize = false }, ref) => {
  const Component = IconNameMapV2[name]

  if (!Component) {
    console.warn(`Icon "${name}" not found in IconNameMapV2.`)
    return null
  }

  const sizeClasses = skipSize ? '' : iconVariants({ size })

  return <Component ref={ref} className={cn(sizeClasses, className)} />
})

export { IconV2 }

IconV2.displayName = 'IconV2'
