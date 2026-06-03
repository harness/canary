import { SearchResultItem } from '@harnessio/views'

import { deriveRepoOptionsFromResults } from '../search-page-utils'

const makeResult = (repoPath: string, fileName = 'foo.ts'): SearchResultItem => ({
  file_name: fileName,
  repo_path: repoPath,
  repo_branch: 'main',
  language: 'typescript',
  matches: []
})

describe('deriveRepoOptionsFromResults', () => {
  it('returns an empty list when there are no results and no selected repo', () => {
    expect(deriveRepoOptionsFromResults([])).toEqual([])
  })

  it('returns one option per unique repo, preserving first-seen order', () => {
    const results = [makeResult('alpha'), makeResult('beta'), makeResult('gamma')]

    expect(deriveRepoOptionsFromResults(results)).toEqual([
      { label: 'alpha', value: 'alpha' },
      { label: 'beta', value: 'beta' },
      { label: 'gamma', value: 'gamma' }
    ])
  })

  it('de-duplicates repos when multiple results come from the same repo', () => {
    const results = [
      makeResult('alpha', 'a.ts'),
      makeResult('beta', 'b.ts'),
      makeResult('alpha', 'a2.ts'),
      makeResult('alpha', 'a3.ts')
    ]

    expect(deriveRepoOptionsFromResults(results)).toEqual([
      { label: 'alpha', value: 'alpha' },
      { label: 'beta', value: 'beta' }
    ])
  })

  it('does not duplicate the selected repo when it is already present in results', () => {
    const results = [makeResult('alpha'), makeResult('beta')]

    expect(deriveRepoOptionsFromResults(results, 'alpha')).toEqual([
      { label: 'alpha', value: 'alpha' },
      { label: 'beta', value: 'beta' }
    ])
  })

  it('prepends the selected repo as a synthetic option when it is missing from the results', () => {
    const results = [makeResult('alpha'), makeResult('beta')]

    expect(deriveRepoOptionsFromResults(results, 'gamma')).toEqual([
      { label: 'gamma', value: 'gamma' },
      { label: 'alpha', value: 'alpha' },
      { label: 'beta', value: 'beta' }
    ])
  })

  it('returns the synthetic selected repo even when results are empty', () => {
    expect(deriveRepoOptionsFromResults([], 'gamma')).toEqual([{ label: 'gamma', value: 'gamma' }])
  })

  it('does not inject a synthetic option when selectedRepoId is null, undefined or empty string', () => {
    const results = [makeResult('alpha')]

    expect(deriveRepoOptionsFromResults(results, null)).toEqual([{ label: 'alpha', value: 'alpha' }])
    expect(deriveRepoOptionsFromResults(results, undefined)).toEqual([{ label: 'alpha', value: 'alpha' }])
    expect(deriveRepoOptionsFromResults(results, '')).toEqual([{ label: 'alpha', value: 'alpha' }])
  })

  it('filters out results with empty repo_path values', () => {
    const results = [makeResult(''), makeResult('alpha'), makeResult('')]

    expect(deriveRepoOptionsFromResults(results)).toEqual([{ label: 'alpha', value: 'alpha' }])
  })
})
