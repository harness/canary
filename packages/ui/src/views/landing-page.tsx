import { Link, LinkProps } from 'react-router-dom'

import { Button, ButtonGroup, DropdownMenu, Icon } from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'

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

export interface LandingPageProps {
  spaces: TypesSpace[]
  useTranslationStore: () => TranslationStore
  getProjectPath: (spaceId?: string) => string
  createProjectLinkProps: LinkProps
}

export const LandingPageView: React.FC<LandingPageProps> = ({
  spaces,
  useTranslationStore,
  getProjectPath,
  createProjectLinkProps
}) => {
  const { t } = useTranslationStore()

  return (
    <SandboxLayout.Main>
      <section className="grid h-full place-content-center place-items-center gap-2.5">
        <h2 className="text-2xl font-medium text-foreground-1">
          {t('views:landingPage.selectProject', 'Select a project to get started')}
        </h2>

        <p className="text-center text-sm font-normal text-foreground-3">
          {t(
            'views:landingPage.description',
            'Projects contain your repositories and pipelines. To start using Gitness, select a project or create a new one.'
          )}
        </p>

        <ButtonGroup>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="default" size="lg">
                <span className="mr-5 text-sm font-normal text-foreground-6">
                  {t('views:landingPage.projectSelector', 'Select Project')}
                </span>
                <Icon name="chevron-down" size={15} className="chevron-down" />
              </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
              {!!spaces?.length &&
                spaces.map(space => (
                  <DropdownMenu.Item key={space.id}>
                    <Link to={getProjectPath(space?.path)}>{space.identifier}</Link>
                  </DropdownMenu.Item>
                ))}

              {!spaces?.length && (
                <DropdownMenu.Item disabled>
                  {t('views:landingPage.noProjects', 'No projects available')}
                </DropdownMenu.Item>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          <Button size="lg" variant="outline" asChild>
            <Link {...createProjectLinkProps}>{t('views:landingPage.createProject', 'Create Project')}</Link>
          </Button>
        </ButtonGroup>
      </section>
    </SandboxLayout.Main>
  )
}
