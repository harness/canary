import { FC, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import css from './view-switcher.module.css'

export interface ViewSwitcherProps {
  routes: string[]
}

const ViewSwitcher: FC<ViewSwitcherProps> = ({ routes }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const currentView = useMemo<string>(
    () => pathname.match(/view-preview\/([^/]+)/)?.[1] || routes[0],
    [pathname, routes]
  )

  if (routes.length < 2) return null

  return (
    <select
      className={css.select}
      value={currentView}
      onChange={e => {
        navigate(e.currentTarget.value)
      }}
    >
      {routes.map(route => (
        <option key={route} value={route}>
          {route}
        </option>
      ))}
    </select>
  )
}

export default ViewSwitcher
