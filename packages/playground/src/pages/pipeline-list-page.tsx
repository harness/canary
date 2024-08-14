import React from 'react'
import { Outlet } from 'react-router-dom'
import PipelineList from '../components/pipeline-list'

export default function PipelineListPage() {
  return (
    <>
      <Outlet />
      <PipelineList />
    </>
  )
}
