// Mock for @harnessio/ui/components - provides only the types/enums needed for tests

export enum MeterState {
  Empty = 0,
  Error = 1,
  Warning = 2,
  Success = 3,
  Info = 4
}

export enum MessageTheme {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  DEFAULT = 'default'
}

// Mock IconV2 component
export const IconV2 = ({ name, size, className }: { name: string; size?: string; className?: string }) => {
  return null
}

// Add any other exports that tests might need
export const Button = () => null
export const Text = () => null
export const Layout = {
  Horizontal: () => null,
  Vertical: () => null
}
