const RADIUS = 7
const PARALLEL_LINE_OFFSET = 15
const SERIAL_LINE_OFFSET = 10

export function clear(svgGroup: SVGElement) {
  svgGroup.innerHTML = ''
}

export function getPortsConnectionPath(
  pipelineGraphRoot: HTMLDivElement,
  connection: {
    source: string
    target: string
    parallel?: {
      position: 'left' | 'right'
    }
    serial?: {
      position: 'left' | 'right'
    }
  },
  edgeClassName?: string
) {
  const { source, target, parallel, serial } = connection

  const fromEl = document.getElementById(source)
  const toEl = document.getElementById(target)

  if (!fromEl || !toEl) return ''

  const fromElBB = fromEl.getBoundingClientRect()
  const toElBB = toEl.getBoundingClientRect()

  const pipelineGraphRootBB = pipelineGraphRoot?.getBoundingClientRect() ?? new DOMRect(0, 0)

  const pathHtml = getPath({
    id: `${source}-${target}`,
    startX: fromElBB.left - pipelineGraphRootBB.left,
    startY: fromElBB.top - pipelineGraphRootBB.top,
    endX: toElBB.left - pipelineGraphRootBB.left,
    endY: toElBB.top - pipelineGraphRootBB.top,
    parallel,
    serial,
    edgeClassName
  })

  return pathHtml
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
  id,
  startX,
  startY,
  endX,
  endY,
  parallel,
  serial,
  edgeClassName
}: {
  id: string
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
}) {
  const correction = 3

  let path = ''

  if (startY === endY) {
    path = 'M ' + (startX + correction) + ' ' + (startY + correction) + ' ' + 'H ' + (endX + correction)
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
  }

  // NOTE: if edgeClassName is not provided use hardcoded color
  const pathStyle = edgeClassName ? ` class="${edgeClassName}"` : ` stroke="#5D5B65"`

  return `<path d="${path}" id="${id}" fill="none" ${pathStyle}/>`
}
