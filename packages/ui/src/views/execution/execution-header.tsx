import { Link } from 'react-router-dom'

import { Button, Icon, Text } from '@/components'
import { Spacer } from 'dist/components'

interface ExecutionHeaderProps {
  commitName: string
  branchName: string
  title: { number: string; title: string }
}

export const ExecutionHeader: React.FC<ExecutionHeaderProps> = ({ commitName, branchName, title }) => {
  return (
    <div className="flex w-full items-center justify-between border-b border-default px-6 py-4">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button variant="secondary" size="xs" asChild>
            <Link to="/">
              <Icon name="tube-sign" size={12} className="mr-1 text-tertiary-background" />
              {commitName}
            </Link>
          </Button>
          <span className="text-foreground-1"> to </span>
          <Button variant="secondary" size="xs" asChild>
            <Link to="/">
              <Icon name="branch" size={12} className="mr-1 text-tertiary-background" />
              {branchName}
            </Link>
          </Button>
        </div>
        <Text size={5}>
          <span className="text-foreground-5">{title.number} </span>
          <span className="text-primary">{title.title}</span>
        </Text>
      </div>
      <div className="flex items-end gap-12 h-full">
        <div className="flex flex-col">
          <span className="text-foreground-5">Storage</span>
          <span className="text-primary">0 B</span>
        </div>
        <div className="flex flex-col">
          <span className="text-foreground-5">Storage (average)</span>
          <span className="text-primary">0 B / 250 MB</span>
        </div>
        <div className="flex flex-col">
          <span className="text-foreground-5">Simple Operation</span>
          <span className="text-primary">27/100k</span>
        </div>
        <div className="flex flex-col">
          <span className="text-foreground-5">Advanced Operations</span>
          <span className="text-primary">2/50k</span>
        </div>
        <div className="flex flex-col">
          <span className="text-foreground-5">Data Transfer</span>
          <span className="text-primary">4.21 kB/5 GB</span>
        </div>
      </div>
    </div>
  )
}
