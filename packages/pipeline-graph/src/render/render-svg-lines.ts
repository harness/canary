import { AnyNodeInternal } from '..'

const RADIUS = 7
const PARALLEL_LINE_OFFSET = 15
const SERIAL_LINE_OFFSET = 10

export type CreateSVGPathType = typeof createSVGPath

export function clear(svgGroup: SVGElement) {
  svgGroup.innerHTML = ''
}

export function getPortsConnectionPath({
  pipelineGraphRoot,
  connection,
  customCreateSVGPath
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
}) {
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
    parallel,
    serial,
    targetNode
  })

  return customCreateSVGPath
    ? customCreateSVGPath({ targetNode, id: `${source}-${target}`, ...pathObj })
    : createSVGPath({ targetNode, id: `${source}-${target}`, ...pathObj })
}

function getHArcConfig(direction: 'down' | 'up') {
  if (direction === 'down') {
    return {
      arc: `a${RADIUS},${RADIUS} 0 0 1 ${RADIUS},${RADIUS}`,
      hCorrection: 7,
      vCorrection: 7
    }
  } else {
    return {
      arc: `a${RADIUS},-${RADIUS} 0 0 0 ${RADIUS},-${RADIUS}`,
      hCorrection: 7,
      vCorrection: -7
    }
  }
}

function getVArcConfig(direction: 'down' | 'up') {
  if (direction === 'down') {
    return {
      arc: `a${RADIUS},${RADIUS} 0 0 0 ${RADIUS},${RADIUS}`,
      hCorrection: 7,
      vCorrection: 7
    }
  } else {
    return {
      arc: `a${RADIUS},-${RADIUS} 0 0 1 ${RADIUS},-${RADIUS}`,
      hCorrection: 7,
      vCorrection: -7
    }
  }
}

function getPath({
  startX,
  startY,
  endX,
  endY,
  parallel,
  serial
}: {
  startX: number
  startY: number
  endX: number
  endY: number
  parallel?: {
    position: 'left' | 'right'
  }
  serial?: {
    position: 'left' | 'right'
  }
  edgeClassName?: string
  targetNode?: AnyNodeInternal
}) {
  const correction = 3

  let path = ''

  // NOTE: approximate line length
  let pathLength = 0
  if (startY === endY) {
    path = 'M ' + (startX + correction) + ' ' + (startY + correction) + ' ' + 'H ' + (endX + correction)
    pathLength = endX - startX
  } else {
    const diff = endX - startX

    let hMiddle = startX + diff / 2
    if (parallel?.position === 'right') {
      hMiddle = startX + diff - PARALLEL_LINE_OFFSET * 2 - RADIUS * 2
    }
    if (parallel?.position === 'left') {
      hMiddle = startX + PARALLEL_LINE_OFFSET
    }
    if (serial?.position === 'right') {
      hMiddle = startX + diff - SERIAL_LINE_OFFSET - RADIUS * 2
    }
    if (serial?.position === 'left') {
      hMiddle = startX + SERIAL_LINE_OFFSET - RADIUS * 2
    }

    const { arc, hCorrection, vCorrection } = getHArcConfig(endY + correction > startY + correction ? 'down' : 'up')

    const {
      arc: arc2,
      hCorrection: hCorrection2,
      vCorrection: vCorrection2
    } = getVArcConfig(endY + correction > startY + correction ? 'down' : 'up')

    path =
      'M ' +
      (startX + correction) +
      ' ' +
      (startY + correction) +
      ' ' +
      'H ' +
      (hMiddle + correction + hCorrection) + //- 6
      arc +
      'V ' +
      (endY + correction - vCorrection2) + //- 6
      arc2 +
      'H ' +
      (endX + correction)

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
