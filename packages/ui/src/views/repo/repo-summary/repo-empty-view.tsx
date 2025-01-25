import {
  Button,
  ButtonGroup,
  ControlGroup,
  CopyButton,
  Fieldset,
  FormSeparator,
  Input,
  MarkdownViewer,
  NoData,
  Spacer,
  StyledLink,
  Text
} from '@/components'
import { SandboxLayout } from '@/views'

interface RepoEmptyViewProps {
  repoName: string
  projName: string
  httpUrl: string
  sshUrl: string
}

export const RepoEmptyView: React.FC<RepoEmptyViewProps> = ({ repoName, projName, httpUrl, sshUrl }) => {
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
      <SandboxLayout.Content className="max-w-[850px] mx-auto">
        <Text size={5} weight={'medium'}>
          Repository
        </Text>
        <Spacer size={6} />
        <NoData
          withBorder
          iconName="no-repository"
          title="This repository is empty"
          description={['We recommend every repository include a', 'README, LICENSE, and .gitignore.']}
          primaryButton={{ label: 'New file' }}
          className="py-0 pb-0 min-h-[40vh]"
        />
        <Spacer size={6} />

        <Fieldset>
          <Text size={4} weight="medium">
            Please Generate Git Cradentials if it’s your first time cloning the repository
          </Text>
          <Text size={3}>Git clone URL</Text>
          <Input label="HTTP" value={httpUrl} readOnly rightElement={<CopyButton name={httpUrl} />} />
          <Input label="SSH" value={sshUrl} readOnly rightElement={<CopyButton name={sshUrl} />} />
          <ControlGroup>
            <ButtonGroup>
              <Button>Generate Clone Credentials</Button>
            </ButtonGroup>
          </ControlGroup>
          <p>
            You can also manage your git credential{' '}
            <StyledLink to="/" relative="path">
              here
            </StyledLink>
          </p>
          <FormSeparator />
          <Text size={4} weight="medium">
            Then push some content into it
          </Text>
          <MarkdownViewer source={getInitialCommitMarkdown()} />
          <Text size={4} weight="medium">
            Or you can push an existing repository
          </Text>
          <MarkdownViewer source={getExistingRepoMarkdown()} />
        </Fieldset>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
