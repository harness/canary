import langMap from 'lang-map'

import { CommitFilterItemProps, TypesCommit } from '@harnessio/ui/views'

export enum GitCommitAction {
  DELETE = 'DELETE',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  MOVE = 'MOVE'
}

export const REFS_TAGS_PREFIX = 'refs/tags/'
export const REFS_BRANCH_PREFIX = 'refs/heads/'
const MONACO_SUPPORTED_LANGUAGES = [
  'abap',
  'apex',
  'azcli',
  'bat',
  'bicep',
  'cameligo',
  'clojure',
  'coffee',
  'cpp',
  'csharp',
  'csp',
  'css',
  'cypher',
  'dart',
  'dockerfile',
  'ecl',
  'elixir',
  'flow9',
  'freemarker2',
  'fsharp',
  'go',
  'graphql',
  'handlebars',
  'hcl',
  'html',
  'ini',
  'java',
  'javascript',
  'json',
  'julia',
  'kotlin',
  'less',
  'lexon',
  'liquid',
  'lua',
  'm3',
  'markdown',
  'mips',
  'msdax',
  'mysql',
  'objective-c',
  'pascal',
  'pascaligo',
  'perl',
  'pgsql',
  'php',
  'pla',
  'postiats',
  'powerquery',
  'powershell',
  'protobuf',
  'pug',
  'python',
  'qsharp',
  'r',
  'razor',
  'redis',
  'redshift',
  'restructuredtext',
  'ruby',
  'rust',
  'sb',
  'scala',
  'scheme',
  'scss',
  'shell',
  'solidity',
  'sophia',
  'sparql',
  'sql',
  'st',
  'swift',
  'systemverilog',
  'tcl',
  'twig',
  'typescript',
  'vb',
  'wgsl',
  'xml',
  'yaml'
]

export const FILE_SEPARATOR = '/'

export const PLAIN_TEXT = 'plaintext'

// Some of the below languages are mapped to Monaco's built-in supported languages
// due to their similarity. We'll still need to get native support for them at
// some point.
const EXTENSION_TO_LANG: Record<string, string> = {
  alpine: 'dockerfile',
  bazel: 'python',
  cc: 'cpp',
  cs: 'csharp',
  env: 'shell',
  gitignore: 'shell',
  jsx: 'typescript',
  makefile: 'shell',
  toml: 'ini',
  tsx: 'typescript',
  tf: 'hcl',
  tfvars: 'hcl',
  workspace: 'python',
  tfstate: 'hcl',
  ipynb: 'json'
}

/**
 * Convert number of bytes into human readable format
 *
 * @param integer bytes     Number of bytes to convert
 * @param integer precision Number of digits after the decimal separator
 * @return string
 * @link https://stackoverflow.com/a/18650828/1114931
 */
export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

const isValidBase64 = (str: string): boolean => {
  // Check if string contains only valid base64 characters
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
  if (!base64Regex.test(str)) return false

  // Check if string length is a multiple of 4 (with padding)
  if (str.length % 4 !== 0) return false

  return true
}

export const decodeGitContent = (content = ''): string => {
  if (!content) return ''

  // Return original content if it's not valid base64
  if (!isValidBase64(content)) {
    return content
  }

  try {
    const binary = atob(content)
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0))
    return new TextDecoder('utf-8').decode(bytes)
  } catch (error) {
    console.error('UTF-8 decoding failed:', error)
    try {
      // Fallback: plain base64 decode
      return atob(content)
    } catch (fallbackError) {
      console.error('Base64 decoding failed:', fallbackError)
      return content
    }
  }
}

export const filenameToLanguage = (name?: string): string | undefined => {
  const extension = (name?.split('.').pop() || '').toLowerCase()
  const lang = MONACO_SUPPORTED_LANGUAGES.find(l => l === extension) || EXTENSION_TO_LANG[extension]

  if (lang) {
    return lang
  }

  const map = langMap.languages(extension)

  if (map?.length) {
    return MONACO_SUPPORTED_LANGUAGES.find(_lang => map.includes(_lang)) || PLAIN_TEXT
  }

  return PLAIN_TEXT
}

export const isRefATag = (gitRef?: string) => gitRef?.includes(REFS_TAGS_PREFIX) || false
export const isRefABranch = (gitRef?: string) => gitRef?.includes(REFS_BRANCH_PREFIX) || false
// Check if gitRef is a git commit hash (https://github.com/diegohaz/is-git-rev, MIT © Diego Haz)
export const isRefACommitSHA = (gitRef = ''): boolean => /^[0-9a-f]{7,40}$/i.test(gitRef)

export const normalizeGitRef = (gitRef: string | undefined) => {
  if (isRefATag(gitRef)) {
    return gitRef
  } else if (isRefABranch(gitRef)) {
    return gitRef
  } else if (gitRef === '') {
    return ''
  } else if (gitRef && isRefACommitSHA(gitRef)) {
    return gitRef
  } else {
    return `refs/heads/${gitRef}`
  }
}

export const deNormalizeGitRef = (gitRef: string | undefined) => {
  if (isRefATag(gitRef)) {
    return gitRef?.replace('refs/tags/', '')
  } else if (isRefABranch(gitRef)) {
    return gitRef?.replace('refs/heads/', '')
  } else if (gitRef === '') {
    return ''
  } else if (gitRef && isRefACommitSHA(gitRef)) {
    return gitRef
  } else {
    return gitRef
  }
}

const TRIMMED_SHA_LIMIT = 7

export const getTrimmedSha = (sha: string): string => {
  return sha.slice(0, TRIMMED_SHA_LIMIT)
}

export const createCommitFilterFromSHA = (
  commitSHA: string | undefined,
  commits: TypesCommit[] | undefined,
  defaultFilter: CommitFilterItemProps
): CommitFilterItemProps[] => {
  if (commitSHA && commits) {
    const matchingCommit = commits.find(commit => commit.sha === commitSHA)
    if (matchingCommit) {
      return [
        {
          name: matchingCommit.title || `Commit ${commitSHA.substring(0, 7)}`,
          count: 1,
          value: commitSHA
        }
      ]
    }
  }
  return [defaultFilter]
}
