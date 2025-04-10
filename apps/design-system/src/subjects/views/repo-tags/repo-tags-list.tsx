import { useCallback, useState } from 'react'

import { noop, useTranslationStore } from '@utils/viewUtils.ts'

import { DeleteAlertDialog } from '@harnessio/ui/components'
import {
  BranchSelectorListItem,
  BranchSelectorTab,
  BranchSelectorV2,
  CreateBranchDialog,
  CreateTagDialog,
  RepoTagsListView
} from '@harnessio/ui/views'

import { tagsStore } from './repo-tags-store'

export const RepoTagsList = () => {
  const [openCreateTagDialog, setOpenCreateTagDialog] = useState(false)
  const [openCreateBranchDialog, setOpenCreateBranchDialog] = useState(false)
  const [selectedTagInList, setSelectedTagInList] = useState<BranchSelectorListItem | null>(null)
  const [preSelectedTab, setPreSelectedTab] = useState<BranchSelectorTab>(BranchSelectorTab.BRANCHES)

  const [openDeleteTagDialog, setOpenDeleteTagDialog] = useState(false)

  const tags = tagsStore.tags
  const branches = [
    {
      id: 0,
      name: 'branch',
      sha: 'sha',
      default: false,
      timestamp: '',
      user: {
        name: '',
        avatarUrl: ''
      }
    }
  ]
  const useRepoTagsStore = useCallback(() => tagsStore, [])

  return (
    <>
      <RepoTagsListView
        useTranslationStore={useTranslationStore}
        isLoading={false}
        openCreateBranchDialog={(selectedTagInList: BranchSelectorListItem) => {
          setOpenCreateBranchDialog(true)
          setSelectedTagInList(selectedTagInList)
          setPreSelectedTab(BranchSelectorTab.TAGS)
        }}
        searchQuery={''}
        setSearchQuery={noop}
        onDeleteTag={() => setOpenDeleteTagDialog(true)}
        useRepoTagsStore={useRepoTagsStore}
        toCommitDetails={() => ''}
        openCreateTagDialog={() => setOpenCreateTagDialog(true)}
      />
      <CreateTagDialog
        useTranslationStore={useTranslationStore}
        open={openCreateTagDialog}
        onClose={() => setOpenCreateTagDialog(false)}
        onSubmit={noop}
        isLoading={false}
        error={''}
        selectedBranchOrTag={null}
        renderProp={() => (
          <BranchSelectorV2
            useTranslationStore={useTranslationStore}
            branchList={branches}
            tagList={tags}
            selectedBranchorTag={branches[0]}
            repoId={'repoId'}
            spaceId={'spaceId'}
            searchQuery={''}
            setSearchQuery={noop}
            onSelectBranch={noop}
            isBranchOnly={false}
            dynamicWidth={false}
          />
        )}
      />
      <CreateBranchDialog
        useTranslationStore={useTranslationStore}
        open={openCreateBranchDialog}
        onClose={() => setOpenCreateBranchDialog(false)}
        selectedBranchOrTag={selectedTagInList}
        onSubmit={async () => {}}
        isCreatingBranch={false}
        error={''}
        renderProp={() => (
          <BranchSelectorV2
            useTranslationStore={useTranslationStore}
            branchList={branches}
            tagList={tags}
            selectedBranchorTag={selectedTagInList ?? { name: '', sha: '', default: false }}
            repoId={'repoId'}
            spaceId={'spaceId'}
            searchQuery={''}
            setSearchQuery={noop}
            onSelectBranch={noop}
            isBranchOnly={false}
            dynamicWidth={false}
            preSelectedTab={preSelectedTab}
          />
        )}
      />
      <DeleteAlertDialog
        open={openDeleteTagDialog}
        onClose={() => setOpenDeleteTagDialog(false)}
        deleteFn={noop}
        error={null}
        type="tag"
        identifier={undefined}
        isLoading={false}
        useTranslationStore={useTranslationStore}
      />
    </>
  )
}
