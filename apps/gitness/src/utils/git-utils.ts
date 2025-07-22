import langMap from 'lang-map'

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

export const FILE_SEPERATOR = '/'

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

export const decodeGitContent = (content = '') => {
  try {
    // Decode base64 content for text file
    return decodeURIComponent(escape(window.atob(content)))
  } catch (_exception) {
    try {
      // Return original base64 content for binary file
      return content
    } catch (exception) {
      console.error(exception)
    }
  }
  return ''
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

export const isRefATag = (gitRef: string | undefined) => gitRef?.includes(REFS_TAGS_PREFIX) || false
export const isRefABranch = (gitRef: string | undefined) => gitRef?.includes(REFS_BRANCH_PREFIX) || false

// Check if gitRef is a git commit hash (https://github.com/diegohaz/is-git-rev, MIT © Diego Haz)
export const isGitRev = (gitRef = ''): boolean => /^[0-9a-f]{7,40}$/i.test(gitRef)

export const normalizeGitRef = (gitRef: string | undefined) => {
  if (isRefATag(gitRef)) {
    return gitRef
  } else if (isRefABranch(gitRef)) {
    return gitRef
  } else if (gitRef === '') {
    return ''
  } else if (gitRef && isGitRev(gitRef)) {
    return gitRef
  } else {
    return `refs/heads/${gitRef}`
  }
}

const TRIMMED_SHA_LIMIT = 7

export const getTrimmedSha = (sha: string): string => {
  return sha.slice(0, TRIMMED_SHA_LIMIT)
}
