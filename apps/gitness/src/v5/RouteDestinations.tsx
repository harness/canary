import { ComponentType } from 'react'

import { EmptyPage } from '@harnessio/ui/views'

import { AppProvider } from '../framework/context/AppContext'
import { ExplorerPathsProvider } from '../framework/context/ExplorerPathsContext'
import PullRequestChanges from '../pages-v2/pull-request/pull-request-changes'
import { PullRequestCommitPage } from '../pages-v2/pull-request/pull-request-commits'
import { CreatePullRequest } from '../pages-v2/pull-request/pull-request-compare'
import PullRequestConversationPage from '../pages-v2/pull-request/pull-request-conversation'
import PullRequestDataProvider from '../pages-v2/pull-request/pull-request-data-provider'
import PullRequestLayout from '../pages-v2/pull-request/pull-request-layout'
import PullRequestListPage from '../pages-v2/pull-request/pull-request-list'
import { RepoBranchesListPage } from '../pages-v2/repo/repo-branch-list'
import { RepoCode } from '../pages-v2/repo/repo-code'
import RepoCommitDetailsPage from '../pages-v2/repo/repo-commit-details'
import RepoCommitsPage from '../pages-v2/repo/repo-commits'
import { CreateRepo } from '../pages-v2/repo/repo-create-page'
import { ImportMultipleRepos } from '../pages-v2/repo/repo-import-multiple-container'
import { ImportRepo } from '../pages-v2/repo/repo-import-page'
import RepoLayout from '../pages-v2/repo/repo-layout'
import ReposListPage from '../pages-v2/repo/repo-list'
import { RepoSidebar } from '../pages-v2/repo/repo-sidebar'
import RepoSummaryPage from '../pages-v2/repo/repo-summary'
import { RepoTagsListContainer } from '../pages-v2/repo/repo-tags-list-container'
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
                          <RepoSidebar>
                            <Switch>
                              <Route path={`${pathPrefix}/repos/:repoId/code`} exact render={() => <RepoCode />} />
                              <Route path={`${pathPrefix}/repos/:repoId/code/*`} render={() => <RepoCode />} />
                            </Switch>
                          </RepoSidebar>
                        </ExplorerPathsProvider>
                      )}
                    />
                    <Route
                      path={`${pathPrefix}/repos/:repoId/commits`}
                      render={() => (
                        <Switch>
                          <Route
                            path={`${pathPrefix}/repos/:repoId/commits`}
                            exact
                            render={() => <RepoCommitsPage />}
                          />
                          <Route
                            path={`${pathPrefix}/repos/:repoId/commits/:commitSHA`}
                            exact
                            render={() => <RepoCommitDetailsPage showSidebar={false} />}
                          />
                        </Switch>
                      )}
                    />
                    <Route path={`${pathPrefix}/repos/:repoId/branches`} render={() => <RepoBranchesListPage />} />
                    <Route path={`${pathPrefix}/repos/:repoId/tags`} render={() => <RepoTagsListContainer />} />
                    <Route
                      path={`${pathPrefix}/repos/:repoId/pulls`}
                      render={() => (
                        <Switch>
                          <Route
                            path={`${pathPrefix}/repos/:repoId/pulls`}
                            exact
                            render={() => <PullRequestListPage />}
                          />
                          <Route
                            path={`${pathPrefix}/repos/:repoId/pulls/compare`}
                            exact
                            render={() => <CreatePullRequest />}
                          />
                          <Route
                            path={`${pathPrefix}/repos/:repoId/pulls/compare/:diffRefs`}
                            render={() => <CreatePullRequest />}
                          />
                          <Route
                            path={`${pathPrefix}/repos/:repoId/pulls/:pullRequestId`}
                            render={() => (
                              <PullRequestLayout>
                                <Switch>
                                  <Route
                                    path={`${pathPrefix}/repos/:repoId/pulls/:pullRequestId`}
                                    exact
                                    render={() => (
                                      <Redirect to={`${pathPrefix}/repos/:repoId/pulls/:pullRequestId/conversation`} />
                                    )}
                                  />
                                  <Route
                                    path={`${pathPrefix}/repos/:repoId/pulls/:pullRequestId/conversation`}
                                    render={() => (
                                      <PullRequestDataProvider>
                                        <PullRequestConversationPage />
                                      </PullRequestDataProvider>
                                    )}
                                  />
                                  <Route
                                    path={`${pathPrefix}/repos/:repoId/pulls/:pullRequestId/commits`}
                                    render={() => <PullRequestCommitPage />}
                                  />
                                  <Route
                                    path={`${pathPrefix}/repos/:repoId/pulls/:pullRequestId/changes`}
                                    render={() => (
                                      <PullRequestDataProvider>
                                        <PullRequestChanges />
                                      </PullRequestDataProvider>
                                    )}
                                  />
                                  <Route
                                    path={`${pathPrefix}/repos/:repoId/pulls/:pullRequestId/checks`}
                                    render={() => <EmptyPage pathName="PR Checks" />}
                                  />
                                </Switch>
                              </PullRequestLayout>
                            )}
                          />
                        </Switch>
                      )}
                    />
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
