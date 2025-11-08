import { SidebarCollapse } from '@harnessio/ui/components'

export const SideNavWrapper = ({ children }: { children: React.ReactNode }) => (
  // <Sidebar.Provider>
  //   <SidebarLayout
  //     sidebar={<SideNav routes={{ toHome: () => '', toActivity: () => '' }} />}
  //     chat={<ChatV2 />}
  //     mainContent={children}
  //   />
  //   <Toaster position="top-right" duration={3000} />

  // </Sidebar.Provider>
  <SidebarCollapse />
)
