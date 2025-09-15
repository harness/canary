import tailwind from './tailwind-design-system'

const distPath = `${__dirname}/**/*.js`
export const uiTailwindPreset = (content: string[]) => {
  return {
    ...tailwind,
    content: [...content, distPath]
  }
}

export default tailwind
