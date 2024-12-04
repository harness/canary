import * as React from 'react'

import { CanaryOutletFactory, CanaryOutletName } from '@/lib/CanaryOutletFactory'
import { cn } from '@/lib/utils'

import { Button, buttonVariants, type ButtonProps } from './button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './dropdown-menu'

export interface SplitButtonProps extends Omit<ButtonProps, 'asChild'> {
  menu?: React.ReactNode
  dropdownAlign?: 'start' | 'end' | 'center'
  dropdownMenuContentClass?: string
}

export const SplitButton = React.forwardRef<HTMLButtonElement, SplitButtonProps>(
  (
    { menu, dropdownAlign = 'end', dropdownMenuContentClass, disabled, loading, onClick, children, variant, ...others },
    ref
  ) => {
    if (loading) {
      return (
        <Button disabled={true} loading={loading} variant={variant} {...others} ref={ref}>
          {children}
        </Button>
      )
    }

    return (
      <Button
        className="pointer-events-none overflow-hidden p-0 hover:bg-current"
        asChild
        variant={variant}
        {...others}
        ref={ref}
      >
        <div>
          <Button
            loading={loading}
            disabled={disabled}
            variant={variant}
            onClick={onClick}
            {...others}
            className="pointer-events-auto rounded-none border-none"
          >
            {children}
          </Button>
          <Button
            disabled={disabled}
            asChild
            className={cn(buttonVariants({ variant }), 'm-0 h-full rounded-none border-none p-0 shadow-none')}
          >
            <span>|</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={variant}
                disabled={disabled}
                {...others}
                className="pointer-events-auto rounded-none border-none px-2 shadow-none"
              >
                {CanaryOutletFactory.getOutlet(CanaryOutletName.SPLIT_ICON, {
                  variant,
                  loading,
                  disabled,
                  children
                })}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={dropdownMenuContentClass} align={dropdownAlign}>
              {menu}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Button>
    )
  }
)
SplitButton.displayName = 'SplitButton'
