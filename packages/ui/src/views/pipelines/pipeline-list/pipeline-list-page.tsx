import { ChangeEvent, FC, useCallback, useState } from 'react'

import { Button, ListActions, PaginationComponent, SearchBox, Spacer, Text } from '@/components'
import { debounce } from 'lodash-es'

import { SandboxLayout } from '../../index'
import { PipelineList } from './pipeline-list'
import { IPipelineListPageProps } from './types'

const PipelineListPage: FC<IPipelineListPageProps> = ({
  usePipelineListStore,
  useTranslationStore,
  isLoading,
  isError,
  errorMessage,
  searchQuery,
  setSearchQuery,
  handleCreatePipeline,
  LinkComponent
}) => {
  const { t } = useTranslationStore()
  const { pipelines, totalPages, page, setPage } = usePipelineListStore()

  const [searchInput, setSearchInput] = useState(searchQuery)

  const debouncedSetSearchQuery = debounce(searchQuery => {
    setSearchQuery(searchQuery || null)
  }, 300)

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    debouncedSetSearchQuery(e.target.value)
  }, [])

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
              Pipelines
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
              <Button variant="default" onClick={handleCreatePipeline}>
                Create pipeline
              </Button>
            </ListActions.Right>
          </ListActions.Root>
        </>
        <Spacer size={5} />
        <PipelineList
          pipelines={pipelines}
          LinkComponent={LinkComponent}
          query={searchQuery ?? ''}
          handleResetQuery={() => {
            setSearchInput('')
            setSearchQuery(null)
          }}
          useTranslationStore={useTranslationStore}
          isLoading={isLoading}
          handleCreatePipeline={handleCreatePipeline}
        />
        <Spacer size={8} />
        <PaginationComponent totalPages={totalPages} currentPage={page} goToPage={page => setPage(page)} t={t} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { PipelineListPage }
