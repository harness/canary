import { InputFactory } from '@harnessio/forms'

import { AccordionFormInput, AccordionFormInputDefinition } from '../accordion-form-input'
import { ArrayFormInput, ArrayFormInputDefinition } from '../array-input'
import { BooleanFormInput, BooleanFormInputDefinition } from '../boolean-form-input'
import { CalendarFormInputDefinition, CalendarInput } from '../calendar-form-input'
import { CardsFormInput, CardsFormInputDefinition } from '../cards-form-input'
import { GroupFormInput, GroupFormInputDefinition } from '../group-form-input'
import { ListFormInput, ListFormInputDefinition } from '../list-form-input'
import { NumberFormInput, NumberFormInputDefinition } from '../number-form-input'
import { SelectFormInput, SelectFormInputDefinition } from '../select-form-input'
import { SeparatorFormInput, SeparatorFormInputDefinition } from '../separator-form-input'
import { TextFormInput, TextFormInputDefinition } from '../text-form-input'
import { TextareaFormInput, TextareaFormInputDefinition } from '../textarea-form-input'

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
inputComponentFactory.registerComponent(new AccordionFormInput())

type InputDefinition =
  | TextFormInputDefinition
  | TextareaFormInputDefinition
  | SeparatorFormInputDefinition
  | SelectFormInputDefinition
  | NumberFormInputDefinition
  | ListFormInputDefinition
  | GroupFormInputDefinition
  | CardsFormInputDefinition
  | CalendarFormInputDefinition
  | BooleanFormInputDefinition
  | ArrayFormInputDefinition
  | AccordionFormInputDefinition

export { inputComponentFactory }
export type { InputDefinition }
