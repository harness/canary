import { MarkdownViewer } from '@/components/markdown-viewer'
import { SandboxLayout } from '@/views'

import { Alert, Button, Layout, NoData, Text } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

interface RepoEmptyViewProps {
  repoName: string
  projName: string
  httpUrl: string
  sshUrl: string
  gitRef: string
  defaultBranchName: string
  tokenGenerationError?: string
  handleCreateToken: () => void
  navigateToProfileKeys?: () => void
}

export const RepoEmptyView: React.FC<RepoEmptyViewProps> = ({
  repoName,
  projName,
  httpUrl,
  sshUrl,
  gitRef,
  defaultBranchName,
  tokenGenerationError,
  handleCreateToken,
  navigateToProfileKeys
}) => {
  const { t } = useTranslation()

  const getInitialCommitMarkdown = () => {
    return `
\`\`\`shell
cd ${repoName}
git branch -M ${defaultBranchName}
echo '# Hello World' >> README.md
git add README.md
git commit -m 'Initial commit'
git push -u origin ${defaultBranchName}
\`\`\`
`
  }

  const getExistingRepoMarkdown = () => {
    return `
\`\`\`shell
git remote add origin ${httpUrl}
git branch -M ${defaultBranchName}
git push -u origin ${defaultBranchName}
\`\`\`
`
  }

  const renderHTTPUrl = () => `
\`\`\`
${httpUrl}
\`\`\`
    `

  const renderSSHUrl = () => `
\`\`\`
${sshUrl}
\`\`\`
  `

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content className="mx-auto max-w-[772px]">
        <Layout.Grid gapY="xl">
          <Layout.Grid gapY="md">
            <Text variant="heading-section">{t('views:repos.emptyRepoPage.title', 'Repository')}</Text>
            <Text>
              {t(
                'views:repos.emptyRepoPage.subtitle',
                'Follow the instructions below to get started with your repository'
              )}
            </Text>
          </Layout.Grid>

          <NoData
            withBorder
            imageName="no-repository"
            title={t('views:repos.emptyRepoPage.noData.title', 'This repository is empty')}
            description={[
              t('views:repos.emptyRepoPage.noData.description.0', 'We recommend every repository include a'),
              t('views:repos.emptyRepoPage.noData.description.1', 'README, LICENSE, and .gitignrore')
            ]}
            primaryButton={{
              icon: 'plus',
              label: t('views:repos.emptyRepoPage.noData.createFile', 'Create File'),
              to: `${projName ? `/${projName}` : ''}/repos/${repoName}/files/new/${gitRef}/~/`
            }}
            className="py-cn-3xl"
          />

          <Layout.Grid as="section" gapY="md">
            <Text variant="heading-subsection" as="h3">
              {t(
                'views:repos.emptyRepoPage.cloneInstructions.title',
                'Please generate git credentials if it’s your first time cloning the repository'
              )}
            </Text>
            <Text variant="heading-base">
              {t('views:repos.emptyRepoPage.cloneInstructions.subTitle', 'Git clone URL')}
            </Text>

            <Text color="foreground-1">{t('views:repos.emptyRepoPage.cloneInstructions.http', 'HTTP')}</Text>
            <MarkdownViewer source={renderHTTPUrl()} />

            <Text color="foreground-1">{t('views:repos.emptyRepoPage.cloneInstructions.ssh', 'SSH')}</Text>
            <MarkdownViewer source={renderSSHUrl()} />
          </Layout.Grid>

          <Layout.Grid gapY="sm" as="section">
            <Button onClick={handleCreateToken} className="w-fit">
              {t('views:repos.emptyRepoPage.cloneInstructions.generateButton', 'Generate Clone Credential')}
            </Button>

            {tokenGenerationError && (
              <Alert.Root theme="danger">
                <Alert.Description>{tokenGenerationError}</Alert.Description>
              </Alert.Root>
            )}

            <Text>
              {t(
                'views:repos.emptyRepoPage.cloneInstructions.manageCredentials.0',
                'You can also manage your git credential'
              )}{' '}
              <Button variant="link" onClick={navigateToProfileKeys} className="h-fit">
                {t('views:repos.emptyRepoPage.cloneInstructions.manageCredentials.1', 'here')}
              </Button>
            </Text>
          </Layout.Grid>

          <Layout.Grid gapY="md" as="section">
            <Text variant="heading-base" as="h4">
              {t('views:repos.emptyRepoPage.initialCommit', 'Then push some content into it')}
            </Text>
            <MarkdownViewer source={getInitialCommitMarkdown()} />
          </Layout.Grid>

          <Layout.Grid gapY="sm" as="section">
            <Layout.Grid gapY="md">
              <Text variant="heading-subsection" as="h4">
                {t('views:repos.emptyRepoPage.existingRepo.title', 'Or you can push an existing repository')}
              </Text>
              <MarkdownViewer source={getExistingRepoMarkdown()} />
            </Layout.Grid>

            <Text>
              {t('views:repos.emptyRepoPage.cloneInstructions.pushRepository.0', 'You might need to')}{' '}
              <Button variant="link" onClick={navigateToProfileKeys} className="h-fit">
                {t('views:repos.emptyRepoPage.cloneInstructions.pushRepository.1', 'create an API token')}
              </Button>{' '}
              {t(
                'views:repos.emptyRepoPage.cloneInstructions.pushRepository.2',
                'in order to pull from or push into this repository.'
              )}
            </Text>
          </Layout.Grid>
        </Layout.Grid>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
