import { InputFactory } from '@harnessio/forms'

import { ArrayFormInput } from '../array-input'
import { BooleanFormInput } from '../boolean-form-input'
import { CalendarInput } from '../calendar-form-input'
import { CardsFormInput } from '../cards-form-input'
import { GroupFormInput } from '../group-form-input'
import { ListFormInput } from '../list-form-input'
import { NumberFormInput } from '../number-form-input'
import { SelectFormInput } from '../select-form-input'
import { SeparatorFormInput } from '../separator-form-input'
import { TextFormInput } from '../text-form-input'
import { TextareaFormInput } from '../textarea-form-input'

const inputComponentFactory = new InputFactory()
inputComponentFactory.registerComponent(new TextFormInput())
inputComponentFactory.registerComponent(new TextareaFormInput())
inputComponentFactory.registerComponent(new NumberFormInput())
inputComponentFactory.registerComponent(new BooleanFormInput())
inputComponentFactory.registerComponent(new ArrayFormInput())
inputComponentFactory.registerComponent(new ListFormInput())
inputComponentFactory.registerComponent(new GroupFormInput())
inputComponentFactory.registerComponent(new SelectFormInput())
inputComponentFactory.registerComponent(new SeparatorFormInput())
inputComponentFactory.registerComponent(new CardsFormInput())
inputComponentFactory.registerComponent(new CalendarInput())

export { inputComponentFactory }
