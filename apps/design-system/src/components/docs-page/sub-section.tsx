import { FC, PropsWithChildren, ReactNode } from 'react'

import { Text } from '@harnessio/ui/components'

import css from './section.module.css'

export interface SubSectionProps extends PropsWithChildren {
  title: string
  description?: ReactNode
}

const SubSection: FC<SubSectionProps> = ({ title, description, children }) => (
  <section className={css.section}>
    <Text as="h4" size={4}>
      {title}
    </Text>
    {description}
    {children}
  </section>
)

export default SubSection
