import {
  Alert,
  Button,
  ButtonLayout,
  ControlGroup,
  CopyButton,
  Fieldset,
  FormSeparator,
  Input,
  MarkdownViewer,
  NoData,
  Spacer,
  Text
} from '@/components'
import { SandboxLayout } from '@/views'

interface RepoEmptyViewProps {
  repoName: string
  projName: string
  httpUrl: string
  sshUrl: string
  gitRef: string
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
  tokenGenerationError,
  handleCreateToken,
  navigateToProfileKeys
}) => {
  const getInitialCommitMarkdown = () => {
    return `
\`\`\`shell
cd ${repoName}
git branch -M main
echo '# Hello World' >> README.md                                                     
git add README.md
git commit -m 'Initial commit'
git push -u origin main
\`\`\`
`
  }

  const getExistingRepoMarkdown = () => {
    return `
\`\`\`shell
git remote add origin http://localhost:3000/git/${projName}/${repoName}.git                     
git branch -M main
git push -u origin main
\`\`\`
`
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content className="mx-auto max-w-[850px]">
        <Text variant="heading-section">Repository</Text>
        <Spacer size={6} />
        <NoData
          withBorder
          imageName="no-repository"
          title="This repository is empty"
          description={['We recommend every repository include a', 'README, LICENSE, and .gitignore.']}
          primaryButton={{
            label: 'New file',
            to: `${projName ? `/${projName}` : ''}/repos/${repoName}/code/new/${gitRef}/~/`
          }}
          className="min-h-[40vh] py-0"
        />
        <Spacer size={6} />

        <Fieldset>
          <Text variant="heading-subsection">
            Please Generate Git Cradentials if it’s your first time cloning the repository
          </Text>
          <Text variant="heading-base">Git clone URL</Text>
          <Input label="HTTP" value={httpUrl} readOnly rightElement={<CopyButton name={httpUrl} />} />
          <Input label="SSH" value={sshUrl} readOnly rightElement={<CopyButton name={sshUrl} />} />
          <ControlGroup>
            <ButtonLayout horizontalAlign="start">
              <Button onClick={handleCreateToken}>Generate Clone Credentials</Button>
            </ButtonLayout>
            {tokenGenerationError && (
              <Alert.Root theme="danger" className="mt-2">
                <Alert.Description>{tokenGenerationError}</Alert.Description>
              </Alert.Root>
            )}
            <Text className="mt-2">
              You can also manage your git credential{' '}
              <span
                role="button"
                tabIndex={0}
                className="cn-link cn-link-default cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cn-foreground-accent"
                data-disabled="false"
                onClick={() => navigateToProfileKeys?.()}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    e.stopPropagation()
                  }
                }}
              >
                here.
              </span>
            </Text>
          </ControlGroup>

          <FormSeparator />
          <Text variant="heading-subsection">Then push some content into it</Text>
          <MarkdownViewer source={getInitialCommitMarkdown()} />
          <Text variant="heading-subsection">Or you can push an existing repository</Text>
          <ControlGroup>
            <MarkdownViewer source={getExistingRepoMarkdown()} />
            <p>
              You might need to{' '}
              <span
                role="button"
                tabIndex={0}
                className="hover:underline cn-link cn-link-default cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cn-foreground-accent"
                data-disabled="false"
                onClick={() => navigateToProfileKeys?.()}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    e.stopPropagation()
                  }
                }}
              >
                create an API token
              </span>{' '}
              In order to pull from or push into this repository.
            </p>
          </ControlGroup>
        </Fieldset>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
