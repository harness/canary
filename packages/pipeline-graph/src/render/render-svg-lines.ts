import { AnyNodeInternal } from '..'

export type CreateSVGPathType = typeof createSVGPath

export function clear(svgGroup: SVGElement) {
  svgGroup.innerHTML = ''
}

export function getPortsConnectionPath({
  pipelineGraphRoot,
  connection,
  customCreateSVGPath,
  edgesConfig = {}
}: {
  pipelineGraphRoot: HTMLDivElement
  connection: {
    source: string
    target: string
    targetNode?: AnyNodeInternal
    parallel?: {
      position: 'left' | 'right'
    }
    serial?: {
      position: 'left' | 'right'
    }
  }
  customCreateSVGPath?: CreateSVGPathType
  edgesConfig?: {
    radius?: number
    parallelNodeOffset?: number
    serialNodeOffset?: number
  }
}) {
  const edgesConfigWithDefaults = {
    radius: 10,
    parallelNodeOffset: 10,
    serialNodeOffset: 10,
    ...edgesConfig
  }

  const { source, target, parallel, serial, targetNode } = connection

  const fromEl = document.getElementById(source)
  const toEl = document.getElementById(target)

  if (!fromEl || !toEl) return { level1: '', level2: '' }

  const fromElBB = fromEl.getBoundingClientRect()
  const toElBB = toEl.getBoundingClientRect()

  const pipelineGraphRootBB = pipelineGraphRoot?.getBoundingClientRect() ?? new DOMRect(0, 0)

  const pathObj = getPath({
    startX: fromElBB.left - pipelineGraphRootBB.left,
    startY: fromElBB.top - pipelineGraphRootBB.top,
    endX: toElBB.left - pipelineGraphRootBB.left,
    endY: toElBB.top - pipelineGraphRootBB.top,
    portAdjustment: fromElBB.height / 2, // center of circle
    parallel,
    serial,
    targetNode,
    edgesConfig: edgesConfigWithDefaults
  })

  return customCreateSVGPath
    ? customCreateSVGPath({ targetNode, id: `${source}-${target}`, ...pathObj })
    : createSVGPath({ targetNode, id: `${source}-${target}`, ...pathObj })
}

function getHArcConfig(direction: 'down' | 'up', r: number) {
  if (direction === 'down') {
    return {
      arc: `a${r},${r} 0 0 1 ${r},${r}`,
      hCorrection: r,
      vCorrection: r
    }
  } else {
    return {
      arc: `a${r},-${r} 0 0 0 ${r},-${r}`,
      hCorrection: r,
      vCorrection: -r
    }
  }
}

function getVArcConfig(direction: 'down' | 'up', r: number) {
  if (direction === 'down') {
    return {
      arc: `a${r},${r} 0 0 0 ${r},${r}`,
      hCorrection: r,
      vCorrection: r
    }
  } else {
    return {
      arc: `a${r},-${r} 0 0 1 ${r},-${r}`,
      hCorrection: r,
      vCorrection: -r
    }
  }
}

function getPath({
  startX,
  startY,
  endX,
  endY,
  parallel,
  serial,
  edgesConfig,
  portAdjustment
}: {
  startX: number
  startY: number
  endX: number
  endY: number
  portAdjustment: number
  parallel?: {
    position: 'left' | 'right'
  }
  serial?: {
    position: 'left' | 'right'
  }
  edgeClassName?: string
  targetNode?: AnyNodeInternal
  edgesConfig: {
    radius: number
    parallelNodeOffset: number
    serialNodeOffset: number
  }
}) {
  let path = ''

  // NOTE: approximate line length (arc is not included in calc)
  let pathLength = 0
  if (startY === endY) {
    path = 'M ' + (startX + portAdjustment) + ' ' + (startY + portAdjustment) + ' ' + 'H ' + (endX + portAdjustment)
    pathLength = endX - startX
  } else {
    // reduce radius avoid broken line
    const xyMinForRadius = Math.min(Math.abs(endY - startY) / 2, Math.abs(endX - startX) / 2)
    const radius = Math.min(edgesConfig.radius, xyMinForRadius)

    const totalHDistance = endX - startX
    const halfHDistance = totalHDistance / 2
    let absArcStart = endX - halfHDistance - radius

    if (parallel?.position === 'right') {
      absArcStart = endX - radius * 2 - edgesConfig.parallelNodeOffset
    }
    if (parallel?.position === 'left') {
      absArcStart = startX + edgesConfig.parallelNodeOffset
    }
    if (serial?.position === 'right') {
      absArcStart = endX - radius * 2 - edgesConfig.serialNodeOffset
    }
    if (serial?.position === 'left') {
      absArcStart = startX + edgesConfig.serialNodeOffset
    }

    const { arc } = getHArcConfig(endY + portAdjustment > startY + portAdjustment ? 'down' : 'up', radius)

    const { arc: arc2, vCorrection: vCorrection2 } = getVArcConfig(
      endY + portAdjustment > startY + portAdjustment ? 'down' : 'up',
      radius
    )

    path =
      'M ' +
      (startX + portAdjustment) +
      ' ' +
      (startY + portAdjustment) +
      ' ' +
      'H ' +
      (absArcStart + portAdjustment) +
      arc +
      'V ' +
      (endY + portAdjustment - vCorrection2) +
      arc2 +
      'H ' +
      (endX + portAdjustment)

    pathLength = Math.abs(endX - startX) + Math.abs(endY - startY)
  }

  return { path, pathLength }
}

function createSVGPath({
  path,
  id,
  pathLength,
  targetNode
}: {
  path: string
  id: string
  pathLength: number
  targetNode?: AnyNodeInternal
}): {
  level1: string
  level2: string
} {
  const pathStyle = targetNode?.data.state === 'executed' ? ` stroke="#43b5e6"` : ` stroke="#5D5B65"`
  const staticPath = `<path d="${path}" id="${id}" fill="none" ${pathStyle} />`

  let animationPath: string = ''
  if (targetNode?.data.state === 'executing') {
    animationPath = `<path d="${path}" id="${id}" fill="none" stroke="#43b5e6" class="PipelineGraph-AnimatePath" stroke-dasharray="${pathLength}" stroke-dashoffset="${pathLength}" />`
  }

  return { level1: staticPath, level2: animationPath }
}
