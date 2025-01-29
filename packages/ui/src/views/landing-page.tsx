import { useNavigate } from 'react-router-dom'

import { Button, ButtonGroup, DropdownMenu, Icon, Text } from '@/components'
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
}

export const LandingPageView: React.FC<LandingPageProps> = ({ spaces, useTranslationStore }) => {
  const navigate = useNavigate()
  const { t } = useTranslationStore()

  return (
    <SandboxLayout.Main>
      <div className="flex size-full flex-col place-content-center place-items-center gap-4">
        <div className="flex flex-col place-content-center place-items-center gap-2.5">
          <Text size={5} weight="medium">
            {t('views:landingPage.selectProject', 'Select a project to get started')}
          </Text>
          <div className="flex flex-col">
            <Text size={2} weight="normal" align="center" color="tertiaryBackground">
              {t(
                'views:landingPage.description',
                'Projects contain your repositories and pipelines. To start using Gitness, select a project or create a new one.'
              )}
            </Text>
          </div>
          <ButtonGroup>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button variant="default" size={'lg'}>
                  <Text color="tertiary" className="mr-5">
                    {t('views:landingPage.projectSelector', 'Select Project')}
                  </Text>
                  <Icon name="chevron-down" size={15} className="chevron-down" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
                {spaces?.length ? (
                  spaces.map(space => (
                    <DropdownMenu.Item key={space.id} onClick={() => navigate(`${space.path}/repos`)}>
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
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                navigate('/create')
              }}
            >
              {t('views:landingPage.createProject', 'Create Project')}
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </SandboxLayout.Main>
  )
}
