import { createContext, useContext } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  useParams,
  Outlet,
  useLocation,
  renderMatches,
  matchRoutes,
} from "react-router-dom";

function PipelineListPage() {
    const scope = useContext(ScopeContext)

    return <div>
      Pipelines in scope "{scope}"
      <ul>
        <li><Link to="a/b/c/+/pipelines/1">Pipeline 1</Link></li>
        <li><Link to="a/b/c/+/pipelines/2">Pipeline 2</Link></li>
        <li><Link to="a/b/c/+/pipelines/3">Pipeline 3</Link></li>
      </ul>
      </div>
}

function PipelineDetailsPage() {
  const { pipelineId } = useParams()
  const scope = useContext(ScopeContext)
  return <div>Pipeline ID: {pipelineId} in scope "{scope}"</div>
}

export const ScopeContext = createContext('');

function Parent() {
  const location = useLocation()
  const match = location.pathname.match(/^\/(.*)\/\+\/(.*)/)
  const scope = match ? match[1] : '';
  
  return (
    <div>
      <h2>Scope Provider</h2>
      <ScopeContext.Provider value={scope}>
        <div style={{ padding: '50px' }}>
          {renderMatches(matchRoutes(
            [
              {
                path: 'pipelines',
                element: <PipelineListPage />,
              },
              {
                path: 'pipelines/:pipelineId',
                element: <PipelineDetailsPage />
              }
            ],
            location,
            "/" + scope + "/+/",
          ))}
        </div>
      </ScopeContext.Provider>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <h1>Hello World</h1>
        <Link to="a/b/c/+/pipelines">Pipelines</Link>
        <Link to="a/b/c/+/pipelines/123">Pipeline Details</Link>
        <div style={{ padding: '50px' }}>
          <Outlet />
        </div>
      </div>
    ),
    children: [
      {
        path: "*",
        element: <Parent />
      }
    ]
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App
