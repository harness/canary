import { MouseEvent } from 'react'

import { Button } from '@components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@components/dropdown-menu'
import { Icon } from '@components/icon'
import { Option } from '@components/option'
import { RadioButton, RadioGroup } from '@components/radio'
import { cn } from '@utils/cn'

export interface ButtonWithOptionsOptionType<T extends string> {
  value: T
  label: string
  description?: string
}

export interface ButtonWithOptionsProps<T extends string> {
  id: string
  handleButtonClick: (e: MouseEvent) => void
  isLoading?: boolean
  buttonText: string
  selectedValue: T
  options: ButtonWithOptionsOptionType<T>[]
  handleOptionChange: (val: T) => void
  className?: string
  buttonSizeClassName?: 'h-8' | 'h-9'
}

export const ButtonWithOptions = <T extends string>({
  id,
  handleButtonClick,
  isLoading = false,
  buttonText,
  selectedValue,
  options,
  handleOptionChange,
  className,
  buttonSizeClassName = 'h-8'
}: ButtonWithOptionsProps<T>) => {
  return (
    <div className={cn('flex rounded bg-background-5', className)}>
      <Button
        className={cn('rounded-r-none pr-2.5 pl-5', buttonSizeClassName)}
        theme="primary"
        onClick={handleButtonClick}
        type="button"
        disabled={!!isLoading}
      >
        {buttonText}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            'relative flex size-8 items-center justify-center rounded-r after:absolute after:inset-y-0 after:left-0 after:my-auto after:h-6 after:w-px after:bg-borders-7 hover:bg-background-10',
            buttonSizeClassName
          )}
        >
          <Icon name="chevron-down" size={12} className="text-icons-10" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="mt-1 max-w-80"
          align="end"
          onCloseAutoFocus={event => event.preventDefault()} // Prevent focus on hidden content
        >
          <RadioGroup value={String(selectedValue)} id={id}>
            <DropdownMenuGroup>
              {options.map(option => (
                <DropdownMenuItem
                  key={String(option.value)}
                  onClick={() => handleOptionChange(option.value)}
                  disabled={!!isLoading}
                >
                  <Option
                    control={<RadioButton className="mt-px" value={String(option.value)} id={String(option.value)} />}
                    id={String(option.value)}
                    label={option.label}
                    ariaSelected={selectedValue === option.value}
                    description={option?.description}
                  />
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </RadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
