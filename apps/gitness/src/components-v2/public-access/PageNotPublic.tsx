import { Layout, Text } from '@harnessio/ui/components'

interface PageNotPublicProps {
  currentPath?: string
}

const PageNotPublic = ({ currentPath: _currentPath }: PageNotPublicProps) => {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <Layout.Vertical className="space-y-6 text-center">
        <Text variant="heading-section" color="foreground-1">
          Oops! This page is not public
        </Text>
      </Layout.Vertical>
    </div>
  )
}

export default PageNotPublic
