/* eslint-disable @typescript-eslint/no-unused-vars, jsx-a11y/label-has-associated-control, tailwindcss/classnames-order, i18next/no-literal-string -- deliberately violating fixture for ds-consumer-check */

import { Button, Drawer, MadeUpWidget } from '@harnessio/ui/components'
import { Foo } from '@harnessio/ui/src/components/foo'

export const Bad = () => (
  <div style={{ color: '#ff0000' }} className="w-[420px] bg-blue-500 text-white cn-not-a-real-class">
    <label>Name</label>
    <input />
    <Button variant="primary">A</Button>
    <Button variant="primary">B</Button>
    <Drawer.Root>
      <Drawer.Content className="p-4" />
    </Drawer.Root>
    <span title="rgb(1,2,3)" />
  </div>
)
