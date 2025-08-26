// Main MFE exports - these are the microfrontend pages exposed via module federation

export { default as RepositoriesPage } from './mfe-pages/RepositoriesPage'
export { default as ProjectSettingsPage } from './mfe-pages/ProjectSettingsPage'
export { default as SearchPage } from './mfe-pages/SearchPage'
export { default as PullRequestsPage } from './mfe-pages/PullRequestsPage'

// Legacy export for backwards compatibility
export { default as MicroFrontendApp } from './AppMFE'