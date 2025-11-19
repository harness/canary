import { Layout, Link, Text, TextProps } from '@harnessio/ui/components'

interface CommitTitleWithPRLinkProps {
  commitMessage?: string
  title?: string
  toPullRequest?: ({ pullRequestId }: { pullRequestId: number }) => string
  textProps?: Omit<TextProps, 'ref'>
}

export const CommitTitleWithPRLink = (props: CommitTitleWithPRLinkProps) => {
  const { textProps, commitMessage, title, toPullRequest } = props

  if (!commitMessage) return null

  const match = commitMessage.match(/\(#\d+\)(\n|$)/)

  if (match?.length && toPullRequest) {
    const pullRequestId = match[0].replace('(#', '').replace(')', '').replace('\n', '')
    const pullRequestIdInt = parseInt(pullRequestId)

    if (!isNaN(pullRequestIdInt)) {
      const pieces = commitMessage
        .split(match[0])
        .filter(el => el.trim() !== '')
        .map((piece, index) => {
          if (index === 0) {
            return (
              <Text {...textProps} truncate title={title} key={piece}>
                {piece}
              </Text>
            )
          }

          return (
            <Text {...textProps} key={piece}>
              &nbsp;(
              <Link
                title={title}
                to={`${toPullRequest?.({ pullRequestId: pullRequestIdInt })}`}
                className="[font:inherit]"
              >
                #{pullRequestId}
              </Link>
              )&nbsp;
            </Text>
          )
        })

      return <Layout.Flex className="min-w-0">{pieces}</Layout.Flex>
    }
  }

  return (
    <Text {...textProps} truncate title={title}>
      {commitMessage}
    </Text>
  )
}

CommitTitleWithPRLink.displayName = 'CommitTitleWithPRLink'
