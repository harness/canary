import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu'
import { Icon } from './icon'

interface ProjectProps {
  projects: {
    title: string
    icon?: React.ReactElement<SVGSVGElement>
  }[]
  name: string
  avatar: React.ReactElement<SVGSVGElement>
}

function Root({ projects, avatar, name }: ProjectProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="select-none outline-none">
        <div className="grid grid-cols-[auto_1fr_auto] w-full items-center gap-2.5 justify-items-start">
          <div className="navbar-company-avatar flex items-center bg-secondary-foreground rounded-full p-1">
            {avatar}
          </div>
          <p className="text-[15px] font-medium text-primary truncate" aria-label={name}>
            {name || 'Choose project'}
          </p>
          <Icon name="chevron-down" className="nav-company-badge-chevron h-2.5 w-2.5 shrink-0 text-primary" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px] p-0 mt-3">
        {projects.map((project, project_idx) => (
          <DropdownMenuItem key={project_idx}>
            {project.icon && project.icon}
            {project.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { Root }
