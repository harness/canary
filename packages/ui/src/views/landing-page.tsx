import { FC } from 'react'

import { Button, ButtonLayout, DropdownMenu, IconV2 } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { SandboxLayout } from '@/views'

interface TypesSpace {
  created?: number
  created_by?: number
  deleted?: number | null
  description?: string
  id?: number
  identifier?: string
  parent_id?: number
  path?: string
  updated?: number
}

interface RoutingProps {
  toCreateProject: () => string
}

export interface LandingPageProps extends Partial<RoutingProps> {
  spaces: TypesSpace[]
  getProjectPath: (spaceId?: string) => string
}

export const LandingPageView: FC<LandingPageProps> = ({ spaces, getProjectPath, toCreateProject }) => {
  const { Link } = useRouterContext()
  const { t } = useTranslation()

  return (
    <SandboxLayout.Main className="min-h-[inherit]">
      <section className="grid min-h-[inherit] place-content-center place-items-center gap-2.5">
        <h2 className="text-cn-foreground-1 text-2xl font-medium">
          {t('views:landingPage.selectProject', 'Select a project to get started')}
        </h2>

        <p className="text-cn-foreground-3 text-center text-sm font-normal">
          {t(
            'views:landingPage.description',
            'Projects contain your repositories and pipelines. To start using Gitness, select a project or create a new one.'
          )}
        </p>

        <ButtonLayout>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button>
                <span>{t('views:landingPage.projectSelector', 'Select Project')}</span>
                <IconV2 name="nav-arrow-down" className="chevron-down" />
              </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
              {spaces?.map(space => (
                <Link key={space.id} to={getProjectPath(space?.path)}>
                  <DropdownMenu.Item title={space.identifier} />
                </Link>
              ))}

              {!spaces?.length && (
                <DropdownMenu.NoOptions>
                  {t('views:landingPage.noProjects', 'No projects available')}
                </DropdownMenu.NoOptions>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          <Button variant="outline" asChild>
            <Link to={toCreateProject?.() || ''}>{t('views:landingPage.createProject', 'Create Project')}</Link>
          </Button>
        </ButtonLayout>
      </section>
    </SandboxLayout.Main>
  )
}
