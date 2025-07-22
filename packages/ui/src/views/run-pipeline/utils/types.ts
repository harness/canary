export type InputLayout = Array<InputName | InputGroup>
type InputName = string

export interface InputGroup {
  items: InputLayout
  title?: string
  open?: boolean
}
