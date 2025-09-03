import { MouseEvent, useEffect, useState } from 'react'

import { ButtonProps, IconPropsV2, IconV2 } from '@/components'
import { cva, VariantProps } from 'class-variance-authority'
import copy from 'clipboard-copy'

// TODO: Design system: Update colors
const copyIconVariants = cva('transition-colors duration-200', {
  variants: {
    color: {
      gray: 'text-icons-1 hover:text-icons-2',
      white: 'text-icons-3 hover:text-icons-2',
      surfaceGray: 'text-cn-gray-surface',
      success: 'text-icons-success'
    }
  },
  defaultVariants: {
    color: 'white'
  }
})

export interface UseCopyButtonProps extends VariantProps<typeof copyIconVariants> {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  copyData: string
  iconSize?: IconPropsV2['size']
}

export const useCopyButton = ({ onClick, copyData, color, iconSize }: UseCopyButtonProps) => {
  const [copied, setCopied] = useState(false)

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()

    // Use clipboard-copy library for cross-browser compatibility
    copy(copyData).then(() => setCopied(true))

    onClick?.(e)
  }

  useEffect(() => {
    let timeoutId: number

    if (copied) {
      timeoutId = window.setTimeout(() => setCopied(false), 1000)
    }

    return () => {
      clearTimeout(timeoutId)
    }
  }, [copied])

  const iconCopyStyle = copied ? 'success' : color
  const changeIcon = copied ? 'check' : 'copy'

  const copyButtonProps: ButtonProps = {
    iconOnly: true,
    'aria-label': 'Copy',
    onClick: handleClick
  }

  return {
    copied,
    CopyIcon: <IconV2 className={copyIconVariants({ color: iconCopyStyle })} name={changeIcon} size={iconSize} />,
    copyButtonProps
  }
}
