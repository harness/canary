import { FC, SVGProps } from 'react'

import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

import { IconNameMapV2 } from './icon-name-map'

export type IconV2NamesType = keyof typeof IconNameMapV2

const iconVariants = cva('cn-icon', {
  variants: {
    size: {
      xs: 'cn-icon-xs',
      default: 'cn-icon-default',
      sm: 'cn-icon-sm',
      md: 'cn-icon-md',
      lg: 'cn-icon-lg'
    }
  },
  defaultVariants: {
    size: 'default'
  }
})

export interface IconPropsV2 extends SVGProps<SVGSVGElement> {
  name: IconV2NamesType
  size?: VariantProps<typeof iconVariants>['size']
  // incase size will be added through CSS
  skipSize?: boolean
}

const IconV2: FC<IconPropsV2> = ({ name, size = 'default', className, skipSize = false }) => {
  const Component = IconNameMapV2[name]

  const sizeClasses = skipSize ? '' : iconVariants({ size })

  // const sizeProps = skipSize
  //   ? {}
  //   : {
  //       width,
  //       height,
  //       style: { minWidth: `${width}px`, minHeight: `${height}px` }
  //     }

  return <Component className={cn(sizeClasses, className)} />
}

export { IconV2 }

IconV2.displayName = 'IconV2'
