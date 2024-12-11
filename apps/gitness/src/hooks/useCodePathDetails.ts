import { useParams } from 'react-router-dom'

import { CodeModes } from '@harnessio/ui/views'

import { REFS_TAGS_PREFIX } from '../utils/git-utils'

const useCodePathDetails = () => {
  const subCodePath = useParams()['*'] || ''

  // Determine codeMode and restPath
  const [codeMode, restPath] = (() => {
    if (subCodePath.startsWith('edit/')) return [CodeModes.EDIT, subCodePath.substring(5)]
    if (subCodePath.startsWith('new/')) return [CodeModes.NEW, subCodePath.substring(4)]
    return [CodeModes.VIEW, subCodePath]
  })()

  // Split the restPath into gitRef and resourcePath
  const [rawSubGitRef = '', rawResourcePath = ''] = restPath.split('~')

  // Normalize values
  const fullGitRef = rawSubGitRef.endsWith('/') ? rawSubGitRef.slice(0, -1) : rawSubGitRef
  const gitRefName = fullGitRef.startsWith(REFS_TAGS_PREFIX) ? fullGitRef.split(REFS_TAGS_PREFIX)[1] : fullGitRef
  const fullResourcePath = rawResourcePath.startsWith('/') ? rawResourcePath.slice(1) : rawResourcePath

  return { codeMode, fullGitRef, gitRefName, fullResourcePath }
}

export default useCodePathDetails
