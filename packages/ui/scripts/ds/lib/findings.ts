export type Severity = 'error' | 'waived'

export interface Finding {
  /** Finding class, e.g. 'schema', 'heading', 'prop-required'. */
  code: string
  /** Stable key a knownGaps entry can waive, e.g. 'prop-required:children'. */
  key: string
  /** Repo-relative file the finding is about. */
  file: string
  /** JSON pointer into the file, or '#L<line>' for Markdown body findings. */
  instancePath: string
  message: string
  severity: Severity
}

export const finding = (
  code: string,
  detail: string,
  file: string,
  instancePath: string,
  message: string
): Finding => ({
  code,
  key: `${code}:${detail}`,
  file,
  instancePath,
  message,
  severity: 'error'
})

export const formatFinding = (f: Finding): string =>
  `${f.severity === 'waived' ? 'waived' : 'error '} [${f.key}] ${f.file} ${f.instancePath || '/'}: ${f.message}`
