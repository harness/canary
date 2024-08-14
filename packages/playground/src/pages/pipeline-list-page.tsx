import React from 'react'
import PipelineList from '../components/pipeline-list/pipeline-list'
import { Outlet } from 'react-router-dom'

export default function PipelineListPage() {
  return (
    <>
      <Outlet />
      <PipelineList />
    </>
  )
}
