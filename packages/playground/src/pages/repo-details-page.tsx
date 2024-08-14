import React from 'react'
import { Outlet } from 'react-router-dom'

export default function RepoDetails() {
  return (
    <>
      <Outlet />
      <div>Repo Details</div>
    </>
  )
}
