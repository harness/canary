import { Fragment } from 'react'
import { Link } from 'react-router-dom'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components'

interface PathParts {
  path: string
  parentPath: string
}

interface PathBreadcrumbsProps {
  items: PathParts[]
}

const PathBreadcrumbs = ({ items }: PathBreadcrumbsProps) => {
  const length = items.length

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map(({ parentPath, path }, idx) => {
          const isLast = length === idx + 1

          if (isLast) {
            return (
              <BreadcrumbItem key={idx}>
                <BreadcrumbPage>{path}</BreadcrumbPage>
              </BreadcrumbItem>
            )
          }

          return (
            <Fragment key={idx}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={parentPath}>{path}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export { PathParts, PathBreadcrumbs }
