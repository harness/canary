# @harnessio/forms

A type-safe, configuration-driven form library for React applications.

## Overview

`@harnessio/forms` provides a declarative approach to building forms using configuration schemas. The library generates forms from type-safe definitions, handles validation, and manages form state through React Hook Form integration.

**Key Features:**

- 🎯 Type-safe form definitions with TypeScript generics
- 📋 Configuration-driven form generation
- ✅ Built-in validation with Zod integration
- 🔢 Tuple support for fixed-position arrays
- 🎨 Flexible input component system
- 🔄 Conditional visibility and dynamic forms

## Core Principles

- Forms are generated from configuration
- Each input defines its own configuration interface
- Validation schemas are part of input configuration
- Type safety through generic type parameters
- Extensible through custom input components

## Type System

The library uses generic type parameters for type safety:

### `IInputDefinition<TConfig, TValue, TInputType>`

- `TConfig` - Input-specific configuration type
- `TValue` - Value type for the input
- `TInputType` - String literal type for input type

### `InputProps<TValue, TConfig>`

- `TValue` - Value type for the input
- `TConfig` - Input-specific configuration type

## Quick Start

### 1. Define Input Types

Each input has a unique type identifier:

```typescript
export enum InputType {
  text = 'text',
  number = 'number',
  checkbox = 'checkbox',
  array = 'array',
  list = 'list'
  // ... more types
}
```

### 2. Create Input Components

Define input configuration and component:

```typescript
import { InputComponent, InputProps, useController } from '@harnessio/forms'

// 1. Define input config type
export interface TextInputConfig {
  placeholder?: string
}

// 2. Define value type
export type TextInputValueType = string

// 3. Create component with typed props
function TextInputInternal(
  props: InputProps<TextInputValueType, TextInputConfig>
): JSX.Element {
  const { readonly, path, input } = props
  const { label, required, inputConfig } = input

  const { field } = useController({ name: path })

  return (
    <>
      <label>{label}</label>
      <input
        placeholder={inputConfig?.placeholder}
        {...field}
        disabled={readonly}
      />
    </>
  )
}

// 4. Register as InputComponent
export class TextInput extends InputComponent<TextInputValueType, TextInputConfig> {
  public internalType = InputType.text

  renderComponent(props: InputProps<TextInputValueType, TextInputConfig>): JSX.Element {
    return <TextInputInternal {...props} />
  }
}
```

**See examples:** [playground/src/implementation/inputs/](./playground/src/implementation/inputs/)

### 3. Register Inputs

Use `InputFactory` to register your input components:

```typescript
import { InputFactory } from '@harnessio/forms'

import { NumberInput } from './inputs/number-input'
import { TextInput } from './inputs/text-input'

const inputComponentFactory = new InputFactory()
inputComponentFactory.registerComponent(new TextInput())
inputComponentFactory.registerComponent(new NumberInput())

export default inputComponentFactory
```

### 4. Define Form Schema

Create a type-safe form definition using `IFormDefinition`:

```typescript
import { z } from 'zod'

import { IFormDefinition } from '@harnessio/forms'

// Basic form without custom input configs
export const basicFormDefinition: IFormDefinition = {
  inputs: [
    {
      inputType: 'text',
      path: 'name',
      label: 'Name',
      required: true,
      validation: {
        schema: z.string().min(3, 'Name must be at least 3 characters')
      }
    },
    {
      inputType: 'number',
      path: 'age',
      label: 'Age',
      validation: {
        schema: z.coerce.number().min(18, 'Must be 18 or older')
      }
    }
  ]
}
```

**With custom input configs for type safety:**

```typescript
// 1. Define config types for each custom input
export interface ListInputConfig {
  inputType: 'list'
  inputConfig: {
    inputs: IInputDefinition[]
    layout?: 'grid' | 'default'
  }
}

export interface TextInputConfig {
  inputType: 'text'
  inputConfig?: {
    placeholder?: string
  }
}

// 2. Create union type
export type InputConfigType = ListInputConfig | TextInputConfig

// 3. Use union type for type-safe form definition
export const formDefinition: IFormDefinition<InputConfigType> = {
  inputs: [
    {
      inputType: 'text',
      path: 'username',
      label: 'Username',
      inputConfig: {
        placeholder: 'Enter username'  // ✅ Type-safe
      }
    },
    {
      inputType: 'list',
      path: 'items',
      label: 'Items',
      inputConfig: {
        inputs: [...],  // ✅ Type-safe
        layout: 'grid'
      }
    }
  ]
}
```

### 5. Render Form

Use `RootForm` and `RenderForm` components:

```typescript
import { RootForm, RenderForm, useZodValidationResolver } from '@harnessio/forms'
import { inputComponentFactory } from './factory'
import { formDefinition } from './form-definition'

function MyForm() {
  const resolver = useZodValidationResolver(formDefinition)

  const handleSubmit = (values: AnyFormValue) => {
    console.log('Form values:', values)
  }

  return (
    <RootForm
      defaultValues={{}}
      onSubmit={handleSubmit}
      resolver={resolver}
    >
      {rootForm => (
        <>
          <RenderForm
            factory={inputComponentFactory}
            inputs={formDefinition}
          />
          <button onClick={() => rootForm.submitForm()}>
            Submit
          </button>
        </>
      )}
    </RootForm>
  )
}
```

## Tuple Support (Fixed-Position Arrays)

The library supports **tuple paths** using numeric indices for fixed-position arrays where each position can have its own schema.

### When to Use Tuples

✅ Use tuples for:

- Fixed number of elements (e.g., `[x, y]` coordinates)
- Position-specific schemas (e.g., `[primary, backup]` servers)
- Elements that shouldn't be added/removed dynamically

❌ Use `array` or `list` input types for:

- Variable number of items
- Add/remove functionality
- Same schema for all items

### Tuple Path Syntax

```typescript
// Coordinates: [10, 20]
{
  inputs: [
    { inputType: 'number', path: 'coordinates.0', label: 'X' },
    { inputType: 'number', path: 'coordinates.1', label: 'Y' }
  ]
}

// Nested objects: [{ name: 'Primary', url: '...' }, { name: 'Backup', url: '...' }]
{
  inputs: [
    { inputType: 'text', path: 'servers.0.name', label: 'Primary Server' },
    { inputType: 'text', path: 'servers.0.url', validation: { schema: z.string().url() } },
    { inputType: 'text', path: 'servers.1.name', label: 'Backup Server' },
    { inputType: 'text', path: 'servers.1.url', validation: { schema: z.string().url() } }
  ]
}

// Different schemas per position
{
  inputs: [
    { inputType: 'text', path: 'owners.0.email', validation: { schema: z.string().email() } },
    { inputType: 'select', path: 'owners.1.role', inputConfig: { options: [...] } }
  ]
}

// Sparse indices: ['Critical', null, null, null, null, 'Low']
{
  inputs: [
    { inputType: 'text', path: 'priorities.0', label: 'High Priority' },
    { inputType: 'text', path: 'priorities.5', label: 'Low Priority' }
  ]
}
```

**Example:** See [playground/src/examples/tuple-example/](./playground/src/examples/tuple-example/)

## Validation

The library integrates with Zod for schema validation.

### Per-Input Validation

Define validation schemas directly in input definitions:

**Static validation:**
```typescript
{
  inputType: 'text',
  path: 'email',
  label: 'Email',
  required: true,
  validation: {
    schema: z.string().email('Invalid email format')
  }
}
```

**Dynamic validation (depends on other form values):**
```typescript
{
  inputType: 'text',
  path: 'password',
  label: 'Password',
  required: true
},
{
  inputType: 'text',
  path: 'confirmPassword',
  label: 'Confirm Password',
  required: true,
  validation: {
    schema: (values) =>
      z.string().refine(
        (val) => val === values.password,
        { message: 'Passwords must match' }
      )
  }
}
```

### Global Validation Configuration

Configure validation globally using `useZodValidationResolver`:

```typescript
const resolver = useZodValidationResolver(
  formDefinition,
  {
    // Custom required message for all inputs
    requiredMessage: 'This field is required',

    // Custom required message per input type
    requiredMessagePerInput: {
      text: 'Text field is required',
      number: 'Please enter a number'
    },

    // Custom required schema per input type
    requiredSchemaPerInput: {
      text: z.string().min(1),
      number: z.number(),
      myCustomInput: z.custom(...)
    },

    // Global validation function
    globalValidation: (value, input, metadata) => {
      // Custom validation logic
      return { continue: true }
    }
  },
  metadata
)
```

**Validation resolution order for required fields:**

1. `requiredSchemaPerInput[inputType]`
2. `requiredSchema`
3. Built-in default validation

## Additional Features

### Conditional Visibility

Control input visibility based on form values:

```typescript
{
  inputType: 'select',
  path: 'authType',
  label: 'Authentication Type'
},
{
  inputType: 'text',
  path: 'apiToken',
  label: 'API Token',
  isVisible: (values) => values.authType === 'token'
}
```

### Default Values

Set default values using the `default` property or `collectDefaultValues`:

```typescript
import { collectDefaultValues } from '@harnessio/forms'

// In input definition
{
  inputType: 'text',
  path: 'name',
  default: 'John Doe'
}

// Collect all defaults from form definition
const defaultValues = collectDefaultValues(formDefinition)
```

### Value Transformers

Transform values between data model and form state:

```typescript
{
  inputType: 'text',
  path: 'tags',
  label: 'Tags',
  // Transform incoming data (array) to form display (string)
  inputTransform: (value: string[]) => ({
    value: value.join(', ')
  }),
  // Transform form value (string) back to data model (array)
  outputTransform: (value: string) => ({
    value: value.split(',').map(s => s.trim())
  })
}
```

**Transformer functions:**
- `inputTransform` - Converts data model → form state (runs when data is loaded)
- `outputTransform` - Converts form state → data model (runs on submit)
- Both must return `{ value: any }` or `undefined`
- Can chain multiple transformers by providing an array

## API Reference

### Core Types

```typescript
// Input definition with generic parameters
IInputDefinition<TConfig = unknown, TValue = unknown, TInputType extends string = string>

// Input component props
InputProps<TValue = unknown, TConfig = unknown>

// Form definition
IFormDefinition<TConfig = unknown>

// Value types
AnyFormValue  // any form value type
```

### Main Components

- `RootForm` - Root form component with React Hook Form integration
- `RenderForm` - Renders inputs from form definition
- `InputFactory` - Registry for input components
- `InputComponent<TValue, TConfig>` - Base class for input components

### Hooks

- `useZodValidationResolver(definition, config?, metadata?)` - Creates Zod validation resolver
- `useController(options)` - React Hook Form controller hook

### Utilities

- `collectDefaultValues(definition)` - Extracts default values from form definition

## Examples

Complete working examples can be found in [playground/src/examples/](./playground/src/examples/):

- [Basic Example](./playground/src/examples/basic-example/) - Simple form with text and number inputs
- [Tuple Example](./playground/src/examples/tuple-example/) - Fixed-position arrays
- [Array Example](./playground/src/examples/array-example/) - Dynamic arrays
- [List Example](./playground/src/examples/list-example/) - Dynamic object lists
- [Conditional Example](./playground/src/examples/conditional-example/) - Conditional visibility

## License

See the main repository license.
