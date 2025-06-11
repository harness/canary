import { FC, SVGProps } from 'react'

import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { LogoNameMap } from './logo-name-map'

const logoVariants = cva('cn-logo', {
  variants: {
    size: {
      xs: 'cn-logo-xs',
      default: 'cn-logo-default',
      sm: 'cn-logo-sm',
      md: 'cn-logo-md',
      lg: 'cn-logo-lg'
    }
  },
  defaultVariants: {
    size: 'default'
  }
})

export type LogoNamesType = keyof typeof LogoNameMap
export interface LogoProps extends SVGProps<SVGSVGElement> {
  name: LogoNamesType
  size?: VariantProps<typeof logoVariants>['size']
  // incase size will be added through CSS
  skipSize?: boolean
}

const Logo: FC<LogoProps> = ({ name, size, className, skipSize = false }) => {
  const Component = LogoNameMap[name]

  const sizeClasses = skipSize ? '' : logoVariants({ size })

  return <Component className={cn(sizeClasses, className)} />
}

export { Logo }

Logo.displayName = 'Logo'
