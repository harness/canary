import { InputFactory } from '@harnessio/forms'

import { AccordionFormInput } from '../canary-inputs/accordion-form-input/accordion-form-input'
import { ArrayFormInput } from '../canary-inputs/array-form-input/array-form-input'
import { BooleanFormInput } from '../canary-inputs/boolean-form-input/boolean-form-input'
import { GroupFormInput } from '../canary-inputs/group-form-input/group-form-input'
import { ListFormInput } from '../canary-inputs/list-form-input/list-form-input'
import { NumberFormInput } from '../canary-inputs/number-form-input/number-form-input'
import { SelectFormInput } from '../canary-inputs/select-form-input/select-form-input'
import { SlotFormInput } from '../canary-inputs/slot-form-input/slot-form-input'
import { TextFormInput } from '../canary-inputs/text-form-input/text-form-input'

const inputComponentFactory = new InputFactory()
inputComponentFactory.registerComponent(new TextFormInput())
inputComponentFactory.registerComponent(new AccordionFormInput())
inputComponentFactory.registerComponent(new GroupFormInput())
inputComponentFactory.registerComponent(new ListFormInput())
inputComponentFactory.registerComponent(new NumberFormInput())
inputComponentFactory.registerComponent(new SelectFormInput())
inputComponentFactory.registerComponent(new BooleanFormInput())
inputComponentFactory.registerComponent(new ArrayFormInput())
inputComponentFactory.registerComponent(new SlotFormInput())

export default inputComponentFactory
