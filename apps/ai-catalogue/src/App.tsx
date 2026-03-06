import { FC, useMemo } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { AssistantRuntime, AssistantRuntimeProvider } from '@harnessio/ai-chat-core'
import { defaultPlugin } from '@harnessio/ai-chat-components'

import { Layout } from './components/layout'
import { CataloguePage } from './pages/catalogue/catalogue-page'
import { ComposerPage } from './pages/composer/composer-page'
import { PlaygroundPage } from './pages/playground/playground-page'
import { CatalogueMockStreamAdapter } from './plugin/adapters/mock-stream-adapter'
import { DrawerCapability } from './plugin/capabilities/drawer-capability'
import { NavigateCapability } from './plugin/capabilities/navigate-capability'
import { ConfirmCapability } from './plugin/capabilities/confirm-capability'

function GlobalCapabilities() {
  return (
    <>
      <DrawerCapability />
      <NavigateCapability />
      <ConfirmCapability />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/catalogue', element: <CataloguePage /> },
      { path: '/composer', element: <ComposerPage /> },
      { path: '/playground', element: <PlaygroundPage /> },
      { path: '/*', element: <Navigate to="/catalogue" /> }
    ]
  }
])

const App: FC = () => {
  const runtime = useMemo(() => {
    return new AssistantRuntime({
      streamAdapter: new CatalogueMockStreamAdapter(),
      plugins: [defaultPlugin]
    })
  }, [])

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <GlobalCapabilities />
      <RouterProvider router={router} />
    </AssistantRuntimeProvider>
  )
}

export default App
