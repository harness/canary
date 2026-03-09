import { ComponentType, FC } from 'react'

import { Button, ButtonLayout, DropdownMenu, IconV2, Text } from '@harnessio/ui/components'
import { LinkProps, useTranslation } from '@harnessio/ui/context'
import { SandboxLayout } from '@views'

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
  getProjectPath: (spaceId?: string) => string
  toCreateProject: () => string
  /** Required: Navigate function for routing */
  navigate: (to: string) => void
  /** Required: Link component for rendering anchor elements */
  Link: ComponentType<LinkProps>
}

export const LandingPageView: FC<LandingPageProps> = ({ spaces, getProjectPath, toCreateProject, navigate, Link }) => {
  const { t } = useTranslation()

  const handleProjectSelect = (event: Event, spacePath?: string) => {
    // Prevent DropdownMenu from trying to close (and update state) after navigation unmounts the component
    event.preventDefault()
    navigate(getProjectPath(spacePath))
  }

  return (
    <SandboxLayout.Main className="min-h-[inherit]">
      {/* TODO: Replace gap-[10px] with a proper value from the design system once available */}
      <section className="grid min-h-[inherit] place-content-center place-items-center gap-[10px]">
        <Text as="h2" variant="heading-section">
          {t('views:landingPage.selectProject', 'Select a project to get started')}
        </Text>

        <Text color="foreground-3" align="center">
          {t(
            'views:landingPage.description',
            'Projects contain your repositories and pipelines. To start using Gitness, select a project or create a new one.'
          )}
        </Text>

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
                <DropdownMenu.Item
                  key={space.id}
                  title={space.identifier}
                  onSelect={event => handleProjectSelect(event, space?.path)}
                />
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
