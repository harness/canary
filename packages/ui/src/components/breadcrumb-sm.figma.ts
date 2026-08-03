// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=21348-100846
// source=packages/ui/src/components/breadcrumb.tsx
// component=Breadcrumb

import figma from 'figma'

const instance = figma.selectedInstance

const rootVariant = instance.getEnum('root', {
  text: 'text',
  interactive: 'interactive'
})

const hasMiddle = instance.getBoolean('middle#21356:187')
const hasLast = instance.getBoolean('last#21356:190')
const hasAfterRoot = instance.getBoolean('after root#21356:184')

export default {
  example: figma.code`
    <Breadcrumb.Root size="sm">
      <Breadcrumb.List>
        <Breadcrumb.Item>
          ${
            rootVariant === 'interactive'
              ? '<Breadcrumb.Link href="#">Root</Breadcrumb.Link>'
              : '<Breadcrumb.Page>Root</Breadcrumb.Page>'
          }
        </Breadcrumb.Item>
        ${
          hasAfterRoot
            ? '<Breadcrumb.Separator /><Breadcrumb.Item><Breadcrumb.Link href="#">Section</Breadcrumb.Link></Breadcrumb.Item>'
            : ''
        }
        ${
          hasMiddle
            ? '<Breadcrumb.Separator /><Breadcrumb.Item><Breadcrumb.Link href="#">Middle</Breadcrumb.Link></Breadcrumb.Item>'
            : ''
        }
        ${
          hasLast
            ? '<Breadcrumb.Separator /><Breadcrumb.Item><Breadcrumb.Page>Current</Breadcrumb.Page></Breadcrumb.Item>'
            : ''
        }
      </Breadcrumb.List>
    </Breadcrumb.Root>
  `,
  imports: ['import { Breadcrumb } from "@harnessio/ui/components"'],
  id: 'breadcrumb-sm',
  metadata: {
    nestable: true
  }
}
