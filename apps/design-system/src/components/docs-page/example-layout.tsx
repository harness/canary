import { FC, PropsWithChildren } from 'react'

import css from './example-layout.module.css'

const ExampleLayout: FC<PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = ({ children }) => (
  <div className={css.layout}>{children}</div>
)

export default ExampleLayout
