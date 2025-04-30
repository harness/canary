import { InputFactory } from '@harnessio/forms'

import { ArrayInput } from '../ArrayInput'
import { BooleanInput } from '../BooleanInput'
import { CalendarInput } from '../calendar-form-input'
import { GroupInput } from '../GroupInput'
import { ListInput } from '../ListInput'
import { NumberInput } from '../NumberInput'
import { RadialInput } from '../RadialInput'
import { SelectInput } from '../SelectInput'
import { SeparatorInput } from '../Separator'
import { TextAreaInput } from '../TextAreaInput'
import { TextInput } from '../TextInput'

const inputComponentFactory = new InputFactory()
inputComponentFactory.registerComponent(new TextInput())
inputComponentFactory.registerComponent(new BooleanInput())
inputComponentFactory.registerComponent(new NumberInput())
inputComponentFactory.registerComponent(new ArrayInput())
inputComponentFactory.registerComponent(new ListInput())
inputComponentFactory.registerComponent(new TextAreaInput())
inputComponentFactory.registerComponent(new GroupInput())
inputComponentFactory.registerComponent(new SelectInput())
inputComponentFactory.registerComponent(new SeparatorInput())
inputComponentFactory.registerComponent(new RadialInput())
inputComponentFactory.registerComponent(new CalendarInput())

export { inputComponentFactory }
