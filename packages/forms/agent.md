# Harness Forms Package - AI Agent Context

## Overview
This is the `@harnessio/forms` package, a React-based form library for creating dynamic forms in Harness applications. The package uses configuration-driven form generation with validation support.

## Key Architecture
- **Configuration-driven**: Forms are generated from form configuration schema
- **Input-based system**: Each form field is an "input" with a unique type
- **Validation integration**: Built-in validation with Zod
- **React Hook Form**: Uses react-hook-form as the underlying form state management

## Core Components
- `InputComponent`: Base class for creating custom form inputs
- `InputFactory`: Registry for managing input components
- `RootForm`: Main form wrapper component
- `RenderForm`: Component that renders form from configuration
- `useController`: Hook for form field control

## Input Types
The package supports various input types defined in `InputType` enum. Examples can be found in the playground:
- `text`, `number`, `checkbox` (playground examples)
- `connector` and other custom types
- Each input type has its own configuration interface

## Conditional Visibility
Inputs can be conditionally shown/hidden using the `isVisible` property:
- Input visibility can depend on other input values
- Use `isVisible` in form configuration to control when inputs appear
- Supports dynamic form behavior based on user selections

## File Structure
- `src/`: Main source code
- `playground/`: Development playground with examples
- `dist/`: Built output
- `package.json`: Package configuration with peer dependencies

## Key Dependencies
- React 18+ (peer dependency)
- react-hook-form 7.34.2+ (peer dependency)
- zod 3.24.1+ (peer dependency)

## Development Commands
- `pnpm playground`: Start development playground
- `pnpm dev`: Start development build
- `pnpm build`: Build the package
- `pnpm build:watch`: Build with watch mode

## Form Creation Pattern
1. Define input types and configurations
2. Create input components extending `InputComponent`
3. Register inputs with `InputFactory`
4. Create form definition (`IFormDefinition`)
5. Render with `RootForm` and `RenderForm`

## Validation System
- Global validation configuration
- Per-input validation overrides
- Required field validation with customizable messages
- Support for Zod
- **Runtime validation**: Validation is built dynamically on form value changes
- **Dependent validation**: Validation rules can depend on other form data values

## Package Details
- Version: 0.7.0
- License: Apache-2.0
- Repository: https://github.com/harness/canary/tree/main/packages/forms
- Issues: https://github.com/harness/canary/issues
