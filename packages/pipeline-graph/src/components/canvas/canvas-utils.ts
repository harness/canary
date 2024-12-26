export interface MousePoint {
  clientX: number
  clientY: number
}

interface CalculateTransformArgs {
  originX?: number
  originY?: number
  panX?: number
  panY?: number
  scaleDiff?: number
  currentTranslateX?: number
  currentTranslateY?: number
  currentScale?: number
}

export function calculateTransform(args: CalculateTransformArgs = {}) {
  const {
    originX = 0,
    originY = 0,
    panX = 0,
    panY = 0,
    scaleDiff = 1,
    currentTranslateX = 0,
    currentTranslateY = 0,
    currentScale = 1
  } = args

  const matrix = new DOMMatrix()
    .translate(panX, panY)
    .translate(originX, originY)
    .translate(currentTranslateX, currentTranslateY)
    .scale(scaleDiff)
    .translate(-originX, -originY)
    .scale(currentScale)

  return {
    translateX: matrix.e,
    translateY: matrix.f,
    scale: matrix.a
  }
}
