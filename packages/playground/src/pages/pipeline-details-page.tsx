import React from 'react'
import { Outlet } from 'react-router-dom'
import PipelineDetails from '../components/pipeline-details'

export default function PipelineDetailsPage() {
  return (
    <>
      <Outlet />
      <PipelineDetails />
    </>
  )
}
