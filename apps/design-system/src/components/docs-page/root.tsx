import { FC, PropsWithChildren } from 'react'

import css from './root.module.css'

const Root: FC<PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = ({ children }) => (
  <article className={css.root}>
    <div className={css.content}>{children}</div>
  </article>
)

export default Root
