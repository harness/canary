import { Layout, LinkProps, Text, TextProps } from '@/components'

interface CommitTitleWithPRLinkProps {
  commitMessage?: string
  title?: string
  toPullRequest?: ({ pullRequestId }: { pullRequestId: number }) => string
  Link: React.ComponentType<LinkProps>
  textVariant?: TextProps['variant']
  textClassName?: string
}

export const CommitTitleWithPRLink = (props: CommitTitleWithPRLinkProps) => {
  const { Link, textVariant, commitMessage, textClassName, title, toPullRequest } = props

  if (!commitMessage) return null

  const match = commitMessage.match(/\(#\d+\)(\n|$)/)

  if (match?.length && toPullRequest) {
    const pullRequestId = match[0].replace('(#', '').replace(')', '').replace('\n', '')
    const pullRequestIdInt = parseInt(pullRequestId)

    if (!isNaN(pullRequestIdInt)) {
      const pieces = commitMessage.split(match[0])
      const piecesEls = pieces.map(piece => {
        return (
          <Text variant={textVariant} className={textClassName} truncate title={title} key={piece}>
            {piece}
          </Text>
        )
      })
      piecesEls.splice(
        1,
        0,
        <Text variant={textVariant} className={textClassName}>
          <Layout.Flex>
            &nbsp;(
            <Link
              // className="hover:underline"
              title={title}
              to={`${toPullRequest?.({ pullRequestId: pullRequestIdInt })}`}
              variant="secondary"
            >
              #{pullRequestId}
            </Link>
            )&nbsp;
          </Layout.Flex>
        </Text>
      )

      return <Layout.Flex>{piecesEls}</Layout.Flex>
    }
  }

  return (
    <Text variant={textVariant} className={textClassName} truncate title={title}>
      {commitMessage}
    </Text>
  )
}

CommitTitleWithPRLink.displayName = 'CommitTitleWithPRLink'
