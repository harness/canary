import * as React from 'react'

import CheckCircleSolid from './check-circle-solid.svg'
import CheckCircle from './check-circle.svg'
import Circle from './circle.svg'
import ClockSolid from './clock-solid.svg'
import Clock from './clock.svg'
import FigmaAlert from './figma-alert.svg'
import HelpCircleSolid from './help-circle-solid.svg'
import HelpCircle from './help-circle.svg'
import InfoCircleSolid from './info-circle-solid.svg'
import InfoCircle from './info-circle.svg'
// import Vector from './vector.svg'
// import Vector from './vector.svg'
// import Vector from './vector.svg'
// import Vector from './vector.svg'
// import Vector from './vector.svg'
// import Vector from './vector.svg'
// import Vector from './vector.svg'
// import Vector from './vector.svg'
// import Vector from './vector.svg'
// import Vector from './vector.svg'
// import Vector from './vector.svg'
// import Vector from './vector.svg'
// import Vector from './vector.svg'
import WarningCircleSolid from './warning-circle-solid.svg'
import WarningCircle from './warning-circle.svg'
import WarningTriangleSolid from './warning-triangle-solid.svg'
import WarningTriangle from './warning-triangle.svg'
import XmarkCircleSolid from './xmark-circle-solid.svg'
import XmarkCircle from './xmark-circle.svg'

export const IconNameMapV2 = {
  'check-circle-solid': CheckCircleSolid,
  'check-circle': CheckCircle,
  circle: Circle,
  'clock-solid': ClockSolid,
  clock: Clock,
  'figma-alert': FigmaAlert,
  'help-circle-solid': HelpCircleSolid,
  'help-circle': HelpCircle,
  'info-circle-solid': InfoCircleSolid,
  'info-circle': InfoCircle,
  // vector: Vector,
  // vector: Vector,
  // vector: Vector,
  // vector: Vector,
  // vector: Vector,
  // vector: Vector,
  // vector: Vector,
  // vector: Vector,
  // vector: Vector,
  // vector: Vector,
  // vector: Vector,
  // vector: Vector,
  // vector: Vector,
  'warning-circle-solid': WarningCircleSolid,
  'warning-circle': WarningCircle,
  'warning-triangle-solid': WarningTriangleSolid,
  'warning-triangle': WarningTriangle,
  'xmark-circle-solid': XmarkCircleSolid,
  'xmark-circle': XmarkCircle
} satisfies Record<string, React.FunctionComponent<React.SVGProps<SVGSVGElement>>>
