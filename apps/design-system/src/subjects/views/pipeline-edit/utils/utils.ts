export function createRoundedRectPath(x: number, y: number, width: number, height: number, radius: number) {
  return (
    'M' +
    (x + radius) +
    ',' +
    y +
    'h' +
    (width - 2 * radius) +
    'a' +
    radius +
    ',' +
    radius +
    ' 0 0 1 ' +
    radius +
    ',' +
    radius +
    'v' +
    (height - 2 * radius) +
    'a' +
    radius +
    ',' +
    radius +
    ' 0 0 1 ' +
    -radius +
    ',' +
    radius +
    'h' +
    (2 * radius - width) +
    'a' +
    -radius +
    ',' +
    -radius +
    ' 0 0 1 ' +
    -radius +
    ',' +
    -radius +
    'v' +
    (2 * radius - height) +
    'a' +
    radius +
    ',' +
    -radius +
    ' 0 0 1 ' +
    radius +
    ',' +
    -radius +
    'z'
  )
}
