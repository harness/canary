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

interface LandingPageProps {
  spaces: TypesSpace[]
  useTranslationStore: () => TranslationStore
  onProjectSelect: (path?: string) => void
  onProjectCreate: () => void
}

export const LandingPageView: React.FC<LandingPageProps> = ({
  spaces,
  useTranslationStore,
  onProjectSelect,
  onProjectCreate
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
              {spaces?.length ? (
                spaces.map(space => (
                  <DropdownMenu.Item key={space.id} onSelect={() => onProjectSelect(space.path)}>
                    {space.identifier}
                  </DropdownMenu.Item>
                ))
              ) : (
                <DropdownMenu.Item disabled>
                  {t('views:landingPage.noProjects', 'No projects available')}
                </DropdownMenu.Item>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          <Button size="lg" variant="outline" role="link" onClick={onProjectCreate}>
            {t('views:landingPage.createProject', 'Create Project')}
          </Button>
        </ButtonGroup>
      </section>
    </SandboxLayout.Main>
  )
}
