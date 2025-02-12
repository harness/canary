import { render } from '@testing-library/react'
import { repoBranchesStoreMock } from '@views/test/mocks/branch-selector-store'
import { describe, it } from 'vitest'

import { BranchInfoBar } from '.'

describe('BranchInfoBar component', () => {
  it('should 1', () => {
    const { debug } = render(
      <BranchInfoBar
        defaultBranchName="main"
        useRepoBranchesStore={() => repoBranchesStoreMock}
        currentBranchDivergence={{
          ahead: 0,
          behind: 0
        }}
      />
    )

    // expect(actual).toBe(expected)
  })
})
