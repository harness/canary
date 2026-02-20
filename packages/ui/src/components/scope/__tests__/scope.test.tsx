import { ScopeType } from '@/types'
import { render } from '@testing-library/react'

import { getScopeType, ScopeTag, scopeTypeToIconMap } from '../scope-tag'
import { determineScope, getScopedPath } from '../utils'

describe('ScopeTag', () => {
  describe('Basic Rendering', () => {
    test('should render Account scope tag', () => {
      const { container } = render(<ScopeTag scopeType={ScopeType.Account} />)
      const tag = container.querySelector('[class*="tag"]')
      expect(tag).toBeInTheDocument()
    })

    test('should render Organization scope tag', () => {
      const { container } = render(<ScopeTag scopeType={ScopeType.Organization} />)
      const tag = container.querySelector('[class*="tag"]')
      expect(tag).toBeInTheDocument()
    })

    test('should render Project scope tag', () => {
      const { container } = render(<ScopeTag scopeType={ScopeType.Project} />)
      const tag = container.querySelector('[class*="tag"]')
      expect(tag).toBeInTheDocument()
    })

    test('should render Repository scope tag', () => {
      const { container } = render(<ScopeTag scopeType={ScopeType.Repository} />)
      const tag = container.querySelector('[class*="tag"]')
      expect(tag).toBeInTheDocument()
    })
  })

  describe('Scoped Path', () => {
    test('should display scoped path when provided', () => {
      const { container } = render(<ScopeTag scopeType={ScopeType.Organization} scopedPath="org-name" />)
      const tag = container.querySelector('[class*="tag"]')
      expect(tag).toBeInTheDocument()
    })

    test('should use empty string when scopedPath is not provided', () => {
      const { container } = render(<ScopeTag scopeType={ScopeType.Project} />)
      const tag = container.querySelector('[class*="tag"]')
      expect(tag).toBeInTheDocument()
    })

    test('should handle empty scopedPath string', () => {
      const { container } = render(<ScopeTag scopeType={ScopeType.Repository} scopedPath="" />)
      const tag = container.querySelector('[class*="tag"]')
      expect(tag).toBeInTheDocument()
    })
  })

  describe('Account Scope', () => {
    test('should render Account scope with Account value', () => {
      const { container } = render(<ScopeTag scopeType={ScopeType.Account} />)
      const tag = container.querySelector('[class*="tag"]')
      expect(tag).toBeInTheDocument()
    })

    test('should use Account icon', () => {
      expect(scopeTypeToIconMap[ScopeType.Account]).toBe('account')
    })

    test('should ignore scopedPath for Account scope', () => {
      const { container } = render(<ScopeTag scopeType={ScopeType.Account} scopedPath="custom-path" />)
      const tag = container.querySelector('[class*="tag"]')
      expect(tag).toBeInTheDocument()
    })
  })

  describe('Organization Scope', () => {
    test('should render Organization scope with scopedPath', () => {
      const { container } = render(<ScopeTag scopeType={ScopeType.Organization} scopedPath="my-org" />)
      const tag = container.querySelector('[class*="tag"]')
      expect(tag).toBeInTheDocument()
    })

    test('should use organizations icon', () => {
      expect(scopeTypeToIconMap[ScopeType.Organization]).toBe('organizations')
    })
  })

  describe('Project Scope', () => {
    test('should render Project scope with scopedPath', () => {
      const { container } = render(<ScopeTag scopeType={ScopeType.Project} scopedPath="my-project" />)
      const tag = container.querySelector('[class*="tag"]')
      expect(tag).toBeInTheDocument()
    })

    test('should use project icon', () => {
      expect(scopeTypeToIconMap[ScopeType.Project]).toBe('project')
    })
  })

  describe('Repository Scope', () => {
    test('should render Repository scope with scopedPath', () => {
      const { container } = render(<ScopeTag scopeType={ScopeType.Repository} scopedPath="my-repo" />)
      const tag = container.querySelector('[class*="tag"]')
      expect(tag).toBeInTheDocument()
    })

    test('should use repository icon', () => {
      expect(scopeTypeToIconMap[ScopeType.Repository]).toBe('repository')
    })
  })

  describe('Size Prop', () => {
    test('should accept size prop', () => {
      const { container } = render(<ScopeTag scopeType={ScopeType.Project} size="sm" />)
      const tag = container.querySelector('[class*="tag"]')
      expect(tag).toBeInTheDocument()
    })

    test('should handle different size values', () => {
      const sizes = ['sm', 'md'] as const
      sizes.forEach(size => {
        const { container, unmount } = render(<ScopeTag scopeType={ScopeType.Organization} size={size} />)
        const tag = container.querySelector('[class*="tag"]')
        expect(tag).toBeInTheDocument()
        unmount()
      })
    })
  })

  describe('ClassName Prop', () => {
    test('should apply custom className', () => {
      const { container } = render(<ScopeTag scopeType={ScopeType.Project} className="custom-class" />)
      const tag = container.querySelector('[class*="tag"]')
      expect(tag).toBeInTheDocument()
    })

    test('should handle empty className', () => {
      const { container } = render(<ScopeTag scopeType={ScopeType.Repository} className="" />)
      const tag = container.querySelector('[class*="tag"]')
      expect(tag).toBeInTheDocument()
    })
  })

  describe('Default Case', () => {
    test('should render default tag for unknown scope type', () => {
      const { container } = render(<ScopeTag scopeType={'unknown' as ScopeType} />)
      const tag = container.querySelector('[class*="tag"]')
      expect(tag).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle all scope types', () => {
      const scopeTypes = [ScopeType.Account, ScopeType.Organization, ScopeType.Project, ScopeType.Repository]
      scopeTypes.forEach(scopeType => {
        const { container, unmount } = render(<ScopeTag scopeType={scopeType} />)
        const tag = container.querySelector('[class*="tag"]')
        expect(tag).toBeInTheDocument()
        unmount()
      })
    })

    test('should handle very long scopedPath', () => {
      const longPath = 'a'.repeat(100)
      const { container } = render(<ScopeTag scopeType={ScopeType.Organization} scopedPath={longPath} />)
      const tag = container.querySelector('[class*="tag"]')
      expect(tag).toBeInTheDocument()
    })

    test('should handle special characters in scopedPath', () => {
      const { container } = render(<ScopeTag scopeType={ScopeType.Project} scopedPath="org/project-name" />)
      const tag = container.querySelector('[class*="tag"]')
      expect(tag).toBeInTheDocument()
    })
  })
})

describe('scopeTypeToIconMap', () => {
  test('should map Account to account icon', () => {
    expect(scopeTypeToIconMap[ScopeType.Account]).toBe('account')
  })

  test('should map Organization to organizations icon', () => {
    expect(scopeTypeToIconMap[ScopeType.Organization]).toBe('organizations')
  })

  test('should map Project to project icon', () => {
    expect(scopeTypeToIconMap[ScopeType.Project]).toBe('project')
  })

  test('should map Repository to repository icon', () => {
    expect(scopeTypeToIconMap[ScopeType.Repository]).toBe('repository')
  })

  test('should have all scope types mapped', () => {
    const scopeTypes = Object.values(ScopeType)
    scopeTypes.forEach(scopeType => {
      expect(scopeTypeToIconMap[scopeType]).toBeDefined()
    })
  })
})

describe('getScopeType', () => {
  test('should return Repository for scope 0', () => {
    expect(getScopeType(0)).toBe(ScopeType.Repository)
  })

  test('should return Account for scope 1', () => {
    expect(getScopeType(1)).toBe(ScopeType.Account)
  })

  test('should return Organization for scope 2', () => {
    expect(getScopeType(2)).toBe(ScopeType.Organization)
  })

  test('should return Project for scope 3', () => {
    expect(getScopeType(3)).toBe(ScopeType.Project)
  })

  test('should return Account as default for unknown scope', () => {
    expect(getScopeType(999)).toBe(ScopeType.Account)
  })

  test('should return Account for negative scope', () => {
    expect(getScopeType(-1)).toBe(ScopeType.Account)
  })

  test('should handle all valid scope values', () => {
    expect(getScopeType(0)).toBe(ScopeType.Repository)
    expect(getScopeType(1)).toBe(ScopeType.Account)
    expect(getScopeType(2)).toBe(ScopeType.Organization)
    expect(getScopeType(3)).toBe(ScopeType.Project)
  })
})

describe('determineScope', () => {
  test('should return Account for 2-part path (accountId/repoIdentifier)', () => {
    const result = determineScope({
      accountId: 'account123',
      repoIdentifier: 'repo456',
      repoPath: 'account123/repo456'
    })
    expect(result).toBe(ScopeType.Account)
  })

  test('should return Organization for 3-part path (accountId/org/repoIdentifier)', () => {
    const result = determineScope({
      accountId: 'account123',
      repoIdentifier: 'repo456',
      repoPath: 'account123/org789/repo456'
    })
    expect(result).toBe(ScopeType.Organization)
  })

  test('should return Project for 4-part path (accountId/org/project/repoIdentifier)', () => {
    const result = determineScope({
      accountId: 'account123',
      repoIdentifier: 'repo456',
      repoPath: 'account123/org789/project101/repo456'
    })
    expect(result).toBe(ScopeType.Project)
  })

  test('should return undefined for path that does not match any pattern', () => {
    const result = determineScope({
      accountId: 'account123',
      repoIdentifier: 'repo456',
      repoPath: 'different-account/repo456'
    })
    expect(result).toBeUndefined()
  })

  test('should return undefined for path with wrong accountId', () => {
    const result = determineScope({
      accountId: 'account123',
      repoIdentifier: 'repo456',
      repoPath: 'wrong-account/repo456'
    })
    expect(result).toBeUndefined()
  })

  test('should return undefined for path with wrong repoIdentifier', () => {
    const result = determineScope({
      accountId: 'account123',
      repoIdentifier: 'repo456',
      repoPath: 'account123/wrong-repo'
    })
    expect(result).toBeUndefined()
  })

  test('should return undefined for path with more than 4 parts', () => {
    const result = determineScope({
      accountId: 'account123',
      repoIdentifier: 'repo456',
      repoPath: 'account123/org/project/extra/repo456'
    })
    expect(result).toBeUndefined()
  })

  test('should return undefined for path with less than 2 parts', () => {
    const result = determineScope({
      accountId: 'account123',
      repoIdentifier: 'repo456',
      repoPath: 'account123'
    })
    expect(result).toBeUndefined()
  })

  test('should handle empty strings', () => {
    const result = determineScope({
      accountId: '',
      repoIdentifier: '',
      repoPath: ''
    })
    expect(result).toBeUndefined()
  })

  test('should handle paths with special characters', () => {
    const result = determineScope({
      accountId: 'account-123',
      repoIdentifier: 'repo_456',
      repoPath: 'account-123/repo_456'
    })
    expect(result).toBe(ScopeType.Account)
  })
})

describe('getScopedPath', () => {
  test('should remove accountId and repoIdentifier from 2-part path', () => {
    const result = getScopedPath({
      accountId: 'account123',
      repoIdentifier: 'repo456',
      repoPath: 'account123/repo456'
    })
    expect(result).toBe('')
  })

  test('should remove accountId and repoIdentifier from 3-part path', () => {
    const result = getScopedPath({
      accountId: 'account123',
      repoIdentifier: 'repo456',
      repoPath: 'account123/org789/repo456'
    })
    expect(result).toBe('org789')
  })

  test('should remove accountId and repoIdentifier from 4-part path', () => {
    const result = getScopedPath({
      accountId: 'account123',
      repoIdentifier: 'repo456',
      repoPath: 'account123/org789/project101/repo456'
    })
    expect(result).toBe('org789/project101')
  })

  test('should handle path with accountId appearing multiple times', () => {
    const result = getScopedPath({
      accountId: 'account123',
      repoIdentifier: 'repo456',
      repoPath: 'account123/account123/repo456'
    })
    expect(result).toBe('')
  })

  test('should handle path with repoIdentifier appearing multiple times', () => {
    const result = getScopedPath({
      accountId: 'account123',
      repoIdentifier: 'repo456',
      repoPath: 'account123/repo456/repo456'
    })
    expect(result).toBe('')
  })

  test('should handle path where accountId or repoIdentifier are not present', () => {
    const result = getScopedPath({
      accountId: 'account123',
      repoIdentifier: 'repo456',
      repoPath: 'other1/other2/other3'
    })
    expect(result).toBe('other1/other2/other3')
  })

  test('should handle empty strings', () => {
    const result = getScopedPath({
      accountId: '',
      repoIdentifier: '',
      repoPath: ''
    })
    expect(result).toBe('')
  })

  test('should handle path with only accountId', () => {
    const result = getScopedPath({
      accountId: 'account123',
      repoIdentifier: 'repo456',
      repoPath: 'account123'
    })
    expect(result).toBe('')
  })

  test('should handle path with only repoIdentifier', () => {
    const result = getScopedPath({
      accountId: 'account123',
      repoIdentifier: 'repo456',
      repoPath: 'repo456'
    })
    expect(result).toBe('')
  })

  test('should preserve order of remaining parts', () => {
    const result = getScopedPath({
      accountId: 'account123',
      repoIdentifier: 'repo456',
      repoPath: 'account123/part1/part2/part3/repo456'
    })
    expect(result).toBe('part1/part2/part3')
  })
})
