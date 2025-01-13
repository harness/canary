import {
  Button,
  Icon,
  ListActions,
  SearchBox,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text
} from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'

interface PageProps {
  //   tokens: TokensList[]
  openAlertDeleteDialog: (params: { identifier: string; type: string }) => void
  useTranslationStore: () => TranslationStore
  labels: any
  space_ref: string
  openCreateLabelDialog: () => void
}

export const ProjectLabelsListView: React.FC<PageProps> = ({
  /*tokens,*/ openAlertDeleteDialog,
  useTranslationStore,
  space_ref,
  labels,
  openCreateLabelDialog
}) => {
  const { t } = useTranslationStore()
  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content maxWidth="3xl">
        <Spacer size={10} />
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
        <Table variant="asStackedList">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created In</TableHead>
              <TableHead>Description</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {labels && labels.length > 0 ? (
              labels.map(label => (
                <TableRow key={label.key}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: label.color }}></div>
                      {label.key}
                    </div>{' '}
                  </TableCell>
                  <TableCell>{space_ref}</TableCell>
                  <TableCell>{label.description}</TableCell>
                  <TableCell className="content-center">
                    <div
                      role="button"
                      tabIndex={0}
                      className="flex cursor-pointer items-center justify-end gap-1.5"
                      onClick={() => {
                        // openAlertDeleteDialog({ identifier: token.identifier!, type: 'token' })
                      }}
                    >
                      <Icon name="vertical-ellipsis" size={14} className="cursor-pointer text-tertiary-background" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  <Text as="p" size={2} align="center" color={'tertiaryBackground'} className="w-full text-center">
                    {t('There are no labels in this project yet. Create a new label to get started.')}
                  </Text>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
