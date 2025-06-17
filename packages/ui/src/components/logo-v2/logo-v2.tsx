import { FC, SVGProps } from 'react'

import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { LogoNameMapV2 } from './logo-name-map'

const logoVariants = cva('cn-logo', {
  variants: {
    size: {
      sm: 'cn-logo-sm',
      md: 'cn-logo-md',
      lg: 'cn-logo-lg'
    }
  },
  defaultVariants: {
    size: 'lg'
  }
})

export type LogoV2NamesType = keyof typeof LogoNameMapV2
export interface LogoPropsV2 extends SVGProps<SVGSVGElement> {
  name: LogoV2NamesType
  size?: VariantProps<typeof logoVariants>['size']
  // incase size will be added through CSS
  skipSize?: boolean
}

const LogoV2: FC<LogoPropsV2> = ({ name, size, className, skipSize = false }) => {
  const Component = LogoNameMapV2[name]

  const sizeClasses = skipSize ? '' : logoVariants({ size })

  return <Component className={cn(sizeClasses, className)} />
}

export { LogoV2 }

LogoV2.displayName = 'LogoV2'
