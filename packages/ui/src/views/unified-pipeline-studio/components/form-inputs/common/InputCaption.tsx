import { FormCaption } from '@components/index'

export interface InputCaptionProps {
  error?: string
  caption?: string
}

const InputCaption = ({ error, caption }: InputCaptionProps) => {
  if (error) {
    return <FormCaption theme="danger">{error}</FormCaption>
  }

  return caption ? <FormCaption>{caption}</FormCaption> : null
}
InputCaption.displayName = 'InputCaption'

export { InputCaption }
