import { FC, SVGProps } from 'react'

import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { LogoNameMapV2 } from './logo-name-map'

export const logoVariants = cva('cn-logo', {
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
interface BaseLogoPropsV2 extends SVGProps<SVGSVGElement> {
  size?: VariantProps<typeof logoVariants>['size']
  // incase size will be added through CSS
  skipSize?: boolean
}

interface LogoDefaultPropsV2 extends BaseLogoPropsV2 {
  name: LogoV2NamesType
  fallback?: never
}

interface LogoFallbackPropsV2 extends BaseLogoPropsV2 {
  name?: LogoV2NamesType
  fallback: LogoV2NamesType
}

export type LogoPropsV2 = LogoDefaultPropsV2 | LogoFallbackPropsV2

const LogoV2: FC<LogoPropsV2> = ({ name, size, className, skipSize = false, fallback }) => {
  const Component = name ? LogoNameMapV2[name] : undefined
  const sizeClasses = skipSize ? '' : logoVariants({ size })

  if (!Component && fallback) {
    console.warn(`Logo "${name}" not found, falling back to "${fallback}".`)
    const FallbackComponent = LogoNameMapV2[fallback]

    return <FallbackComponent className={cn(sizeClasses, className)} />
  }

  if (!Component) {
    console.warn(`Logo "${name}" not found in LogoNameMapV2.`)
    return null
  }

  return <Component className={cn(sizeClasses, className)} />
}

export { LogoV2 }

LogoV2.displayName = 'LogoV2'
