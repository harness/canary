import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'

import { Slot } from '@radix-ui/react-slot'
import { CanaryOutletFactory, CanaryOutletName } from '@utils/CanaryOutletFactory'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva('button', {
  variants: {
    variant: {
      // default:
      //   'bg-cn-background-primary text-cn-foreground-primary hover:bg-button-background-accent-2 disabled:bg-button-background-accent-3 disabled:text-button-foreground-accent-2',
      // outline:
      //   'border border-cn-borders-2 bg-transparent text-cn-foreground-2 hover:border-cn-borders-6 hover:text-cn-foreground-1',
      // tertiary: 'bg-cn-background-2 text-cn-foreground-2 hover:bg-cn-background-2/80',
      // ghost: 'hover:bg-cn-background-12 hover:text-cn-foreground-1',
      // link: 'text-cn-foreground-1 underline-offset-4 hover:underline',
      // split: 'flex items-center gap-1.5 border p-0',
      // 'gradient-border': 'bg-cn-background-2 text-cn-foreground-1 hover:bg-cn-background-8',
      // custom: '',
      // secondary: 'bg-cn-background-3 text-cn-foreground-2 hover:bg-cn-background-3/80',
      // link_accent: 'text-cn-foreground-accent underline-offset-4 hover:underline',

      solid: 'button-solid',
      surface: 'button-surface',
      soft: 'button-soft',
      ghost: 'button-ghost',
      link: 'button-link'
    },
    size: {
      // default: 'h-8 px-6',
      // sm: 'h-7 px-3 text-sm font-normal',
      // xs: 'h-auto px-1.5 py-0.5 text-xs font-normal',
      // lg: 'h-10 px-8',
      // xs_icon: 'size-6',
      // sm_icon: 'size-7',
      // xs_split: 'h-auto p-0 text-xs font-medium',
      // md_split: 'h-8 text-14 font-medium',
      // lg_split: 'h-10 p-0 font-medium'
      // md: 'h-9 px-7',
      // icon: 'size-8',

      sm: 'button-sm',
      lg: 'button-lg'
    },
    rounded: {
      true: 'button-rounded'
    },

    iconOnly: {
      true: 'button-icon-only'
    },

    // borderRadius: {
    //   full: 'rounded-full focus-visible:rounded-full',
    //   none: 'rounded-none'
    // },
    theme: {
      // default: '',
      // error:
      //   'border-cn-borders-danger/30 bg-button-background-danger-1 text-cn-foreground-danger hover:bg-button-background-danger-2',
      // warning:
      //   'border-cn-borders-danger/30 bg-button-background-danger-1 text-cn-foreground-warning hover:bg-button-background-danger-2',
      // success:
      //   'border-button-border-success-1 bg-button-background-success-1 text-button-foreground-success-1 hover:bg-button-background-success-2',
      // muted: 'border-cn-borders-3/20 bg-cn-background-1/10 text-cn-foreground-3',
      // primary: 'border-cn-borders-brand/20 bg-cn-background-primary text-cn-foreground-primary',
      // disabled:
      //   'border-button-border-disabled-1 bg-button-background-disabled-1 text-button-foreground-disabled-1 disabled:bg-button-background-disabled-1 disabled:text-button-foreground-disabled-1'

      success: 'button-success',
      muted: 'button-muted',
      danger: 'button-danger',
      primary: 'button-primary',
      ai: 'button-ai'
    }
    // padding: {
    //   default: '',
    //   sm: 'px-3'
    // }
    // gradient: {
    //   default: 'ai-button'
    // }
  },
  defaultVariants: {
    variant: 'solid',
    theme: 'primary'
  }
})

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  spinner?: ReactNode
  rounded?: boolean
  iconOnly?: boolean
}

export type ButtonThemes = Exclude<NonNullable<VariantProps<typeof buttonVariants>['theme']>, null | undefined>
export type ButtonVariants = Exclude<NonNullable<VariantProps<typeof buttonVariants>['variant']>, null | undefined>
export type ButtonSizes = VariantProps<typeof buttonVariants>['size']

// add icon only aria attr if iconOnly is true

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      theme,
      rounded,
      iconOnly,
      asChild = false,
      loading,
      disabled,
      spinner,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    const _children = loading ? (
      <>
        {(loading && spinner) ||
          CanaryOutletFactory.getOutlet(CanaryOutletName.BUTTON_SPINNER, {
            className,
            variant,
            size,
            theme,
            rounded,
            asChild,
            loading,
            disabled,
            children,
            ...props
          })}
        {children}
      </>
    ) : (
      children
    )

    // const gradientClassMap: Record<string, string> = {
    //   'ai-button': 'bg-ai-button'
    // }

    // const gradientClass = gradientType ? gradientClassMap[gradientType] : ''

    // if (gradientType) {
    //   return (
    //     <div className={cn(buttonVariants({ size, borderRadius }), 'p-[1px]')}>
    //       <Comp
    //         className={cn(buttonVariants({ variant, borderRadius, className }), 'h-full')}
    //         ref={ref}
    //         disabled={disabled || loading}
    //         {...props}
    //       >
    //         {_children}
    //       </Comp>
    //     </div>
    //   )
    // }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, theme, rounded, iconOnly, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {_children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants, type ButtonProps }
