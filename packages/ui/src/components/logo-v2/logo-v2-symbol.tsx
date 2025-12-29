import { forwardRef, SVGProps } from 'react'

import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { LogoSymbolNameMapV2 } from './logo-v2-symbol-name-map'

export const logoSymbolVariants = cva('cn-logo-symbol', {
    variants: {
        size: {
            xs: 'cn-logo-xs',
            sm: 'cn-logo-sm',
            md: 'cn-logo-md',
            lg: 'cn-logo-lg'
        },
        color: {
            currentColor: '',
            default: 'text-cn-foreground-1',
            muted: 'text-cn-foreground-2',
            neutral: 'text-cn-foreground-3'
        }
    },
    defaultVariants: {
        size: 'lg',
        color: 'default'
    }
})

export type LogoV2SymbolNamesType = keyof typeof LogoSymbolNameMapV2

interface BaseLogoSymbolProps extends Omit<SVGProps<SVGSVGElement>, 'color'> {
    size?: VariantProps<typeof logoSymbolVariants>['size']
    color?: VariantProps<typeof logoSymbolVariants>['color']
    // incase size will be added through CSS
    skipSize?: boolean
}

interface LogoV2SymbolDefaultProps extends BaseLogoSymbolProps {
    name: LogoV2SymbolNamesType
    fallback?: never
}

interface LogoV2SymbolFallbackProps extends BaseLogoSymbolProps {
    name?: LogoV2SymbolNamesType
    fallback: LogoV2SymbolNamesType
}

export type LogoV2SymbolProps = LogoV2SymbolDefaultProps | LogoV2SymbolFallbackProps

const LogoV2Symbol = forwardRef<SVGSVGElement, LogoV2SymbolProps>(
    ({ name, size, color, className, skipSize = false, fallback }, ref) => {
        const Component = name ? LogoSymbolNameMapV2[name] : undefined
        const sizeClasses = skipSize ? '' : logoSymbolVariants({ size, color })

        if (!Component && fallback) {
            console.warn(`LogoV2Symbol "${name}" not found, falling back to "${fallback}".`)
            const FallbackComponent = LogoSymbolNameMapV2[fallback]

            return <FallbackComponent className={cn(sizeClasses, className)} ref={ref} />
        }

        if (!Component) {
            console.warn(`LogoV2Symbol "${name}" not found in LogoSymbolNameMapV2.`)
            return null
        }

        return <Component className={cn(sizeClasses, className)} ref={ref} />
    }
)

export { LogoV2Symbol }

LogoV2Symbol.displayName = 'LogoV2Symbol'
