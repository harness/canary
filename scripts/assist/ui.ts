const paint = (open: number, close: number) => (text: string) =>
  process.stdout.isTTY ? `\x1b[${open}m${text}\x1b[${close}m` : text

export const bold = paint(1, 22)
export const dim = paint(2, 22)
export const red = paint(31, 39)
export const green = paint(32, 39)
export const yellow = paint(33, 39)
export const cyan = paint(36, 39)

export const say = (message = '') => console.log(message)
