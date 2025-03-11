import { ComponentType } from 'react'

import { AppShellMFE } from './components-v2/app-shell'
import { AppProvider } from './framework/context/AppContext'
import { ExplorerPathsProvider } from './framework/context/ExplorerPathsContext'
import { RepoBranchesListPage } from './pages-v2/repo/repo-branch-list'
import { RepoCode } from './pages-v2/repo/repo-code'
import RepoCommitsPage from './pages-v2/repo/repo-commits'
import { CreateRepo } from './pages-v2/repo/repo-create-page'
import { ImportMultipleRepos } from './pages-v2/repo/repo-import-multiple-container'
import { ImportRepo } from './pages-v2/repo/repo-import-page'
import RepoLayout from './pages-v2/repo/repo-layout'
import ReposListPage from './pages-v2/repo/repo-list'
import { RepoSidebar } from './pages-v2/repo/repo-sidebar'
import RepoSummaryPage from './pages-v2/repo/repo-summary'

interface MatchParams {
  match: { params: { repoId: string } }
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
          <AppShellMFE />
        </AppProvider>
      )}
    />
    <Route path={`${pathPrefix}/repos`} exact render={() => <ReposListPage />} />
    <Route path={`${pathPrefix}/repos/create`} render={() => <CreateRepo />} />
    <Route path={`${pathPrefix}/repos/import`} render={() => <ImportRepo />} />
    <Route path={`${pathPrefix}/repos/import-multiple`} render={() => <ImportMultipleRepos />} />
    <Route
      path={`${pathPrefix}/repos/:repoId`}
      render={({ match: _match }: MatchParams) => (
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
                  <Switch>
                    <Route path={`${pathPrefix}/repos/:repoId/code`} exact render={() => <RepoCode />} />
                    <Route path={`${pathPrefix}/repos/:repoId/code/*`} render={() => <RepoCode />} />
                  </Switch>
                </ExplorerPathsProvider>
              )}
            />
            <Route path={`${pathPrefix}/repos/:repoId/branches`} render={() => <RepoBranchesListPage />} />
            <Route path={`${pathPrefix}/repos/:repoId/commits`} render={() => <RepoCommitsPage />} />
          </Switch>
        </RepoLayout>
      )}
    />
  </Switch>
)
