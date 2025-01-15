import { Button, ListActions, SearchBox, Spacer, Text } from '@/components'
import { SandboxLayout } from '@/views'

import { LabelsListView } from './components/labels-list-view'
import { ProjectLabelPageProps } from './types'

export const ProjectLabelsListView: React.FC<ProjectLabelPageProps> = ({
  useTranslationStore,
  createdIn,
  useLabelsStore,
  openCreateLabelDialog,
  handleEditLabel,
  handleDeleteLabel,
  showSpacer = true
}) => {
  const { t } = useTranslationStore()
  const { labels } = useLabelsStore()
  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content maxWidth="3xl">
        {showSpacer && <Spacer size={10} />}
        <Text size={5} weight={'medium'}>
          Labels
        </Text>
        <Spacer size={6} />
        <ListActions.Root>
          <ListActions.Left>
            <SearchBox.Root
              width="full"
              className="max-w-96"
              // value={searchInput || ''}
              // handleChange={handleInputChange}
              placeholder={t('views:repos.search')}
            />
          </ListActions.Left>
          <ListActions.Right>
            <Button variant="default" onClick={openCreateLabelDialog}>
              New label
            </Button>
          </ListActions.Right>
        </ListActions.Root>
        <Spacer size={5} />
        <LabelsListView
          labels={labels}
          createdIn={createdIn}
          handleDeleteLabel={handleDeleteLabel}
          handleEditLabel={handleEditLabel}
          useTranslationStore={useTranslationStore}
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
