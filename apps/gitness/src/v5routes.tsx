import { ComponentType } from 'react'

import { AppShellMFE } from './components-v2/app-shell'
import { AppProvider } from './framework/context/AppContext'
import { ExplorerPathsProvider } from './framework/context/ExplorerPathsContext'
import { RouteConstants } from './framework/routing/types'
import { RepoCode } from './pages-v2/repo/repo-code'
import { CreateRepo } from './pages-v2/repo/repo-create-page'
import { ImportMultipleRepos } from './pages-v2/repo/repo-import-multiple-container'
import { ImportRepo } from './pages-v2/repo/repo-import-page'
import RepoLayout from './pages-v2/repo/repo-layout'
import ReposListPage from './pages-v2/repo/repo-list'
import { RepoSidebar } from './pages-v2/repo/repo-sidebar'
import RepoSummaryPage from './pages-v2/repo/repo-summary'

enum Page {
  Repositories = 'Repositories',
  Summary = 'Summary',
  Commits = 'Commits',
  Pull_Requests = 'Pull Requests',
  Branches = 'Branches',
  Files = 'Files',
  Conversation = 'Conversation',
  Changes = 'Changes',
  Checks = 'Checks',
  Pipelines = 'Pipelines',
  Executions = 'Executions',
  Settings = 'Settings',
  Branch_Rules = 'Branch Rules',
  Labels = 'Labels',
  Members = 'Members',
  General = 'General',
  Keys = 'Keys',
  Home = 'Home',
  Theme = 'Theme'
}

export const getAppRoutes = ({
  pathPrefix,
  Switch,
  Route,
  Redirect
}: {
  pathPrefix: string
  Switch: ComponentType<any>
  Route: ComponentType<any>
  Redirect: ComponentType<any>
}) => (
  <Switch>
    <Route
      path={`${pathPrefix}/`}
      exact
      render={() => (
        <AppProvider>
          {/* <AppShellMFE /> */}
          <></>
        </AppProvider>
      )}
    />
    <Switch>
      <Route path={`${pathPrefix}/repos`} exact render={() => <ReposListPage />} />
      <Route path={`${pathPrefix}/repos/create`} render={() => <CreateRepo />} />
      <Route path={`${pathPrefix}/repos/import`} render={() => <ImportRepo />} />
      <Route path={`${pathPrefix}/repos/import-multiple`} render={() => <ImportMultipleRepos />} />
      <Route
        path={`${pathPrefix}/repos/:repoId`}
        render={() => (
          <RepoLayout>
            <Switch>
              <Route
                path={`${pathPrefix}/repos/:repoId`}
                exact
                render={() => <Redirect to={`${pathPrefix}/repos/:repoId/summary`} />}
              />
              <Route path={`${pathPrefix}/repos/:repoId/summary`} render={() => <RepoSummaryPage />} />
              <Route
                path={`${pathPrefix}/repos/:repoId/code`}
                render={() => (
                  <ExplorerPathsProvider>
                    <RepoSidebar />
                  </ExplorerPathsProvider>
                )}
              >
                <Switch>
                  <Route path={`${pathPrefix}/repos/:repoId/code`} exact render={() => <RepoCode />} />
                  <Route path={`${pathPrefix}/repos/:repoId/code/*`} render={() => <RepoCode />} />
                </Switch>
              </Route>
            </Switch>
          </RepoLayout>
        )}
      ></Route>
    </Switch>
  </Switch>
)
