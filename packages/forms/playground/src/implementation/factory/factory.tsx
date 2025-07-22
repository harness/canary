import { InputFactory } from '../../../../src'
import { ArrayInput } from '../inputs/array-input'
import { CheckboxInput } from '../inputs/checkbox-input'
import { GroupInput } from '../inputs/group-input'
import { IntegerInput } from '../inputs/integer-input'
import { ListInput } from '../inputs/list-input'
import { SelectInput } from '../inputs/select-input'
import { TextInput } from '../inputs/text-input'

const inputComponentFactory = new InputFactory()
inputComponentFactory.registerComponent(new TextInput())
inputComponentFactory.registerComponent(new CheckboxInput())
inputComponentFactory.registerComponent(new IntegerInput())
inputComponentFactory.registerComponent(new SelectInput())
inputComponentFactory.registerComponent(new ArrayInput())
inputComponentFactory.registerComponent(new ListInput())
inputComponentFactory.registerComponent(new GroupInput())

export default inputComponentFactory
