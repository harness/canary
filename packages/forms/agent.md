# Harness Forms Package - AI Agent Context

## Overview

This is the `@harnessio/forms` package, a React-based form library for creating dynamic forms in Harness applications. The package uses configuration-driven form generation with validation support.

## Key Architecture

- **Configuration-driven**: Forms are generated from form configuration schema
- **Input-based system**: Each form field is an "input" with a unique type
- **Validation integration**: Built-in validation with Zod (dynamic and dependent validation support)
- **React Hook Form**: Uses react-hook-form as the underlying form state management
- **Plugin architecture**: InputFactory registry pattern enables extensible custom input components
- **Error isolation**: InputErrorBoundary wraps each input for graceful error handling
- **Performance optimization**: Component memoization and selective value watching reduce unnecessary re-renders

## Core Components

### InputComponent (Abstract Base Class)
Abstract class that all custom input components must extend.

- Requires `internalType: string` property for factory registration
- Requires `renderComponent(props: InputProps<TValue>): JSX.Element` method implementation
- Receives `InputProps` with path, value management, factory reference, and state flags
- Provides the contract for all custom input implementations

### InputFactory
Registry pattern for managing input component types.

- `register(component, allowOverride?)` - Register an input type (prevents duplicates by default)
- `get(internalType)` - Retrieve registered component class
- `clone()` - Create factory copy with all registrations
- Central to the plugin architecture enabling extensibility

### RootForm
Main form wrapper managing React Hook Form integration.

- Manages form state with configurable validation modes (`onBlur`, `onChange`, `onSubmit`, etc.)
- Provides callbacks: `onValuesChange`, `onValidationChange`, `onSubmit`, `onInputRenderError`
- Propagates metadata to validation and visibility functions via context
- Implements auto-focus using `requestIdleCallback` for performance
- Triggers dependent field validation when form values change
- Supports global readonly mode and programmatic focus management

### RenderForm / RenderInputs
Components that render form structure from configuration.

- `RenderForm`: Wrapper around inputs with optional container div (`withoutWrapper` prop)
- `RenderInputs`: Maps input definitions array to `InputComponentRenderer` components
- Handles array iteration and key generation
- Passes factory and context through to renderers

### InputComponentRenderer (Performance Critical)
Memoized component rendering individual inputs with optimizations.

- **Selective watching**: Analyzes `isVisible` and `disabled` functions to watch only necessary values
- Computes conditional visibility and dynamic disabling
- Manages warning schema validation (non-blocking)
- Wraps each input in `InputErrorBoundary` for error isolation
- Renders `before` and `after` elements
- Only re-renders when watched values change (significant performance gain for large forms)

### InputErrorBoundary
React Error Boundary wrapping each individual input.

- Catches rendering errors in input components
- Prevents single input errors from breaking the entire form
- Calls `onInputRenderError` callback with error details
- Renders `null` on error for graceful degradation
- Improves form resilience, especially for large complex forms

### RootFormContext
Context provider for form-wide state.

- Provides: `metadata`, `readonly`, `onInputRenderError`
- Consumed by `InputComponentRenderer` and custom input components
- Accessed via `useRootFormContext()` hook
- Enables metadata propagation without prop drilling

### Component Hierarchy
```
RootForm (wraps FormProvider from react-hook-form)
  └─ RootFormContext.Provider
      └─ RenderForm / RenderInputs
          └─ InputComponentRenderer (for each input)
              └─ InputErrorBoundary
                  └─ CustomInputComponent (from factory)
```

## Input Definition Reference (IInputDefinition)

Complete reference for all properties available in input definitions:

### Core Properties
- `inputType: string` - Identifies the input component type (matches `internalType` in factory)
- `path: string` - Dot-notation path for the field in form data (e.g., `"user.email"`)
  - Supports nested objects using dot notation
- `label?: string` - Display label for the input
- `placeholder?: string` - Placeholder text
- `description?: string` - Help text or description shown with the input

### State Properties
- `required?: boolean` - Marks field as required (triggers required validation)
- `readonly?: boolean` - Makes the input read-only
- `disabled?: boolean | ((values, metadata) => boolean)` - Disables the input (can be dynamic based on form values)
- `default?: TValue` - Default value for the field
- `autofocus?: boolean` - Auto-focus this input on mount

### Layout Properties
- `before?: JSX.Element` - Content to render before the input
- `after?: JSX.Element` - Content to render after the input

### Conditional Rendering
- `isVisible?: (values: FormValues, metadata: TMetadata) => boolean` - Function to determine visibility
  - Receives all form values and metadata
  - Hidden inputs are excluded from validation
  - Re-evaluated when watched form values change

### Configuration
- `inputConfig?: TConfig` - Type-specific configuration object (shape depends on input type)
- `inputs?: IInputDefinition[]` - Nested input definitions (for composite inputs like groups)

### Validation
- `validation?: { schema?: ZodSchema | ((values: FormValues) => ZodSchema) }` - Zod validation schema
  - Can be static schema or dynamic function receiving form values
  - Enables dependent/cross-field validation
- `warning?: { schema?: ZodSchema | ((values: FormValues) => ZodSchema) }` - Non-blocking warning schema
  - Warnings don't prevent form submission
  - Useful for advisory messages

### Data Transformation
- `inputTransform?: IInputTransformerFunc | IInputTransformerFunc[]` - Transform data from component state to form state
  - Runs before component renders
  - Can chain multiple transformers

- `outputTransform?: IOutputTransformerFunc | IOutputTransformerFunc[]` - Transform data from form state to component state
  - Runs before data is saved
  - Can chain multiple transformers

### Advanced
- `pathRegExp?: RegExp` - Regular expression for dynamic path matching
  - Enables pattern-based input resolution

**Note:** All path strings support dot-notation for nested objects (e.g., `"address.street"`).

## Data Transformation System

The package provides built-in transformer functions to convert data between different formats. Transformers enable flexible data modeling without exposing internal structure to users.

### Input Transformers
Transform data from component state to form state (runs before component renders):

- `objectToArrayInputTransformer()` - Convert object to array of `{key, value}` pairs
  - Use when editing objects as key-value lists
- `shorthandObjectInputTransformer()` - Extract parent path value when using shorthand notation
  - Simplifies nested object access
- `shorthandArrayInputTransformer()` - Convert single value to array format
  - Normalizes single values to array structure

### Output Transformers
Transform data from form state to component state (runs before data is saved):

- `arrayToObjectOutputTransformer()` - Convert array of `{key, value}` pairs back to object
  - Inverse of `objectToArrayInputTransformer`
- `unsetEmptyArrayOutputTransformer()` - Remove empty arrays from output
  - Cleans up unused array fields
- `unsetEmptyObjectOutputTransformer()` - Remove empty objects from output
  - Cleans up unused nested objects
- `unsetEmptyStringOutputTransformer()` - Remove empty strings from output
  - Cleans up blank text fields
- `shorthandArrayOutputTransformer()` - Collapse single-item arrays to the value
  - Simplifies single-element arrays
- `shorthandObjectOutputTransformer()` - Collapse single-property objects to the value
  - Simplifies single-property objects

### Key Concepts

- **Transformer chaining**: Multiple transformers can be chained in sequence by providing an array
- **Common pattern**: Object ↔ array conversion for key-value editing UI
- **Data cleanup**: Use `unset*` transformers to remove empty values before submission
- **Simplification**: Use `shorthand*` transformers to collapse unnecessary structure

### Example Usage

```typescript
{
  inputType: 'array',
  path: 'tags',
  // Convert object to array for editing
  inputTransform: objectToArrayInputTransformer(),
  // Convert back and clean up
  outputTransform: [
    arrayToObjectOutputTransformer(),
    unsetEmptyObjectOutputTransformer()
  ]
}
```

## Input Types

The package supports various input types, each serving different purposes. The playground demonstrates these types in action:

### Primitive Input Types
- `text` - Text input fields
- `number` - Numeric input fields
- `boolean` - Toggle/checkbox inputs
- `select` - Dropdown selection inputs

### Composite Input Types
- `array` - Dynamic list of values (can add/remove items)
- `list` - Table-like list of structured items with multiple fields per row

### Container Input Types
- `group` - Grouping related inputs together
- `accordion` - Collapsible sections for organizing inputs

### Dynamic Input Types
- `slot` - Runtime content insertion, enables dynamic form structure

### Custom Input Types
- You can define any custom input type by creating a component that extends `InputComponent`
- Register custom types with `InputFactory`
- Each input type can have its own configuration interface via `inputConfig`

**Note:** The actual input types available depend on what's registered in your `InputFactory` instance. The playground examples demonstrate common patterns for each type.

## Conditional Visibility

Inputs can be conditionally shown/hidden using the `isVisible` property for dynamic form behavior.

### Function Signature
```typescript
isVisible?: (values: FormValues, metadata: TMetadata) => boolean
```

### Key Features

- **Access to all form values**: The function receives the entire form state
- **Metadata support**: Access to metadata for context-aware visibility (e.g., user permissions, feature flags)
- **Automatic exclusion**: Hidden inputs are automatically excluded from validation
- **Selective watching**: Only re-evaluates when dependent form values change (performance optimized)

### Best Practices

- Keep functions **pure** (no side effects)
- Minimize dependencies - only reference values actually needed for the visibility decision
- Use metadata for external context (user roles, feature flags) rather than form values
- Test visibility logic with different form states

### Example

```typescript
{
  inputType: 'text',
  path: 'adminEmail',
  label: 'Admin Email',
  isVisible: (values, metadata) => {
    // Show only if user is admin or if 'requiresApproval' is checked
    return metadata.userRole === 'admin' || values.requiresApproval === true
  }
}
```

The `ConditionalExample` in the playground demonstrates this feature in action.

## File Structure

- `src/`: Main source code
- `playground/`: Development playground with examples
- `dist/`: Built output
- `package.json`: Package configuration with peer dependencies

## Key Dependencies

- React 17.0.2+ (peer dependency)
- react-hook-form 7.28.0+ (peer dependency)
- zod 3.23.8+ (peer dependency)

## Development Commands

- `pnpm playground`: Start development playground
- `pnpm dev`: Start development build
- `pnpm build`: Build the package
- `pnpm build:watch`: Build with watch mode

## Form Creation Pattern

### Step-by-Step Guide

**Step 1: Define Input Types and Create Components**

Create custom input components by extending `InputComponent`:

```typescript
class TextInput extends InputComponent<string> {
  internalType = 'text'

  renderComponent(props: InputProps<string>) {
    const { field } = useController({ name: props.path })
    return <input {...field} disabled={props.disabled} readOnly={props.readonly} />
  }
}
```

**Step 2: Register Components with InputFactory**

```typescript
const factory = new InputFactory()
factory.register(new TextInput())
factory.register(new NumberInput())
factory.register(new SelectInput())
// ... register all input types
```

**Step 3: Create Form Definition**

```typescript
const formDefinition: IFormDefinition = {
  metadata: { userRole: 'admin' }, // Optional metadata
  inputs: [
    {
      inputType: 'text',
      path: 'username',
      label: 'Username',
      required: true,
      validation: {
        schema: z.string().min(3, 'Min 3 characters')
      }
    },
    {
      inputType: 'number',
      path: 'age',
      isVisible: (values) => values.username?.length > 0,
      validation: {
        schema: (values) => z.number()
          .min(values.username === 'admin' ? 21 : 18)
      }
    }
  ]
}
```

**Step 4: Create Validation Resolver**

```typescript
const resolver = useZodValidationResolver(
  formDefinition,
  {
    requiredMessage: 'This field is required',
    globalValidation: (value, input, metadata) => {
      // Custom global validation logic
      return { continue: true }
    }
  },
  formDefinition.metadata
)
```

**Step 5: Render with RootForm**

```typescript
<RootForm
  defaultValues={collectDefaultValues(formDefinition.inputs)}
  resolver={resolver}
  onValuesChange={(values) => console.log('Values:', values)}
  onSubmit={(values) => console.log('Submit:', values)}
  metadata={formDefinition.metadata}
  mode="onBlur"
>
  <RenderForm
    factory={factory}
    formDefinition={formDefinition}
  />
</RootForm>
```

### Advanced Patterns

**Using Transformers:**
```typescript
{
  inputType: 'array',
  path: 'tags',
  inputTransform: objectToArrayInputTransformer(),
  outputTransform: [
    arrayToObjectOutputTransformer(),
    unsetEmptyObjectOutputTransformer()
  ]
}
```

**Nested Structures:**
```typescript
{
  inputType: 'group',
  path: 'address',
  inputs: [
    { inputType: 'text', path: 'address.street', label: 'Street' },
    { inputType: 'text', path: 'address.city', label: 'City' }
  ]
}
```

**Dynamic Validation:**
```typescript
{
  path: 'endDate',
  validation: {
    schema: (values) => {
      const startDate = values.startDate
      return z.date().min(startDate, 'Must be after start date')
    }
  }
}
```

## Best Practices

### When to Use Transformers

- Use when internal data structure differs from desired output format
- **Common pattern**: Edit objects as key-value pairs → use object ↔ array transformers
- Chain transformers for complex transformations
- Use `unset*` transformers to clean up empty values before submission
- Use `shorthand*` transformers to simplify single-item structures

### Performance Considerations

**For large forms (50+ inputs):**
- Rely on `InputComponentRenderer` memoization (automatic)
- Minimize dependencies in `isVisible` and `disabled` functions
- The selective watching system optimizes re-renders automatically
- Avoid creating new function references in render (use `useCallback` when necessary)

### Error Handling Strategies

- Always provide `onInputRenderError` callback to log input errors
- Use `InputErrorBoundary`'s graceful degradation for resilience
- Test edge cases in custom input components
- Validate data shapes match expected formats

### Validation Patterns

- **Use dynamic schemas** for dependent validation
- **Leverage metadata** for permission-based validation
- **Use warning schemas** for non-blocking feedback
- **Organize validation** into global config for consistency
- **Extract complex logic** into helper functions for reusability

### Conditional Rendering

- Keep `isVisible` functions **pure** (no side effects)
- Watch minimal dependencies to avoid unnecessary re-renders
- Hidden inputs are excluded from validation automatically
- Use metadata for context-based visibility (user roles, feature flags)

### Nested Form Structures

- Use **dot-notation** for simple nested objects: `"user.email"`
- Use nested `inputs` array for groups and accordion containers
- Validation schemas are recursive automatically
- Consider component composition for complex nested forms

### Component Registration

- Register input components **once** at app initialization
- Use **unique `internalType`** values to avoid conflicts
- Avoid `allowOverride: true` unless intentionally replacing components

### Metadata Usage

- Pass user permissions for conditional validation/visibility
- Include feature flags for conditional form behavior
- Share application state that affects form logic
- Keep metadata **serializable** for easier debugging

## Validation System

The forms package uses Zod for schema validation with a three-level validation hierarchy.

### Validation Hierarchy (Applied in Order)

**1. Required Validation** (First Layer)
- Only applied when `input.required === true`
- Global required message via `requiredMessage` in global validation config
- Per-input-type required message via `requiredMessagePerInput[inputType]`
- Global required schema via `requiredSchema`
- Per-input-type required schema via `requiredSchemaPerInput[inputType]`

**2. Global Validation** (Second Layer)
- Custom validation logic applied to all inputs
- Function signature: `(value, input, metadata) => { continue?: boolean; error?: string }`
- If `continue: false`, stops validation chain
- If returns `error` string, validation fails with that message

**3. Input Validation** (Third Layer)
- Per-input Zod schema via `input.validation.schema`
- Can be static schema or dynamic function: `(values: FormValues) => ZodSchema`
- Dynamic schemas enable dependent field validation
- Receives all form values for cross-field validation rules

### Warning Schemas
- Non-blocking validation via `input.warning.schema`
- Rendered separately from errors
- Warnings don't prevent form submission
- Also support static or dynamic schemas
- Useful for advisory messages without blocking user

### IGlobalValidationConfig Interface

```typescript
{
  requiredMessage?: string
  requiredMessagePerInput?: Record<InputType, string>
  requiredSchema?: ZodSchema
  requiredSchemaPerInput?: Record<InputType, ZodSchema>
  globalValidation?: (value, input, metadata) => {
    continue?: boolean
    error?: string
  }
}
```

### Dynamic Validation Features

- **Form value access**: Validation schemas can access entire form state
- **Auto re-validation**: Form re-validates submitted fields when dependencies change
- **Cross-field rules**: Supports complex rules like "End date must be after start date"
- **Context-aware**: Metadata available in validation functions

### Example Use Cases

- Field A must be filled if Field B has specific value
- Numeric range depends on another field's value
- Validation rules change based on user permissions (via metadata)

**Example:**
```typescript
{
  path: 'endDate',
  validation: {
    schema: (values) => {
      const startDate = values.startDate
      return z.date().min(startDate, 'Must be after start date')
    }
  }
}
```

## RootForm Props Reference

Complete reference for all props available on the `RootForm` component:

### Form Configuration
- `defaultValues?: TFieldValues` - Initial form values
- `resolver?: Resolver` - React Hook Form validation resolver (typically from `useZodValidationResolver`)
- `mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all'` - Validation trigger mode (default: `'onBlur'`)

### Callbacks
- `onValuesChange?: (values: TFieldValues) => void` - Called when any form value changes
- `onValidationChange?: (props: ValidationChangeProps) => void` - Called when validation state changes
- `onSubmit?: (values: TFieldValues) => void` - Form submission handler
- `onInputRenderError?: (error: Error, errorInfo: ErrorInfo) => void` - Called when input rendering fails

### Form Behavior
- `shouldFocusError?: boolean` - Auto-focus first invalid field on submit (default: `true`)
- `validateAfterFirstSubmit?: boolean` - Defer validation until first submit attempt
- `readonly?: boolean` - Global readonly mode for entire form

### Context & State
- `metadata?: TMetadata` - Arbitrary metadata passed to `isVisible`, `disabled`, and validation functions
  - Useful for passing user permissions
  - Provides context for conditional validation
  - Shares app state with form components
- `fixedValues?: Partial<TFieldValues>` - Immutable field values (not editable)
- `prefix?: string` - Path prefix
- `autoFocusPath?: Path` - Programmatically focus specific field on mount

### Rendering
- `children: JSX.Element | ((methods: UseFormReturn & { submitForm: () => void }) => JSX.Element)`
  - Form content as JSX element
  - Or render function receiving form methods for advanced control

## Hooks and Utilities

### Custom Hooks

**`useController()`** - Enhanced wrapper around react-hook-form's `useController`
- Defers `onBlur` event to next frame using `afterFrames(2)`
- Prevents focus loss when input is inside modal/drawer/dialog (focus trap compatibility)
- Resolves issue where blur event fires before new element receives focus
- Otherwise identical to react-hook-form's `useController`

**`useRootFormContext()`** - Access form metadata and readonly state
- Returns `{ metadata, readonly, onInputRenderError }`
- Warns if used outside `RootFormProvider`
- Enables custom inputs to access form-wide state

### Re-exported from react-hook-form

The package re-exports commonly used hooks and components from react-hook-form:
- **Hooks**: `useForm`, `useWatch`, `useFormState`, `useFieldArray`, `useFormContext`
- **Components**: `Controller`, `FormProvider`

### Form Utilities

**`collectDefaultValues(inputs)`** - Extract all default values from form definition
- Recursively traverses input definitions
- Collects all `default` values into an object
- Used to initialize form state

**`useZodValidationResolver(formDefinition, globalValidation, metadata)`** - Create resolver for React Hook Form
- Integrates Zod validation with react-hook-form
- Applies three-level validation hierarchy
- Returns resolver compatible with RootForm `resolver` prop

### Performance Utilities

**`requestIdleCallbackPolyfill()`** - Browser compatibility shim for idle scheduling
- Provides polyfill for browsers without `requestIdleCallback`
- Used for non-critical operations like auto-focus

**`afterFrames(callback, frameCount)`** - Frame-based callback scheduling
- Defers execution by specified number of animation frames
- Used for focus management and blur event deferral
- Improves responsiveness by delaying non-critical operations

### Transform Utilities

Helper functions to apply input/output transformers in sequence:
- Handle data shape conversion between form state and component format
- Support transformer chaining for complex transformations

## Advanced Features

### Performance Optimizations

**Component Memoization**
- `InputComponentRenderer` is memoized to prevent unnecessary re-renders
- Significantly improves performance in forms with many inputs
- Reduces React reconciliation overhead

**Selective Value Watching**
- Only watches form values needed for dynamic behavior (visibility, disabling, validation)
- Analyzes `isVisible` and `disabled` functions to determine which paths to watch
- Dramatically reduces re-renders in large forms
- Example: Input only re-renders when its specific dependencies change, not on every form value change

**Frame-Based Scheduling**
- `afterFrames()` utility defers non-critical operations
- Used for blur event handling and focus management
- Improves perceived responsiveness

**Idle Callbacks**
- `requestIdleCallback` used for auto-focus and form resets
- Performs non-urgent work during browser idle time
- Better user experience during intensive operations

### Error Handling

**InputErrorBoundary**
- Error boundary wraps each input component individually
- Catches rendering errors in specific inputs
- Prevents single input errors from breaking the entire form
- Calls `onInputRenderError` callback with error details
- Renders `null` on error (graceful degradation)
- Form remains functional even if some inputs fail

**Graceful Degradation**
- Form continues functioning even when individual inputs fail to render
- Users can still interact with working parts of the form
- Particularly valuable for large complex forms

### Focus Management

**Focus Trap Compatibility**
- Custom `useController` defers `onBlur` events using `afterFrames(2)`
- Prevents focus loss when input is inside modal/drawer/dialog
- Resolves issue where blur event fires before new element can receive focus
- Essential for proper form behavior in overlay contexts

**Auto-Focus**
- `autofocus` prop on input definition focuses field on mount
- `autoFocusPath` on RootForm for programmatic focus control
- Uses `requestIdleCallback` for better performance
- Doesn't block rendering or cause jank

**Error Focus**
- `shouldFocusError` automatically focuses first invalid field on submit
- Improves accessibility and user experience
- Helps users quickly identify and fix validation errors

### Nested Structures

**Dot-Notation Paths**
- Full support for nested data structures (e.g., `"user.email"`, `"address.street"`)
- Access deeply nested values naturally
- Validation and transformation work seamlessly with nested paths

**Recursive Validation**
- Validation schemas generated recursively for nested structures
- Nested groups automatically handle child validation
- No special handling needed for deep nesting

**Nested Inputs**
- Groups can contain nested input definitions
- Support for arbitrary nesting depth
- Clean composition of complex form structures

### Dynamic Forms

**Slot Inputs**
- Add/remove inputs at runtime
- Dynamic form structure based on user interaction
- Playground `DynamicExample` demonstrates this pattern

**Dynamic Validation**
- Validation functions receive current form values
- Rules can change based on other field values
- Enables complex conditional validation logic

**Conditional Rendering**
- `isVisible` function reacts to form value changes
- Inputs can appear/disappear based on user selections
- Hidden inputs automatically excluded from validation

**Runtime Definition Updates**
- Form definition can be updated programmatically
- Enables data-driven form generation
- Playground `DynamicExample` shows this pattern

### Multi-Type Values

- Playground demonstrates runtime value type selection
- Switch between literal values, expressions, variable references
- Extensible pattern for complex input scenarios
- Useful for configuration UIs and advanced forms

## Playground Examples

The playground directory contains practical examples demonstrating different features and patterns:

### 1. Conditional Example (`ConditionalExample.tsx`)
- Demonstrates `isVisible` function usage
- Shows how input visibility reacts to form value changes
- Example: Show field B only when field A has a specific value
- Illustrates conditional form behavior patterns

### 2. Validation Example (`ValidationExample.tsx`)
- Array validation with Zod
- Cross-field dependent validation
- Dynamic validation schemas based on other field values
- Required field validation with custom messages
- Shows complex validation patterns in practice

### 3. Runtime Example (`RuntimeExample.tsx`)
- Demonstrates multi-value functionality
- Values can be fixed/literal, expression, or runtime input
- Shows how to switch between different value types
- Pattern for flexible input value selection

### 4. Performance Example (`PerformanceExample.tsx`)
- Optimization techniques for large forms (100+ fields)
- Demonstrates selective watching benefits
- Shows component memoization impact
- Best practices for handling many inputs efficiently

### 5. List Performance Example (`ListPerformanceExample.tsx`)
- Optimizing array/list input rendering
- Performance patterns for table-like list structures
- Efficient handling of dynamic lists with many rows
- Shows how to avoid common performance pitfalls

### 6. Dynamic Example (`DynamicExample.tsx`)
- Runtime form modification
- Adding/removing inputs dynamically using slot inputs
- Real-time form structure updates
- Interactive form generation patterns

### 7. Debug Example (`DebugExample.tsx`)
- Form state inspection tools
- Validation state debugging
- Value tracking and monitoring
- Helpful for development and troubleshooting

### Input Types Demonstrated

The playground examples showcase various input types:
- **Primitives**: `text`, `number`, `boolean`, `select`
- **Composite**: `array` (dynamic list of values), `list` (table-like rows)
- **Containers**: `group`, `accordion` (collapsible sections)
- **Dynamic**: `slot` (runtime content insertion)

Each example includes complete implementation showing:
- Component registration with `InputFactory`
- Form definition structure
- `RootForm` usage and configuration
- Real-world patterns and best practices

## Main Exports

The package exports are organized by category for easy discovery:

### Core Components
- `InputComponent` - Abstract base class for custom inputs
- `InputFactory` - Component registry for input types
- `RootForm` - Main form wrapper
- `RenderForm` - Form renderer
- `RenderInputs` - Input array renderer
- `InputComponentRenderer` - Individual input renderer
- `InputErrorBoundary` - Error boundary wrapper

### Hooks
- `useController` - Enhanced controller with focus trap fix
- `useRootFormContext` - Access form context (metadata, readonly, error handler)

**Re-exported from react-hook-form:**
- `useForm`, `useWatch`, `useFormState`, `useFieldArray`, `useFormContext`

### Components
**Re-exported from react-hook-form:**
- `Controller`, `FormProvider`

### Types
- `IFormDefinition<TInput, TMetadata>` - Form configuration interface
- `IInputDefinition<TValue, TConfig, TMetadata>` - Input configuration interface
- `IGlobalValidationConfig` - Validation configuration
- `InputProps<TValue>` - Props passed to custom inputs
- `IInputTransformerFunc` - Input transformer function type
- `IOutputTransformerFunc` - Output transformer function type

**Re-exported from react-hook-form:**
- `SubmitHandler`, `FieldValues`, `Mode`, `DefaultValues`, and more

### Validation
- `useZodValidationResolver` - Create Zod-based resolver for react-hook-form

### Utilities
- `collectDefaultValues` - Extract defaults from form definition
- `requestIdleCallbackPolyfill` - Browser compatibility shim
- `afterFrames` - Frame-based callback scheduler

### Transformers

**Input Transformers:**
- `objectToArrayInputTransformer`
- `shorthandObjectInputTransformer`
- `shorthandArrayInputTransformer`

**Output Transformers:**
- `arrayToObjectOutputTransformer`
- `unsetEmptyArrayOutputTransformer`
- `unsetEmptyObjectOutputTransformer`
- `unsetEmptyStringOutputTransformer`
- `shorthandArrayOutputTransformer`
- `shorthandObjectOutputTransformer`

**Note:** The package also exports `useRootFormikContext` as a legacy alias (naming from migration from Formik).

## Package Details

- Version: 0.8.0
- License: Apache-2.0
- Repository: https://github.com/harness/canary/tree/main/packages/forms
- Issues: https://github.com/harness/canary/issues
