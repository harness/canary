import * as React from 'react'
import { Pagination } from '@harnessio/ui'

export function WithPageNumbers() {
  return <div style={{ width: 640, padding: 16 }}><Pagination showPageNumbers currentPage={3} totalItems={240} pageSize={20} goToPage={() => {}} /></div>
}
export function PrevNext() {
  return <div style={{ width: 640, padding: 16 }}><Pagination indeterminate hasPrevious hasNext onPrevious={() => {}} onNext={() => {}} /></div>
}
export function FirstPage() {
  return <div style={{ width: 640, padding: 16 }}><Pagination indeterminate hasPrevious={false} hasNext onNext={() => {}} /></div>
}
