import { FormEvent, useMemo, useState } from 'react'

import { Alert, Button, Layout, SandboxLayout, Text } from '@harnessio/ui/components'

import { useMFEContext } from '../../framework/hooks/useMFEContext'

const decodeStoredToken = (encodedToken: string): string => {
  try {
    return JSON.parse(decodeURIComponent(atob(encodedToken)))
  } catch {
    return encodedToken
  }
}

export const ProjectManageRepositoriesGeneralPage = () => {
  const { scope } = useMFEContext()
  const [defaultBranch, setDefaultBranch] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      accountIdentifier: scope.accountId || ''
    })

    if (scope.orgIdentifier) {
      params.set('orgIdentifier', scope.orgIdentifier)
    }

    if (scope.projectIdentifier) {
      params.set('projectIdentifier', scope.projectIdentifier)
    }

    if (scope.accountId) {
      params.set('routingId', scope.accountId)
    }

    return params
  }, [scope.accountId, scope.orgIdentifier, scope.projectIdentifier])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const trimmedBranch = defaultBranch.trim()

    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      const rawToken = localStorage.getItem('token')
      const decodedToken = rawToken ? decodeStoredToken(rawToken) : ''

      const headers = new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json'
      })

      if (decodedToken.startsWith('pat.')) {
        headers.set('x-api-key', decodedToken)
      } else if (decodedToken) {
        headers.set('Authorization', `Bearer ${decodedToken}`)
      }

      const response = await fetch(`${window.apiUrl || ''}/code/api/v1/settings/general?${queryParams.toString()}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ default_branch: trimmedBranch })
      })

      if (!response.ok) {
        throw new Error(`Failed to update settings: ${response.status}`)
      }

      setSuccess(trimmedBranch ? 'Default branch updated.' : 'Default branch reset to inherited default.')
    } catch {
      setError('Failed to update default branch. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content className="mx-auto w-full max-w-[880px]">
        <Layout.Vertical gap="lg" className="py-cn-xl">
          <Text variant="heading-section">Repository Settings</Text>
          <Text className="text-cn-2">Set the default branch for repositories at this scope.</Text>

          <form onSubmit={handleSubmit} className="max-w-[420px]">
            <Layout.Vertical gap="sm">
              <label htmlFor="default-branch-input" className="text-cn-1 text-sm font-medium">
                Default branch
              </label>
              <input
                id="default-branch-input"
                type="text"
                value={defaultBranch}
                onChange={e => setDefaultBranch(e.target.value)}
                placeholder="e.g. main or dev"
                className="h-10 rounded-md border border-cn-4 bg-cn-1 px-3 text-cn-2 outline-none focus:border-cn-brand"
              />
              <Layout.Horizontal gap="sm" align="center">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Text className="text-cn-3 text-xs">
                  Scope: {scope.projectIdentifier ? 'Project' : scope.orgIdentifier ? 'Organization' : 'Account'}
                </Text>
              </Layout.Horizontal>
            </Layout.Vertical>
          </form>

          {success && (
            <Alert.Root theme="success">
              <Alert.Description>{success}</Alert.Description>
            </Alert.Root>
          )}
          {error && (
            <Alert.Root theme="danger">
              <Alert.Description>{error}</Alert.Description>
            </Alert.Root>
          )}
        </Layout.Vertical>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}