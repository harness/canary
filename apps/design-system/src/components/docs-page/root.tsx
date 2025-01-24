import { FC, PropsWithChildren } from 'react'

import css from './root.module.css'

const Root: FC<PropsWithChildren<unknown>> = ({ children }) => (
  <article className={css.root}>
    <div className={css.content}>{children}</div>
  </article>
)

export default Root
