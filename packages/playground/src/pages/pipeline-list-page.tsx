import React from 'react'
import { Outlet } from 'react-router-dom'
import PipelineList from './pull-request-list-page'

export default function PipelineListPage() {
  return (
    <>
      <Outlet />
      <PipelineList />
    </>
  )
}
