import { ScopeType } from '@harnessio/views'

import { checkIsSameScope, getPullRequestUrl, getRepoUrl, getScopeType, prependScopeToUrl } from '../scope-url-utils'

const ACCOUNT_ID = 'acc'

describe('scope-url-utils', () => {
  describe('getScopeType', () => {
    it('returns Account when only accountId is present', () => {
      expect(getScopeType({ accountId: ACCOUNT_ID })).toBe(ScopeType.Account)
    })

    it('returns Organization when accountId and orgIdentifier are present', () => {
      expect(getScopeType({ accountId: ACCOUNT_ID, orgIdentifier: 'org1' })).toBe(ScopeType.Organization)
    })

    it('returns Project when accountId, orgIdentifier and projectIdentifier are present', () => {
      expect(getScopeType({ accountId: ACCOUNT_ID, orgIdentifier: 'org1', projectIdentifier: 'proj1' })).toBe(
        ScopeType.Project
      )
    })
  })

  describe('checkIsSameScope', () => {
    it('returns true when viewing an account-level repo from the account scope', () => {
      expect(
        checkIsSameScope({
          scope: { accountId: ACCOUNT_ID },
          repoIdentifier: 'repoA',
          repoPath: `${ACCOUNT_ID}/repoA`
        })
      ).toBe(true)
    })

    it('returns false when viewing a project-level repo from the account scope (cross-scope)', () => {
      expect(
        checkIsSameScope({
          scope: { accountId: ACCOUNT_ID },
          repoIdentifier: 'repoB',
          repoPath: `${ACCOUNT_ID}/org1/proj1/repoB`
        })
      ).toBe(false)
    })

    it('returns false when viewing an org-level repo from the account scope (cross-scope)', () => {
      expect(
        checkIsSameScope({
          scope: { accountId: ACCOUNT_ID },
          repoIdentifier: 'repoC',
          repoPath: `${ACCOUNT_ID}/org1/repoC`
        })
      ).toBe(false)
    })
  })

  describe('prependScopeToUrl', () => {
    it('prepends org and project segments when account scope views a project repo', () => {
      expect(
        prependScopeToUrl({
          url: '/repos/repoB/files/main',
          scope: { accountId: ACCOUNT_ID },
          orgId: 'org1',
          projectId: 'proj1'
        })
      ).toBe('/orgs/org1/projects/proj1/repos/repoB/files/main')
    })

    it('leaves the url untouched when already in the matching scope', () => {
      expect(
        prependScopeToUrl({
          url: '/repos/repoB/files/main',
          scope: { accountId: ACCOUNT_ID, orgIdentifier: 'org1', projectIdentifier: 'proj1' }
        })
      ).toBe('/repos/repoB/files/main')
    })
  })

  describe('getRepoUrl', () => {
    it('builds a scope-correct branch path for a project repo viewed from the account scope', () => {
      expect(
        getRepoUrl({
          repo: { name: 'repoB', path: `${ACCOUNT_ID}/org1/proj1/repoB` },
          scope: { accountId: ACCOUNT_ID },
          repoSubPath: '/repos/repoB/files/main'
        })
      ).toBe('/orgs/org1/projects/proj1/repos/repoB/files/main')
    })

    it('returns the sub path unchanged for an account repo viewed from the account scope', () => {
      expect(
        getRepoUrl({
          repo: { name: 'repoA', path: `${ACCOUNT_ID}/repoA` },
          scope: { accountId: ACCOUNT_ID },
          repoSubPath: '/repos/repoA/files/main'
        })
      ).toBe('/repos/repoA/files/main')
    })
  })

  describe('getPullRequestUrl', () => {
    it('builds a scope-correct PR path for a project repo viewed from the account scope', () => {
      expect(
        getPullRequestUrl({
          repo: { name: 'repoB', path: `${ACCOUNT_ID}/org1/proj1/repoB` },
          scope: { accountId: ACCOUNT_ID },
          pullRequestSubPath: '/repos/repoB/pulls/1'
        })
      ).toBe('/orgs/org1/projects/proj1/repos/repoB/pulls/1')
    })
  })
})
