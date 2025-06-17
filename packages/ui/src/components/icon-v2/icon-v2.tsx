import { FC, SVGProps } from 'react'

import { IconNameMapV2 } from './icon-name-map'

export type IconV2NamesType = keyof typeof IconNameMapV2

export interface IconPropsV2 extends SVGProps<SVGSVGElement> {
  name: IconV2NamesType
  size?: number

  // incase size will be added through CSS
  skipSize?: boolean
}

const IconV2: FC<IconPropsV2> = ({ name, size = 16, height, width, className, skipSize = false }) => {
  const Component = IconNameMapV2[name]

  const sizeProps = skipSize
    ? {}
    : {
        width: width || size,
        height: height || size,
        style: { minWidth: `${width || size}px`, minHeight: `${height || size}px` }
      }

  return <Component className={className} {...sizeProps} />
}

export { IconV2 }

IconV2.displayName = 'IconV2'
