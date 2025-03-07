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
  }>
  customUtils: Partial<{
    navigate: (path: string | number) => void
    navigateToUserProfile: Unknown
  }>
}

function decode<T = unknown>(arg: string): T {
  return JSON.parse(decodeURIComponent(atob(arg)))
}

export default function AppMFE({ scope, renderUrl, on401, customComponents: { Link, Switch, Route } }: AppMFEProps) {
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

  const Home = () => <h2>Welcome to the Home Page</h2>
  const About = () => <h2>About Our Company</h2>

  const Services = ({ match }) => (
    <div>
      <h2>Our Services</h2>
      <ul>
        <li>
          <Link to={`${match.url}/web`}>Web Development</Link>
        </li>
        <li>
          <Link to={`${match.url}/mobile`}>Mobile Development</Link>
        </li>
      </ul>
      <Switch>
        <Route exact path={match.path} render={() => <h3>Select a service</h3>} />
        <Route path={`${match.path}/web`} component={WebDevelopment} />
        <Route path={`${match.path}/mobile`} component={MobileDevelopment} />
      </Switch>
    </div>
  )

  const WebDevelopment = ({ match }) => (
    <div>
      <h3>Web Development Services</h3>
      <ul>
        <li>
          <Link to={`${match.url}/react`}>ReactJS</Link>
        </li>
        <li>
          <Link to={`${match.url}/vite`}>ViteJS</Link>
        </li>
      </ul>
      {/* Replacement for <Outlet /> */}
      <Switch>
        <Route exact path={match.path} render={() => <h3>Select a web dev technology</h3>} />
        <Route path={`${match.path}/react`} render={() => <h3>ReactJS Development</h3>} />
        <Route path={`${match.path}/vite`} render={() => <h3>ViteJS Development</h3>} />
      </Switch>
    </div>
  )

  const MobileDevelopment = ({ match }) => (
    <div>
      <h3>Mobile Development Services</h3>
      <ul>
        <li>
          <Link to={`${match.url}/ios`}>iOS</Link>
        </li>
        <li>
          <Link to={`${match.url}/android`}>Android</Link>
        </li>
      </ul>
      {/* Replacement for <Outlet /> */}
      <Switch>
        <Route exact path={match.path} render={() => <h3>Select a mobile dev technology</h3>} />
        <Route path={`${match.path}/ios`} render={() => <h3>iOS Development</h3>} />
        <Route path={`${match.path}/android`} render={() => <h3>Android Development</h3>} />
      </Switch>
    </div>
  )

  const Contact = () => <h2>Contact Us</h2>
  const NotFound = () => <h2>404 - Page Not Found</h2>

  const Layout = () => (
    <div>
      <nav>
        <ul>
          <li>
            <Link to={`${renderUrl}/`}>Home</Link>
          </li>
          <li>
            <Link to={`${renderUrl}/about`}>About</Link>
          </li>
          <li>
            <Link to={`${renderUrl}/services`}>Services</Link>
          </li>
          <li>
            <Link to={`${renderUrl}/contact`}>Contact</Link>
          </li>
        </ul>
      </nav>
      <hr />
      <Switch>
        <Route exact path={`${renderUrl}/`} component={Home} />
        <Route path={`${renderUrl}/about`} component={About} />
        <Route path={`${renderUrl}/services`} component={Services} />
        <Route path={`${renderUrl}/contact`} component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </div>
  )

  // return <Layout />
  const routes = getV5Routes({ Route, Switch, routesV6, renderUrl })
  return <Switch>{routes}</Switch>
}
