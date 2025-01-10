import { FC } from 'react'

import { MarkdownViewer } from '@harnessio/ui/components'

export interface CodeBlockProps {
  code: string
  language?: string
}

const CodeBlock: FC<CodeBlockProps> = ({ code, language = 'typescript tsx' }) => (
  <MarkdownViewer
    source={`
\`\`\`${language}
${code}
\`\`\`
`}
  />
)

export default CodeBlock
