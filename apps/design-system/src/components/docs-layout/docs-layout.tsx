import { FC, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import '@harnessio/ui/styles.css'

import DocsNavbar from '@components/docs-navbar/docs-navbar'

import css from './docs-layout.module.css'

const DocsLayout: FC = () => {
  // TODO: expose this via a UI element to switch between light-std-std and dark-std-std
  useEffect(() => document.body.classList.add('light-std-std'), [])

  return (
    <main className={css.layout}>
      <DocsNavbar className={css.navbar} />
      <Outlet />
    </main>
  )
}

export default DocsLayout
