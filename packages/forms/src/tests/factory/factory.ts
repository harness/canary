import { InputFactory } from '../../core'
import { GroupFormInput } from '../inputs/group-form-input/group-form-input'
import { TextFormInput } from '../inputs/text-form-input/text-form-input'

const inputComponentFactory = new InputFactory()
inputComponentFactory.registerComponent(new TextFormInput())
inputComponentFactory.registerComponent(new GroupFormInput())

export default inputComponentFactory
