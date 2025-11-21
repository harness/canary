import { Layout, Sidebar } from '@/components'

import Header from './header'

export const SidebarLayout = ({
  sidebar,
  chat,
  mainContent
}: {
  sidebar: React.ReactNode
  chat: React.ReactNode
  mainContent: React.ReactNode
}) => {
  return (
    <Layout.Flex className="w-full" direction="column">
      <Header />
      <Layout.Grid columns="auto 1fr">
        {sidebar}

        <Sidebar.Inset className="bg-cn-1 grid grid-cols-[auto_1fr] border border-l-0 rounded-t-cn-3 cn-content-full-height mr-cn-2xs">
          <div className="overflow-y-auto overflow-x-hidden">{chat}</div>
          <div className="overflow-y-auto overflow-x-hidden">{mainContent}</div>
        </Sidebar.Inset>
      </Layout.Grid>
    </Layout.Flex>
  )
}
