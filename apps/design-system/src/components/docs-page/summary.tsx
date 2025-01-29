import { FC, PropsWithChildren } from 'react'

import { Text } from '@harnessio/ui/components'

export interface SummaryProps extends PropsWithChildren<React.HTMLAttributes<HTMLElement>> {
  title: string
}

const Summary: FC<SummaryProps> = ({ title, children }) => (
  <header>
    <Text as="h2" size={7}>
      {title}
    </Text>
    {children}
  </header>
)

export default Summary
