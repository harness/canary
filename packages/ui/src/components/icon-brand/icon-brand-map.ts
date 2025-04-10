/**
 * Brand Icon Map
 *
 * This file maps brand icon names to their corresponding SVG components and default brand background colors.
 * Icons are stored in icons-brands directory.
 */

import GitLabIcon from '../../icons-brands/multicolor/gitlab.svg'
import DockerIcon from '../../icons-brands/simpleicons/docker.svg'

/**
 * Interface for brand icon configuration
 * @property {ComponentType<SVGProps<SVGSVGElement>>} component - SVG component for the icon fromsimpleicons.org
 * @property {string} [backgroundColor] - Brand background color from simpleicons.org
 */
export interface IconBrandConfig {
  component: React.ComponentType<React.SVGProps<SVGSVGElement>>
  backgroundColor?: string
}

/**
 * Map of brand icon names to their SVG component and default background color
 */
export const IconBrandMap = {
  docker: {
    component: DockerIcon,
    backgroundColor: '#2496ED'
  },
  gitlab: {
    component: GitLabIcon
  }
} as const
