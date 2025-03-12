import { ComponentType } from 'react'

import { AppProvider } from '../framework/context/AppContext'
import { ExplorerPathsProvider } from '../framework/context/ExplorerPathsContext'
import { RepoBranchesListPage } from '../pages-v2/repo/repo-branch-list'
import { RepoCode } from '../pages-v2/repo/repo-code'
import RepoCommitsPage from '../pages-v2/repo/repo-commits'
import { CreateRepo } from '../pages-v2/repo/repo-create-page'
import { ImportMultipleRepos } from '../pages-v2/repo/repo-import-multiple-container'
import { ImportRepo } from '../pages-v2/repo/repo-import-page'
import RepoLayout from '../pages-v2/repo/repo-layout'
import ReposListPage from '../pages-v2/repo/repo-list'
import { RepoSidebar } from '../pages-v2/repo/repo-sidebar'
import RepoSummaryPage from '../pages-v2/repo/repo-summary'
import { AppShell } from './components/app-shell'

export const getRoutes = ({
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
  <Route
    path={`${pathPrefix}/`}
    render={() => (
      <AppProvider>
        <AppShell>
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
        </AppShell>
      </AppProvider>
    )}
  />
)
