import { FC, PropsWithChildren, ReactNode } from 'react'

import { Text } from '@harnessio/ui/components'

export interface SectionProps extends PropsWithChildren {
  title: string
  description?: ReactNode
}

const Section: FC<SectionProps> = ({ title, description, children }) => (
  <section>
    <Text as="h3" size={5}>
      {title}
    </Text>
    {description}
    {children}
  </section>
)

export default Section
