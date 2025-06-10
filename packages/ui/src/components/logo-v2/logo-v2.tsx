import { FC, SVGProps } from 'react'

import { LogoNameMapV2 } from './logo-name-map'

export interface LogoPropsV2 extends SVGProps<SVGSVGElement> {
  name: keyof typeof LogoNameMapV2
  size?: number
  // incase size will be added through CSS
  skipSize?: boolean
}

const LogoV2: FC<LogoPropsV2> = ({ name, size = 16, height, width, className, skipSize = false }) => {
  const Component = LogoNameMapV2[name]

  const sizeProps = skipSize
    ? {}
    : {
        width: width || size,
        height: height || size,
        style: { minWidth: `${width || size}px`, minHeight: `${height || size}px` }
      }

  return <Component className={className} {...sizeProps} />
}

export { LogoV2 }

LogoV2.displayName = 'LogoV2'
