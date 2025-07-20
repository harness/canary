import { useParams } from 'react-router-dom'

import { CodeModes } from '@harnessio/ui/views'

import { isRefABranch, isRefACommitSHA, isRefATag, REFS_BRANCH_PREFIX, REFS_TAGS_PREFIX } from '../utils/git-utils'
import { removeLeadingSlash, removeTrailingSlash } from '../utils/path-utils'

const useCodePathDetails = () => {
  const params = useParams()
  const subCodePath = params['*'] || ''
  const { branchId, tagId, commitSHA } = params

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
  } else if (commitSHA) {
    effectiveGitRef = commitSHA
  }

  // Normalize values
  const fullGitRef = removeTrailingSlash(effectiveGitRef)
  const fullResourcePath = removeLeadingSlash(rawResourcePath)

  let gitRefName = ''
  if (isRefATag(fullGitRef)) {
    gitRefName = fullGitRef.split(REFS_TAGS_PREFIX)[1]
  } else if (isRefABranch(fullGitRef)) {
    gitRefName = fullGitRef.split(REFS_BRANCH_PREFIX)[1]
  } else if (isRefACommitSHA(fullGitRef)) {
    gitRefName = fullGitRef
  }

  return { codeMode, fullGitRef, gitRefName, fullResourcePath }
}

export default useCodePathDetails
