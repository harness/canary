import { FC, PropsWithChildren, ReactNode } from 'react'

import { Text } from '@harnessio/ui/components'

import css from './section.module.css'

export interface SectionProps extends PropsWithChildren<React.HTMLAttributes<HTMLElement>> {
  title: string
  description?: ReactNode
}

const Section: FC<SectionProps> = ({ title, description, children }) => (
  <section className={css.section}>
    <Text as="h3" size={5}>
      {title}
    </Text>
    {description}
    {children}
  </section>
)

export default Section
