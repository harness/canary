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
  }
) {
  const { source, target, parallel, serial } = connection

  const fromEl = document.getElementById(source)
  const toEl = document.getElementById(target)

  if (!fromEl || !toEl) return ''

  const fromElBB = fromEl.getBoundingClientRect()
  const toElBB = toEl.getBoundingClientRect()

  const pipelineGraphRootBB = pipelineGraphRoot?.getBoundingClientRect() ?? new DOMRect(0, 0)

  const pathHtml = getPath(
    `${source}-${target}`,
    fromElBB.left - pipelineGraphRootBB.left,
    fromElBB.top - pipelineGraphRootBB.top,
    toElBB.left - pipelineGraphRootBB.left,
    toElBB.top - pipelineGraphRootBB.top,
    parallel,
    serial
  )

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

function getPath(
  id: string,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  parallel?: {
    position: 'left' | 'right'
  },
  serial?: {
    position: 'left' | 'right'
  }
) {
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

  // TODO: line style (color)
  return `<path d="${path}" id="${id}" fill="none" stroke="#5D5B65" />`
}
