---
name: form-builder
description: ONLY for @harnessio/forms (IFormDefinition, InputFactory, transformers) in apps/gitness. Invoked via ui-builder Step 2a only. Do NOT use for react-hook-form pages — use ui-builder RHF canonical patterns instead.
---

# Form Builder

> **UI Builder gate:** Read `ui-builder/SKILL.md` first. This skill applies **only** at ui-builder Step 2a (`IFormDefinition` path). If the form uses `react-hook-form` + `FormWrapper`, **stop** — use ui-builder RHF table instead.

## When NOT to use (most gitness forms)

Stop if the form uses:

- `react-hook-form` + `zodResolver` + `FormWrapper` / `FormInput.*`
- Any file in ui-builder **RHF canonical patterns** table

Those require **ui3-form-review**, not this skill.

## When to use

- `IFormDefinition`, `defineForm`, `InputFactory`
- Imports from `@harnessio/forms`
- Pipeline studio / unified-pipeline-studio form inputs
- Transformers, `isVisible` conditional fields in form definitions

After build → ui-builder Step 3 (**ui3-form-review**).

## Reference Documentation

**Forms Package Documentation**: `../../packages/forms/agent.md` (relative to `apps/gitness/`)

This file contains comprehensive documentation about:
- Form architecture and components
- Input types and their configurations
- Validation system details
- Transformer functions
- Performance optimizations
- Advanced patterns

Reference this file when you need detailed technical information about the forms package.

## When to Use This Skill

Use **only** when ui-builder Step 2a applies (see gate above).

Do **not** use for generic "building a form page" — see ui-builder form decision tree.

After completing work, run **ui3-form-review** (ui-builder Step 3).

## CRITICAL: Mandatory Pre-Work Before Creating Forms

**BEFORE writing ANY form definition, you MUST:**

1. **Understand the Data Structure**:
   - What shape is the data? (flat, nested, array, object)
   - What are the field names and types?
   - Are there optional vs required fields?
   - Example: `{ name: string, age: number, tags: string[] }`

2. **Identify Required Input Types**:
   - Which form inputs are needed?
   - Are there custom input types registered in InputFactory?
   - Do you need containers (group)?

3. **Plan Validation**:
   - Which fields are required?
   - What validation rules apply? (min length, email format, number range, etc.)
   - Are there cross-field validation rules? (e.g., endDate > startDate)
   - Use `z.coerce` for all form inputs that parse values (numbers, dates, etc.)

4. **Determine Transformer Needs**:
   - Does the UI representation differ from data structure?
   - Are you editing objects as key-value pairs? (use object ↔ array transformers)
   - Do you need to clean up empty values? (use unset* transformers)

5. **Check for Conditional Logic**:
   - Do fields appear/disappear based on other field values?
   - Use `isVisible` function for conditional rendering
   - Use metadata for permission-based or feature flag visibility

6. **Verify Custom Input Components**:
   - Check if custom inputs are registered in InputFactory
   - Verify inputConfig requirements for custom inputs
   - Read custom input component source if needed

## Critical Guidelines - Common Mistakes to Avoid

**ALWAYS follow these guidelines when creating forms. These prevent frequently occurring mistakes:**

### ❌ Validation Mistakes

**MISTAKE 1: Using z.number() instead of z.coerce.number()**
```typescript
// ❌ WRONG - Will fail validation because form values are strings
validation: {
  schema: z.number().min(0, 'Must be positive')
}

// ✅ CORRECT - Always use z.coerce for number inputs
validation: {
  schema: z.coerce.number().min(0, 'Must be positive')
}
```

**MISTAKE 2: Not making required fields properly**
```typescript
// ❌ WRONG - Using validation instead of required prop
validation: {
  schema: z.string().min(1, 'Required')
}

// ✅ CORRECT - Use required prop AND validation
{
  inputType: 'text',
  path: 'name',
  required: true,
  validation: {
    schema: z.string().min(3, 'Minimum 3 characters')
  }
}
```

**MISTAKE 3: Dynamic validation without function**
```typescript
// ❌ WRONG - Schema doesn't update based on form values
validation: {
  schema: z.date().min(formValues.startDate)  // formValues is not accessible here
}

// ✅ CORRECT - Use function for dynamic validation
validation: {
  schema: (values) => z.date().min(values.startDate, 'Must be after start date')
}
```

### ❌ Transformer Mistakes

**MISTAKE 1: Using inputTransform without outputTransform**
```typescript
// ❌ WRONG - Incomplete transformation, data won't save correctly
{
  inputType: 'list',
  path: 'env',
  inputTransform: objectToArrayInputTransformer()
  // Missing outputTransform!
}

// ✅ CORRECT - Always pair input and output transformers
{
  inputType: 'list',
  path: 'env',
  inputTransform: objectToArrayInputTransformer(),
  outputTransform: arrayToObjectOutputTransformer({ unsetIfEmpty: true })
}
```

**MISTAKE 2: Wrong transformer for the use case**
```typescript
// ❌ WRONG - Using array input for key-value pairs
{
  inputType: 'array',  // This is for simple arrays like ['item1', 'item2']
  path: 'env'  // But env is { KEY1: 'value1', KEY2: 'value2' }
}

// ✅ CORRECT - Use list with transformers for key-value pairs
{
  inputType: 'list',
  path: 'env',
  inputConfig: {
    inputs: [
      { inputType: 'text', relativePath: 'key', label: 'Key' },
      { inputType: 'text', relativePath: 'value', label: 'Value' }
    ]
  },
  inputTransform: objectToArrayInputTransformer(),
  outputTransform: arrayToObjectOutputTransformer({ unsetIfEmpty: true })
}
```

### ❌ Path Mistakes

**MISTAKE 1: Wrong path for nested data**
```typescript
// Data structure: { user: { profile: { name: '' } } }

// ❌ WRONG - Flat path for nested data
path: 'name'

// ✅ CORRECT - Use dot notation for nested paths
path: 'user.profile.name'
```

**MISTAKE 2: Path doesn't match data structure**
```typescript
// Data structure: { spec: { store: { type: 'github' } } }

// ❌ WRONG - Missing intermediate levels
path: 'type'

// ✅ CORRECT - Full path with all nesting levels
path: 'spec.store.type'
```

**MISTAKE 3: Confusing tuple paths with array input types**
```typescript
// Data structure: servers = [{ name: 'Primary', url: '...' }, { name: 'Backup', url: '...' }]

// ❌ WRONG - Using array input for fixed-position tuple
{
  inputType: 'array',  // This is for dynamic add/remove
  path: 'servers'
}

// ✅ CORRECT - Use numeric paths for fixed-position tuples
{
  inputType: 'text',
  path: 'servers.0.name',
  label: 'Primary Server Name'
},
{
  inputType: 'text',
  path: 'servers.1.name',
  label: 'Backup Server Name'
}

// Note: Use 'array' or 'list' input types only when users can add/remove items dynamically
```

### ❌ Input Type Mistakes

**MISTAKE 1: Using wrong input type**
```typescript
// ❌ WRONG - Using 'text' for boolean values
{
  inputType: 'text',
  path: 'enabled'  // enabled is true/false
}

// ✅ CORRECT - Use 'boolean' for true/false values
{
  inputType: 'boolean',
  path: 'enabled'
}
```

**MISTAKE 2: Using deprecated 'accordion' input type**
```typescript
// ❌ WRONG - accordion is DEPRECATED
{
  inputType: 'accordion',  // DO NOT USE - DEPRECATED
  path: '_metadata_group'
}

// ✅ CORRECT - Use 'group' instead
{
  inputType: 'group',
  path: '_metadata',
  label: 'Metadata',
  inputs: [/* ... */]
}
```

**MISTAKE 3: Using 'array' instead of 'list'**
```typescript
// ❌ WRONG - 'array' is for simple value arrays
{
  inputType: 'array',
  path: 'users'  // users is [{ name: 'John', age: 30 }, ...]
}

// ✅ CORRECT - Use 'list' for structured data arrays
{
  inputType: 'list',
  path: 'users',
  inputConfig: {
    inputs: [
      { inputType: 'text', relativePath: 'name', label: 'Name' },
      { inputType: 'number', relativePath: 'age', label: 'Age' }
    ]
  }
}
```

### ❌ Conditional Visibility Mistakes

**MISTAKE 1: Watching unnecessary values**
```typescript
// ❌ WRONG - isVisible accesses values it doesn't need
isVisible: (values) => {
  console.log(values.unrelatedField)  // Don't access unrelated fields
  return values.type === 'github'
}

// ✅ CORRECT - Only access values actually needed for the condition
isVisible: (values) => values.type === 'github'
```

**MISTAKE 2: Complex logic in isVisible**
```typescript
// ❌ WRONG - Complex logic with side effects
isVisible: (values) => {
  const result = someComplexCalculation(values)
  saveToLocalStorage(result)  // Side effect!
  return result
}

// ✅ CORRECT - Pure function, simple logic
isVisible: (values) => values.authType === 'token' && values.provider === 'github'
```

### ❌ InputConfig Mistakes

**MISTAKE 1: Wrong inputConfig structure**
```typescript
// ❌ WRONG - Options not wrapped in inputConfig
{
  inputType: 'select',
  path: 'type',
  options: [{ label: 'A', value: 'a' }]  // Wrong location
}

// ✅ CORRECT - Options inside inputConfig
{
  inputType: 'select',
  path: 'type',
  inputConfig: {
    options: [{ label: 'A', value: 'a' }]
  }
}
```

**MISTAKE 2: Missing required inputConfig**
```typescript
// ❌ WRONG - List without inputs configuration
{
  inputType: 'list',
  path: 'items'
  // Missing inputConfig.inputs!
}

// ✅ CORRECT - List with inputs defined
{
  inputType: 'list',
  path: 'items',
  inputConfig: {
    inputs: [
      { inputType: 'text', relativePath: 'name', label: 'Name' }
    ]
  }
}
```

## Form Definition Reference (IFormDefinition)

### Complete Interface

```typescript
interface IFormDefinition<TInput = IInputDefinition, TMetadata = any> {
  inputs: TInput[]
  metadata?: TMetadata
}
```

### Input Definition Properties (IInputDefinition)

**Generic Signature:**
```typescript
IInputDefinition<TConfig = unknown, TValue = unknown, TInputType extends string = string>
```
Where:
- `TConfig` is the configuration type for the input
- `TValue` is the value type
- `TInputType` is the input type string

#### Core Properties
- `inputType: string` - **REQUIRED** - Type of input component (must be registered in InputFactory)
- `path: string` - **REQUIRED** - Dot-notation path for field in form data (e.g., `"user.email"`). Also supports numeric indices for tuples (e.g., `"coordinates.0"`, `"servers.1.name"`)
- `label?: string` - Display label for the input
- `placeholder?: string` - Placeholder text
- `description?: string` - Help text shown with the input

#### State Properties
- `required?: boolean` - Marks field as required (triggers required validation)
- `readonly?: boolean` - Makes the input read-only
- `disabled?: boolean | ((values, metadata) => boolean)` - Disables the input (can be dynamic)
- `default?: TValue` - Default value for the field
- `autofocus?: boolean` - Auto-focus this input on mount

#### Layout Properties
- `before?: JSX.Element` - Content to render before the input
- `after?: JSX.Element` - Content to render after the input

#### Conditional Rendering
- `isVisible?: (values: FormValues, metadata: TMetadata) => boolean` - Function to determine visibility
  - Receives all form values and metadata
  - Hidden inputs are excluded from validation
  - Re-evaluated when watched form values change

#### Configuration
- `inputConfig?: TConfig` - Type-specific configuration object (shape depends on input type). Note: in gitness input.inputConfig inherits RuntimeInputConfig, CommonFormInputConfig. This enables e.g. tooltip or runtimeinput configuration.
- `inputs?: IInputDefinition[]` - Nested input definitions (for composite inputs like groups)

#### Validation
- `validation?: { schema?: ZodSchema | ((values: FormValues) => ZodSchema) }` - Zod validation schema
  - Can be static schema or dynamic function receiving form values
  - Enables dependent/cross-field validation
- `warning?: { schema?: ZodSchema | ((values: FormValues) => ZodSchema) }` - Non-blocking warning schema
  - Warnings don't prevent form submission
  - Useful for advisory messages

#### Data Transformation
- `inputTransform?: IInputTransformerFunc | IInputTransformerFunc[]` - Transform data from component state to the form state
  - Runs when component renders
  - Can chain multiple transformers

- `outputTransform?: IOutputTransformerFunc | IOutputTransformerFunc[]` - Transform data from form state to component state
  - Runs before data is saved
  - Can chain multiple transformers

**Note:** All path strings support dot-notation for nested objects (e.g., `"address.street"`).

## Input Types Catalog

### Primitive Input Types

#### Text Input
```typescript
{
  inputType: 'text',
  path: 'username',
  label: 'Username',
  placeholder: 'Enter username',
  required: true,
  validation: {
    schema: z.string().min(3, 'Minimum 3 characters')
  }
}
```

**Use for**: Short single-line text (names, identifiers, URLs)

**Common inputConfig options**:
- `allowedValueTypes?: ['fixed', 'expression', 'runtime']` - For gitness value type switching
- `tooltip?: string` - For adding tooltip

#### Textarea Input
```typescript
{
  inputType: 'textarea',
  path: 'description',
  label: 'Description',
  placeholder: 'Enter description',
  validation: {
    schema: z.string().max(500, 'Maximum 500 characters').optional()
  }
}
```

**Use for**: Multi-line text (descriptions, notes, comments)

#### Number Input
```typescript
{
  inputType: 'number',
  path: 'port',
  label: 'Port',
  required: true,
  validation: {
    schema: z.coerce.number().min(1).max(65535, 'Invalid port')
  }
}
```

**Use for**: Numeric values (ports, counts, amounts)

**IMPORTANT**: Always use `z.coerce.number()` for validation

#### Boolean Input
```typescript
{
  inputType: 'boolean',
  path: 'enabled',
  label: 'Enable feature',
  default: false
}
```

**Use for**: True/false toggles, checkboxes

#### Select Input
```typescript
{
  inputType: 'select',
  path: 'type',
  label: 'Type',
  required: true,
  inputConfig: {
    options: [
      { label: 'GitHub', value: 'github' },
      { label: 'GitLab', value: 'gitlab' },
      { label: 'Bitbucket', value: 'bitbucket' }
    ],
    allowedValueTypes: ['fixed']  // Optional, for gitness value types
  },
  validation: {
    schema: z.enum(['github', 'gitlab', 'bitbucket'])
  }
}
```

**Use for**: Picking one option from a list

**inputConfig options**:
- `options: Array<{ label: string, value: string }>` - **REQUIRED**
- `allowedValueTypes?: string[]` - Optional value type restrictions

#### Multiselect Input
```typescript
{
  inputType: 'multiselect',
  path: 'tags',
  label: 'Tags',
  placeholder: 'Add tags',
  validation: {
    schema: z.array(z.string()).min(1, 'At least one tag required')
  }
}
```

**Use for**: Picking multiple options from a list

### Composite Input Types

#### Array Input
```typescript
{
  inputType: 'array',
  path: 'branches',
  label: 'Branches',
  description: 'List of branches to monitor',
  inputConfig: {
    input: {
      inputType: 'text',
      path: ''  // Empty path for array items
    }
  },
  validation: {
    schema: z.array(z.string()).min(1, 'At least one branch required')
  }
}
```

**Use for**: Dynamic list of simple values (strings, numbers)

**inputConfig options**:
- `input: IInputDefinition` - **REQUIRED** - Definition of the input for each array item
  - Use empty `path: ''` for the input definition
  - Common: `{ inputType: 'text', path: '' }` for string arrays
  - Common: `{ inputType: 'number', path: '' }` for number arrays

**NOT for**: Structured data with multiple fields per item (use `list` instead)

#### List Input
```typescript
{
  inputType: 'list',
  path: 'env',
  label: 'Environment Variables',
  inputConfig: {
    layout: 'grid',  // or 'table'
    inputs: [
      {
        inputType: 'text',
        relativePath: 'key',  // Note: relativePath, not path
        label: 'Key',
        outputTransform: unsetEmptyStringOutputTransformer()
      },
      {
        inputType: 'text',
        relativePath: 'value',
        label: 'Value',
        outputTransform: unsetEmptyStringOutputTransformer()
      }
    ]
  },
  inputTransform: objectToArrayInputTransformer(),
  outputTransform: arrayToObjectOutputTransformer({ unsetIfEmpty: true })
}
```

**Use for**: Table-like structured data with multiple fields per row

**inputConfig options**:
- `layout?: 'grid' | 'table'` - Visual layout style
- `inputs: IInputDefinition[]` - **REQUIRED** - Field definitions (use `relativePath`)

**Common pattern**: Key-value pair editing with object ↔ array transformers

### Container Input Types

**⚠️ DEPRECATED: Accordion Input Type**

The `accordion` input type is **DEPRECATED** and should **NOT be used** in any new forms. If you encounter it in existing code, consider refactoring to use `group` instead.

```typescript
// ❌ DO NOT USE - DEPRECATED
{
  inputType: 'accordion',  // DEPRECATED - DO NOT USE
  path: '_source_group'
}

// ✅ USE THIS INSTEAD
{
  inputType: 'group',
  path: '_source',
  label: 'Source',
  inputs: [/* ... */]
}
```

#### Group Input
```typescript
{
  inputType: 'group',
  path: 'address',
  label: 'Address',
  inputs: [
    {
      inputType: 'text',
      path: 'address.street',
      label: 'Street'
    },
    {
      inputType: 'text',
      path: 'address.city',
      label: 'City'
    },
    {
      inputType: 'text',
      path: 'address.zip',
      label: 'ZIP Code'
    }
  ]
}
```

**Use for**: Visually grouping related fields

**Note**: Fields inside groups use full dot-notation paths

### Custom/PlatformUI-Specific Input Types

#### Code Editor Input
```typescript
{
  inputType: 'code-editor',
  path: 'script',
  label: 'Script',
  required: true,
  inputConfig: {
    allowedValueTypes: ['fixed', 'expression', 'runtime']
  },
  inputTransform: shorthandObjectInputTransformer('run'),
  outputTransform: shorthandObjectOutputTransformer('run')
}
```

**Use for**: Code editing with syntax highlighting

#### Repo Select Input
```typescript
{
  inputType: 'repo-select',
  path: 'repo',
  label: 'Repository',
  required: false
}
```

**Use for**: Repository selection in gitness

#### Name-ID Input
```typescript
import { getNameIdInput } from '@components/forms/common/utils/form-utils'

// In form definition:
getNameIdInput(
  'name',
  'identifier',
  {
    placeholder: t('views:pipelines.namePlaceholder', 'Enter name')
  },
  generateEntityName('pipeline')
)
```

**Use for**: Paired name/identifier fields with auto-generation

### Dynamic Input Types

#### Slot Input
```typescript
{
  inputType: 'slot',
  path: 'dynamicField',
  inputs: [
    {
      inputType: 'text',
      path: 'dynamicField.value',
      label: 'Dynamic Value'
    }
  ]
}
```

**Use for**: Runtime form structure modification, dynamic content insertion

**Required properties**:
- `inputs: IInputDefinition[]` - **REQUIRED** - Definition of inputs that can be inserted at runtime

## Validation System

### Three-Level Validation Hierarchy

Forms package applies validation in this order:

1. **Required Validation** (First Layer)
   - Only applied when `input.required === true`
   - Global required message via `requiredMessage` in global validation config
   - Per-input-type required message via `requiredMessagePerInput[inputType]`
   - Global required schema via `requiredSchema`
   - Per-input-type required schema via `requiredSchemaPerInput[inputType]`

2. **Global Validation** (Second Layer)
   - Custom validation logic applied to all inputs
   - Function signature: `(value, input, metadata) => { continue?: boolean; error?: string }`
   - If `continue: false`, stops validation chain
   - If returns `error` string, validation fails with that message

3. **Input Validation** (Third Layer)
   - Per-input Zod schema via `input.validation.schema`
   - Can be static schema or dynamic function: `(values: FormValues) => ZodSchema`
   - Dynamic schemas enable dependent field validation
   - Receives all form values for cross-field validation rules

### Basic Validation Patterns

#### Required String
```typescript
{
  inputType: 'text',
  path: 'name',
  required: true,
  validation: {
    schema: z.string().min(3, 'Minimum 3 characters')
  }
}
```

#### Optional String
```typescript
{
  inputType: 'text',
  path: 'description',
  label: 'Description'
  // No validation needed - field is optional by default
}
```

**Note**: Fields are optional by default unless `required: true` is set. You only need validation if you want to add rules (like max length) that apply when the field has a value.

#### Email
```typescript
{
  inputType: 'text',
  path: 'email',
  required: true,
  validation: {
    schema: z.string().email('Invalid email address')
  }
}
```

#### Number (ALWAYS use z.coerce)
```typescript
{
  inputType: 'number',
  path: 'port',
  required: true,
  validation: {
    schema: z.coerce.number().min(1).max(65535, 'Port must be 1-65535')
  }
}
```

#### URL
```typescript
{
  inputType: 'text',
  path: 'webhook',
  validation: {
    schema: z.string().url('Invalid URL').optional()
  }
}
```

#### Enum/Select
```typescript
{
  inputType: 'select',
  path: 'type',
  inputConfig: {
    options: [
      { label: 'GitHub', value: 'github' },
      { label: 'GitLab', value: 'gitlab' }
    ]
  },
  validation: {
    schema: z.enum(['github', 'gitlab'], {
      errorMap: () => ({ message: 'Invalid type selected' })
    })
  }
}
```

#### Array
```typescript
{
  inputType: 'array',
  path: 'tags',
  validation: {
    schema: z.array(z.string()).min(1, 'At least one tag required')
  }
}
```

#### Object
```typescript
{
  inputType: 'group',
  path: 'address',
  inputs: [/* ... */],
  validation: {
    schema: z.object({
      street: z.string().min(1),
      city: z.string().min(1),
      zip: z.string().regex(/^\d{5}$/, 'Invalid ZIP')
    })
  }
}
```

### Dynamic Validation

#### Cross-Field Validation
```typescript
{
  inputType: 'date',
  path: 'endDate',
  validation: {
    schema: (values) => {
      const startDate = values.startDate
      return z.date().min(startDate, 'End date must be after start date')
    }
  }
}
```

#### Conditional Validation
```typescript
{
  inputType: 'text',
  path: 'apiKey',
  isVisible: (values) => values.authType === 'token',
  validation: {
    schema: (values) => {
      if (values.authType === 'token') {
        return z.string().min(1, 'API key required for token auth')
      }
      return z.string().optional()
    }
  }
}
```

#### Validation Based on Metadata
```typescript
{
  inputType: 'number',
  path: 'age',
  validation: {
    schema: (values, metadata) => {
      const minAge = metadata?.userRole === 'admin' ? 21 : 18
      return z.coerce.number().min(minAge, `Must be ${minAge}+`)
    }
  }
}
```

### Warning Schemas (Non-Blocking)

```typescript
{
  inputType: 'text',
  path: 'password',
  validation: {
    schema: z.string().min(8, 'Password required')
  },
  warning: {
    schema: (values) => {
      const password = values.password
      const hasNumber = /\d/.test(password)
      const hasSpecial = /[!@#$%^&*]/.test(password)

      if (!hasNumber || !hasSpecial) {
        return z.string().refine(
          () => false,
          'Consider using numbers and special characters for stronger security'
        )
      }
      return z.string()
    }
  }
}
```

**Warning schemas**:
- Don't prevent form submission
- Rendered separately from errors
- Useful for advisory messages
- Support static or dynamic schemas

### Global Validation Configuration

```typescript
import { getGlobalValidationForNonFixedValues } from '@components/forms/common/utils/validation'

const resolver = useZodValidationResolver(
  formDefinition,
  {
    requiredMessage: 'This field is required',
    requiredMessagePerInput: {
      text: 'Please enter a value',
      number: 'Please enter a number'
    },
    // Skip validation for runtime/expression values (common in gitness)
    globalValidation: getGlobalValidationForNonFixedValues()
  },
  formDefinition.metadata
)
```

**Common global validation pattern**:
```typescript
// Skip validation for runtime/expression values
export function getGlobalValidationForNonFixedValues() {
  return (value: unknown, _input: IInputDefinition, _metadata: unknown) => {
    if (typeof value === 'string' && (isRuntimeValue(value) || isExpressionValue(value))) {
      return { continue: false }  // Skip validation
    }
    return { continue: true }  // Continue to input validation
  }
}
```

## Data Transformers

### When to Use Transformers

Use transformers when:
- Internal data structure differs from desired output format
- Editing objects as key-value pairs
- Need to clean up empty values before submission
- Simplifying single-item structures
- Converting between data representations

### Input Transformers (Component State → Form State)

Transform data FROM component state TO form state (runs when component renders).

#### objectToArrayInputTransformer()
Converts object to array of `{key, value}` pairs for editing.

```typescript
// Data: { KEY1: 'value1', KEY2: 'value2' }
// Transforms to: [{ key: 'KEY1', value: 'value1' }, { key: 'KEY2', value: 'value2' }]

{
  inputType: 'list',
  path: 'env',
  inputTransform: objectToArrayInputTransformer(),
  outputTransform: arrayToObjectOutputTransformer({ unsetIfEmpty: true })
}
```

**Use for**: Editing objects as key-value lists in UI

#### shorthandObjectInputTransformer(parentPath)
Supports shorthand syntax where data can be a string instead of an object.

```typescript
// External data (shorthand): { script: 'echo hello' }
// Transforms to internal form: { script: { run: 'echo hello' } }
// Field at 'script.run' gets value: 'echo hello'

{
  inputType: 'code-editor',
  path: 'script.run',  // Nested path
  inputTransform: shorthandObjectInputTransformer('script'),  // Parent path
  outputTransform: shorthandObjectOutputTransformer('script')
}
```

**Parameters**:
- `parentPath: string` - **REQUIRED** - Path to the parent field that may be a shorthand string

**Use for**: Supporting shorthand syntax where `{ field: "value" }` is equivalent to `{ field: { property: "value" } }`

#### shorthandArrayInputTransformer(parentPath)
Converts single value to array format.

```typescript
// Data at 'items': 'single-value'
// Transforms to: ['single-value']

{
  inputType: 'array',
  path: 'items',
  inputTransform: shorthandArrayInputTransformer('items')
}
```

**Parameters**:
- `parentPath: string` - **REQUIRED** - Path to the parent field

**Use for**: Normalizing single values to array structure

### Output Transformers (Form State → Component State)

Transform data FROM form state TO component state (runs before data is saved).

#### arrayToObjectOutputTransformer(options?)
Converts array of `{key, value}` pairs back to object.

```typescript
// Input: [{ key: 'KEY1', value: 'value1' }, { key: 'KEY2', value: 'value2' }]
// Transforms to: { KEY1: 'value1', KEY2: 'value2' }

outputTransform: arrayToObjectOutputTransformer({ unsetIfEmpty: true })
```

**Options**:
- `unsetIfEmpty?: boolean` - Remove field if array is empty

**Use for**: Converting key-value lists back to objects

#### unsetEmptyArrayOutputTransformer()
Removes empty arrays from output.

```typescript
outputTransform: unsetEmptyArrayOutputTransformer()
```

**Use for**: Cleaning up unused array fields

#### unsetEmptyObjectOutputTransformer()
Removes empty objects from output.

```typescript
outputTransform: unsetEmptyObjectOutputTransformer()
```

**Use for**: Cleaning up unused nested objects

#### unsetEmptyStringOutputTransformer()
Removes empty strings from output.

```typescript
{
  inputType: 'text',
  path: 'description',
  outputTransform: unsetEmptyStringOutputTransformer()
}
```

**Use for**: Cleaning up blank optional text fields

#### shorthandArrayOutputTransformer(parentPath, options?)
Collapses single-item arrays to the value.

```typescript
// Array at 'items': ['single-value']
// Transforms to: 'single-value'

{
  inputType: 'array',
  path: 'items',
  inputTransform: shorthandArrayInputTransformer('items'),
  outputTransform: shorthandArrayOutputTransformer('items')
}
```

**Parameters**:
- `parentPath: string` - **REQUIRED** - Path to the parent field
- `options?: { unsetIfEmpty?: boolean }` - Optional configuration

**Use for**: Simplifying single-element arrays

#### shorthandObjectOutputTransformer(parentPath)
Collapses single-property objects back to shorthand string syntax.

```typescript
// Internal form: { script: { run: 'echo hello' } }
// Transforms to external (shorthand): { script: 'echo hello' }

{
  inputType: 'code-editor',
  path: 'script.run',  // Nested path
  inputTransform: shorthandObjectInputTransformer('script'),  // Parent path
  outputTransform: shorthandObjectOutputTransformer('script')
}
```

**Parameters**:
- `parentPath: string` - **REQUIRED** - Path to the parent field to collapse if it has only one property

**Use for**: Converting `{ field: { property: "value" } }` back to shorthand `{ field: "value" }` when field has only one property

### Transformer Chaining

Multiple transformers can be chained in sequence:

```typescript
{
  inputType: 'list',
  path: 'tags',
  inputTransform: objectToArrayInputTransformer(),
  outputTransform: [
    arrayToObjectOutputTransformer(),
    unsetEmptyObjectOutputTransformer()
  ]
}
```

### Common Transformer Patterns

#### Pattern 1: Key-Value Editing
```typescript
{
  inputType: 'list',
  path: 'env',
  inputConfig: {
    layout: 'grid',
    inputs: [
      {
        inputType: 'text',
        relativePath: 'key',
        label: 'Key',
        outputTransform: unsetEmptyStringOutputTransformer()
      },
      {
        inputType: 'text',
        relativePath: 'value',
        label: 'Value',
        outputTransform: unsetEmptyStringOutputTransformer()
      }
    ]
  },
  inputTransform: objectToArrayInputTransformer(),
  outputTransform: arrayToObjectOutputTransformer({ unsetIfEmpty: true })
}
```

#### Pattern 2: Nested Single Value
```typescript
{
  inputType: 'text',
  path: 'config.value',
  inputTransform: shorthandObjectInputTransformer('config'),
  outputTransform: shorthandObjectOutputTransformer('config')
}
```

#### Pattern 3: Clean Optional Field
```typescript
{
  inputType: 'textarea',
  path: 'description',
  outputTransform: unsetEmptyStringOutputTransformer()
}
```

## Conditional Visibility

### isVisible Property

Controls when an input is shown/hidden based on form state.

**Function Signature**:
```typescript
isVisible?: (values: FormValues, metadata: TMetadata) => boolean
```

**Key Features**:
- Access to all form values
- Metadata support for external context (permissions, feature flags)
- Hidden inputs automatically excluded from validation
- Selective watching - only re-evaluates when dependent values change

### Basic Examples

#### Show field based on another field
```typescript
{
  inputType: 'text',
  path: 'apiKey',
  label: 'API Key',
  isVisible: (values) => values.authType === 'token'
}
```

#### Multiple conditions
```typescript
{
  inputType: 'text',
  path: 'webhookUrl',
  label: 'Webhook URL',
  isVisible: (values) => values.enabled && values.type === 'webhook'
}
```

#### Using metadata for permissions or feature flags
```typescript
{
  inputType: 'select',
  path: 'role',
  label: 'Role',
  inputConfig: {
    options: [/* ... */]
  },
  isVisible: (values, metadata) => metadata.userRole === 'admin'
}
```

### Complex Visibility Logic

```typescript
{
  inputType: 'text',
  path: 'connectionString',
  isVisible: (values, metadata) => {
    // Show only if:
    // - Feature is enabled in metadata
    // - Database type is selected
    // - Auth type requires connection string
    return (
      metadata.features?.database === true &&
      values.type === 'database' &&
      ['postgres', 'mysql'].includes(values.dbType)
    )
  }
}
```

### Best Practices

1. **Keep functions pure** - No side effects
```typescript
// ❌ WRONG - Side effects
isVisible: (values) => {
  console.log(values)  // Side effect
  saveToLocalStorage(values)  // Side effect
  return values.enabled
}

// ✅ CORRECT - Pure function
isVisible: (values) => values.enabled
```

2. **Minimize dependencies** - Only reference needed values
```typescript
// ❌ WRONG - Watching unnecessary values
isVisible: (values) => {
  const { field1, field2, field3, unrelatedField } = values
  return field1 === 'value'
}

// ✅ CORRECT - Only watch what's needed
isVisible: (values) => values.field1 === 'value'
```

3. **Use metadata for external context**
```typescript
// ✅ CORRECT - Use metadata for non-form context
isVisible: (values, metadata) => {
  return metadata.userPermissions?.canEditAdvanced === true
}
```

4. **Test visibility logic**
```typescript
// Test with different form states to ensure visibility works correctly
const testValues1 = { authType: 'token' }
const testValues2 = { authType: 'oauth' }
```

## Tuple Support (Fixed-Position Arrays)

**NEW FEATURE**: Forms now support **tuple paths** using numeric indices. Tuples are fixed-position arrays where each element can have its own schema and validation.

### What are Tuples?

Tuples are arrays with:
- **Fixed positions**: Elements at specific indices (0, 1, 2, etc.)
- **Position-specific schemas**: Each position can have different validation
- **Immutable length**: Positions are predefined, not added/removed dynamically

### Tuples vs Dynamic Arrays

| Feature | Tuples (numeric paths) | Dynamic Arrays (`array`/`list` inputs) |
|---------|------------------------|----------------------------------------|
| **Path syntax** | `field.0`, `field.1.name` | Uses array/list input type |
| **Number of items** | Fixed | Variable (add/remove) |
| **Schema per item** | Can differ per position | Same schema for all items |
| **Use case** | Coordinates, fixed config values | Tags, users, environment variables |
| **Example** | `[x, y]`, `[primary, backup]` | `['tag1', 'tag2', ...]` |

### Tuple Path Syntax

```typescript
// coordinates = [10, 20]
{ inputType: 'number', path: 'coordinates.0', label: 'X', validation: { schema: z.coerce.number().min(0) } },
{ inputType: 'number', path: 'coordinates.1', label: 'Y', validation: { schema: z.coerce.number().min(0) } }
```

### Nested Objects in Tuples

```typescript
// servers = [{ name: 'Primary', url: '...' }, { name: 'Backup', url: '...' }]
{ inputType: 'text', path: 'servers.0.name', label: 'Primary Server' },
{ inputType: 'text', path: 'servers.0.url', validation: { schema: z.string().url() } },
{ inputType: 'text', path: 'servers.1.name', label: 'Backup Server' },
{ inputType: 'text', path: 'servers.1.url', validation: { schema: z.string().url() } }
```

### Different Schemas Per Position

Each position can have different fields and validation:

```typescript
// owners = [{ name: string, email: string }, { name: string, role: string }]
{ inputType: 'text', path: 'owners.0.email', validation: { schema: z.string().email() } },
{ inputType: 'select', path: 'owners.1.role', inputConfig: { options: [...] } }
// Position 0 has email, position 1 has role instead
```

### Sparse Indices

```typescript
// priorities = ['Critical', null, null, null, null, 'Low']
{ inputType: 'text', path: 'priorities.0', label: 'High Priority' },
{ inputType: 'text', path: 'priorities.5', label: 'Low Priority' }
// Skips indices 1-4
```

### When to Use Tuples

✅ **Use tuples when:**
- Fixed number of elements (e.g., [x, y] coordinates)
- Each position has specific meaning (e.g., [primary, backup] servers)
- Different validation per position (e.g., [string, number, boolean])
- Elements should not be added/removed by users
- Sparse positions needed (only certain indices matter)

❌ **Don't use tuples when:**
- Users need to add/remove items → Use `array` input type
- All items have same schema → Use `array` or `list` input type
- Number of items is unknown/variable → Use `array` or `list` input type


### Common Patterns

```typescript
// Coordinates: position = [100, 200]
{ path: 'position.0', label: 'X' },
{ path: 'position.1', label: 'Y' }

// Primary/Backup: databases = [{ url: '...' }, { url: '...' }]
{ path: 'databases.0.url', label: 'Primary DB' },
{ path: 'databases.1.url', label: 'Backup DB' }

// Mixed types: config = ['production', 3000, true]
{ path: 'config.0', validation: { schema: z.string() } },
{ path: 'config.1', validation: { schema: z.coerce.number() } },
{ path: 'config.2', inputType: 'boolean' }
```

**Playground example**: `/packages/forms/playground/src/examples/tuple-example/`

## Form Rendering & Integration

### Complete Form Setup

#### Step 1: Define Form Definition
```typescript
import { IFormDefinition } from '@harnessio/forms'

const formDefinition: IFormDefinition = {
  metadata: {
    userRole: 'admin'  // Optional metadata
  },
  inputs: [
    {
      inputType: 'text',
      path: 'name',
      label: 'Name',
      required: true,
      validation: {
        schema: z.string().min(3, 'Minimum 3 characters')
      }
    },
    {
      inputType: 'number',
      path: 'age',
      label: 'Age',
      validation: {
        schema: z.coerce.number().min(18, 'Must be 18+')
      }
    }
  ]
}
```

#### Step 2: Create Validation Resolver
```typescript
import { useZodValidationResolver } from '@harnessio/forms'

const resolver = useZodValidationResolver(
  formDefinition,
  {
    requiredMessage: 'This field is required',
    globalValidation: (value, input, metadata) => {
      // Optional global validation logic
      return { continue: true }
    }
  },
  formDefinition.metadata
)
```

#### Step 3: Render with RootForm
```typescript
import { RootForm, RenderForm, collectDefaultValues } from '@harnessio/forms'
import { inputFactory } from '@components/forms/inputs-factory'

const MyFormComponent = () => {
  const onSubmit = async (values) => {
    console.log('Form values:', values)
    // Save data, call API, etc.
  }

  return (
    <RootForm
      defaultValues={collectDefaultValues(formDefinition.inputs)}
      resolver={resolver}
      onSubmit={onSubmit}
      onValuesChange={(values) => console.log('Values changed:', values)}
      metadata={formDefinition.metadata}
      mode="onSubmit"
    >
      <RenderForm
        factory={inputFactory}
        formDefinition={formDefinition}
      />
    </RootForm>
  )
}
```

### RootForm Props Reference

#### Form Configuration
- `defaultValues?: TFieldValues` - Initial form values
- `resolver?: Resolver` - React Hook Form validation resolver (from `useZodValidationResolver`)
- `mode?: 'onSubmit'` - Validation trigger mode

#### Callbacks
- `onValuesChange?: (values: TFieldValues) => void` - Called when any form value changes
- `onValidationChange?: (props: ValidationChangeProps) => void` - Called when validation state changes
- `onSubmit?: (values: TFieldValues) => void` - Form submission handler
- `onInputRenderError?: (error: Error, errorInfo: ErrorInfo) => void` - Called when input rendering fails

#### Form Behavior
- `shouldFocusError?: boolean` - Auto-focus first invalid field on submit (default: `true`)
- `validateAfterFirstSubmit?: boolean` - Defer validation until first submit attempt
- `readonly?: boolean` - Global readonly mode for entire form

#### Context & State
- `metadata?: TMetadata` - Arbitrary metadata passed to `isVisible`, `disabled`, and validation functions
- `fixedValues?: Partial<TFieldValues>` - Immutable field values (not editable)
- `autoFocusPath?: Path` - Programmatically focus specific field on mount

#### Rendering
- `children: JSX.Element | ((methods: UseFormReturn & { submitForm: () => void }) => JSX.Element)`

### Using collectDefaultValues

```typescript
import { collectDefaultValues } from '@harnessio/forms'

// Automatically extract default values from form definition
const defaultValues = collectDefaultValues(formDefinition.inputs)

// Or manually specify defaults
const defaultValues = {
  name: '',
  age: 18,
  enabled: false
}
```

### Form with Dialog

```typescript
import { Dialog, Button } from '@harnessio/ui/components'
import { RootForm, RenderForm, collectDefaultValues } from '@harnessio/forms'
import { RootFormChildrenRendererType } from '@harnessio/forms'

const MyDialog = () => {
  const onSubmit = async (values) => {
    console.log('Form values:', values)
    // Save data, call API, etc.
    setIsOpen(false)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Create Pipeline</Dialog.Title>
        </Dialog.Header>

        <Dialog.Body>
          <RootForm
            defaultValues={collectDefaultValues(formDefinition.inputs)}
            resolver={resolver}
            mode="onSubmit"
            validateAfterFirstSubmit={true}
            onSubmit={onSubmit}
          >
            {(rootForm: RootFormChildrenRendererType) => (
              <>
                <RenderForm
                  factory={inputFactory}
                  formDefinition={formDefinition}
                />
                <Dialog.Footer>
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => rootForm.submitForm()} variant="primary">
                    Create
                  </Button>
                </Dialog.Footer>
              </>
            )}
          </RootForm>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  )
}
```

**Key points**:
- Use children renderer function to access `rootForm` methods
- Call `rootForm.submitForm()` from button's onClick handler
- No need for `id` or `form` attributes
- `validateAfterFirstSubmit={true}` defers validation until first submit attempt

## Custom Input Components

### Creating Custom Inputs

#### Step 1: Extend InputComponent Class

```typescript
import { InputComponent, InputProps, useController } from '@harnessio/forms'

class CustomTextInput extends InputComponent<string> {
  // Define unique internal type for factory registration
  internalType = 'custom-text'

  // Implement render method
  renderComponent(props: InputProps<string>) {
    const { field } = useController({ name: props.path })

    return (
      <input
        {...field}
        type="text"
        disabled={props.disabled}
        readOnly={props.readonly}
        placeholder={props.placeholder}
        className="custom-input-class"
      />
    )
  }
}
```

#### Step 2: Register with InputFactory

```typescript
import { InputFactory } from '@harnessio/forms'

// Create or get your factory instance
const inputFactory = new InputFactory()

// Register the custom input
inputFactory.register(new CustomTextInput())
```

#### Step 3: Use in Form Definition

```typescript
{
  inputType: 'custom-text',  // Matches internalType
  path: 'myField',
  label: 'My Field'
}
```

### Custom Input with Configuration

```typescript
interface CustomSelectConfig {
  options: Array<{ label: string; value: string }>
  placeholder?: string
}

class CustomSelectInput extends InputComponent<string, CustomSelectConfig> {
  internalType = 'custom-select'

  renderComponent(props: InputProps<string, CustomSelectConfig>) {
    const { field } = useController({ name: props.path })
    const { options, placeholder } = props.inputConfig || {}

    return (
      <select
        {...field}
        disabled={props.disabled}
        className="custom-select"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options?.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  }
}
```

**Usage**:
```typescript
{
  inputType: 'custom-select',
  path: 'type',
  inputConfig: {
    options: [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' }
    ],
    placeholder: 'Select an option'
  }
}
```

### Accessing Form Context

```typescript
import { useRootFormContext } from '@harnessio/forms'

class ContextAwareInput extends InputComponent<string> {
  internalType = 'context-aware'

  renderComponent(props: InputProps<string>) {
    const { field } = useController({ name: props.path })
    const { metadata } = useRootFormContext()

    return (
      <div>
        <input
          {...field}
          readOnly={props.readonly}
          disabled={props.disabled}
        />
        {metadata?.showHelp && (
          <span className="help-text">Help text from metadata</span>
        )}
      </div>
    )
  }
}
```

### InputFactory Management

```typescript
// Create factory
const factory = new InputFactory()

// Register multiple inputs
factory.register(new TextInput())
factory.register(new NumberInput())
factory.register(new SelectInput())

// Clone factory for isolated instance
const clonedFactory = factory.clone()

// Get registered input
const TextInputClass = factory.get('text')
```

## Common Form Patterns

### Pattern 1: Simple Contact Form

```typescript
import { IFormDefinition } from '@harnessio/forms'
import { z } from 'zod'

const contactFormDefinition: IFormDefinition = {
  inputs: [
    {
      inputType: 'text',
      path: 'name',
      label: 'Name',
      placeholder: 'Enter your name',
      required: true,
      validation: {
        schema: z.string().min(2, 'Name must be at least 2 characters')
      }
    },
    {
      inputType: 'text',
      path: 'email',
      label: 'Email',
      placeholder: 'your@email.com',
      required: true,
      validation: {
        schema: z.string().email('Invalid email address')
      }
    },
    {
      inputType: 'textarea',
      path: 'message',
      label: 'Message',
      placeholder: 'Your message',
      required: true,
      validation: {
        schema: z.string().min(10, 'Message must be at least 10 characters')
      }
    }
  ]
}
```

### Pattern 2: Pipeline Configuration Form

```typescript
import {
  IFormDefinition,
  arrayToObjectOutputTransformer,
  objectToArrayInputTransformer,
  unsetEmptyStringOutputTransformer
} from '@harnessio/forms'
import { getNameIdInput } from '@components/forms/common/utils/form-utils'

const pipelineFormDefinition: IFormDefinition = {
  inputs: [
    getNameIdInput('name', 'identifier', {
      placeholder: 'Enter pipeline name'
    }),
    {
      inputType: 'group',
      path: '_source',
      label: 'Source',
      inputs: [
        {
          inputType: 'text',
          path: 'gitBranch',
          label: 'Git Branch',
          placeholder: 'main',
          inputConfig: {
            allowedValueTypes: ['fixed']
          }
        },
        {
          inputType: 'text',
          path: 'yamlPath',
          label: 'YAML Path',
          placeholder: '.harness/pipeline.yaml',
          outputTransform: unsetEmptyStringOutputTransformer()
        }
      ]
    },
    {
      inputType: 'group',
      path: '_metadata',
      label: 'Metadata',
      inputs: [
        {
          inputType: 'textarea',
          path: 'description',
          label: 'Description',
          placeholder: 'Pipeline description',
          outputTransform: unsetEmptyStringOutputTransformer()
        },
        {
          inputType: 'multiselect',
          path: 'tags',
          label: 'Tags',
          placeholder: 'Add tags',
          inputTransform: objectToArrayInputTransformer(),
          outputTransform: arrayToObjectOutputTransformer({ unsetIfEmpty: true })
        }
      ]
    }
  ]
}
```

### Pattern 3: Conditional Form (Auth Configuration)

```typescript
const authFormDefinition: IFormDefinition = {
  inputs: [
    {
      inputType: 'select',
      path: 'authType',
      label: 'Authentication Type',
      required: true,
      inputConfig: {
        options: [
          { label: 'Token', value: 'token' },
          { label: 'OAuth', value: 'oauth' },
          { label: 'SSH', value: 'ssh' }
        ]
      }
    },
    {
      inputType: 'text',
      path: 'token',
      label: 'API Token',
      required: true,
      isVisible: (values) => values.authType === 'token',
      validation: {
        schema: z.string().min(1, 'Token is required')
      }
    },
    {
      inputType: 'text',
      path: 'clientId',
      label: 'Client ID',
      required: true,
      isVisible: (values) => values.authType === 'oauth',
      validation: {
        schema: z.string().min(1, 'Client ID is required')
      }
    },
    {
      inputType: 'text',
      path: 'clientSecret',
      label: 'Client Secret',
      required: true,
      isVisible: (values) => values.authType === 'oauth',
      validation: {
        schema: z.string().min(1, 'Client Secret is required')
      }
    },
    {
      inputType: 'textarea',
      path: 'privateKey',
      label: 'Private Key',
      required: true,
      isVisible: (values) => values.authType === 'ssh',
      validation: {
        schema: z.string().min(1, 'Private key is required')
      }
    }
  ]
}
```

### Pattern 4: Key-Value Environment Variables

```typescript
import {
  arrayToObjectOutputTransformer,
  objectToArrayInputTransformer,
  unsetEmptyStringOutputTransformer
} from '@harnessio/forms'

const envFormDefinition: IFormDefinition = {
  inputs: [
    {
      inputType: 'list',
      path: 'env',
      label: 'Environment Variables',
      description: 'Key-value pairs for environment variables',
      inputConfig: {
        layout: 'grid',
        inputs: [
          {
            inputType: 'text',
            relativePath: 'key',
            label: 'Key',
            placeholder: 'VARIABLE_NAME',
            outputTransform: unsetEmptyStringOutputTransformer()
          },
          {
            inputType: 'text',
            relativePath: 'value',
            label: 'Value',
            placeholder: 'variable value',
            outputTransform: unsetEmptyStringOutputTransformer()
          }
        ]
      },
      inputTransform: objectToArrayInputTransformer(),
      outputTransform: arrayToObjectOutputTransformer({ unsetIfEmpty: true })
    }
  ]
}
```

### Pattern 5: Cross-Field Validation (Date Range)

```typescript
const dateRangeFormDefinition: IFormDefinition = {
  inputs: [
    {
      inputType: 'date',
      path: 'startDate',
      label: 'Start Date',
      required: true,
      validation: {
        schema: z.date()
      }
    },
    {
      inputType: 'date',
      path: 'endDate',
      label: 'End Date',
      required: true,
      validation: {
        schema: (values) => {
          const startDate = values.startDate
          return z.date().min(
            startDate,
            'End date must be after start date'
          )
        }
      }
    },
    {
      inputType: 'number',
      path: 'duration',
      label: 'Duration (days)',
      readonly: true,
      validation: {
        schema: (values) => {
          if (values.startDate && values.endDate) {
            const days = Math.ceil(
              (values.endDate - values.startDate) / (1000 * 60 * 60 * 24)
            )
            return z.coerce.number().refine(
              (val) => val === days,
              'Duration mismatch'
            )
          }
          return z.coerce.number().optional()
        }
      }
    }
  ]
}
```

### Pattern 6: Permission-Based Form (Using Metadata)

```typescript
const userFormDefinition: IFormDefinition = {
  metadata: {
    userRole: 'admin',
    permissions: {
      canEditRole: true,
      canEditSensitiveData: false
    }
  },
  inputs: [
    {
      inputType: 'text',
      path: 'username',
      label: 'Username',
      required: true,
      validation: {
        schema: z.string().min(3)
      }
    },
    {
      inputType: 'text',
      path: 'email',
      label: 'Email',
      required: true,
      validation: {
        schema: z.string().email()
      }
    },
    {
      inputType: 'select',
      path: 'role',
      label: 'Role',
      inputConfig: {
        options: [
          { label: 'User', value: 'user' },
          { label: 'Admin', value: 'admin' }
        ]
      },
      isVisible: (values, metadata) => metadata.permissions?.canEditRole === true
    },
    {
      inputType: 'text',
      path: 'ssn',
      label: 'SSN',
      isVisible: (values, metadata) => metadata.permissions?.canEditSensitiveData === true,
      validation: {
        schema: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, 'Invalid SSN format')
      }
    }
  ]
}
```

### Pattern 7: Dynamic List of Users

```typescript
const teamFormDefinition: IFormDefinition = {
  inputs: [
    {
      inputType: 'text',
      path: 'teamName',
      label: 'Team Name',
      required: true
    },
    {
      inputType: 'list',
      path: 'members',
      label: 'Team Members',
      inputConfig: {
        layout: 'table',
        inputs: [
          {
            inputType: 'text',
            relativePath: 'name',
            label: 'Name',
            validation: {
              schema: z.string().min(1, 'Name required')
            }
          },
          {
            inputType: 'text',
            relativePath: 'email',
            label: 'Email',
            validation: {
              schema: z.string().email('Invalid email')
            }
          },
          {
            inputType: 'select',
            relativePath: 'role',
            label: 'Role',
            inputConfig: {
              options: [
                { label: 'Developer', value: 'developer' },
                { label: 'Lead', value: 'lead' }
              ]
            }
          }
        ]
      },
      validation: {
        schema: z.array(
          z.object({
            name: z.string().min(1),
            email: z.string().email(),
            role: z.enum(['developer', 'lead'])
          })
        ).min(1, 'At least one member required')
      }
    }
  ]
}
```

### Pattern 8: Code Editor with Runtime Values

```typescript
import {
  shorthandObjectInputTransformer,
  shorthandObjectOutputTransformer
} from '@harnessio/forms'

const scriptFormDefinition: IFormDefinition = {
  inputs: [
    {
      inputType: 'select',
      path: 'shell',
      label: 'Shell',
      inputConfig: {
        options: [
          { label: 'Bash', value: 'bash' },
          { label: 'Python', value: 'python' },
          { label: 'PowerShell', value: 'powershell' }
        ],
        allowedValueTypes: ['fixed']
      }
    },
    {
      inputType: 'code-editor',
      path: 'script',
      label: 'Script',
      required: true,
      inputTransform: shorthandObjectInputTransformer('run'),
      outputTransform: shorthandObjectOutputTransformer('run'),
      inputConfig: {
        allowedValueTypes: ['fixed', 'expression', 'runtime']
      },
      validation: {
        schema: z.string().min(1, 'Script is required')
      }
    }
  ]
}
```

## Quick Reference Tables

### Input Type Selection Guide

| Need | Input Type | Notes |
|------|-----------|-------|
| Single line text | `text` | For short strings (names, identifiers) |
| Multi-line text | `textarea` | For long text (descriptions, notes) |
| Number | `number` | Auto-parses to number, use `z.coerce.number()` |
| True/false | `boolean` | Checkbox/toggle |
| Pick one option | `select` | Dropdown, requires `inputConfig.options` |
| Pick multiple | `multiselect` | Multi-select dropdown |
| Simple list | `array` | Add/remove simple values, requires `inputConfig.input` |
| Structured rows | `list` | Table-like data, requires `inputConfig.inputs` |
| Group fields | `group` | Visual grouping |
| ~~Accordion~~ | ~~`accordion`~~ | **DEPRECATED - DO NOT USE. Use `group` instead** |
| Code editing | `code-editor` | Syntax highlighting |
| Repository | `repo-select` | PlatformUI repository picker |
| Name + ID | Use `getNameIdInput()` | Paired name/identifier with auto-generation |
| Runtime insertion | `slot` | Dynamic forms, requires `inputs: []` |
| Fixed-position array | Use numeric paths | Tuples: `field.0`, `field.1.name` - Each position can have different schema. See [Tuple Support](#tuple-support-fixed-position-arrays) section |

### Validation Schema Patterns

| Need | Zod Schema | Example |
|------|-----------|---------|
| Required string | `z.string().min(1, 'msg')` | Name, username |
| Optional string | No validation needed | Fields optional by default |
| Email | `z.string().email('msg')` | Email validation |
| URL | `z.string().url('msg')` | Website, API endpoint |
| Number | `z.coerce.number()` | **Always use coerce** |
| Positive number | `z.coerce.number().min(0)` | Age, count |
| Number range | `z.coerce.number().min(1).max(100)` | Port, percentage |
| Enum/Select | `z.enum(['a', 'b'])` | Fixed options |
| Array | `z.array(z.string())` | List of strings |
| Min array length | `z.array(z.string()).min(1)` | At least one item |
| Object | `z.object({ field: z.string() })` | Nested data |
| Date | `z.date()` | Date fields |
| Regex | `z.string().regex(/pattern/)` | Format validation |
| Conditional | `(values) => z.string().min(...)` | Based on other fields |
| Cross-field | `(values) => z.date().min(values.start)` | Dependent validation |

### Transformer Usage Patterns

| Need | Input Transformer | Output Transformer | Example |
|------|------------------|-------------------|---------|
| Key-value editing | `objectToArrayInputTransformer()` | `arrayToObjectOutputTransformer()` | Environment variables |
| Clean empty strings | - | `unsetEmptyStringOutputTransformer()` | Optional text fields |
| Clean empty arrays | - | `unsetEmptyArrayOutputTransformer()` | Optional lists |
| Clean empty objects | - | `unsetEmptyObjectOutputTransformer()` | Optional nested data |
| Nested single value | `shorthandObjectInputTransformer('prop')` | `shorthandObjectOutputTransformer('prop')` | Script with run property |
| Single to array | `shorthandArrayInputTransformer('path')` | `shorthandArrayOutputTransformer('path')` | Normalize values |
| Fixed-position tuples | - | - | **No transformers needed** - Use numeric paths directly |

**Note**: Tuples (fixed-position arrays using numeric paths like `field.0`, `field.1`) don't require transformers since they use direct path addressing. See [Tuple Support](#tuple-support-fixed-position-arrays) section.

### Common inputConfig Properties

| Input Type | inputConfig Properties | Example |
|-----------|----------------------|---------|
| `select` | `options: Array<{label, value}>` | `{ options: [{ label: 'A', value: 'a' }] }` |
| `multiselect` | `options: Array<{label, value}>` | Same as select |
| `array` | `input: IInputDefinition` | `{ input: { inputType: 'text', path: '' } }` |
| `list` | `layout?: 'grid' \| 'table'`<br/>`inputs: IInputDefinition[]` | `{ layout: 'grid', inputs: [...] }` |
| `slot` | `inputs: IInputDefinition[]` | `{ inputs: [{ inputType: 'text', path: 'field' }] }` |
| `code-editor` | `allowedValueTypes?: string[]` | `{ allowedValueTypes: ['fixed', 'runtime'] }` |
| `text` | `allowedValueTypes?: string[]` | PlatformUI value type switching |

### Form Validation Modes

| Mode | When Validation Runs | Best For |
|------|---------------------|----------|
| `onSubmit` | Only on form submission | Lenient, minimal interruption |


## Response Guidelines

1. **Understand Requirements First**: Always ask clarifying questions if the form requirements are unclear
2. **Verify Input Types**: Check if custom inputs are registered in InputFactory
3. **Plan Validation**: Determine validation rules before writing schemas
4. **Pair Transformers**: Always use input + output transformers together
5. **Type Safety**: Ensure generated forms have zero TypeScript errors
6. **Provide Examples**: Include working code snippets
7. **Reference Patterns**: Point to similar patterns in this guide
8. **Highlight Gotchas**: Warn about common mistakes
9. **Test Logic**: Verify conditional visibility and validation logic
10. **Follow Conventions**: Use gitness patterns and naming conventions

## Summary: Type-Safe Form Creation is Mandatory

**Remember**: Your primary goal is to help developers create **type-safe, error-free** forms quickly.

**Every form you create must:**
1. ✅ Have correct data structure and paths
2. ✅ Use appropriate input types
3. ✅ Include proper validation (use `z.coerce` for numbers)
4. ✅ Pair input/output transformers when needed
5. ✅ Implement conditional logic correctly
6. ✅ Have zero TypeScript compilation errors
7. ✅ Follow gitness conventions and patterns
8. ✅ Clean up empty values appropriately

**When creating forms:**
- Start with understanding the data structure
- Choose the right input types
- Plan validation requirements
- Identify transformer needs
- Implement conditional logic
- Test the form definition

**When in doubt:**
- Reference the common patterns section
- Check the forms package agent.md
- Review existing form definitions in gitness
- Ask clarifying questions

**This skill applies only via ui-builder Step 2a (`IFormDefinition`).** For react-hook-form pages, use ui-builder RHF patterns + ui3-form-review.

**Type safety and correctness are not optional. They are mandatory.**
