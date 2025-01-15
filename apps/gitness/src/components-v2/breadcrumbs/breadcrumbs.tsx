import { useMatches } from 'react-router-dom'

import { Breadcrumb, Topbar } from '@harnessio/ui/components'

import { CustomHandle } from '../../framework/routing/types'

function Breadcrumbs() {
  const matches = useMatches()

  return (
    <Topbar.Root>
      <Topbar.Left>
        <Breadcrumb.Root className="select-none">
          <Breadcrumb.List>
            {matches.map((match, index) => {
              const { breadcrumb } = (match.handle || {}) as CustomHandle
              const isFirst = index === 1
              const isLast = index === matches.length - 1

              if (!breadcrumb) return null

              return (
                <Breadcrumb.Item key={match.pathname}>
                  {!isFirst ? <Breadcrumb.Separator /> : null}
                  {isLast ? (
                    <Breadcrumb.Page>{breadcrumb(match.params)}</Breadcrumb.Page>
                  ) : (
                    <Breadcrumb.Link href={match.pathname}>{breadcrumb(match.params)}</Breadcrumb.Link>
                  )}
                </Breadcrumb.Item>
              )
            })}
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </Topbar.Left>
    </Topbar.Root>
  )
}

export default Breadcrumbs
