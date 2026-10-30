import { MouseEvent, useEffect, useState } from 'react'

import { ButtonProps, IconPropsV2, IconV2, IconV2Color, toast } from '@/components'
import copy from 'clipboard-copy'

export interface UseCopyButtonProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  copyData: string | (() => string)
  iconSize?: IconPropsV2['size']
  color?: IconV2Color
}

export const useCopyButton = ({ onClick, copyData, color, iconSize }: UseCopyButtonProps) => {
  const [copied, setCopied] = useState(false)

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()

    // Handle the copy operation asynchronously (clipboard API is async)
    const performCopy = async () => {
      try {
        // Resolve copyData - string or sync function
        const textToCopy = typeof copyData === 'function' ? copyData() : copyData

        // Use clipboard-copy library for cross-browser compatibility
        await copy(textToCopy)
        setCopied(true)
      } catch (error) {
        // Handle potential errors from copy operation
        toast.danger({
          title: 'Failed to copy',
          description: error instanceof Error ? error.message : 'An unknown error occurred'
        })
      }
    }

    performCopy()
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

  const iconColor = copied ? 'success' : color
  const changeIcon = copied ? 'check' : 'copy'

  const copyButtonProps: ButtonProps = {
    iconOnly: true,
    'aria-label': 'Copy',
    onClick: handleClick,
    tooltipProps: {
      content: 'Copy'
    }
  }

  return {
    copied,
    CopyIcon: <IconV2 color={iconColor} name={changeIcon} size={iconSize} />,
    copyButtonProps
  }
}
