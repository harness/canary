import './styles/AppMFE.css'

import { ComponentType } from 'react'

import { CodeServiceAPIClient } from '@harnessio/code-service-client'

import { Unknown } from './framework/context/MFEContext'
import { getV5Routes } from './framework/routing/utils'
import { routes as routesV6 } from './routesV2'

export interface MFERouteRendererProps {
  renderUrl: string
  parentLocationPath: string
  onRouteChange: (updatedLocationPathname: string) => void
}

interface AppMFEProps {
  /**
   * These types will be later referred from "ChildComponentProps" from @harness/microfrontends
   *  */
  scope: {
    accountId?: string
    orgIdentifier?: string
    projectIdentifier?: string
  }
  renderUrl: string
  on401?: () => void
  useMFEThemeContext: () => { theme: string }
  parentLocationPath: string
  onRouteChange: (updatedLocationPathname: string) => void
  customComponents: {
    Link: ComponentType<any>
    NavLink: ComponentType<any>
    Route: ComponentType<any>
    Switch: ComponentType<any>
  }
  customHooks: Partial<{
    useLocation: any
    useGenerateToken: Unknown
    useRouteMatch: any
    useParams: any
  }>
  customUtils: Partial<{
    navigate: (path: string | number) => void
    navigateToUserProfile: Unknown
  }>
}

function decode<T = unknown>(arg: string): T {
  return JSON.parse(decodeURIComponent(atob(arg)))
}

export default function AppMFE({
  scope,
  renderUrl,
  on401,
  customComponents: { Link, Switch, Route },
  customHooks: { useParams }
}: AppMFEProps) {
  new CodeServiceAPIClient({
    urlInterceptor: (url: string) =>
      `${window.apiUrl || ''}/code/api/v1${url}${url.includes('?') ? '&' : '?'}routingId=${scope.accountId}`,
    requestInterceptor: (request: Request) => {
      const token = decode(localStorage.getItem('token') || '')
      const newRequest = request.clone()
      newRequest.headers.set('Authorization', `Bearer ${token}`)
      return newRequest
    },
    responseInterceptor: (response: Response) => {
      switch (response.status) {
        case 401:
          on401?.()
          break
      }
      return response
    }
  })

  const Repos = () => (
    <div>
      <h2>Repositories</h2>
      <ul>
        <li>
          <Link to={`${renderUrl}/repos/repo-1`}>Repo 1</Link>
        </li>
        <li>
          <Link to={`${renderUrl}/repos/repo-2`}>Repo 2</Link>
        </li>
        <li>
          <Link to={`${renderUrl}/repos/repo-3`}>Repo 3</Link>
        </li>
      </ul>
    </div>
  )

  // Repo Details Page with tabs
  const RepoDetails = () => {
    const { repoName } = useParams() // Get the repo name from the URL
    return (
      <div>
        <h2>{repoName} - Repo Details</h2>
        <ul>
          <li>
            <Link to={`${renderUrl}/repos/${repoName}/summary`}>Summary</Link>
          </li>
          <li>
            <Link to={`${renderUrl}/repos/${repoName}/files`}>Files</Link>
          </li>
          <li>
            <Link to={`${renderUrl}/repos/${repoName}/pull-requests`}>Pull Requests</Link>
          </li>
          <li>
            <Link to={`${renderUrl}/repos/${repoName}/commits`}>Commits</Link>
          </li>
          <li>
            <Link to={`${renderUrl}/repos/${repoName}/branches`}>Branches</Link>
          </li>
          <li>
            <Link to={`${renderUrl}/repos/${repoName}/settings`}>Settings</Link>
          </li>
        </ul>
        <Switch>
          <Route
            path={`${renderUrl}/repos/:repoName/summary`}
            render={() => (
              <div>
                <h2>Summary</h2>
                <h3>Repository Summary</h3>
              </div>
            )}
          />
          <Route
            path={`${renderUrl}/repos/:repoName/files`}
            render={() => (
              <div>
                <h2>Files</h2>
                <h3>Repository files</h3>
              </div>
            )}
          />
          <Route
            path={`${renderUrl}/repos/:repoName/pull-requests`}
            render={() => (
              <div>
                <h2>Pull Requests</h2>
                <h3>Repository pull requests</h3>
              </div>
            )}
          />
          <Route
            path={`${renderUrl}/repos/:repoName/commits`}
            render={() => (
              <div>
                <h2>Commits</h2>
                <h3>Repository commits</h3>
              </div>
            )}
          />
          <Route
            path={`${renderUrl}/repos/:repoName/branches`}
            render={() => (
              <div>
                <h2>Branches</h2>
                <h3>Repository branches</h3>
              </div>
            )}
          />
          <Route
            path={`${renderUrl}/repos/:repoName/settings`}
            render={() => (
              <div>
                <h2>Settings</h2>
                <h3>Repository settings</h3>
              </div>
            )}
          />
        </Switch>
      </div>
    )
  }

  // Not Found Page
  const NotFound = () => <h2>404 - Page Not Found</h2>

  const Layout = () => (
    <div>
      <nav>
        <ul>
          <li>
            <Link to={`${renderUrl}/repos`}>Repos</Link>
          </li>
        </ul>
      </nav>
      <hr />
      {/* Replacement for <Outlet /> */}
      <Switch>
        <Route exact path={`${renderUrl}/repos`} component={Repos} />
        <Route path={`${renderUrl}/repos/:repoName`} component={RepoDetails} />
        <Route component={NotFound} />
      </Switch>
    </div>
  )

  return <Layout />
  // const routes = getV5Routes({ Route, Switch, routesV6, renderUrl })
  // return <Switch>{routes}</Switch>
}
