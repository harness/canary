import React from 'react'
import { Outlet } from 'react-router-dom'

export default function PipelineDetails() {
  return (
    <>
      <Outlet />
      <div>Pipeline Details</div>
    </>
  )
}
