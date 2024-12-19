import { FC, useMemo } from 'react'

import Example, { ExampleProps } from '@components/docs-page/example'

import * as components from '@harnessio/ui/components'

export type ComponentExampleProps = Omit<ExampleProps, 'scope'> & {
  scope?: ExampleProps['scope']
}

const ComponentExample: FC<ComponentExampleProps> = ({ code, scope }) => {
  const combinedScope = useMemo<ExampleProps['scope']>(() => ({ ...components, ...scope }), [scope])

  return <Example code={code} scope={combinedScope} />
}

export default ComponentExample
