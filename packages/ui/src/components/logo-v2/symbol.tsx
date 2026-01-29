import { forwardRef, SVGProps } from 'react'

import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { SymbolNameMap } from './symbol-name-map'

export const symbolVariants = cva('cn-symbol', {
  variants: {
    size: {
      xs: 'cn-symbol-xs',
      sm: 'cn-symbol-sm',
      md: 'cn-symbol-md',
      lg: 'cn-symbol-lg'
    }
  },
  defaultVariants: {
    size: 'lg'
  }
})

export type SymbolNamesType = keyof typeof SymbolNameMap
interface BaseSymbolProps extends SVGProps<SVGSVGElement> {
  size?: VariantProps<typeof symbolVariants>['size']
  // incase size will be added through CSS
  skipSize?: boolean
}

interface SymbolDefaultProps extends BaseSymbolProps {
  name: SymbolNamesType
  fallback?: never
}

interface SymbolFallbackProps extends BaseSymbolProps {
  name?: SymbolNamesType
  fallback: SymbolNamesType
}

export type SymbolProps = SymbolDefaultProps | SymbolFallbackProps

const LogoSymbol = forwardRef<SVGSVGElement, SymbolProps>(
  ({ name, size, className, skipSize = false, fallback }, ref) => {
    const Component = name ? SymbolNameMap[name] : undefined
    const sizeClasses = skipSize ? '' : symbolVariants({ size })

    if (!Component && fallback) {
      console.warn(`LogoSymbol "${name}" not found, falling back to "${fallback}".`)
      const FallbackComponent = SymbolNameMap[fallback]

      return <FallbackComponent className={cn(sizeClasses, className)} ref={ref} />
    }

    if (!Component) {
      console.warn(`LogoSymbol "${name}" not found in SymbolNameMap.`)
      return null
    }

    return <Component className={cn(sizeClasses, className)} ref={ref} />
  }
)

export { LogoSymbol }

LogoSymbol.displayName = 'LogoSymbol'
