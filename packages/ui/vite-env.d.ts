declare module '*.svg' {
  import type { FunctionComponent, SVGProps } from 'react'
  const value: FunctionComponent<SVGProps<SVGSVGElement>>
  export default value
}

declare module '*.png' {
  const value: string
  export default value
}
