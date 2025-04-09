# Harness forms

This repository contains components and utilities for creating forms in the harness applications.

## Intro

The library uses **form configuration schema** and **inputs** to generate form. For **json schema** driven forms, we are use parser to convert input data to **form configuration schema** data model. This means that for any kind of form we have to create **form configuration schema** either explicitly or implicitly by transforming input data.

## Principles

- Form is generated from configuration.
- Validation is part of configuration (per input).
- Default values are part of configuration (per input).
- Each input defines its configuration interface.
- Input define default validation as utility function - optional.

### Step by step guide

#### 1. Input type

Each input has a unique type.

```
export enum InputType {
  text = "text",
  number = "number",
  checkbox = "checkbox",
  connector = "connector"
  ...
}
```

#### 2. Create inputs

Examples of input can be found in the `playgorund`:
[Text input example](./playground/src/implementation/inputs/text-input.tsx)

Minimal implementation:

```typescript
import { InputComponent, InputProps, useController, type AnyFormikValue } from '@harnessio/forms'

export interface TextInputConfig {
  inputType: InputType.text
}

function TextInputInternal(props: InputProps<AnyFormikValue>): JSX.Element {
  const { readonly, path, input } = props
  const { label = '', required, placeholder } = input

  const { field, formState } = useController<{ [key: string]: boolean }>({
    name: path
  })

  return (
    <>
      <label>{label}</label>
      <input placeholder={placeholder} {...field} disabled={readonly} tabIndex={0} />
    </>
  )
}

export class TextInput extends InputComponent<AnyFormikValue> {
  public internalType = InputType.text

  renderComponent(props: InputProps<AnyFormikValue>): JSX.Element {
    return <TextInputInternal {...props} />
  }
}

```

#### 3. Register inputs

Use InputFactory to register inputs

```js
import { InputFactory } from '@harnessio/forms'

import { TextInput } from '../inputs/TextInput'

const inputComponentFactory = new InputFactory()
inputComponentFactory.registerComponent(new TextInput())

export default inputComponentFactory
```

#### 4. Create form model - IFormDefinition

Form model is a blueprint for creating form.

```js
export const formDefinition: IFormDefinition = {
  inputs: [
    {
        inputType: InputType.string,
        path: "name",
        label: "Name",
    },
    {
        inputType: InputType.number,
        path: "age",
        label: "Age",
    }
  ]
}
```

NOTE: Input may contain configuration. In this case we have to provide a generic type to `IFormDefinition` in order to get intellisense for the form definition inputs.

```typescript
// 1. Define input config type
export interface ListInputConfig {
  inputType: InputType.list
  inputConfig: {
    inputs: UIInputWithConfigsForList[]
    layout?: 'grid' | 'default'
  }
}

// 2. Use input config type for second generic of component props
function ListInputInternal(props: InputProps<AnyFormikValue, ListInputConfig>): JSX.Element ....

// 3. Make union of all Input configs
export type InputConfigType =
  | ListInputConfig
  | TextInputConfig ...

// 4. Use union type when defining form
export const formDefinition: IFormDefinition<InputConfigType> = {
  inputs: [...]
}
```

For more info check [List input example](../views/src/components/form-inputs/TextInput.tsx)

#### 5. Render form

Use RootForm and RenderForm components.

```js
<RootForm initialValues={{}} onSubmit={handleOnSubmit}>
  <RenderForm factory={inputComponentFactory} inputs={formDefinition} />
</RootForm>
```

### Configure Required validation

Required validation can be configured globally for all inputs or per input. Per input validation overrides the global validation.

When the library is generating validation, it tries to pick the first available validation for **required** check in this order:

- requiredSchemaPerInput
- requiredSchema
- default - if validation is not found, it uses the default built-in validation.

```js
// Required validation config example
const validationConfig: IGlobalValidationConfig = {
  requiredSchemaPerInput: {
    [InputType.string]: zod.string(),
    [InputType.number]: zod.number(),
    [InputType.myCustomInput]: zod.custom(....),
  },
  requiredSchema: zod.custom(....), // << used for validating all inputs except string, number and myCustomInput
};
```

If validation configuration is not found, default/built-in validation takes place.
Message can be set globally or per input.

```js
// Required message config example

const validationConfig: IGlobalValidationConfig = {
  requiredMessage: "Required field",
  requiredMessagePerInput: {
    [InputType.string]: "Field is required",
    [InputType.number]: "Required. Please enter a number",
  },
};
```
