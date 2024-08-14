// RootLayout.tsx
import React from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'

const RootLayout: React.FC = () => {
  const location = useLocation()
  const hideNavbarPaths = ['/signin', '/signup']

  const showNavbar = !hideNavbarPaths.includes(location.pathname)

  return (
    <div style={{ display: 'flex' }}>
      {showNavbar && (
        <nav style={{ width: '220px', height: '100vh', padding: '20px', background: '#111' }}>
          <ul>
            <li>
              <NavLink to="/repos" style={({ isActive }) => ({ color: isActive ? 'green' : 'inherit' })}>
                Repositories
              </NavLink>
            </li>
            <li>
              <NavLink to="/pipelines" style={({ isActive }) => ({ color: isActive ? 'green' : 'inherit' })}>
                Pipelines
              </NavLink>
            </li>
            <li>
              <NavLink to="/executions" style={({ isActive }) => ({ color: isActive ? 'green' : 'inherit' })}>
                Executions
              </NavLink>
            </li>
            <hr style={{ marginTop: '20px', marginBottom: '20px' }} />
            <li>
              <NavLink to="/" style={({ isActive }) => ({ color: isActive ? 'green' : 'inherit' })}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/signin" style={({ isActive }) => ({ color: isActive ? 'green' : 'inherit' })}>
                Sign in
              </NavLink>
            </li>
            <li>
              <NavLink to="/sign up" style={({ isActive }) => ({ color: isActive ? 'green' : 'inherit' })}>
                Sign up
              </NavLink>
            </li>
          </ul>
        </nav>
      )}
      <main style={{ flexGrow: 1, padding: '0px' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default RootLayout
