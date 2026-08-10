import {
  RUNTIME_INPUT,
  extractRuntimeInputName,
  getInputValueType,
  isExpressionValue,
  isLegacyRuntimeValue,
  isRuntimeValue,
  isUnresolvedValue
} from '../utils'

describe('runtime-value-utils', () => {
  it.each([
    ['<+input>', true],
    ['  <+input>  ', true],
    ['<+inputs.manifestPath>', true],
    ['${{inputs.manifestPath}}', true],
    ['${{ inputs.manifestPath }}', true],
    ['<+input', false],
    ['${{inputs.manifestPath', false],
    ['${{runtime.manifestPath}}', false],
    ['<+pipeline.name>', false],
    ['deployment.yaml', false],
    [undefined, false],
    [42, false]
  ])('isRuntimeValue(%j) → %s', (value, expected) => {
    expect(isRuntimeValue(value)).toBe(expected)
  })

  it.each([
    ['<+input>', true],
    ['  ${{inputs.foo}}  ', true],
    ['<+pipeline.name>', true],
    ['${{runtime.manifestPath}}', true],
    ['<+pipeline.name', false],
    ['${{runtime.manifestPath', false],
    ['deployment.yaml', false]
  ])('isExpressionValue(%j) → %s', (value, expected) => {
    expect(isExpressionValue(value)).toBe(expected)
  })

  it('treats legacy <+input> (with whitespace) as unresolved', () => {
    expect(isLegacyRuntimeValue('  <+input>  ')).toBe(true)
    expect(isUnresolvedValue('  <+input>  ')).toBe(true)
  })

  it.each(['<+invalid', '${{broken'])('does not treat malformed expression %j as unresolved', value => {
    expect(isUnresolvedValue(value)).toBe(false)
  })

  it('classifies CEL runtime inputs as runtime, not expression', () => {
    expect(getInputValueType('${{inputs.manifestPath}}')).toBe('runtime')
    expect(getInputValueType('${{ inputs.manifestPath }}')).toBe('runtime')
    expect(getInputValueType('<+pipeline.name>')).toBe('expression')
    expect(getInputValueType('fixed')).toBe('fixed')
  })

  it('extracts names from both CEL and jexl forms', () => {
    expect(extractRuntimeInputName('${{inputs.foo}}')).toBe('foo')
    expect(extractRuntimeInputName('${{ inputs.foo }}')).toBe('foo')
    expect(extractRuntimeInputName('<+inputs.foo>')).toBe('foo')
    expect(extractRuntimeInputName(RUNTIME_INPUT)).toBe(RUNTIME_INPUT)
  })
})
