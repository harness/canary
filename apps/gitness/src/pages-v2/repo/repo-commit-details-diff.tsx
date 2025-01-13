import { useParams } from 'react-router-dom'

import { compact } from 'lodash-es'

import { useDiffStatsQuery, useGetContentQuery, useListPathsQuery } from '@harnessio/code-service-client'
import { CommitDiff, CommitSidebar } from '@harnessio/ui/views'

import Explorer from '../../components/FileExplorer.tsx'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath.ts'
import useCodePathDetails from '../../hooks/useCodePathDetails.ts'
import { useTranslationStore } from '../../i18n/stores/i18n-store.ts'
import { PathParams } from '../../RouteDefinitions.ts'
import { normalizeGitRef } from '../../utils/git-utils.ts'
import { useCommitDetailsStore } from './stores/commit-details-store.ts'

/**
 * TODO: This code was migrated from V2 and needs to be refactored.
 */
export const CommitDiffContainer = () => {
  const repoRef = useGetRepoRef()
  const { spaceId, repoId, commitSHA } = useParams<PathParams>()
  const { fullGitRef } = useCodePathDetails()
  const { diffs } = useCommitDetailsStore()

  const defaultCommitRange = compact(commitSHA?.split(/~1\.\.\.|\.\.\./g))
  const diffApiPath = `${defaultCommitRange[0]}~1...${defaultCommitRange[defaultCommitRange.length - 1]}`

  const { data: { body: diffStats } = {} } = useDiffStatsQuery(
    { queryParams: {}, repo_ref: repoRef, range: diffApiPath },
    { enabled: !!repoRef && !!diffApiPath }
  )

  //   const { data: { body: repository } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })

  //   const { data: { body: branches } = {} } = useListBranchesQuery({
  //     repo_ref: repoRef,
  //     queryParams: {
  //       include_commit: false,
  //       sort: 'date',
  //       order: orderSortDate.ASC,
  //       limit: 50,
  //       query: searchQuery
  //     }
  //   })

  //   useEffect(() => {
  //     if (branches) {
  //       setBranchList(transformBranchList(branches, repository?.default_branch))
  //     }
  //     if (repository?.default_branch) {
  //       setDefaultBranch(repository?.default_branch)
  //     }
  //   }, [branches, repository?.default_branch])

  //   const { data: { body: tags } = {} } = useListTagsQuery({
  //     repo_ref: repoRef,
  //     queryParams: {
  //       include_commit: false,
  //       sort: 'date',
  //       order: orderSortDate.DESC,
  //       limit: 50
  //     }
  //   })

  //   useEffect(() => {
  //     if (tags) {
  //       setTagList(
  //         tags.map(item => ({
  //           name: item?.name || '',
  //           sha: item?.sha || '',
  //           default: false
  //         }))
  //       )
  //     }
  //   }, [tags])

  //   useEffect(() => {
  //     if (!repository?.default_branch || !branchList.length) {
  //       return
  //     }
  //     if (!fullGitRef) {
  //       const defaultBranch = branchList.find(branch => branch.default)
  //       setSelectedBranchTag({
  //         name: defaultBranch?.name || repository?.default_branch || '',
  //         sha: defaultBranch?.sha || '',
  //         default: true
  //       })
  //     } else {
  //       const selectedGitRefBranch = branchList.find(branch => branch.name === fullGitRef)
  //       const selectedGitRefTag = tagList.find(tag => tag.name === gitRefName)
  //       if (selectedGitRefBranch) {
  //         setSelectedBranchTag(selectedGitRefBranch)
  //       } else if (selectedGitRefTag) {
  //         setSelectedBranchTag(selectedGitRefTag)
  //       }
  //     }
  //   }, [repository?.default_branch, fullGitRef, branchList, tagList])

  const { data: repoDetails } = useGetContentQuery({
    path: '',
    repo_ref: repoRef,
    queryParams: {
      include_commit: true,
      git_ref: normalizeGitRef(fullGitRef)
    }
  })

  const { data: filesData } = useListPathsQuery({
    repo_ref: repoRef,
    queryParams: { git_ref: normalizeGitRef(fullGitRef) }
  })

  const filesList = filesData?.body?.files || []
  console.log(
    'diffs are',
    diffs.forEach(diff => console.log(diff.filePath))
  )

  // TODO: repoId and spaceId must be defined
  if (!repoId || !spaceId) return <></>

  return (
    <>
      <CommitSidebar
        //   selectBranchOrTag={selectBranchOrTag}
        //   useRepoBranchesStore={useRepoBranchesStore}
        useTranslationStore={useTranslationStore}
        //   navigateToNewFile={navigateToNewFile}
        navigateToFile={() => {}}
        filesList={filesList}
        //   searchQuery={searchQuery}
        //   setSearchQuery={setSearchQuery}
      >
        {!!repoDetails?.body?.content?.entries?.length && <Explorer repoDetails={repoDetails?.body} />}
      </CommitSidebar>
      <CommitDiff diffs={diffs} diffStats={diffStats} useTranslationStore={useTranslationStore} />
    </>
  )
}
