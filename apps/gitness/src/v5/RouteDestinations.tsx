import { ComponentType } from 'react'

import { EmptyPage, RepoSettingsLayout } from '@harnessio/ui/views'

import { AppProvider } from '../framework/context/AppContext'
import { ExplorerPathsProvider } from '../framework/context/ExplorerPathsContext'
import { useTranslationStore } from '../i18n/stores/i18n-store'
import PullRequestChanges from '../pages-v2/pull-request/pull-request-changes'
import { PullRequestCommitPage } from '../pages-v2/pull-request/pull-request-commits'
import { CreatePullRequest } from '../pages-v2/pull-request/pull-request-compare'
import PullRequestConversationPage from '../pages-v2/pull-request/pull-request-conversation'
import PullRequestDataProvider from '../pages-v2/pull-request/pull-request-data-provider'
import PullRequestLayout from '../pages-v2/pull-request/pull-request-layout'
import PullRequestListPage from '../pages-v2/pull-request/pull-request-list'
import { RepoLabelFormContainer } from '../pages-v2/repo/labels/label-form-container'
import { RepoLabelsList } from '../pages-v2/repo/labels/labels-list-container'
import { RepoBranchesListPage } from '../pages-v2/repo/repo-branch-list'
import { RepoBranchSettingsRulesPageContainer } from '../pages-v2/repo/repo-branch-rules-container'
import { RepoCode } from '../pages-v2/repo/repo-code'
import RepoCommitDetailsPage from '../pages-v2/repo/repo-commit-details'
import RepoCommitsPage from '../pages-v2/repo/repo-commits'
import { CreateRepo } from '../pages-v2/repo/repo-create-page'
import { ImportMultipleRepos } from '../pages-v2/repo/repo-import-multiple-container'
import { ImportRepo } from '../pages-v2/repo/repo-import-page'
import RepoLayout from '../pages-v2/repo/repo-layout'
import ReposListPage from '../pages-v2/repo/repo-list'
import { RepoSettingsGeneralPageContainer } from '../pages-v2/repo/repo-settings-general-container'
import { RepoSidebar } from '../pages-v2/repo/repo-sidebar'
import RepoSummaryPage from '../pages-v2/repo/repo-summary'
import { RepoTagsListContainer } from '../pages-v2/repo/repo-tags-list-container'
import { CreateWebhookContainer } from '../pages-v2/webhooks/create-webhook-container'
import WebhookListPage from '../pages-v2/webhooks/webhook-list'
import { PathParams } from '../RouteDefinitions'
import { AppShell } from './components/app-shell'
import { getCreateRepoPath, getImportMultipleReposPath, getImportRepoPath, getReposListPath } from './RouteDefinitions'

interface RouterMatchInterface {
  match: { params: PathParams }
}

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
            <Route path={getReposListPath(pathPrefix)} exact render={() => <ReposListPage />} />
            <Route path={getCreateRepoPath(pathPrefix)} render={() => <CreateRepo />} />
            <Route path={getImportRepoPath(pathPrefix)} render={() => <ImportRepo />} />
            <Route path={getImportMultipleReposPath(pathPrefix)} render={() => <ImportMultipleRepos />} />
            <Route
              path={`${pathPrefix}/repos/:repoId`}
              render={({ match }: RouterMatchInterface) => (
                <RepoLayout>
                  <Switch>
                    <Route
                      path={`${pathPrefix}/repos/:repoId`}
                      exact
                      render={() => <Redirect to={`${pathPrefix}/repos/${match.params.repoId}/summary`} />}
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
                                    render={({ match }: RouterMatchInterface) => (
                                      <Redirect
                                        to={`${pathPrefix}/repos/${match.params.repoId}/pulls/${match.params.pullRequestId}/conversation`}
                                      />
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
                    <Route
                      path={`${pathPrefix}/repos/:repoId/settings`}
                      render={() => (
                        <RepoSettingsLayout useTranslationStore={useTranslationStore}>
                          <Switch>
                            <Route
                              path={`${pathPrefix}/repos/:repoId/settings`}
                              exact
                              render={({ match }: RouterMatchInterface) => (
                                <Redirect to={`${pathPrefix}/repos/${match.params.repoId}/settings/general`} />
                              )}
                            />
                            <Route
                              path={`${pathPrefix}/repos/:repoId/settings/general`}
                              render={() => <RepoSettingsGeneralPageContainer />}
                            />
                            <Route
                              path={`${pathPrefix}/repos/:repoId/settings/rules`}
                              render={() => (
                                <Switch>
                                  <Route
                                    path={`${pathPrefix}/repos/:repoId/settings/rules`}
                                    exact
                                    render={() => <RepoSettingsGeneralPageContainer />}
                                  />
                                  <Route
                                    path={`${pathPrefix}/repos/:repoId/settings/rules/create`}
                                    render={() => <RepoBranchSettingsRulesPageContainer />}
                                  />
                                  <Route
                                    path={`${pathPrefix}/repos/:repoId/settings/rules/:identifier`}
                                    render={() => <RepoBranchSettingsRulesPageContainer />}
                                  />
                                </Switch>
                              )}
                            />
                            <Route
                              path={`${pathPrefix}/repos/:repoId/settings/webhooks`}
                              render={() => (
                                <Switch>
                                  <Route
                                    path={`${pathPrefix}/repos/:repoId/settings/webhooks`}
                                    exact
                                    render={() => <WebhookListPage />}
                                  />
                                  <Route
                                    path={`${pathPrefix}/repos/:repoId/settings/webhooks/create`}
                                    render={() => <CreateWebhookContainer />}
                                  />
                                </Switch>
                              )}
                            />
                            <Route
                              path={`${pathPrefix}/repos/:repoId/settings/labels`}
                              render={() => (
                                <Switch>
                                  <Route
                                    path={`${pathPrefix}/repos/:repoId/settings/labels`}
                                    exact
                                    render={() => <RepoLabelsList />}
                                  />
                                  <Route
                                    path={`${pathPrefix}/repos/:repoId/settings/labels/create`}
                                    render={() => <RepoLabelFormContainer />}
                                  />
                                  <Route
                                    path={`${pathPrefix}/repos/:repoId/settings/labels/:labelId`}
                                    render={() => <RepoLabelFormContainer />}
                                  />
                                </Switch>
                              )}
                            />
                          </Switch>
                        </RepoSettingsLayout>
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
