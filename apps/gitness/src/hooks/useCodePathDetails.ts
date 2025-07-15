import { useParams } from 'react-router-dom'

import { CodeModes } from '@harnessio/ui/views'

import { REFS_BRANCH_PREFIX, REFS_TAGS_PREFIX } from '../utils/git-utils'

const useCodePathDetails = () => {
  const params = useParams()
  const subCodePath = params['*'] || ''
  const { branchId, tagId } = params

  // Determine codeMode and restPath
  const [codeMode, restPath] = (() => {
    if (subCodePath.startsWith('edit/')) return [CodeModes.EDIT, subCodePath.substring(5)]
    if (subCodePath.startsWith('new/')) return [CodeModes.NEW, subCodePath.substring(4)]
    return [CodeModes.VIEW, subCodePath]
  })()

  // Split the restPath into gitRef and resourcePath
  const [rawSubGitRef = '', rawResourcePath = ''] = restPath.split('~')

  let effectiveGitRef = ''

  if (rawSubGitRef) {
    effectiveGitRef = rawSubGitRef
  } else if (branchId) {
    effectiveGitRef = `${REFS_BRANCH_PREFIX}${branchId}`
  } else if (tagId) {
    effectiveGitRef = `${REFS_TAGS_PREFIX}${tagId}`
  }

  // Normalize values
  const fullGitRef = effectiveGitRef.endsWith('/') ? effectiveGitRef.slice(0, -1) : effectiveGitRef
  let gitRefName = fullGitRef.startsWith(REFS_TAGS_PREFIX)
    ? fullGitRef.split(REFS_TAGS_PREFIX)[1]
    : fullGitRef.split(REFS_BRANCH_PREFIX)[1]
  const fullResourcePath = rawResourcePath.startsWith('/') ? rawResourcePath.slice(1) : rawResourcePath

  // If the effectiveGitRef is not a branch or a tag and instead a commit SHA, use it as the gitRefName
  if (!(effectiveGitRef.startsWith(REFS_BRANCH_PREFIX) || effectiveGitRef.startsWith(REFS_TAGS_PREFIX))) {
    gitRefName = effectiveGitRef
  }

  const isCommitSHA = fullGitRef
    ? !(fullGitRef?.startsWith(REFS_BRANCH_PREFIX) || fullGitRef?.startsWith(REFS_TAGS_PREFIX))
    : false

  return { codeMode, fullGitRef, gitRefName, fullResourcePath, isCommitSHA }
}

export default useCodePathDetails
