import { FC } from 'react'
import { Link } from 'react-router-dom'

import { Button, ListActions, PaginationComponent, SearchBox, Spacer, Text } from '@/components'
import { useDebounceSearch } from '@/hooks'

import { SandboxLayout } from '../../index'
import { ExecutionList } from './execution-list'
import { IExecutionListPageProps } from './types'

const ExecutionListPage: FC<IExecutionListPageProps> = ({
  useExecutionListStore,
  useTranslationStore,
  isLoading,
  isError,
  errorMessage,
  searchQuery,
  setSearchQuery,
  handleExecutePipeline,
  LinkComponent
}) => {
  const { t } = useTranslationStore()
  const { executions, totalPages, page, setPage } = useExecutionListStore()

  const {
    search: searchInput,
    handleSearchChange: handleInputChange,
    handleResetSearch
  } = useDebounceSearch({
    handleChangeSearchValue: (val: string) => setSearchQuery(val.length ? val : null),
    searchValue: searchQuery || ''
  })

  if (isError)
    // TODO: improve error handling
    return (
      <>
        <SandboxLayout.Main>
          <SandboxLayout.Content>
            <Spacer size={2} />
            <Text size={1} className="text-destructive">
              {errorMessage || 'Something went wrong'}
            </Text>
          </SandboxLayout.Content>
        </SandboxLayout.Main>
      </>
    )

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        <>
          <Spacer size={10} />
          <div className="flex items-end">
            <Text className="leading-none" size={5} weight={'medium'}>
              Executions
            </Text>
          </div>
          <Spacer size={6} />
          <ListActions.Root>
            <ListActions.Left>
              <SearchBox.Root
                width="full"
                className="max-w-96"
                value={searchInput || ''}
                handleChange={handleInputChange}
                placeholder={'Search'}
              />
            </ListActions.Left>
            <ListActions.Right>
              {/* TODO: two buttons - xd review required */}
              <div className="flex gap-3">
                <Button variant="default" asChild>
                  <Link to={`create`}>Run</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link to={`edit`}>Edit</Link>
                </Button>
              </div>
            </ListActions.Right>
          </ListActions.Root>
        </>
        <Spacer size={5} />
        <ExecutionList
          executions={executions}
          LinkComponent={LinkComponent}
          query={searchQuery ?? ''}
          handleResetQuery={handleResetSearch}
          useTranslationStore={useTranslationStore}
          isLoading={isLoading}
          handleExecutePipeline={handleExecutePipeline}
        />
        <Spacer size={8} />
        <PaginationComponent totalPages={totalPages} currentPage={page} goToPage={page => setPage(page)} t={t} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { ExecutionListPage }
