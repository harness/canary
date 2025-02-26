import { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { viewPreviews } from '@/pages/view-preview/view-preview'
import { componentPages } from '@subjects/components/componentPages'

import { Icon, NavbarSkeleton, ScrollArea } from '@harnessio/ui/components'

import css from './docs-navbar.module.css'

export interface DocsNavbarProps {
  className?: string
}

const DocsNavbar: FC<DocsNavbarProps> = ({ className }) => {
  const location = useLocation()

  return (
    <NavbarSkeleton.Root className={className}>
      <NavbarSkeleton.Header>
        <Link className="flex items-center gap-1.5 p-5" to="/docs">
          <Icon name="harness" size={18} className="text-sidebar-foreground-accent" />
          <Icon name="harness-logo-text" width={65} height={15} className="text-sidebar-foreground-1 mb-0.5" />
        </Link>
      </NavbarSkeleton.Header>

      <NavbarSkeleton.Content className={css.content}>
        <ScrollArea>
          <NavbarSkeleton.Group title="Components">
            {componentPages.map(({ name, path }) => (
              <Link key={path} to={`/docs/components/${path}`}>
                <NavbarSkeleton.Item
                  text={name}
                  active={location.pathname.includes(`/docs/components/${path}`)}
                  isMainNav
                />
              </Link>
            ))}
          </NavbarSkeleton.Group>

          {Object.entries(viewPreviews).map(([groupKey, group]) => (
            <NavbarSkeleton.Group key={groupKey} title={group.label} topBorder>
              {Object.entries(group.items).map(([path, { label }]) => (
                <Link key={path} to={`/view-preview/${path}`}>
                  <NavbarSkeleton.Item
                    text={label}
                    active={location.pathname.includes(`/view-preview/${path}`)}
                    isMainNav
                  />
                </Link>
              ))}
            </NavbarSkeleton.Group>
          ))}
        </ScrollArea>
      </NavbarSkeleton.Content>
      <NavbarSkeleton.Footer>
        <Link to="/view-preview/" target="_blank" className={css.viewLink}>
          <NavbarSkeleton.Item text="View Preview" isMainNav />
          <Icon name="supply-chain" size={12} />
        </Link>
      </NavbarSkeleton.Footer>
    </NavbarSkeleton.Root>
  )
}

export default DocsNavbar
