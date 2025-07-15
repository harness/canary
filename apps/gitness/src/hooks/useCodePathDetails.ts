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

  let prefixedGitRef = ''

  if (rawSubGitRef) {
    prefixedGitRef =
      rawSubGitRef.startsWith(REFS_TAGS_PREFIX) || rawSubGitRef.startsWith(REFS_BRANCH_PREFIX)
        ? rawSubGitRef
        : `${REFS_BRANCH_PREFIX}${rawSubGitRef}`
  } else if (branchId) {
    prefixedGitRef = `${REFS_BRANCH_PREFIX}${branchId}`
  } else if (tagId) {
    prefixedGitRef = `${REFS_TAGS_PREFIX}${tagId}`
  }

  // Normalize values
  const fullGitRef = prefixedGitRef.endsWith('/') ? prefixedGitRef.slice(0, -1) : prefixedGitRef
  const gitRefName = fullGitRef.startsWith(REFS_TAGS_PREFIX)
    ? fullGitRef.split(REFS_TAGS_PREFIX)[1]
    : fullGitRef.split(REFS_BRANCH_PREFIX)[1]
  const fullResourcePath = rawResourcePath.startsWith('/') ? rawResourcePath.slice(1) : rawResourcePath

  return { codeMode, fullGitRef, gitRefName, fullResourcePath }
}

export default useCodePathDetails
