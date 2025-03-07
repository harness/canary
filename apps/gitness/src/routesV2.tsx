import { CustomRouteObject } from './framework/routing/types'

const Home = () => <h2>Home Page</h2>
const About = () => <h2>About Page</h2>
const Services = () => <h2>Services Page</h2>
const WebDevelopment = () => <h3>Web Development</h3>
const MobileDevelopment = () => <h3>Mobile Development</h3>
const Contact = () => <h2>Contact Page</h2>
const NotFound = () => <h2>404 Not Found</h2>

export const routes: CustomRouteObject[] = [
  {
    path: '/',
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'services',
        children: [
          { index: true, element: <Services /> },
          {
            path: 'web',
            children: [
              { index: true, element: <WebDevelopment /> },
              { path: 'react', element: <h2>ReactJS</h2> },
              { path: 'vite', element: <h3>ViteJS</h3> }
            ]
          },
          {
            path: 'mobile',
            children: [
              { index: true, element: <MobileDevelopment /> },
              { path: 'ios', element: <h2>iOS</h2> },
              { path: 'android', element: <h3>Android</h3> }
            ]
          }
        ]
      },
      {
        path: 'contact',
        element: <Contact />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]
