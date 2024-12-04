import { render } from '@testing-library/react'

import { StringSubstitute, stringSubstitute } from '../StringSubstitute'

describe('StringSubstitute', () => {
  test('Basic substitution should be done properly', async () => {
    let str = 'Some static text'
    let vars = {}
    let output = 'Some static text'

    const { queryByText } = render(<StringSubstitute str={str} vars={vars} />)
    expect(queryByText(output)).toBeTruthy()
    expect(stringSubstitute(str, vars)).toEqual(output)

    str = "{user}'s age is {age}"
    vars = { user: 'Eric', age: 5 }
    output = "Eric's age is 5"

    render(<StringSubstitute str={str} vars={vars} />)
    expect(queryByText(output)).toBeTruthy()
    expect(stringSubstitute(str, vars)).toEqual(output)
  })

  test('Repeated substitute', async () => {
    const str = "{user}'s age is {age}. {user} is a {gender}"
    const vars = { user: 'Eric', age: 5, gender: 'male' }
    const output = "Eric's age is 5. Eric is a male"

    const { queryByText } = render(<StringSubstitute str={str} vars={vars} />)
    expect(queryByText(output)).toBeTruthy()
    expect(stringSubstitute(str, vars)).toEqual(output)
  })

  test('Basic translation', async () => {
    let str = '{user} wants to merge {number} {number|1:commit,commits} into {target} from {source}'
    let vars = { user: 'Eric', number: 1, target: 'patch1', source: 'develop' }
    let output = 'Eric wants to merge 1 commit into patch1 from develop'

    const { queryByText } = render(<StringSubstitute str={str} vars={vars} />)
    expect(queryByText(output)).toBeTruthy()
    expect(stringSubstitute(str, vars)).toEqual(output)

    str = '{user} wants to merge {number} {number|1:commit,commits} into {target} from {source}'
    vars = { user: 'Eric', number: 25, target: 'patch1', source: 'develop' }
    output = 'Eric wants to merge 25 commits into patch1 from develop'

    render(<StringSubstitute str={str} vars={vars} />)
    expect(queryByText(output)).toBeTruthy()
    expect(stringSubstitute(str, vars)).toEqual(output)
  })

  test('Multiple occurrences of translation', async () => {
    let str = '{number} {number|1:commit,commits} {number|1:is,are} done by {user}'
    let vars = { user: 'Eric', number: 1 }
    let output = '1 commit is done by Eric'

    const { queryByText } = render(<StringSubstitute str={str} vars={vars} />)
    expect(queryByText(output)).toBeTruthy()
    expect(stringSubstitute(str, vars)).toEqual(output)

    str = '{number} {number|1:commit,commits} {number|1:is,are} done by {user}'
    vars = { user: 'Eric', number: 101 }
    output = '101 commits are done by Eric'

    render(<StringSubstitute str={str} vars={vars} />)
    expect(queryByText(output)).toBeTruthy()
    expect(stringSubstitute(str, vars)).toEqual(output)
  })

  test('Raw translation should be returned when vars are missing', async () => {
    let str = '{number} {number|1:commit,commits} {number|1:is,are} done by {user}'
    const vars = { user: 'Eric' }
    let output = '{number} {number|1:commit,commits} {number|1:is,are} done by Eric'

    const { queryByText } = render(<StringSubstitute str={str} vars={vars} />)
    expect(queryByText(output)).toBeTruthy()
    expect(stringSubstitute(str, vars)).toEqual(output)

    str = '{number} {number|1:commit,commits} {number|1:is,are} done by {user}'
    output = '{number} {number|1:commit,commits} {number|1:is,are} done by {user}'

    render(<StringSubstitute str={str} />)
    expect(queryByText(output)).toBeTruthy()
    expect(stringSubstitute(str)).toEqual(output)
  })
})
