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

          return (
            <BreadcrumbItem key={idx}>
              {isLast ? (
                <BreadcrumbPage>{path}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild>
                    <Link to={parentPath}>{path}</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator>/</BreadcrumbSeparator>
                </>
              )}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export { PathParts, PathBreadcrumbs }
