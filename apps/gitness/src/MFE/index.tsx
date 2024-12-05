import { useEffect } from 'react'
import { Link, Redirect, Route, Switch, useHistory, useLocation, useParams } from 'react-router-dom'

export default function ConfigMFE() {
  const location = useLocation()
  useEffect(() => {
    console.log('location', location)
  }, [])
  return (
    <>
      <Link to="test">Test link</Link>
      <Link to="repo-list">Repo List</Link>
      <Link to="signin">Sign In</Link>
    </>
  )
}
