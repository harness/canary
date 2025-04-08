import { noop } from '@utils/viewUtils'

import { DiffFileEntry, ICommitDetailsStore } from '@harnessio/ui/views'

export const commitDetailsStore: ICommitDetailsStore = {
  diffs: [
    {
      blocks: [
        {
          lines: [
            {
              content: "+import { FC } from 'react'",
              type: 'insert',
              newNumber: 1
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 2
            },
            {
              content: "+import { MarkdownViewer } from '@harnessio/ui/components'",
              type: 'insert',
              newNumber: 3
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 4
            },
            {
              content: '+export interface CodeBlockProps {',
              type: 'insert',
              newNumber: 5
            },
            {
              content: '+  code: string',
              type: 'insert',
              newNumber: 6
            },
            {
              content: '+  language?: string',
              type: 'insert',
              newNumber: 7
            },
            {
              content: '+}',
              type: 'insert',
              newNumber: 8
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 9
            },
            {
              content: "+const CodeBlock: FC<CodeBlockProps> = ({ code, language = 'typescript tsx' }) => (",
              type: 'insert',
              newNumber: 10
            },
            {
              content: '+  <MarkdownViewer',
              type: 'insert',
              newNumber: 11
            },
            {
              content: '+    source={`',
              type: 'insert',
              newNumber: 12
            },
            {
              content: '+\\`\\`\\`${language}',
              type: 'insert',
              newNumber: 13
            },
            {
              content: '+${code}',
              type: 'insert',
              newNumber: 14
            },
            {
              content: '+\\`\\`\\`',
              type: 'insert',
              newNumber: 15
            },
            {
              content: '+`}',
              type: 'insert',
              newNumber: 16
            },
            {
              content: '+  />',
              type: 'insert',
              newNumber: 17
            },
            {
              content: '+)',
              type: 'insert',
              newNumber: 18
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 19
            },
            {
              content: '+export default CodeBlock',
              type: 'insert',
              newNumber: 20
            }
          ],
          oldStartLine: 0,
          oldStartLine2: null,
          newStartLine: 1,
          header: '@@ -0,0 +1,20 @@'
        }
      ],
      deletedLines: 0,
      addedLines: 20,
      isGitDiff: true,
      newFileMode: '100644',
      isNew: true,
      checksumBefore: '0000000000000000000000000000000000000000',
      checksumAfter: '29e67d052254a294ca3d36fc7a0eecd890e3f862',
      oldName: '/dev/null',
      language: 'tsx',
      newName: 'apps/design-system/src/components/docs-page/code-block.tsx',
      isCombined: false,
      containerId: 'container-/dev/null::::apps/design-system/src/components/docs-page/code-block.tsx',
      contentId: 'content-/dev/null::::apps/design-system/src/components/docs-page/code-block.tsx',
      fileId: '/dev/null::::apps/design-system/src/components/docs-page/code-block.tsx',
      filePath: 'apps/design-system/src/components/docs-page/code-block.tsx',
      raw: "diff --git a/apps/design-system/src/components/docs-page/code-block.tsx b/apps/design-system/src/components/docs-page/code-block.tsx\nnew file mode 100644\nindex 0000000000000000000000000000000000000000..29e67d052254a294ca3d36fc7a0eecd890e3f862\n--- /dev/null\n+++ b/apps/design-system/src/components/docs-page/code-block.tsx\n@@ -0,0 +1,20 @@\n+import { FC } from 'react'\n+\n+import { MarkdownViewer } from '@harnessio/ui/components'\n+\n+export interface CodeBlockProps {\n+  code: string\n+  language?: string\n+}\n+\n+const CodeBlock: FC<CodeBlockProps> = ({ code, language = 'typescript tsx' }) => (\n+  <MarkdownViewer\n+    source={`\n+\\`\\`\\`${language}\n+${code}\n+\\`\\`\\`\n+`}\n+  />\n+)\n+\n+export default CodeBlock\n"
    },
    {
      blocks: [
        {
          lines: [
            {
              content: "+import CodeBlock from './code-block.tsx'",
              type: 'insert',
              newNumber: 1
            },
            {
              content: " import ComponentExample from './component-example'",
              type: 'context',
              oldNumber: 1,
              newNumber: 2
            },
            {
              content: " import Example from './example'",
              type: 'context',
              oldNumber: 2,
              newNumber: 3
            },
            {
              content: "+import PropsTable from './props-table.tsx'",
              type: 'insert',
              newNumber: 4
            },
            {
              content: " import Root from './root'",
              type: 'context',
              oldNumber: 3,
              newNumber: 5
            },
            {
              content: " import Section from './section'",
              type: 'context',
              oldNumber: 4,
              newNumber: 6
            },
            {
              content: "+import SubSection from './sub-section.tsx'",
              type: 'insert',
              newNumber: 7
            },
            {
              content: " import Summary from './summary'",
              type: 'context',
              oldNumber: 5,
              newNumber: 8
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 6,
              newNumber: 9
            },
            {
              content: ' export const DocsPage = {',
              type: 'context',
              oldNumber: 7,
              newNumber: 10
            },
            {
              content: '   Root,',
              type: 'context',
              oldNumber: 8,
              newNumber: 11
            },
            {
              content: '   Summary,',
              type: 'context',
              oldNumber: 9,
              newNumber: 12
            },
            {
              content: '   Section,',
              type: 'context',
              oldNumber: 10,
              newNumber: 13
            },
            {
              content: '+  SubSection,',
              type: 'insert',
              newNumber: 14
            },
            {
              content: '   Example,',
              type: 'context',
              oldNumber: 11,
              newNumber: 15
            },
            {
              content: '-  ComponentExample',
              type: 'delete',
              oldNumber: 12
            },
            {
              content: '+  ComponentExample,',
              type: 'insert',
              newNumber: 16
            },
            {
              content: '+  CodeBlock,',
              type: 'insert',
              newNumber: 17
            },
            {
              content: '+  PropsTable',
              type: 'insert',
              newNumber: 18
            },
            {
              content: ' }',
              type: 'context',
              oldNumber: 13,
              newNumber: 19
            }
          ],
          oldStartLine: 1,
          oldStartLine2: null,
          newStartLine: 1,
          header: '@@ -1,13 +1,19 @@'
        }
      ],
      deletedLines: 1,
      addedLines: 7,
      isGitDiff: true,
      checksumBefore: '42fd1bddc44007476270e4c34ec7104602e39c9a',
      checksumAfter: '5f3bdaf0b672d6ddb144cb7994003adee63c02c6',
      mode: '100644',
      oldName: 'apps/design-system/src/components/docs-page/docs-page.tsx',
      language: 'tsx',
      newName: 'apps/design-system/src/components/docs-page/docs-page.tsx',
      isCombined: false,
      containerId:
        'container-apps/design-system/src/components/docs-page/docs-page.tsx::::apps/design-system/src/components/docs-page/docs-page.tsx',
      contentId:
        'content-apps/design-system/src/components/docs-page/docs-page.tsx::::apps/design-system/src/components/docs-page/docs-page.tsx',
      fileId:
        'apps/design-system/src/components/docs-page/docs-page.tsx::::apps/design-system/src/components/docs-page/docs-page.tsx',
      filePath: 'apps/design-system/src/components/docs-page/docs-page.tsx',
      raw: "diff --git a/apps/design-system/src/components/docs-page/docs-page.tsx b/apps/design-system/src/components/docs-page/docs-page.tsx\nindex 42fd1bddc44007476270e4c34ec7104602e39c9a..5f3bdaf0b672d6ddb144cb7994003adee63c02c6 100644\n--- a/apps/design-system/src/components/docs-page/docs-page.tsx\n+++ b/apps/design-system/src/components/docs-page/docs-page.tsx\n@@ -1,13 +1,19 @@\n+import CodeBlock from './code-block.tsx'\n import ComponentExample from './component-example'\n import Example from './example'\n+import PropsTable from './props-table.tsx'\n import Root from './root'\n import Section from './section'\n+import SubSection from './sub-section.tsx'\n import Summary from './summary'\n \n export const DocsPage = {\n   Root,\n   Summary,\n   Section,\n+  SubSection,\n   Example,\n-  ComponentExample\n+  ComponentExample,\n+  CodeBlock,\n+  PropsTable\n }\n"
    },
    {
      blocks: [
        {
          lines: [
            {
              content: "+import { FC } from 'react'",
              type: 'insert',
              newNumber: 1
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 2
            },
            {
              content:
                "+import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@harnessio/ui/components'",
              type: 'insert',
              newNumber: 3
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 4
            },
            {
              content: '+interface PropDescription {',
              type: 'insert',
              newNumber: 5
            },
            {
              content: '+  name: string',
              type: 'insert',
              newNumber: 6
            },
            {
              content: '+  required?: boolean',
              type: 'insert',
              newNumber: 7
            },
            {
              content: '+  defaultValue?: string',
              type: 'insert',
              newNumber: 8
            },
            {
              content: '+  description?: string',
              type: 'insert',
              newNumber: 9
            },
            {
              content: '+}',
              type: 'insert',
              newNumber: 10
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 11
            },
            {
              content: '+export interface PropsTableProps {',
              type: 'insert',
              newNumber: 12
            },
            {
              content: '+  props: PropDescription[]',
              type: 'insert',
              newNumber: 13
            },
            {
              content: '+}',
              type: 'insert',
              newNumber: 14
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 15
            },
            {
              content: '+const PropsTable: FC<PropsTableProps> = ({ props }) => (',
              type: 'insert',
              newNumber: 16
            },
            {
              content: '+  <Table>',
              type: 'insert',
              newNumber: 17
            },
            {
              content: '+    <TableHeader>',
              type: 'insert',
              newNumber: 18
            },
            {
              content: '+      <TableRow>',
              type: 'insert',
              newNumber: 19
            },
            {
              content: '+        <TableHead>Prop</TableHead>',
              type: 'insert',
              newNumber: 20
            },
            {
              content: '+        <TableHead>Required</TableHead>',
              type: 'insert',
              newNumber: 21
            },
            {
              content: '+        <TableHead>Default</TableHead>',
              type: 'insert',
              newNumber: 22
            },
            {
              content: '+      </TableRow>',
              type: 'insert',
              newNumber: 23
            },
            {
              content: '+    </TableHeader>',
              type: 'insert',
              newNumber: 24
            },
            {
              content: '+    <TableBody>',
              type: 'insert',
              newNumber: 25
            },
            {
              content: '+      {props.map(({ name, required, defaultValue, description }) => (',
              type: 'insert',
              newNumber: 26
            },
            {
              content: '+        <TableRow key={name}>',
              type: 'insert',
              newNumber: 27
            },
            {
              content: '+          <TableCell title={description}>{name}</TableCell>',
              type: 'insert',
              newNumber: 28
            },
            {
              content: "+          <TableCell>{required ? 'yup' : 'nope'}</TableCell>",
              type: 'insert',
              newNumber: 29
            },
            {
              content: '+          <TableCell>{defaultValue}</TableCell>',
              type: 'insert',
              newNumber: 30
            },
            {
              content: '+        </TableRow>',
              type: 'insert',
              newNumber: 31
            },
            {
              content: '+      ))}',
              type: 'insert',
              newNumber: 32
            },
            {
              content: '+    </TableBody>',
              type: 'insert',
              newNumber: 33
            },
            {
              content: '+  </Table>',
              type: 'insert',
              newNumber: 34
            },
            {
              content: '+)',
              type: 'insert',
              newNumber: 35
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 36
            },
            {
              content: '+export default PropsTable',
              type: 'insert',
              newNumber: 37
            }
          ],
          oldStartLine: 0,
          oldStartLine2: null,
          newStartLine: 1,
          header: '@@ -0,0 +1,37 @@'
        }
      ],
      deletedLines: 0,
      addedLines: 37,
      isGitDiff: true,
      newFileMode: '100644',
      isNew: true,
      checksumBefore: '0000000000000000000000000000000000000000',
      checksumAfter: '8b8aeb204e6979d83260ddaccd5dda94830cfec1',
      oldName: '/dev/null',
      language: 'tsx',
      newName: 'apps/design-system/src/components/docs-page/props-table.tsx',
      isCombined: false,
      containerId: 'container-/dev/null::::apps/design-system/src/components/docs-page/props-table.tsx',
      contentId: 'content-/dev/null::::apps/design-system/src/components/docs-page/props-table.tsx',
      fileId: '/dev/null::::apps/design-system/src/components/docs-page/props-table.tsx',
      filePath: 'apps/design-system/src/components/docs-page/props-table.tsx',
      raw: "diff --git a/apps/design-system/src/components/docs-page/props-table.tsx b/apps/design-system/src/components/docs-page/props-table.tsx\nnew file mode 100644\nindex 0000000000000000000000000000000000000000..8b8aeb204e6979d83260ddaccd5dda94830cfec1\n--- /dev/null\n+++ b/apps/design-system/src/components/docs-page/props-table.tsx\n@@ -0,0 +1,37 @@\n+import { FC } from 'react'\n+\n+import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@harnessio/ui/components'\n+\n+interface PropDescription {\n+  name: string\n+  required?: boolean\n+  defaultValue?: string\n+  description?: string\n+}\n+\n+export interface PropsTableProps {\n+  props: PropDescription[]\n+}\n+\n+const PropsTable: FC<PropsTableProps> = ({ props }) => (\n+  <Table>\n+    <TableHeader>\n+      <TableRow>\n+        <TableHead>Prop</TableHead>\n+        <TableHead>Required</TableHead>\n+        <TableHead>Default</TableHead>\n+      </TableRow>\n+    </TableHeader>\n+    <TableBody>\n+      {props.map(({ name, required, defaultValue, description }) => (\n+        <TableRow key={name}>\n+          <TableCell title={description}>{name}</TableCell>\n+          <TableCell>{required ? 'yup' : 'nope'}</TableCell>\n+          <TableCell>{defaultValue}</TableCell>\n+        </TableRow>\n+      ))}\n+    </TableBody>\n+  </Table>\n+)\n+\n+export default PropsTable\n"
    },
    {
      blocks: [
        {
          lines: [
            {
              content: '+.section {',
              type: 'insert',
              newNumber: 1
            },
            {
              content: '+  display: flex;',
              type: 'insert',
              newNumber: 2
            },
            {
              content: '+  flex-direction: column;',
              type: 'insert',
              newNumber: 3
            },
            {
              content: '+  gap: 1rem;',
              type: 'insert',
              newNumber: 4
            },
            {
              content: '+}',
              type: 'insert',
              newNumber: 5
            }
          ],
          oldStartLine: 0,
          oldStartLine2: null,
          newStartLine: 1,
          header: '@@ -0,0 +1,5 @@'
        }
      ],
      deletedLines: 0,
      addedLines: 5,
      isGitDiff: true,
      newFileMode: '100644',
      isNew: true,
      checksumBefore: '0000000000000000000000000000000000000000',
      checksumAfter: 'ae4721f4d7594f7910a20d702b4c71f2daae4e0a',
      oldName: '/dev/null',
      language: 'css',
      newName: 'apps/design-system/src/components/docs-page/section.module.css',
      isCombined: false,
      containerId: 'container-/dev/null::::apps/design-system/src/components/docs-page/section.module.css',
      contentId: 'content-/dev/null::::apps/design-system/src/components/docs-page/section.module.css',
      fileId: '/dev/null::::apps/design-system/src/components/docs-page/section.module.css',
      filePath: 'apps/design-system/src/components/docs-page/section.module.css',
      raw: 'diff --git a/apps/design-system/src/components/docs-page/section.module.css b/apps/design-system/src/components/docs-page/section.module.css\nnew file mode 100644\nindex 0000000000000000000000000000000000000000..ae4721f4d7594f7910a20d702b4c71f2daae4e0a\n--- /dev/null\n+++ b/apps/design-system/src/components/docs-page/section.module.css\n@@ -0,0 +1,5 @@\n+.section {\n+  display: flex;\n+  flex-direction: column;\n+  gap: 1rem;\n+}\n'
    },
    {
      blocks: [
        {
          lines: [
            {
              content: ' ',
              type: 'context',
              oldNumber: 2,
              newNumber: 2
            },
            {
              content: " import { Text } from '@harnessio/ui/components'",
              type: 'context',
              oldNumber: 3,
              newNumber: 3
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 4,
              newNumber: 4
            },
            {
              content: "+import css from './section.module.css'",
              type: 'insert',
              newNumber: 5
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 6
            },
            {
              content: ' export interface SectionProps extends PropsWithChildren {',
              type: 'context',
              oldNumber: 5,
              newNumber: 7
            },
            {
              content: '   title: string',
              type: 'context',
              oldNumber: 6,
              newNumber: 8
            },
            {
              content: '   description?: ReactNode',
              type: 'context',
              oldNumber: 7,
              newNumber: 9
            },
            {
              content: ' }',
              type: 'context',
              oldNumber: 8,
              newNumber: 10
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 9,
              newNumber: 11
            },
            {
              content: ' const Section: FC<SectionProps> = ({ title, description, children }) => (',
              type: 'context',
              oldNumber: 10,
              newNumber: 12
            },
            {
              content: '-  <section>',
              type: 'delete',
              oldNumber: 11
            },
            {
              content: '+  <section className={css.section}>',
              type: 'insert',
              newNumber: 13
            },
            {
              content: '     <Text as="h3" size={5}>',
              type: 'context',
              oldNumber: 12,
              newNumber: 14
            },
            {
              content: '       {title}',
              type: 'context',
              oldNumber: 13,
              newNumber: 15
            },
            {
              content: '     </Text>',
              type: 'context',
              oldNumber: 14,
              newNumber: 16
            }
          ],
          oldStartLine: 2,
          oldStartLine2: null,
          newStartLine: 2,
          header: "@@ -2,13 +2,15 @@ import { FC, PropsWithChildren, ReactNode } from 'react'"
        }
      ],
      deletedLines: 1,
      addedLines: 3,
      isGitDiff: true,
      checksumBefore: '395cdc7b75f17ec147c82604c890d29c8181fa78',
      checksumAfter: '0d7d92a0a22cf451320980a9c0301ede2efd0c1d',
      mode: '100644',
      oldName: 'apps/design-system/src/components/docs-page/section.tsx',
      language: 'tsx',
      newName: 'apps/design-system/src/components/docs-page/section.tsx',
      isCombined: false,
      containerId:
        'container-apps/design-system/src/components/docs-page/section.tsx::::apps/design-system/src/components/docs-page/section.tsx',
      contentId:
        'content-apps/design-system/src/components/docs-page/section.tsx::::apps/design-system/src/components/docs-page/section.tsx',
      fileId:
        'apps/design-system/src/components/docs-page/section.tsx::::apps/design-system/src/components/docs-page/section.tsx',
      filePath: 'apps/design-system/src/components/docs-page/section.tsx',
      raw: "diff --git a/apps/design-system/src/components/docs-page/section.tsx b/apps/design-system/src/components/docs-page/section.tsx\nindex 395cdc7b75f17ec147c82604c890d29c8181fa78..0d7d92a0a22cf451320980a9c0301ede2efd0c1d 100644\n--- a/apps/design-system/src/components/docs-page/section.tsx\n+++ b/apps/design-system/src/components/docs-page/section.tsx\n@@ -2,13 +2,15 @@ import { FC, PropsWithChildren, ReactNode } from 'react'\n \n import { Text } from '@harnessio/ui/components'\n \n+import css from './section.module.css'\n+\n export interface SectionProps extends PropsWithChildren {\n   title: string\n   description?: ReactNode\n }\n \n const Section: FC<SectionProps> = ({ title, description, children }) => (\n-  <section>\n+  <section className={css.section}>\n     <Text as=\"h3\" size={5}>\n       {title}\n     </Text>\n"
    },
    {
      blocks: [
        {
          lines: [
            {
              content: "+import { FC, PropsWithChildren, ReactNode } from 'react'",
              type: 'insert',
              newNumber: 1
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 2
            },
            {
              content: "+import { Text } from '@harnessio/ui/components'",
              type: 'insert',
              newNumber: 3
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 4
            },
            {
              content: "+import css from './section.module.css'",
              type: 'insert',
              newNumber: 5
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 6
            },
            {
              content: '+export interface SubSectionProps extends PropsWithChildren {',
              type: 'insert',
              newNumber: 7
            },
            {
              content: '+  title: string',
              type: 'insert',
              newNumber: 8
            },
            {
              content: '+  description?: ReactNode',
              type: 'insert',
              newNumber: 9
            },
            {
              content: '+}',
              type: 'insert',
              newNumber: 10
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 11
            },
            {
              content: '+const SubSection: FC<SubSectionProps> = ({ title, description, children }) => (',
              type: 'insert',
              newNumber: 12
            },
            {
              content: '+  <section className={css.section}>',
              type: 'insert',
              newNumber: 13
            },
            {
              content: '+    <Text as="h4" size={4}>',
              type: 'insert',
              newNumber: 14
            },
            {
              content: '+      {title}',
              type: 'insert',
              newNumber: 15
            },
            {
              content: '+    </Text>',
              type: 'insert',
              newNumber: 16
            },
            {
              content: '+    {description}',
              type: 'insert',
              newNumber: 17
            },
            {
              content: '+    {children}',
              type: 'insert',
              newNumber: 18
            },
            {
              content: '+  </section>',
              type: 'insert',
              newNumber: 19
            },
            {
              content: '+)',
              type: 'insert',
              newNumber: 20
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 21
            },
            {
              content: '+export default SubSection',
              type: 'insert',
              newNumber: 22
            }
          ],
          oldStartLine: 0,
          oldStartLine2: null,
          newStartLine: 1,
          header: '@@ -0,0 +1,22 @@'
        }
      ],
      deletedLines: 0,
      addedLines: 22,
      isGitDiff: true,
      newFileMode: '100644',
      isNew: true,
      checksumBefore: '0000000000000000000000000000000000000000',
      checksumAfter: '90db2c3a606d6e32ad9d1d7d208bb02fa2d4b05e',
      oldName: '/dev/null',
      language: 'tsx',
      newName: 'apps/design-system/src/components/docs-page/sub-section.tsx',
      isCombined: false,
      containerId: 'container-/dev/null::::apps/design-system/src/components/docs-page/sub-section.tsx',
      contentId: 'content-/dev/null::::apps/design-system/src/components/docs-page/sub-section.tsx',
      fileId: '/dev/null::::apps/design-system/src/components/docs-page/sub-section.tsx',
      filePath: 'apps/design-system/src/components/docs-page/sub-section.tsx',
      raw: "diff --git a/apps/design-system/src/components/docs-page/sub-section.tsx b/apps/design-system/src/components/docs-page/sub-section.tsx\nnew file mode 100644\nindex 0000000000000000000000000000000000000000..90db2c3a606d6e32ad9d1d7d208bb02fa2d4b05e\n--- /dev/null\n+++ b/apps/design-system/src/components/docs-page/sub-section.tsx\n@@ -0,0 +1,22 @@\n+import { FC, PropsWithChildren, ReactNode } from 'react'\n+\n+import { Text } from '@harnessio/ui/components'\n+\n+import css from './section.module.css'\n+\n+export interface SubSectionProps extends PropsWithChildren {\n+  title: string\n+  description?: ReactNode\n+}\n+\n+const SubSection: FC<SubSectionProps> = ({ title, description, children }) => (\n+  <section className={css.section}>\n+    <Text as=\"h4\" size={4}>\n+      {title}\n+    </Text>\n+    {description}\n+    {children}\n+  </section>\n+)\n+\n+export default SubSection\n"
    },
    {
      blocks: [
        {
          lines: [
            {
              content: ' ',
              type: 'context',
              oldNumber: 3,
              newNumber: 3
            },
            {
              content: " import { noop, useThemeStore, useTranslationStore } from '@utils/viewUtils'",
              type: 'context',
              oldNumber: 4,
              newNumber: 4
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 5,
              newNumber: 5
            },
            {
              content: '-import {',
              type: 'delete',
              oldNumber: 6
            },
            {
              content: '-  Breadcrumb,',
              type: 'delete',
              oldNumber: 7
            },
            {
              content: '-  BreadcrumbItem,',
              type: 'delete',
              oldNumber: 8
            },
            {
              content: '-  BreadcrumbLink,',
              type: 'delete',
              oldNumber: 9
            },
            {
              content: '-  BreadcrumbList,',
              type: 'delete',
              oldNumber: 10
            },
            {
              content: '-  BreadcrumbSeparator,',
              type: 'delete',
              oldNumber: 11
            },
            {
              content: '-  Navbar,',
              type: 'delete',
              oldNumber: 12
            },
            {
              content: '-  NavbarItemType,',
              type: 'delete',
              oldNumber: 13
            },
            {
              content: '-  Topbar',
              type: 'delete',
              oldNumber: 14
            },
            {
              content: "-} from '@harnessio/ui/components'",
              type: 'delete',
              oldNumber: 15
            },
            {
              content: "+import { Breadcrumb, Navbar, NavbarItemType, Topbar } from '@harnessio/ui/components'",
              type: 'insert',
              newNumber: 6
            },
            {
              content: " import { SandboxLayout } from '@harnessio/ui/views'",
              type: 'context',
              oldNumber: 16,
              newNumber: 7
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 17,
              newNumber: 8
            },
            {
              content:
                ' const RootViewWrapper: FC<PropsWithChildren<{ asChild?: boolean }>> = ({ children, asChild = false }) => {',
              type: 'context',
              oldNumber: 18,
              newNumber: 9
            }
          ],
          oldStartLine: 3,
          oldStartLine2: null,
          newStartLine: 3,
          header: "@@ -3,16 +3,7 @@ import { Outlet, Route, Routes } from 'react-router-dom'"
        },
        {
          lines: [
            {
              content: '               <div className="bg-background-1 sticky top-0 z-40">',
              type: 'context',
              oldNumber: 62,
              newNumber: 53
            },
            {
              content: '                 <Topbar.Root>',
              type: 'context',
              oldNumber: 63,
              newNumber: 54
            },
            {
              content: '                   <Topbar.Left>',
              type: 'context',
              oldNumber: 64,
              newNumber: 55
            },
            {
              content: '-                    <Breadcrumb className="select-none">',
              type: 'delete',
              oldNumber: 65
            },
            {
              content: '-                      <BreadcrumbList>',
              type: 'delete',
              oldNumber: 66
            },
            {
              content: '-                        <BreadcrumbItem>',
              type: 'delete',
              oldNumber: 67
            },
            {
              content: '-                          <BreadcrumbLink href="#">Lorem</BreadcrumbLink>',
              type: 'delete',
              oldNumber: 68
            },
            {
              content: '-                        </BreadcrumbItem>',
              type: 'delete',
              oldNumber: 69
            },
            {
              content: '-                        <BreadcrumbSeparator />',
              type: 'delete',
              oldNumber: 70
            },
            {
              content: '-                        <BreadcrumbItem>',
              type: 'delete',
              oldNumber: 71
            },
            {
              content: '-                          <BreadcrumbLink href="#">Ipsum</BreadcrumbLink>',
              type: 'delete',
              oldNumber: 72
            },
            {
              content: '-                        </BreadcrumbItem>',
              type: 'delete',
              oldNumber: 73
            },
            {
              content: '-                        <BreadcrumbSeparator />',
              type: 'delete',
              oldNumber: 74
            },
            {
              content: '-                        <BreadcrumbItem>Dolor</BreadcrumbItem>',
              type: 'delete',
              oldNumber: 75
            },
            {
              content: '-                      </BreadcrumbList>',
              type: 'delete',
              oldNumber: 76
            },
            {
              content: '-                    </Breadcrumb>',
              type: 'delete',
              oldNumber: 77
            },
            {
              content: '+                    <Breadcrumb.Root className="select-none">',
              type: 'insert',
              newNumber: 56
            },
            {
              content: '+                      <Breadcrumb.List>',
              type: 'insert',
              newNumber: 57
            },
            {
              content: '+                        <Breadcrumb.Item>',
              type: 'insert',
              newNumber: 58
            },
            {
              content: '+                          <Breadcrumb.Link href="#">Lorem</Breadcrumb.Link>',
              type: 'insert',
              newNumber: 59
            },
            {
              content: '+                        </Breadcrumb.Item>',
              type: 'insert',
              newNumber: 60
            },
            {
              content: '+                        <Breadcrumb.Separator />',
              type: 'insert',
              newNumber: 61
            },
            {
              content: '+                        <Breadcrumb.Item>',
              type: 'insert',
              newNumber: 62
            },
            {
              content: '+                          <Breadcrumb.Link href="#">Ipsum</Breadcrumb.Link>',
              type: 'insert',
              newNumber: 63
            },
            {
              content: '+                        </Breadcrumb.Item>',
              type: 'insert',
              newNumber: 64
            },
            {
              content: '+                        <Breadcrumb.Separator />',
              type: 'insert',
              newNumber: 65
            },
            {
              content: '+                        <Breadcrumb.Item>Dolor</Breadcrumb.Item>',
              type: 'insert',
              newNumber: 66
            },
            {
              content: '+                      </Breadcrumb.List>',
              type: 'insert',
              newNumber: 67
            },
            {
              content: '+                    </Breadcrumb.Root>',
              type: 'insert',
              newNumber: 68
            },
            {
              content: '                   </Topbar.Left>',
              type: 'context',
              oldNumber: 78,
              newNumber: 69
            },
            {
              content: '                 </Topbar.Root>',
              type: 'context',
              oldNumber: 79,
              newNumber: 70
            },
            {
              content: '               </div>',
              type: 'context',
              oldNumber: 80,
              newNumber: 71
            }
          ],
          oldStartLine: 62,
          oldStartLine2: null,
          newStartLine: 53,
          header: '@@ -62,19 +53,19 @@ const RootViewWrapper: FC<PropsWithChildren<{ asChild?: boolean }>> = ({ childre'
        }
      ],
      deletedLines: 23,
      addedLines: 14,
      isGitDiff: true,
      checksumBefore: '31551abd93ce31e564e2304d83638dca29b302f2',
      checksumAfter: '57549ac177fdd0b5197f562edb3983a2f0197a1f',
      mode: '100644',
      oldName: 'apps/design-system/src/pages/view-preview/root-view-wrapper.tsx',
      language: 'tsx',
      newName: 'apps/design-system/src/pages/view-preview/root-view-wrapper.tsx',
      isCombined: false,
      containerId:
        'container-apps/design-system/src/pages/view-preview/root-view-wrapper.tsx::::apps/design-system/src/pages/view-preview/root-view-wrapper.tsx',
      contentId:
        'content-apps/design-system/src/pages/view-preview/root-view-wrapper.tsx::::apps/design-system/src/pages/view-preview/root-view-wrapper.tsx',
      fileId:
        'apps/design-system/src/pages/view-preview/root-view-wrapper.tsx::::apps/design-system/src/pages/view-preview/root-view-wrapper.tsx',
      filePath: 'apps/design-system/src/pages/view-preview/root-view-wrapper.tsx',
      raw: 'diff --git a/apps/design-system/src/pages/view-preview/root-view-wrapper.tsx b/apps/design-system/src/pages/view-preview/root-view-wrapper.tsx\nindex 31551abd93ce31e564e2304d83638dca29b302f2..57549ac177fdd0b5197f562edb3983a2f0197a1f 100644\n--- a/apps/design-system/src/pages/view-preview/root-view-wrapper.tsx\n+++ b/apps/design-system/src/pages/view-preview/root-view-wrapper.tsx\n@@ -3,16 +3,7 @@ import { Outlet, Route, Routes } from \'react-router-dom\'\n \n import { noop, useThemeStore, useTranslationStore } from \'@utils/viewUtils\'\n \n-import {\n-  Breadcrumb,\n-  BreadcrumbItem,\n-  BreadcrumbLink,\n-  BreadcrumbList,\n-  BreadcrumbSeparator,\n-  Navbar,\n-  NavbarItemType,\n-  Topbar\n-} from \'@harnessio/ui/components\'\n+import { Breadcrumb, Navbar, NavbarItemType, Topbar } from \'@harnessio/ui/components\'\n import { SandboxLayout } from \'@harnessio/ui/views\'\n \n const RootViewWrapper: FC<PropsWithChildren<{ asChild?: boolean }>> = ({ children, asChild = false }) => {\n@@ -62,19 +53,19 @@ const RootViewWrapper: FC<PropsWithChildren<{ asChild?: boolean }>> = ({ childre\n               <div className="bg-background-1 sticky top-0 z-40">\n                 <Topbar.Root>\n                   <Topbar.Left>\n-                    <Breadcrumb className="select-none">\n-                      <BreadcrumbList>\n-                        <BreadcrumbItem>\n-                          <BreadcrumbLink href="#">Lorem</BreadcrumbLink>\n-                        </BreadcrumbItem>\n-                        <BreadcrumbSeparator />\n-                        <BreadcrumbItem>\n-                          <BreadcrumbLink href="#">Ipsum</BreadcrumbLink>\n-                        </BreadcrumbItem>\n-                        <BreadcrumbSeparator />\n-                        <BreadcrumbItem>Dolor</BreadcrumbItem>\n-                      </BreadcrumbList>\n-                    </Breadcrumb>\n+                    <Breadcrumb.Root className="select-none">\n+                      <Breadcrumb.List>\n+                        <Breadcrumb.Item>\n+                          <Breadcrumb.Link href="#">Lorem</Breadcrumb.Link>\n+                        </Breadcrumb.Item>\n+                        <Breadcrumb.Separator />\n+                        <Breadcrumb.Item>\n+                          <Breadcrumb.Link href="#">Ipsum</Breadcrumb.Link>\n+                        </Breadcrumb.Item>\n+                        <Breadcrumb.Separator />\n+                        <Breadcrumb.Item>Dolor</Breadcrumb.Item>\n+                      </Breadcrumb.List>\n+                    </Breadcrumb.Root>\n                   </Topbar.Left>\n                 </Topbar.Root>\n               </div>\n'
    },
    {
      blocks: [
        {
          lines: [
            {
              content: "+import { DocsPage } from '@components/docs-page/docs-page'",
              type: 'insert',
              newNumber: 1
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 2
            },
            {
              content: '+const BreadcrumbComponent = () => (',
              type: 'insert',
              newNumber: 3
            },
            {
              content: '+  <DocsPage.Root>',
              type: 'insert',
              newNumber: 4
            },
            {
              content: '+    <DocsPage.Summary title="Breadcrumb">',
              type: 'insert',
              newNumber: 5
            },
            {
              content: '+      <p>',
              type: 'insert',
              newNumber: 6
            },
            {
              content:
                '+        A breadcrumbs is a list of links that help visualize the location of a page within the hierarchical structure of',
              type: 'insert',
              newNumber: 7
            },
            {
              content: '+        a site, it allows navigation up to any of the ancestors.',
              type: 'insert',
              newNumber: 8
            },
            {
              content: '+      </p>',
              type: 'insert',
              newNumber: 9
            },
            {
              content: '+    </DocsPage.Summary>',
              type: 'insert',
              newNumber: 10
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 11
            },
            {
              content: '+    <DocsPage.ComponentExample',
              type: 'insert',
              newNumber: 12
            },
            {
              content: '+      code={`',
              type: 'insert',
              newNumber: 13
            },
            {
              content: '+  <Breadcrumb.Root className="select-none">',
              type: 'insert',
              newNumber: 14
            },
            {
              content: '+    <Breadcrumb.List>',
              type: 'insert',
              newNumber: 15
            },
            {
              content: '+      <Breadcrumb.Item>',
              type: 'insert',
              newNumber: 16
            },
            {
              content: '+        <Breadcrumb.Link href="#">Lorem</Breadcrumb.Link>',
              type: 'insert',
              newNumber: 17
            },
            {
              content: '+      </Breadcrumb.Item>',
              type: 'insert',
              newNumber: 18
            },
            {
              content: '+      <Breadcrumb.Separator />',
              type: 'insert',
              newNumber: 19
            },
            {
              content: '+      <Breadcrumb.Ellipsis />',
              type: 'insert',
              newNumber: 20
            },
            {
              content: '+      <Breadcrumb.Separator />',
              type: 'insert',
              newNumber: 21
            },
            {
              content: '+      <Breadcrumb.Item>',
              type: 'insert',
              newNumber: 22
            },
            {
              content: '+        <Breadcrumb.Link href="#">Ipsum</Breadcrumb.Link>',
              type: 'insert',
              newNumber: 23
            },
            {
              content: '+      </Breadcrumb.Item>',
              type: 'insert',
              newNumber: 24
            },
            {
              content: '+      <Breadcrumb.Separator />',
              type: 'insert',
              newNumber: 25
            },
            {
              content: '+      <Breadcrumb.Page>Dolor</Breadcrumb.Page>',
              type: 'insert',
              newNumber: 26
            },
            {
              content: '+    </Breadcrumb.List>',
              type: 'insert',
              newNumber: 27
            },
            {
              content: '+  </Breadcrumb.Root>',
              type: 'insert',
              newNumber: 28
            },
            {
              content: '+    `}',
              type: 'insert',
              newNumber: 29
            },
            {
              content: '+    />',
              type: 'insert',
              newNumber: 30
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 31
            },
            {
              content: '+    <DocsPage.Section title="Anatomy">',
              type: 'insert',
              newNumber: 32
            },
            {
              content: '+      <p>All parts of the breadcrumb can be imported and composed as required.</p>',
              type: 'insert',
              newNumber: 33
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 34
            },
            {
              content: '+      <DocsPage.CodeBlock',
              type: 'insert',
              newNumber: 35
            },
            {
              content: '+        code={`<Breadcrumb.Root className="select-none">',
              type: 'insert',
              newNumber: 36
            },
            {
              content: '+  <Breadcrumb.List>',
              type: 'insert',
              newNumber: 37
            },
            {
              content: '+    <Breadcrumb.Item>',
              type: 'insert',
              newNumber: 38
            },
            {
              content: '+      <Breadcrumb.Link href="#">Lorem</Breadcrumb.Link>',
              type: 'insert',
              newNumber: 39
            },
            {
              content: '+    </Breadcrumb.Item>',
              type: 'insert',
              newNumber: 40
            },
            {
              content: '+    <Breadcrumb.Separator />',
              type: 'insert',
              newNumber: 41
            },
            {
              content: '+    <Breadcrumb.Ellipsis />',
              type: 'insert',
              newNumber: 42
            },
            {
              content: '+    <Breadcrumb.Separator />',
              type: 'insert',
              newNumber: 43
            },
            {
              content: '+    <Breadcrumb.Item>',
              type: 'insert',
              newNumber: 44
            },
            {
              content: '+      <Breadcrumb.Link href="#">Ipsum</Breadcrumb.Link>',
              type: 'insert',
              newNumber: 45
            },
            {
              content: '+    </Breadcrumb.Item>',
              type: 'insert',
              newNumber: 46
            },
            {
              content: '+    <Breadcrumb.Separator />',
              type: 'insert',
              newNumber: 47
            },
            {
              content: '+    <Breadcrumb.Page>Dolor</Breadcrumb.Page>',
              type: 'insert',
              newNumber: 48
            },
            {
              content: '+  </Breadcrumb.List>',
              type: 'insert',
              newNumber: 49
            },
            {
              content: '+</Breadcrumb.Root>`}',
              type: 'insert',
              newNumber: 50
            },
            {
              content: '+      />',
              type: 'insert',
              newNumber: 51
            },
            {
              content: '+    </DocsPage.Section>',
              type: 'insert',
              newNumber: 52
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 53
            },
            {
              content: '+    <DocsPage.Section title="API Reference">',
              type: 'insert',
              newNumber: 54
            },
            {
              content: '+      <DocsPage.SubSection title="Root">',
              type: 'insert',
              newNumber: 55
            },
            {
              content:
                '+        <p>The `Root` component wraps the breadcrumb with a `nav` tag for use as page navigation.</p>',
              type: 'insert',
              newNumber: 56
            },
            {
              content: '+        <DocsPage.PropsTable',
              type: 'insert',
              newNumber: 57
            },
            {
              content: '+          props={[',
              type: 'insert',
              newNumber: 58
            },
            {
              content:
                "+            { name: 'children', description: 'You can pass in your `Breadcrumb.List` as a child', required: true },",
              type: 'insert',
              newNumber: 59
            },
            {
              content: "+            { name: 'className', required: false }",
              type: 'insert',
              newNumber: 60
            },
            {
              content: '+          ]}',
              type: 'insert',
              newNumber: 61
            },
            {
              content: '+        />',
              type: 'insert',
              newNumber: 62
            },
            {
              content: '+      </DocsPage.SubSection>',
              type: 'insert',
              newNumber: 63
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 64
            },
            {
              content: '+      <DocsPage.SubSection title="List">',
              type: 'insert',
              newNumber: 65
            },
            {
              content:
                '+        <p>The `List` component adds styling to ensure the breadcrumb is displayed inline as a list.</p>',
              type: 'insert',
              newNumber: 66
            },
            {
              content: '+        <DocsPage.CodeBlock',
              type: 'insert',
              newNumber: 67
            },
            {
              content: '+          code={`<Breadcrumb.List>',
              type: 'insert',
              newNumber: 68
            },
            {
              content: '+  {/* Pass Breadcrumb.Item, Breadcrumb.Separator and Breadcrumb.Page elements as children */}',
              type: 'insert',
              newNumber: 69
            },
            {
              content: '+</Breadcrumb.List>`}',
              type: 'insert',
              newNumber: 70
            },
            {
              content: '+        />',
              type: 'insert',
              newNumber: 71
            },
            {
              content: '+        <DocsPage.PropsTable',
              type: 'insert',
              newNumber: 72
            },
            {
              content: '+          props={[',
              type: 'insert',
              newNumber: 73
            },
            {
              content:
                "+            { name: 'children', description: 'You can pass in your `Breadcrumb.Item`s as children', required: true },",
              type: 'insert',
              newNumber: 74
            },
            {
              content: "+            { name: 'className', required: false }",
              type: 'insert',
              newNumber: 75
            },
            {
              content: '+          ]}',
              type: 'insert',
              newNumber: 76
            },
            {
              content: '+        />',
              type: 'insert',
              newNumber: 77
            },
            {
              content: '+      </DocsPage.SubSection>',
              type: 'insert',
              newNumber: 78
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 79
            },
            {
              content: '+      <DocsPage.SubSection title="Item">',
              type: 'insert',
              newNumber: 80
            },
            {
              content: '+        <p>The `Item` component displays its contents as a node within the breadcrumb.</p>',
              type: 'insert',
              newNumber: 81
            },
            {
              content: '+        <DocsPage.CodeBlock',
              type: 'insert',
              newNumber: 82
            },
            {
              content: '+          code={`<Breadcrumb.Item>',
              type: 'insert',
              newNumber: 83
            },
            {
              content: '+  {/* Pass text, JSX elements or Breadcrumb.Link elements as children */}',
              type: 'insert',
              newNumber: 84
            },
            {
              content: '+</Breadcrumb.Item>`}',
              type: 'insert',
              newNumber: 85
            },
            {
              content: '+        />',
              type: 'insert',
              newNumber: 86
            },
            {
              content: '+        <DocsPage.PropsTable',
              type: 'insert',
              newNumber: 87
            },
            {
              content: '+          props={[',
              type: 'insert',
              newNumber: 88
            },
            {
              content: "+            { name: 'children', description: 'Content to display', required: true },",
              type: 'insert',
              newNumber: 89
            },
            {
              content: "+            { name: 'className', required: false }",
              type: 'insert',
              newNumber: 90
            },
            {
              content: '+          ]}',
              type: 'insert',
              newNumber: 91
            },
            {
              content: '+        />',
              type: 'insert',
              newNumber: 92
            },
            {
              content: '+      </DocsPage.SubSection>',
              type: 'insert',
              newNumber: 93
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 94
            },
            {
              content: '+      <DocsPage.SubSection title="Link">',
              type: 'insert',
              newNumber: 95
            },
            {
              content: '+        <p>',
              type: 'insert',
              newNumber: 96
            },
            {
              content:
                '+          The `Link` component can be passed as a child to an `Item` component to display a clickable breadcrumb item.',
              type: 'insert',
              newNumber: 97
            },
            {
              content: '+        </p>',
              type: 'insert',
              newNumber: 98
            },
            {
              content: '+        <DocsPage.CodeBlock',
              type: 'insert',
              newNumber: 99
            },
            {
              content: '+          code={`<Breadcrumb.Item>',
              type: 'insert',
              newNumber: 100
            },
            {
              content: '+  <Breadcrumb.Link href="#">',
              type: 'insert',
              newNumber: 101
            },
            {
              content: '+    Lorem',
              type: 'insert',
              newNumber: 102
            },
            {
              content: '+  </Breadcrumb.Link>',
              type: 'insert',
              newNumber: 103
            },
            {
              content: '+</Breadcrumb.Item>',
              type: 'insert',
              newNumber: 104
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 105
            },
            {
              content: '+<Breadcrumb.Item>',
              type: 'insert',
              newNumber: 106
            },
            {
              content: '+  <Breadcrumb.Link asChild>',
              type: 'insert',
              newNumber: 107
            },
            {
              content: '+    <button onClick={handleLinkClick}>Click me</button>',
              type: 'insert',
              newNumber: 108
            },
            {
              content: '+  </Breadcrumb.Link>',
              type: 'insert',
              newNumber: 109
            },
            {
              content: '+</Breadcrumb.Item>`}',
              type: 'insert',
              newNumber: 110
            },
            {
              content: '+        />',
              type: 'insert',
              newNumber: 111
            },
            {
              content: '+        <DocsPage.PropsTable',
              type: 'insert',
              newNumber: 112
            },
            {
              content: '+          props={[',
              type: 'insert',
              newNumber: 113
            },
            {
              content: "+            { name: 'href', description: 'Where to link to' },",
              type: 'insert',
              newNumber: 114
            },
            {
              content:
                "+            { name: 'children', description: 'Content to display in the link', required: true },",
              type: 'insert',
              newNumber: 115
            },
            {
              content: '+            {',
              type: 'insert',
              newNumber: 116
            },
            {
              content: "+              name: 'asChild',",
              type: 'insert',
              newNumber: 117
            },
            {
              content:
                "+              description: 'Render using the passed child element instead of as an anchor element',",
              type: 'insert',
              newNumber: 118
            },
            {
              content: "+              defaultValue: 'false'",
              type: 'insert',
              newNumber: 119
            },
            {
              content: '+            },',
              type: 'insert',
              newNumber: 120
            },
            {
              content: "+            { name: 'className' }",
              type: 'insert',
              newNumber: 121
            },
            {
              content: '+          ]}',
              type: 'insert',
              newNumber: 122
            },
            {
              content: '+        />',
              type: 'insert',
              newNumber: 123
            },
            {
              content: '+      </DocsPage.SubSection>',
              type: 'insert',
              newNumber: 124
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 125
            },
            {
              content: '+      <DocsPage.SubSection title="Page">',
              type: 'insert',
              newNumber: 126
            },
            {
              content: '+        <p>',
              type: 'insert',
              newNumber: 127
            },
            {
              content:
                '+          The `Page` component displays its contents as a node within the breadcrumb with styling to denote that it is',
              type: 'insert',
              newNumber: 128
            },
            {
              content: '+          the current page.',
              type: 'insert',
              newNumber: 129
            },
            {
              content: '+        </p>',
              type: 'insert',
              newNumber: 130
            },
            {
              content: '+        <DocsPage.CodeBlock code={`<Breadcrumb.Page>Lorem ipsum</Breadcrumb.Page>`} />',
              type: 'insert',
              newNumber: 131
            },
            {
              content: '+        <DocsPage.PropsTable',
              type: 'insert',
              newNumber: 132
            },
            {
              content: '+          props={[',
              type: 'insert',
              newNumber: 133
            },
            {
              content: "+            { name: 'children', description: 'Content to display', required: true },",
              type: 'insert',
              newNumber: 134
            },
            {
              content: "+            { name: 'className', required: false }",
              type: 'insert',
              newNumber: 135
            },
            {
              content: '+          ]}',
              type: 'insert',
              newNumber: 136
            },
            {
              content: '+        />',
              type: 'insert',
              newNumber: 137
            },
            {
              content: '+      </DocsPage.SubSection>',
              type: 'insert',
              newNumber: 138
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 139
            },
            {
              content: '+      <DocsPage.SubSection title="Separator">',
              type: 'insert',
              newNumber: 140
            },
            {
              content:
                '+        <p>The `Separator` component displays a separator between the items of the breadcrumb.</p>',
              type: 'insert',
              newNumber: 141
            },
            {
              content: '+        <DocsPage.CodeBlock',
              type: 'insert',
              newNumber: 142
            },
            {
              content: '+          code={`<Breadcrumb.Separator />',
              type: 'insert',
              newNumber: 143
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 144
            },
            {
              content: '+<Breadcrumb.Item>',
              type: 'insert',
              newNumber: 145
            },
            {
              content: '+  Lorem ipsum',
              type: 'insert',
              newNumber: 146
            },
            {
              content: '+</Breadcrumb.Item>',
              type: 'insert',
              newNumber: 147
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 148
            },
            {
              content: '+<Breadcrumb.Separator>',
              type: 'insert',
              newNumber: 149
            },
            {
              content: '+  &gt;',
              type: 'insert',
              newNumber: 150
            },
            {
              content: '+</Breadcrumb.Separator>`}',
              type: 'insert',
              newNumber: 151
            },
            {
              content: '+        />',
              type: 'insert',
              newNumber: 152
            },
            {
              content: '+        <DocsPage.PropsTable',
              type: 'insert',
              newNumber: 153
            },
            {
              content: '+          props={[',
              type: 'insert',
              newNumber: 154
            },
            {
              content: "+            { name: 'children', description: 'Content to display', defaultValue: '/' },",
              type: 'insert',
              newNumber: 155
            },
            {
              content: "+            { name: 'className', required: false }",
              type: 'insert',
              newNumber: 156
            },
            {
              content: '+          ]}',
              type: 'insert',
              newNumber: 157
            },
            {
              content: '+        />',
              type: 'insert',
              newNumber: 158
            },
            {
              content: '+      </DocsPage.SubSection>',
              type: 'insert',
              newNumber: 159
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 160
            },
            {
              content: '+      <DocsPage.SubSection title="Ellipsis">',
              type: 'insert',
              newNumber: 161
            },
            {
              content:
                '+        <p>The `Ellipsis` component displays an ellipsis for use when there are too many items to display.</p>',
              type: 'insert',
              newNumber: 162
            },
            {
              content: '+        <DocsPage.CodeBlock code={`<Breadcrumb.Ellipsis />`} />',
              type: 'insert',
              newNumber: 163
            },
            {
              content: "+        <DocsPage.PropsTable props={[{ name: 'className', required: false }]} />",
              type: 'insert',
              newNumber: 164
            },
            {
              content: '+      </DocsPage.SubSection>',
              type: 'insert',
              newNumber: 165
            },
            {
              content: '+    </DocsPage.Section>',
              type: 'insert',
              newNumber: 166
            },
            {
              content: '+  </DocsPage.Root>',
              type: 'insert',
              newNumber: 167
            },
            {
              content: '+)',
              type: 'insert',
              newNumber: 168
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 169
            },
            {
              content: '+export default BreadcrumbComponent',
              type: 'insert',
              newNumber: 170
            }
          ],
          oldStartLine: 0,
          oldStartLine2: null,
          newStartLine: 1,
          header: '@@ -0,0 +1,170 @@'
        }
      ],
      deletedLines: 0,
      addedLines: 170,
      isGitDiff: true,
      newFileMode: '100644',
      isNew: true,
      checksumBefore: '0000000000000000000000000000000000000000',
      checksumAfter: '35d3931575e2cebe57ae880faa5eecc1196fae09',
      oldName: '/dev/null',
      language: 'tsx',
      newName: 'apps/design-system/src/subjects/components/breadcrumb.tsx',
      isCombined: false,
      containerId: 'container-/dev/null::::apps/design-system/src/subjects/components/breadcrumb.tsx',
      contentId: 'content-/dev/null::::apps/design-system/src/subjects/components/breadcrumb.tsx',
      fileId: '/dev/null::::apps/design-system/src/subjects/components/breadcrumb.tsx',
      filePath: 'apps/design-system/src/subjects/components/breadcrumb.tsx',
      raw: "diff --git a/apps/design-system/src/subjects/components/breadcrumb.tsx b/apps/design-system/src/subjects/components/breadcrumb.tsx\nnew file mode 100644\nindex 0000000000000000000000000000000000000000..35d3931575e2cebe57ae880faa5eecc1196fae09\n--- /dev/null\n+++ b/apps/design-system/src/subjects/components/breadcrumb.tsx\n@@ -0,0 +1,170 @@\n+import { DocsPage } from '@components/docs-page/docs-page'\n+\n+const BreadcrumbComponent = () => (\n+  <DocsPage.Root>\n+    <DocsPage.Summary title=\"Breadcrumb\">\n+      <p>\n+        A breadcrumbs is a list of links that help visualize the location of a page within the hierarchical structure of\n+        a site, it allows navigation up to any of the ancestors.\n+      </p>\n+    </DocsPage.Summary>\n+\n+    <DocsPage.ComponentExample\n+      code={`\n+  <Breadcrumb.Root className=\"select-none\">\n+    <Breadcrumb.List>\n+      <Breadcrumb.Item>\n+        <Breadcrumb.Link href=\"#\">Lorem</Breadcrumb.Link>\n+      </Breadcrumb.Item>\n+      <Breadcrumb.Separator />\n+      <Breadcrumb.Ellipsis />\n+      <Breadcrumb.Separator />\n+      <Breadcrumb.Item>\n+        <Breadcrumb.Link href=\"#\">Ipsum</Breadcrumb.Link>\n+      </Breadcrumb.Item>\n+      <Breadcrumb.Separator />\n+      <Breadcrumb.Page>Dolor</Breadcrumb.Page>\n+    </Breadcrumb.List>\n+  </Breadcrumb.Root>\n+    `}\n+    />\n+\n+    <DocsPage.Section title=\"Anatomy\">\n+      <p>All parts of the breadcrumb can be imported and composed as required.</p>\n+\n+      <DocsPage.CodeBlock\n+        code={`<Breadcrumb.Root className=\"select-none\">\n+  <Breadcrumb.List>\n+    <Breadcrumb.Item>\n+      <Breadcrumb.Link href=\"#\">Lorem</Breadcrumb.Link>\n+    </Breadcrumb.Item>\n+    <Breadcrumb.Separator />\n+    <Breadcrumb.Ellipsis />\n+    <Breadcrumb.Separator />\n+    <Breadcrumb.Item>\n+      <Breadcrumb.Link href=\"#\">Ipsum</Breadcrumb.Link>\n+    </Breadcrumb.Item>\n+    <Breadcrumb.Separator />\n+    <Breadcrumb.Page>Dolor</Breadcrumb.Page>\n+  </Breadcrumb.List>\n+</Breadcrumb.Root>`}\n+      />\n+    </DocsPage.Section>\n+\n+    <DocsPage.Section title=\"API Reference\">\n+      <DocsPage.SubSection title=\"Root\">\n+        <p>The `Root` component wraps the breadcrumb with a `nav` tag for use as page navigation.</p>\n+        <DocsPage.PropsTable\n+          props={[\n+            { name: 'children', description: 'You can pass in your `Breadcrumb.List` as a child', required: true },\n+            { name: 'className', required: false }\n+          ]}\n+        />\n+      </DocsPage.SubSection>\n+\n+      <DocsPage.SubSection title=\"List\">\n+        <p>The `List` component adds styling to ensure the breadcrumb is displayed inline as a list.</p>\n+        <DocsPage.CodeBlock\n+          code={`<Breadcrumb.List>\n+  {/* Pass Breadcrumb.Item, Breadcrumb.Separator and Breadcrumb.Page elements as children */}\n+</Breadcrumb.List>`}\n+        />\n+        <DocsPage.PropsTable\n+          props={[\n+            { name: 'children', description: 'You can pass in your `Breadcrumb.Item`s as children', required: true },\n+            { name: 'className', required: false }\n+          ]}\n+        />\n+      </DocsPage.SubSection>\n+\n+      <DocsPage.SubSection title=\"Item\">\n+        <p>The `Item` component displays its contents as a node within the breadcrumb.</p>\n+        <DocsPage.CodeBlock\n+          code={`<Breadcrumb.Item>\n+  {/* Pass text, JSX elements or Breadcrumb.Link elements as children */}\n+</Breadcrumb.Item>`}\n+        />\n+        <DocsPage.PropsTable\n+          props={[\n+            { name: 'children', description: 'Content to display', required: true },\n+            { name: 'className', required: false }\n+          ]}\n+        />\n+      </DocsPage.SubSection>\n+\n+      <DocsPage.SubSection title=\"Link\">\n+        <p>\n+          The `Link` component can be passed as a child to an `Item` component to display a clickable breadcrumb item.\n+        </p>\n+        <DocsPage.CodeBlock\n+          code={`<Breadcrumb.Item>\n+  <Breadcrumb.Link href=\"#\">\n+    Lorem\n+  </Breadcrumb.Link>\n+</Breadcrumb.Item>\n+\n+<Breadcrumb.Item>\n+  <Breadcrumb.Link asChild>\n+    <button onClick={handleLinkClick}>Click me</button>\n+  </Breadcrumb.Link>\n+</Breadcrumb.Item>`}\n+        />\n+        <DocsPage.PropsTable\n+          props={[\n+            { name: 'href', description: 'Where to link to' },\n+            { name: 'children', description: 'Content to display in the link', required: true },\n+            {\n+              name: 'asChild',\n+              description: 'Render using the passed child element instead of as an anchor element',\n+              defaultValue: 'false'\n+            },\n+            { name: 'className' }\n+          ]}\n+        />\n+      </DocsPage.SubSection>\n+\n+      <DocsPage.SubSection title=\"Page\">\n+        <p>\n+          The `Page` component displays its contents as a node within the breadcrumb with styling to denote that it is\n+          the current page.\n+        </p>\n+        <DocsPage.CodeBlock code={`<Breadcrumb.Page>Lorem ipsum</Breadcrumb.Page>`} />\n+        <DocsPage.PropsTable\n+          props={[\n+            { name: 'children', description: 'Content to display', required: true },\n+            { name: 'className', required: false }\n+          ]}\n+        />\n+      </DocsPage.SubSection>\n+\n+      <DocsPage.SubSection title=\"Separator\">\n+        <p>The `Separator` component displays a separator between the items of the breadcrumb.</p>\n+        <DocsPage.CodeBlock\n+          code={`<Breadcrumb.Separator />\n+\n+<Breadcrumb.Item>\n+  Lorem ipsum\n+</Breadcrumb.Item>\n+\n+<Breadcrumb.Separator>\n+  &gt;\n+</Breadcrumb.Separator>`}\n+        />\n+        <DocsPage.PropsTable\n+          props={[\n+            { name: 'children', description: 'Content to display', defaultValue: '/' },\n+            { name: 'className', required: false }\n+          ]}\n+        />\n+      </DocsPage.SubSection>\n+\n+      <DocsPage.SubSection title=\"Ellipsis\">\n+        <p>The `Ellipsis` component displays an ellipsis for use when there are too many items to display.</p>\n+        <DocsPage.CodeBlock code={`<Breadcrumb.Ellipsis />`} />\n+        <DocsPage.PropsTable props={[{ name: 'className', required: false }]} />\n+      </DocsPage.SubSection>\n+    </DocsPage.Section>\n+  </DocsPage.Root>\n+)\n+\n+export default BreadcrumbComponent\n"
    },
    {
      blocks: [
        {
          lines: [
            {
              content: " import type { RouteProps } from 'react-router-dom'",
              type: 'context',
              oldNumber: 1,
              newNumber: 1
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 2,
              newNumber: 2
            },
            {
              content: "-import AlertComponent from '@subjects/components/alert'",
              type: 'delete',
              oldNumber: 3
            },
            {
              content: "-import BadgeComponent from '@subjects/components/badge'",
              type: 'delete',
              oldNumber: 4
            },
            {
              content: "-import ButtonComponent from '@subjects/components/button'",
              type: 'delete',
              oldNumber: 5
            },
            {
              content: "+import AlertComponent from './alert'",
              type: 'insert',
              newNumber: 3
            },
            {
              content: "+import BadgeComponent from './badge'",
              type: 'insert',
              newNumber: 4
            },
            {
              content: "+import BreadcrumbComponent from './breadcrumb'",
              type: 'insert',
              newNumber: 5
            },
            {
              content: "+import ButtonComponent from './button'",
              type: 'insert',
              newNumber: 6
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 6,
              newNumber: 7
            },
            {
              content: ' interface ComponentPage {',
              type: 'context',
              oldNumber: 7,
              newNumber: 8
            },
            {
              content: '   name: string',
              type: 'context',
              oldNumber: 8,
              newNumber: 9
            }
          ],
          oldStartLine: 1,
          oldStartLine2: null,
          newStartLine: 1,
          header: '@@ -1,8 +1,9 @@'
        },
        {
          lines: [
            {
              content: ' export const componentPages: ComponentPage[] = [',
              type: 'context',
              oldNumber: 13,
              newNumber: 14
            },
            {
              content: "   { name: 'Alert', path: 'alert', Component: AlertComponent },",
              type: 'context',
              oldNumber: 14,
              newNumber: 15
            },
            {
              content: "   { name: 'Badge', path: 'badge', Component: BadgeComponent },",
              type: 'context',
              oldNumber: 15,
              newNumber: 16
            },
            {
              content: "+  { name: 'Breadcrumb', path: 'breadcrumb', Component: BreadcrumbComponent },",
              type: 'insert',
              newNumber: 17
            },
            {
              content: "   { name: 'Button', path: 'button', Component: ButtonComponent }",
              type: 'context',
              oldNumber: 16,
              newNumber: 18
            },
            {
              content: ' ]',
              type: 'context',
              oldNumber: 17,
              newNumber: 19
            }
          ],
          oldStartLine: 13,
          oldStartLine2: null,
          newStartLine: 14,
          header: '@@ -13,5 +14,6 @@ interface ComponentPage {'
        }
      ],
      deletedLines: 3,
      addedLines: 5,
      isGitDiff: true,
      checksumBefore: 'e145a7e8e55ef2c5bc18bddc5ec7bc7ab1122372',
      checksumAfter: '12dbeedab5985b9b313fe89540da383288a972b7',
      mode: '100644',
      oldName: 'apps/design-system/src/subjects/components/componentPages.ts',
      language: 'ts',
      newName: 'apps/design-system/src/subjects/components/componentPages.ts',
      isCombined: false,
      containerId:
        'container-apps/design-system/src/subjects/components/componentPages.ts::::apps/design-system/src/subjects/components/componentPages.ts',
      contentId:
        'content-apps/design-system/src/subjects/components/componentPages.ts::::apps/design-system/src/subjects/components/componentPages.ts',
      fileId:
        'apps/design-system/src/subjects/components/componentPages.ts::::apps/design-system/src/subjects/components/componentPages.ts',
      filePath: 'apps/design-system/src/subjects/components/componentPages.ts',
      raw: "diff --git a/apps/design-system/src/subjects/components/componentPages.ts b/apps/design-system/src/subjects/components/componentPages.ts\nindex e145a7e8e55ef2c5bc18bddc5ec7bc7ab1122372..12dbeedab5985b9b313fe89540da383288a972b7 100644\n--- a/apps/design-system/src/subjects/components/componentPages.ts\n+++ b/apps/design-system/src/subjects/components/componentPages.ts\n@@ -1,8 +1,9 @@\n import type { RouteProps } from 'react-router-dom'\n \n-import AlertComponent from '@subjects/components/alert'\n-import BadgeComponent from '@subjects/components/badge'\n-import ButtonComponent from '@subjects/components/button'\n+import AlertComponent from './alert'\n+import BadgeComponent from './badge'\n+import BreadcrumbComponent from './breadcrumb'\n+import ButtonComponent from './button'\n \n interface ComponentPage {\n   name: string\n@@ -13,5 +14,6 @@ interface ComponentPage {\n export const componentPages: ComponentPage[] = [\n   { name: 'Alert', path: 'alert', Component: AlertComponent },\n   { name: 'Badge', path: 'badge', Component: BadgeComponent },\n+  { name: 'Breadcrumb', path: 'breadcrumb', Component: BreadcrumbComponent },\n   { name: 'Button', path: 'button', Component: ButtonComponent }\n ]\n"
    },
    {
      blocks: [
        {
          lines: [
            {
              content: " import { useMatches } from 'react-router-dom'",
              type: 'context',
              oldNumber: 1,
              newNumber: 1
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 2,
              newNumber: 2
            },
            {
              content: '-import {',
              type: 'delete',
              oldNumber: 3
            },
            {
              content: '-  Breadcrumb,',
              type: 'delete',
              oldNumber: 4
            },
            {
              content: '-  BreadcrumbItem,',
              type: 'delete',
              oldNumber: 5
            },
            {
              content: '-  BreadcrumbLink,',
              type: 'delete',
              oldNumber: 6
            },
            {
              content: '-  BreadcrumbList,',
              type: 'delete',
              oldNumber: 7
            },
            {
              content: '-  BreadcrumbSeparator,',
              type: 'delete',
              oldNumber: 8
            },
            {
              content: '-  Topbar',
              type: 'delete',
              oldNumber: 9
            },
            {
              content: "-} from '@harnessio/ui/components'",
              type: 'delete',
              oldNumber: 10
            },
            {
              content: "+import { Breadcrumb, Topbar } from '@harnessio/ui/components'",
              type: 'insert',
              newNumber: 3
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 11,
              newNumber: 4
            },
            {
              content: " import { CustomHandle } from '../../framework/routing/types'",
              type: 'context',
              oldNumber: 12,
              newNumber: 5
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 13,
              newNumber: 6
            }
          ],
          oldStartLine: 1,
          oldStartLine2: null,
          newStartLine: 1,
          header: '@@ -1,13 +1,6 @@'
        },
        {
          lines: [
            {
              content: '   return (',
              type: 'context',
              oldNumber: 17,
              newNumber: 10
            },
            {
              content: '     <Topbar.Root>',
              type: 'context',
              oldNumber: 18,
              newNumber: 11
            },
            {
              content: '       <Topbar.Left>',
              type: 'context',
              oldNumber: 19,
              newNumber: 12
            },
            {
              content: '-        <Breadcrumb className="select-none">',
              type: 'delete',
              oldNumber: 20
            },
            {
              content: '-          <BreadcrumbList>',
              type: 'delete',
              oldNumber: 21
            },
            {
              content: '+        <Breadcrumb.Root className="select-none">',
              type: 'insert',
              newNumber: 13
            },
            {
              content: '+          <Breadcrumb.List>',
              type: 'insert',
              newNumber: 14
            },
            {
              content: '             {matches.map((match, index) => {',
              type: 'context',
              oldNumber: 22,
              newNumber: 15
            },
            {
              content: '               const { breadcrumb } = (match.handle || {}) as CustomHandle',
              type: 'context',
              oldNumber: 23,
              newNumber: 16
            },
            {
              content: '               const isFirst = index === 1',
              type: 'context',
              oldNumber: 24,
              newNumber: 17
            }
          ],
          oldStartLine: 17,
          oldStartLine2: null,
          newStartLine: 10,
          header: '@@ -17,8 +10,8 @@ function Breadcrumbs() {'
        },
        {
          lines: [
            {
              content: '               if (!breadcrumb) return null',
              type: 'context',
              oldNumber: 27,
              newNumber: 20
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 28,
              newNumber: 21
            },
            {
              content: '               return (',
              type: 'context',
              oldNumber: 29,
              newNumber: 22
            },
            {
              content: '-                <BreadcrumbItem key={index}>',
              type: 'delete',
              oldNumber: 30
            },
            {
              content: '-                  {!isFirst ? <BreadcrumbSeparator /> : null}',
              type: 'delete',
              oldNumber: 31
            },
            {
              content: '+                <Breadcrumb.Item key={index}>',
              type: 'insert',
              newNumber: 23
            },
            {
              content: '+                  {!isFirst ? <Breadcrumb.Separator /> : null}',
              type: 'insert',
              newNumber: 24
            },
            {
              content: '                   {isLast ? (',
              type: 'context',
              oldNumber: 32,
              newNumber: 25
            },
            {
              content: '                     breadcrumb(match.params)',
              type: 'context',
              oldNumber: 33,
              newNumber: 26
            },
            {
              content: '                   ) : (',
              type: 'context',
              oldNumber: 34,
              newNumber: 27
            },
            {
              content:
                '-                    <BreadcrumbLink href={match.pathname}>{breadcrumb(match.params)}</BreadcrumbLink>',
              type: 'delete',
              oldNumber: 35
            },
            {
              content:
                '+                    <Breadcrumb.Link href={match.pathname}>{breadcrumb(match.params)}</Breadcrumb.Link>',
              type: 'insert',
              newNumber: 28
            },
            {
              content: '                   )}',
              type: 'context',
              oldNumber: 36,
              newNumber: 29
            },
            {
              content: '-                </BreadcrumbItem>',
              type: 'delete',
              oldNumber: 37
            },
            {
              content: '+                </Breadcrumb.Item>',
              type: 'insert',
              newNumber: 30
            },
            {
              content: '               )',
              type: 'context',
              oldNumber: 38,
              newNumber: 31
            },
            {
              content: '             })}',
              type: 'context',
              oldNumber: 39,
              newNumber: 32
            },
            {
              content: '-          </BreadcrumbList>',
              type: 'delete',
              oldNumber: 40
            },
            {
              content: '-        </Breadcrumb>',
              type: 'delete',
              oldNumber: 41
            },
            {
              content: '+          </Breadcrumb.List>',
              type: 'insert',
              newNumber: 33
            },
            {
              content: '+        </Breadcrumb.Root>',
              type: 'insert',
              newNumber: 34
            },
            {
              content: '       </Topbar.Left>',
              type: 'context',
              oldNumber: 42,
              newNumber: 35
            },
            {
              content: '     </Topbar.Root>',
              type: 'context',
              oldNumber: 43,
              newNumber: 36
            },
            {
              content: '   )',
              type: 'context',
              oldNumber: 44,
              newNumber: 37
            }
          ],
          oldStartLine: 27,
          oldStartLine2: null,
          newStartLine: 20,
          header: '@@ -27,18 +20,18 @@ function Breadcrumbs() {'
        }
      ],
      deletedLines: 16,
      addedLines: 9,
      isGitDiff: true,
      checksumBefore: '802f9d66f57c0fb61f917b5b9568a0177a259f66',
      checksumAfter: '3dfca19d21605a07f078e41d2eddea3be12bf46d',
      mode: '100644',
      oldName: 'apps/gitness/src/components-v2/breadcrumbs/breadcrumbs.tsx',
      language: 'tsx',
      newName: 'apps/gitness/src/components-v2/breadcrumbs/breadcrumbs.tsx',
      isCombined: false,
      containerId:
        'container-apps/gitness/src/components-v2/breadcrumbs/breadcrumbs.tsx::::apps/gitness/src/components-v2/breadcrumbs/breadcrumbs.tsx',
      contentId:
        'content-apps/gitness/src/components-v2/breadcrumbs/breadcrumbs.tsx::::apps/gitness/src/components-v2/breadcrumbs/breadcrumbs.tsx',
      fileId:
        'apps/gitness/src/components-v2/breadcrumbs/breadcrumbs.tsx::::apps/gitness/src/components-v2/breadcrumbs/breadcrumbs.tsx',
      filePath: 'apps/gitness/src/components-v2/breadcrumbs/breadcrumbs.tsx',
      raw: "diff --git a/apps/gitness/src/components-v2/breadcrumbs/breadcrumbs.tsx b/apps/gitness/src/components-v2/breadcrumbs/breadcrumbs.tsx\nindex 802f9d66f57c0fb61f917b5b9568a0177a259f66..3dfca19d21605a07f078e41d2eddea3be12bf46d 100644\n--- a/apps/gitness/src/components-v2/breadcrumbs/breadcrumbs.tsx\n+++ b/apps/gitness/src/components-v2/breadcrumbs/breadcrumbs.tsx\n@@ -1,13 +1,6 @@\n import { useMatches } from 'react-router-dom'\n \n-import {\n-  Breadcrumb,\n-  BreadcrumbItem,\n-  BreadcrumbLink,\n-  BreadcrumbList,\n-  BreadcrumbSeparator,\n-  Topbar\n-} from '@harnessio/ui/components'\n+import { Breadcrumb, Topbar } from '@harnessio/ui/components'\n \n import { CustomHandle } from '../../framework/routing/types'\n \n@@ -17,8 +10,8 @@ function Breadcrumbs() {\n   return (\n     <Topbar.Root>\n       <Topbar.Left>\n-        <Breadcrumb className=\"select-none\">\n-          <BreadcrumbList>\n+        <Breadcrumb.Root className=\"select-none\">\n+          <Breadcrumb.List>\n             {matches.map((match, index) => {\n               const { breadcrumb } = (match.handle || {}) as CustomHandle\n               const isFirst = index === 1\n@@ -27,18 +20,18 @@ function Breadcrumbs() {\n               if (!breadcrumb) return null\n \n               return (\n-                <BreadcrumbItem key={index}>\n-                  {!isFirst ? <BreadcrumbSeparator /> : null}\n+                <Breadcrumb.Item key={index}>\n+                  {!isFirst ? <Breadcrumb.Separator /> : null}\n                   {isLast ? (\n                     breadcrumb(match.params)\n                   ) : (\n-                    <BreadcrumbLink href={match.pathname}>{breadcrumb(match.params)}</BreadcrumbLink>\n+                    <Breadcrumb.Link href={match.pathname}>{breadcrumb(match.params)}</Breadcrumb.Link>\n                   )}\n-                </BreadcrumbItem>\n+                </Breadcrumb.Item>\n               )\n             })}\n-          </BreadcrumbList>\n-        </Breadcrumb>\n+          </Breadcrumb.List>\n+        </Breadcrumb.Root>\n       </Topbar.Left>\n     </Topbar.Root>\n   )\n"
    },
    {
      blocks: [
        {
          lines: [
            {
              content: '-import {',
              type: 'delete',
              oldNumber: 1
            },
            {
              content: '-  Breadcrumb,',
              type: 'delete',
              oldNumber: 2
            },
            {
              content: '-  BreadcrumbItem,',
              type: 'delete',
              oldNumber: 3
            },
            {
              content: '-  BreadcrumbLink,',
              type: 'delete',
              oldNumber: 4
            },
            {
              content: '-  BreadcrumbList,',
              type: 'delete',
              oldNumber: 5
            },
            {
              content: '-  BreadcrumbPage,',
              type: 'delete',
              oldNumber: 6
            },
            {
              content: '-  BreadcrumbSeparator',
              type: 'delete',
              oldNumber: 7
            },
            {
              content: "-} from '@harnessio/canary'",
              type: 'delete',
              oldNumber: 8
            },
            {
              content: "+import { Breadcrumb } from '@harnessio/ui/components'",
              type: 'insert',
              newNumber: 1
            },
            {
              content: " import { Topbar } from '@harnessio/views'",
              type: 'context',
              oldNumber: 9,
              newNumber: 2
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 10,
              newNumber: 3
            },
            {
              content: " import PipelineStudioHeaderActions from './pipeline-studio-header-actions'",
              type: 'context',
              oldNumber: 11,
              newNumber: 4
            }
          ],
          oldStartLine: 1,
          oldStartLine2: null,
          newStartLine: 1,
          header: '@@ -1,11 +1,4 @@'
        },
        {
          lines: [
            {
              content: '     <Topbar.Root>',
              type: 'context',
              oldNumber: 16,
              newNumber: 9
            },
            {
              content: '       <Topbar.Left>',
              type: 'context',
              oldNumber: 17,
              newNumber: 10
            },
            {
              content: '         {/** TODO: common component */}',
              type: 'context',
              oldNumber: 18,
              newNumber: 11
            },
            {
              content: '-        <Breadcrumb>',
              type: 'delete',
              oldNumber: 19
            },
            {
              content: '-          <BreadcrumbList>',
              type: 'delete',
              oldNumber: 20
            },
            {
              content: '-            <BreadcrumbItem>',
              type: 'delete',
              oldNumber: 21
            },
            {
              content: '-              <BreadcrumbLink href="/">harness-next</BreadcrumbLink>',
              type: 'delete',
              oldNumber: 22
            },
            {
              content: '-            </BreadcrumbItem>',
              type: 'delete',
              oldNumber: 23
            },
            {
              content: '-            <BreadcrumbSeparator className="font-thin">/</BreadcrumbSeparator>',
              type: 'delete',
              oldNumber: 24
            },
            {
              content: '-            <BreadcrumbPage>',
              type: 'delete',
              oldNumber: 25
            },
            {
              content: '-              <BreadcrumbLink href="/components">pipeline.yml</BreadcrumbLink>',
              type: 'delete',
              oldNumber: 26
            },
            {
              content: '-            </BreadcrumbPage>',
              type: 'delete',
              oldNumber: 27
            },
            {
              content: '-          </BreadcrumbList>',
              type: 'delete',
              oldNumber: 28
            },
            {
              content: '-        </Breadcrumb>',
              type: 'delete',
              oldNumber: 29
            },
            {
              content: '+        <Breadcrumb.Root>',
              type: 'insert',
              newNumber: 12
            },
            {
              content: '+          <Breadcrumb.List>',
              type: 'insert',
              newNumber: 13
            },
            {
              content: '+            <Breadcrumb.Item>',
              type: 'insert',
              newNumber: 14
            },
            {
              content: '+              <Breadcrumb.Link href="/">harness-next</Breadcrumb.Link>',
              type: 'insert',
              newNumber: 15
            },
            {
              content: '+            </Breadcrumb.Item>',
              type: 'insert',
              newNumber: 16
            },
            {
              content: '+            <Breadcrumb.Separator />',
              type: 'insert',
              newNumber: 17
            },
            {
              content: '+            <Breadcrumb.Page>',
              type: 'insert',
              newNumber: 18
            },
            {
              content: '+              <Breadcrumb.Link href="/components">pipeline.yml</Breadcrumb.Link>',
              type: 'insert',
              newNumber: 19
            },
            {
              content: '+            </Breadcrumb.Page>',
              type: 'insert',
              newNumber: 20
            },
            {
              content: '+          </Breadcrumb.List>',
              type: 'insert',
              newNumber: 21
            },
            {
              content: '+        </Breadcrumb.Root>',
              type: 'insert',
              newNumber: 22
            },
            {
              content: '       </Topbar.Left>',
              type: 'context',
              oldNumber: 30,
              newNumber: 23
            },
            {
              content: '       <Topbar.Right>',
              type: 'context',
              oldNumber: 31,
              newNumber: 24
            },
            {
              content: '         <PipelineStudioHeaderActions />',
              type: 'context',
              oldNumber: 32,
              newNumber: 25
            }
          ],
          oldStartLine: 16,
          oldStartLine2: null,
          newStartLine: 9,
          header: '@@ -16,17 +9,17 @@ export function PipelineStudioHeader(): JSX.Element {'
        }
      ],
      deletedLines: 19,
      addedLines: 12,
      isGitDiff: true,
      checksumBefore: '1986641e2e5fe4d5e3894ba2b2e0355b0e8ab18f',
      checksumAfter: '5d47345e6c47bbf7098896191daa3225351636a1',
      mode: '100644',
      oldName: 'apps/gitness/src/pages-v2/pipeline/pipeline-edit/components/pipeline-studio-header.tsx',
      language: 'tsx',
      newName: 'apps/gitness/src/pages-v2/pipeline/pipeline-edit/components/pipeline-studio-header.tsx',
      isCombined: false,
      containerId:
        'container-apps/gitness/src/pages-v2/pipeline/pipeline-edit/components/pipeline-studio-header.tsx::::apps/gitness/src/pages-v2/pipeline/pipeline-edit/components/pipeline-studio-header.tsx',
      contentId:
        'content-apps/gitness/src/pages-v2/pipeline/pipeline-edit/components/pipeline-studio-header.tsx::::apps/gitness/src/pages-v2/pipeline/pipeline-edit/components/pipeline-studio-header.tsx',
      fileId:
        'apps/gitness/src/pages-v2/pipeline/pipeline-edit/components/pipeline-studio-header.tsx::::apps/gitness/src/pages-v2/pipeline/pipeline-edit/components/pipeline-studio-header.tsx',
      filePath: 'apps/gitness/src/pages-v2/pipeline/pipeline-edit/components/pipeline-studio-header.tsx',
      raw: 'diff --git a/apps/gitness/src/pages-v2/pipeline/pipeline-edit/components/pipeline-studio-header.tsx b/apps/gitness/src/pages-v2/pipeline/pipeline-edit/components/pipeline-studio-header.tsx\nindex 1986641e2e5fe4d5e3894ba2b2e0355b0e8ab18f..5d47345e6c47bbf7098896191daa3225351636a1 100644\n--- a/apps/gitness/src/pages-v2/pipeline/pipeline-edit/components/pipeline-studio-header.tsx\n+++ b/apps/gitness/src/pages-v2/pipeline/pipeline-edit/components/pipeline-studio-header.tsx\n@@ -1,11 +1,4 @@\n-import {\n-  Breadcrumb,\n-  BreadcrumbItem,\n-  BreadcrumbLink,\n-  BreadcrumbList,\n-  BreadcrumbPage,\n-  BreadcrumbSeparator\n-} from \'@harnessio/canary\'\n+import { Breadcrumb } from \'@harnessio/ui/components\'\n import { Topbar } from \'@harnessio/views\'\n \n import PipelineStudioHeaderActions from \'./pipeline-studio-header-actions\'\n@@ -16,17 +9,17 @@ export function PipelineStudioHeader(): JSX.Element {\n     <Topbar.Root>\n       <Topbar.Left>\n         {/** TODO: common component */}\n-        <Breadcrumb>\n-          <BreadcrumbList>\n-            <BreadcrumbItem>\n-              <BreadcrumbLink href="/">harness-next</BreadcrumbLink>\n-            </BreadcrumbItem>\n-            <BreadcrumbSeparator className="font-thin">/</BreadcrumbSeparator>\n-            <BreadcrumbPage>\n-              <BreadcrumbLink href="/components">pipeline.yml</BreadcrumbLink>\n-            </BreadcrumbPage>\n-          </BreadcrumbList>\n-        </Breadcrumb>\n+        <Breadcrumb.Root>\n+          <Breadcrumb.List>\n+            <Breadcrumb.Item>\n+              <Breadcrumb.Link href="/">harness-next</Breadcrumb.Link>\n+            </Breadcrumb.Item>\n+            <Breadcrumb.Separator />\n+            <Breadcrumb.Page>\n+              <Breadcrumb.Link href="/components">pipeline.yml</Breadcrumb.Link>\n+            </Breadcrumb.Page>\n+          </Breadcrumb.List>\n+        </Breadcrumb.Root>\n       </Topbar.Left>\n       <Topbar.Right>\n         <PipelineStudioHeaderActions />\n'
    },
    {
      blocks: [
        {
          lines: [
            {
              content: " import { Navigate } from 'react-router-dom'",
              type: 'context',
              oldNumber: 1,
              newNumber: 1
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 2,
              newNumber: 2
            },
            {
              content: "-import { BreadcrumbSeparator, Text } from '@harnessio/ui/components'",
              type: 'delete',
              oldNumber: 3
            },
            {
              content: "+import { Breadcrumb, Text } from '@harnessio/ui/components'",
              type: 'insert',
              newNumber: 3
            },
            {
              content: " import { EmptyPage, RepoSettingsPage, SandboxLayout } from '@harnessio/ui/views'",
              type: 'context',
              oldNumber: 4,
              newNumber: 4
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 5,
              newNumber: 5
            },
            {
              content: " import AppShell from './components-v2/app-shell'",
              type: 'context',
              oldNumber: 6,
              newNumber: 6
            }
          ],
          oldStartLine: 1,
          oldStartLine2: null,
          newStartLine: 1,
          header: '@@ -1,6 +1,6 @@'
        },
        {
          lines: [
            {
              content: '           breadcrumb: () => (',
              type: 'context',
              oldNumber: 486,
              newNumber: 486
            },
            {
              content: '             <>',
              type: 'context',
              oldNumber: 487,
              newNumber: 487
            },
            {
              content: '               <Text>Account</Text>',
              type: 'context',
              oldNumber: 488,
              newNumber: 488
            },
            {
              content: '-              <BreadcrumbSeparator />',
              type: 'delete',
              oldNumber: 489
            },
            {
              content: '+              <Breadcrumb.Separator />',
              type: 'insert',
              newNumber: 489
            },
            {
              content: '               <Text>Users</Text>',
              type: 'context',
              oldNumber: 490,
              newNumber: 490
            },
            {
              content: '             </>',
              type: 'context',
              oldNumber: 491,
              newNumber: 491
            },
            {
              content: '           )',
              type: 'context',
              oldNumber: 492,
              newNumber: 492
            }
          ],
          oldStartLine: 486,
          oldStartLine2: null,
          newStartLine: 486,
          header: '@@ -486,7 +486,7 @@ export const routes: CustomRouteObject[] = ['
        },
        {
          lines: [
            {
              content: '           breadcrumb: () => (',
              type: 'context',
              oldNumber: 499,
              newNumber: 499
            },
            {
              content: '             <>',
              type: 'context',
              oldNumber: 500,
              newNumber: 500
            },
            {
              content: '               <Text>User</Text>',
              type: 'context',
              oldNumber: 501,
              newNumber: 501
            },
            {
              content: '-              <BreadcrumbSeparator className="mx-2.5" />',
              type: 'delete',
              oldNumber: 502
            },
            {
              content: '+              <Breadcrumb.Separator className="mx-2.5" />',
              type: 'insert',
              newNumber: 502
            },
            {
              content: '               <Text>Settings</Text>',
              type: 'context',
              oldNumber: 503,
              newNumber: 503
            },
            {
              content: '             </>',
              type: 'context',
              oldNumber: 504,
              newNumber: 504
            },
            {
              content: '           )',
              type: 'context',
              oldNumber: 505,
              newNumber: 505
            }
          ],
          oldStartLine: 499,
          oldStartLine2: null,
          newStartLine: 499,
          header: '@@ -499,7 +499,7 @@ export const routes: CustomRouteObject[] = ['
        }
      ],
      deletedLines: 3,
      addedLines: 3,
      isGitDiff: true,
      checksumBefore: 'f2d3a7332bea9f8fe67a416afed29bf524f3cd18',
      checksumAfter: '4f0fe9334a9cad3ce85910b0c540c319826b2205',
      mode: '100644',
      oldName: 'apps/gitness/src/routes.tsx',
      language: 'tsx',
      newName: 'apps/gitness/src/routes.tsx',
      isCombined: false,
      containerId: 'container-apps/gitness/src/routes.tsx::::apps/gitness/src/routes.tsx',
      contentId: 'content-apps/gitness/src/routes.tsx::::apps/gitness/src/routes.tsx',
      fileId: 'apps/gitness/src/routes.tsx::::apps/gitness/src/routes.tsx',
      filePath: 'apps/gitness/src/routes.tsx',
      raw: "diff --git a/apps/gitness/src/routes.tsx b/apps/gitness/src/routes.tsx\nindex f2d3a7332bea9f8fe67a416afed29bf524f3cd18..4f0fe9334a9cad3ce85910b0c540c319826b2205 100644\n--- a/apps/gitness/src/routes.tsx\n+++ b/apps/gitness/src/routes.tsx\n@@ -1,6 +1,6 @@\n import { Navigate } from 'react-router-dom'\n \n-import { BreadcrumbSeparator, Text } from '@harnessio/ui/components'\n+import { Breadcrumb, Text } from '@harnessio/ui/components'\n import { EmptyPage, RepoSettingsPage, SandboxLayout } from '@harnessio/ui/views'\n \n import AppShell from './components-v2/app-shell'\n@@ -486,7 +486,7 @@ export const routes: CustomRouteObject[] = [\n           breadcrumb: () => (\n             <>\n               <Text>Account</Text>\n-              <BreadcrumbSeparator />\n+              <Breadcrumb.Separator />\n               <Text>Users</Text>\n             </>\n           )\n@@ -499,7 +499,7 @@ export const routes: CustomRouteObject[] = [\n           breadcrumb: () => (\n             <>\n               <Text>User</Text>\n-              <BreadcrumbSeparator className=\"mx-2.5\" />\n+              <Breadcrumb.Separator className=\"mx-2.5\" />\n               <Text>Settings</Text>\n             </>\n           )\n"
    },
    {
      blocks: [
        {
          lines: [
            {
              content: " import { Slot } from '@radix-ui/react-slot'",
              type: 'context',
              oldNumber: 4,
              newNumber: 4
            },
            {
              content: " import { cn } from '@utils/cn'",
              type: 'context',
              oldNumber: 5,
              newNumber: 5
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 6,
              newNumber: 6
            },
            {
              content: "-type BreadcrumbProps = ComponentPropsWithoutRef<'nav'> & {",
              type: 'delete',
              oldNumber: 7
            },
            {
              content: "+type BreadcrumbRootProps = ComponentPropsWithoutRef<'nav'> & {",
              type: 'insert',
              newNumber: 7
            },
            {
              content: '   separator?: ReactNode',
              type: 'context',
              oldNumber: 8,
              newNumber: 8
            },
            {
              content: ' }',
              type: 'context',
              oldNumber: 9,
              newNumber: 9
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 10,
              newNumber: 10
            },
            {
              content: '-const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(({ ...props }, ref) => {',
              type: 'delete',
              oldNumber: 11
            },
            {
              content: '+const BreadcrumbRoot = forwardRef<HTMLElement, BreadcrumbRootProps>(({ ...props }, ref) => {',
              type: 'insert',
              newNumber: 11
            },
            {
              content: '   return <nav ref={ref} aria-label="breadcrumb" {...props} />',
              type: 'context',
              oldNumber: 12,
              newNumber: 12
            },
            {
              content: ' })',
              type: 'context',
              oldNumber: 13,
              newNumber: 13
            },
            {
              content: "-Breadcrumb.displayName = 'Breadcrumb'",
              type: 'delete',
              oldNumber: 14
            },
            {
              content: "+BreadcrumbRoot.displayName = 'BreadcrumbRoot'",
              type: 'insert',
              newNumber: 14
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 15,
              newNumber: 15
            },
            {
              content: " type BreadcrumbListProps = ComponentPropsWithoutRef<'ol'>",
              type: 'context',
              oldNumber: 16,
              newNumber: 16
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 17,
              newNumber: 17
            }
          ],
          oldStartLine: 4,
          oldStartLine2: null,
          newStartLine: 4,
          header: "@@ -4,14 +4,14 @@ import { DotsHorizontalIcon } from '@radix-ui/react-icons'"
        },
        {
          lines: [
            {
              content: ' )',
              type: 'context',
              oldNumber: 83,
              newNumber: 83
            },
            {
              content: " BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis'",
              type: 'context',
              oldNumber: 84,
              newNumber: 84
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 85,
              newNumber: 85
            },
            {
              content: '+const Breadcrumb = {',
              type: 'insert',
              newNumber: 86
            },
            {
              content: '+  Root: BreadcrumbRoot,',
              type: 'insert',
              newNumber: 87
            },
            {
              content: '+  List: BreadcrumbList,',
              type: 'insert',
              newNumber: 88
            },
            {
              content: '+  Item: BreadcrumbItem,',
              type: 'insert',
              newNumber: 89
            },
            {
              content: '+  Link: BreadcrumbLink,',
              type: 'insert',
              newNumber: 90
            },
            {
              content: '+  Page: BreadcrumbPage,',
              type: 'insert',
              newNumber: 91
            },
            {
              content: '+  Separator: BreadcrumbSeparator,',
              type: 'insert',
              newNumber: 92
            },
            {
              content: '+  Ellipsis: BreadcrumbEllipsis',
              type: 'insert',
              newNumber: 93
            },
            {
              content: '+}',
              type: 'insert',
              newNumber: 94
            },
            {
              content: '+',
              type: 'insert',
              newNumber: 95
            },
            {
              content: ' export {',
              type: 'context',
              oldNumber: 86,
              newNumber: 96
            },
            {
              content: '   Breadcrumb,',
              type: 'context',
              oldNumber: 87,
              newNumber: 97
            },
            {
              content: '-  BreadcrumbProps,',
              type: 'delete',
              oldNumber: 88
            },
            {
              content: '-  BreadcrumbList,',
              type: 'delete',
              oldNumber: 89
            },
            {
              content: '+  BreadcrumbRootProps,',
              type: 'insert',
              newNumber: 98
            },
            {
              content: '   BreadcrumbListProps,',
              type: 'context',
              oldNumber: 90,
              newNumber: 99
            },
            {
              content: '-  BreadcrumbItem,',
              type: 'delete',
              oldNumber: 91
            },
            {
              content: '   BreadcrumbItemProps,',
              type: 'context',
              oldNumber: 92,
              newNumber: 100
            },
            {
              content: '-  BreadcrumbLink,',
              type: 'delete',
              oldNumber: 93
            },
            {
              content: '   BreadcrumbLinkProps,',
              type: 'context',
              oldNumber: 94,
              newNumber: 101
            },
            {
              content: '-  BreadcrumbPage,',
              type: 'delete',
              oldNumber: 95
            },
            {
              content: '   BreadcrumbPageProps,',
              type: 'context',
              oldNumber: 96,
              newNumber: 102
            },
            {
              content: '-  BreadcrumbSeparator,',
              type: 'delete',
              oldNumber: 97
            },
            {
              content: '   BreadcrumbSeparatorProps,',
              type: 'context',
              oldNumber: 98,
              newNumber: 103
            },
            {
              content: '-  BreadcrumbEllipsis,',
              type: 'delete',
              oldNumber: 99
            },
            {
              content: '   BreadcrumbEllipsisProps',
              type: 'context',
              oldNumber: 100,
              newNumber: 104
            },
            {
              content: ' }',
              type: 'context',
              oldNumber: 101,
              newNumber: 105
            }
          ],
          oldStartLine: 83,
          oldStartLine2: null,
          newStartLine: 83,
          header: '@@ -83,19 +83,23 @@ const BreadcrumbEllipsis = ({ className, ...props }: BreadcrumbEllipsisProps) =>'
        }
      ],
      deletedLines: 10,
      addedLines: 14,
      isGitDiff: true,
      checksumBefore: '643b5ab48be6ec413ada7551967d252376e7b38f',
      checksumAfter: 'a7e03df75a1882cea32814c39d4895946a67fa6c',
      mode: '100644',
      oldName: 'packages/ui/src/components/breadcrumb.tsx',
      language: 'tsx',
      newName: 'packages/ui/src/components/breadcrumb.tsx',
      isCombined: false,
      containerId: 'container-packages/ui/src/components/breadcrumb.tsx::::packages/ui/src/components/breadcrumb.tsx',
      contentId: 'content-packages/ui/src/components/breadcrumb.tsx::::packages/ui/src/components/breadcrumb.tsx',
      fileId: 'packages/ui/src/components/breadcrumb.tsx::::packages/ui/src/components/breadcrumb.tsx',
      filePath: 'packages/ui/src/components/breadcrumb.tsx',
      raw: "diff --git a/packages/ui/src/components/breadcrumb.tsx b/packages/ui/src/components/breadcrumb.tsx\nindex 643b5ab48be6ec413ada7551967d252376e7b38f..a7e03df75a1882cea32814c39d4895946a67fa6c 100644\n--- a/packages/ui/src/components/breadcrumb.tsx\n+++ b/packages/ui/src/components/breadcrumb.tsx\n@@ -4,14 +4,14 @@ import { DotsHorizontalIcon } from '@radix-ui/react-icons'\n import { Slot } from '@radix-ui/react-slot'\n import { cn } from '@utils/cn'\n \n-type BreadcrumbProps = ComponentPropsWithoutRef<'nav'> & {\n+type BreadcrumbRootProps = ComponentPropsWithoutRef<'nav'> & {\n   separator?: ReactNode\n }\n \n-const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(({ ...props }, ref) => {\n+const BreadcrumbRoot = forwardRef<HTMLElement, BreadcrumbRootProps>(({ ...props }, ref) => {\n   return <nav ref={ref} aria-label=\"breadcrumb\" {...props} />\n })\n-Breadcrumb.displayName = 'Breadcrumb'\n+BreadcrumbRoot.displayName = 'BreadcrumbRoot'\n \n type BreadcrumbListProps = ComponentPropsWithoutRef<'ol'>\n \n@@ -83,19 +83,23 @@ const BreadcrumbEllipsis = ({ className, ...props }: BreadcrumbEllipsisProps) =>\n )\n BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis'\n \n+const Breadcrumb = {\n+  Root: BreadcrumbRoot,\n+  List: BreadcrumbList,\n+  Item: BreadcrumbItem,\n+  Link: BreadcrumbLink,\n+  Page: BreadcrumbPage,\n+  Separator: BreadcrumbSeparator,\n+  Ellipsis: BreadcrumbEllipsis\n+}\n+\n export {\n   Breadcrumb,\n-  BreadcrumbProps,\n-  BreadcrumbList,\n+  BreadcrumbRootProps,\n   BreadcrumbListProps,\n-  BreadcrumbItem,\n   BreadcrumbItemProps,\n-  BreadcrumbLink,\n   BreadcrumbLinkProps,\n-  BreadcrumbPage,\n   BreadcrumbPageProps,\n-  BreadcrumbSeparator,\n   BreadcrumbSeparatorProps,\n-  BreadcrumbEllipsis,\n   BreadcrumbEllipsisProps\n }\n"
    },
    {
      blocks: [
        {
          lines: [
            {
              content: '   >',
              type: 'context',
              oldNumber: 150,
              newNumber: 150
            },
            {
              content:
                '     <span className="absolute left-2 flex size-4 items-center justify-center rounded-full border border-icons-1">',
              type: 'context',
              oldNumber: 151,
              newNumber: 151
            },
            {
              content: '       <DropdownMenuPrimitive.ItemIndicator>',
              type: 'context',
              oldNumber: 152,
              newNumber: 152
            },
            {
              content: '-        <span className="size-2 bg-icons-2 rounded-full block" />',
              type: 'delete',
              oldNumber: 153
            },
            {
              content: '+        <span className="block size-2 rounded-full bg-icons-2" />',
              type: 'insert',
              newNumber: 153
            },
            {
              content: '       </DropdownMenuPrimitive.ItemIndicator>',
              type: 'context',
              oldNumber: 154,
              newNumber: 154
            },
            {
              content: '     </span>',
              type: 'context',
              oldNumber: 155,
              newNumber: 155
            },
            {
              content: '     {children}',
              type: 'context',
              oldNumber: 156,
              newNumber: 156
            }
          ],
          oldStartLine: 150,
          oldStartLine2: null,
          newStartLine: 150,
          header: '@@ -150,7 +150,7 @@ const DropdownMenuRadioItem = React.forwardRef<'
        }
      ],
      deletedLines: 1,
      addedLines: 1,
      isGitDiff: true,
      checksumBefore: 'b5476fe12dfc08aeb6c1478d4ca77c46b4263490',
      checksumAfter: '651d2b8a9c79fc3dbc8bae8dd60f039e14cf83bb',
      mode: '100644',
      oldName: 'packages/ui/src/components/dropdown-menu.tsx',
      language: 'tsx',
      newName: 'packages/ui/src/components/dropdown-menu.tsx',
      isCombined: false,
      containerId:
        'container-packages/ui/src/components/dropdown-menu.tsx::::packages/ui/src/components/dropdown-menu.tsx',
      contentId: 'content-packages/ui/src/components/dropdown-menu.tsx::::packages/ui/src/components/dropdown-menu.tsx',
      fileId: 'packages/ui/src/components/dropdown-menu.tsx::::packages/ui/src/components/dropdown-menu.tsx',
      filePath: 'packages/ui/src/components/dropdown-menu.tsx',
      raw: 'diff --git a/packages/ui/src/components/dropdown-menu.tsx b/packages/ui/src/components/dropdown-menu.tsx\nindex b5476fe12dfc08aeb6c1478d4ca77c46b4263490..651d2b8a9c79fc3dbc8bae8dd60f039e14cf83bb 100644\n--- a/packages/ui/src/components/dropdown-menu.tsx\n+++ b/packages/ui/src/components/dropdown-menu.tsx\n@@ -150,7 +150,7 @@ const DropdownMenuRadioItem = React.forwardRef<\n   >\n     <span className="absolute left-2 flex size-4 items-center justify-center rounded-full border border-icons-1">\n       <DropdownMenuPrimitive.ItemIndicator>\n-        <span className="size-2 bg-icons-2 rounded-full block" />\n+        <span className="block size-2 rounded-full bg-icons-2" />\n       </DropdownMenuPrimitive.ItemIndicator>\n     </span>\n     {children}\n'
    },
    {
      blocks: [
        {
          lines: [
            {
              content: " import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react'",
              type: 'context',
              oldNumber: 1,
              newNumber: 1
            },
            {
              content: " import { Link } from 'react-router-dom'",
              type: 'context',
              oldNumber: 2,
              newNumber: 2
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 3,
              newNumber: 3
            },
            {
              content: '-import {',
              type: 'delete',
              oldNumber: 4
            },
            {
              content: '-  Breadcrumb,',
              type: 'delete',
              oldNumber: 5
            },
            {
              content: '-  BreadcrumbItem,',
              type: 'delete',
              oldNumber: 6
            },
            {
              content: '-  BreadcrumbLink,',
              type: 'delete',
              oldNumber: 7
            },
            {
              content: '-  BreadcrumbList,',
              type: 'delete',
              oldNumber: 8
            },
            {
              content: '-  BreadcrumbPage,',
              type: 'delete',
              oldNumber: 9
            },
            {
              content: '-  BreadcrumbSeparator,',
              type: 'delete',
              oldNumber: 10
            },
            {
              content: '-  Icon,',
              type: 'delete',
              oldNumber: 11
            },
            {
              content: '-  Input',
              type: 'delete',
              oldNumber: 12
            },
            {
              content: "-} from '@/components'",
              type: 'delete',
              oldNumber: 13
            },
            {
              content: "+import { Breadcrumb, Icon, Input } from '@/components'",
              type: 'insert',
              newNumber: 4
            },
            {
              content: " import { debounce } from 'lodash-es'",
              type: 'context',
              oldNumber: 14,
              newNumber: 5
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 15,
              newNumber: 6
            },
            {
              content: ' interface InputPathBreadcrumbItemProps {',
              type: 'context',
              oldNumber: 16,
              newNumber: 7
            }
          ],
          oldStartLine: 1,
          oldStartLine2: null,
          newStartLine: 1,
          header: '@@ -1,16 +1,7 @@'
        },
        {
          lines: [
            {
              content: '   }',
              type: 'context',
              oldNumber: 113,
              newNumber: 104
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 114,
              newNumber: 105
            },
            {
              content: '   return (',
              type: 'context',
              oldNumber: 115,
              newNumber: 106
            },
            {
              content: '-    <Breadcrumb>',
              type: 'delete',
              oldNumber: 116
            },
            {
              content: '-      <BreadcrumbList>',
              type: 'delete',
              oldNumber: 117
            },
            {
              content: '+    <Breadcrumb.Root>',
              type: 'insert',
              newNumber: 107
            },
            {
              content: '+      <Breadcrumb.List>',
              type: 'insert',
              newNumber: 108
            },
            {
              content: '         {items.map(({ parentPath, path }, idx) => {',
              type: 'context',
              oldNumber: 118,
              newNumber: 109
            },
            {
              content: '           const isLast = length === idx + 1',
              type: 'context',
              oldNumber: 119,
              newNumber: 110
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 120,
              newNumber: 111
            },
            {
              content: '           if (isLast) {',
              type: 'context',
              oldNumber: 121,
              newNumber: 112
            },
            {
              content: '             return (',
              type: 'context',
              oldNumber: 122,
              newNumber: 113
            },
            {
              content: '-              <BreadcrumbItem key={idx}>',
              type: 'delete',
              oldNumber: 123
            },
            {
              content: '-                {isEdit ? renderInput() : <BreadcrumbPage>{path}</BreadcrumbPage>}',
              type: 'delete',
              oldNumber: 124
            },
            {
              content: '-              </BreadcrumbItem>',
              type: 'delete',
              oldNumber: 125
            },
            {
              content: '+              <Breadcrumb.Item key={idx}>',
              type: 'insert',
              newNumber: 114
            },
            {
              content: '+                {isEdit ? renderInput() : <Breadcrumb.Page>{path}</Breadcrumb.Page>}',
              type: 'insert',
              newNumber: 115
            },
            {
              content: '+              </Breadcrumb.Item>',
              type: 'insert',
              newNumber: 116
            },
            {
              content: '             )',
              type: 'context',
              oldNumber: 126,
              newNumber: 117
            },
            {
              content: '           }',
              type: 'context',
              oldNumber: 127,
              newNumber: 118
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 128,
              newNumber: 119
            },
            {
              content: '           return (',
              type: 'context',
              oldNumber: 129,
              newNumber: 120
            },
            {
              content: '             <Fragment key={idx}>',
              type: 'context',
              oldNumber: 130,
              newNumber: 121
            },
            {
              content: '-              <BreadcrumbItem>',
              type: 'delete',
              oldNumber: 131
            },
            {
              content: '-                <BreadcrumbLink asChild>',
              type: 'delete',
              oldNumber: 132
            },
            {
              content: '+              <Breadcrumb.Item>',
              type: 'insert',
              newNumber: 122
            },
            {
              content: '+                <Breadcrumb.Link asChild>',
              type: 'insert',
              newNumber: 123
            },
            {
              content: '                   <Link to={parentPath}>{path}</Link>',
              type: 'context',
              oldNumber: 133,
              newNumber: 124
            },
            {
              content: '-                </BreadcrumbLink>',
              type: 'delete',
              oldNumber: 134
            },
            {
              content: '-              </BreadcrumbItem>',
              type: 'delete',
              oldNumber: 135
            },
            {
              content: '-              <BreadcrumbSeparator />',
              type: 'delete',
              oldNumber: 136
            },
            {
              content: '+                </Breadcrumb.Link>',
              type: 'insert',
              newNumber: 125
            },
            {
              content: '+              </Breadcrumb.Item>',
              type: 'insert',
              newNumber: 126
            },
            {
              content: '+              <Breadcrumb.Separator />',
              type: 'insert',
              newNumber: 127
            },
            {
              content: '             </Fragment>',
              type: 'context',
              oldNumber: 137,
              newNumber: 128
            },
            {
              content: '           )',
              type: 'context',
              oldNumber: 138,
              newNumber: 129
            },
            {
              content: '         })}',
              type: 'context',
              oldNumber: 139,
              newNumber: 130
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 140,
              newNumber: 131
            },
            {
              content: '         {isNew && (',
              type: 'context',
              oldNumber: 141,
              newNumber: 132
            },
            {
              content: '           <>',
              type: 'context',
              oldNumber: 142,
              newNumber: 133
            },
            {
              content: '-            {!!items.length && <BreadcrumbSeparator />}',
              type: 'delete',
              oldNumber: 143
            },
            {
              content: '-            <BreadcrumbItem>{renderInput()}</BreadcrumbItem>',
              type: 'delete',
              oldNumber: 144
            },
            {
              content: '+            {!!items.length && <Breadcrumb.Separator />}',
              type: 'insert',
              newNumber: 134
            },
            {
              content: '+            <Breadcrumb.Item>{renderInput()}</Breadcrumb.Item>',
              type: 'insert',
              newNumber: 135
            },
            {
              content: '           </>',
              type: 'context',
              oldNumber: 145,
              newNumber: 136
            },
            {
              content: '         )}',
              type: 'context',
              oldNumber: 146,
              newNumber: 137
            },
            {
              content: '-      </BreadcrumbList>',
              type: 'delete',
              oldNumber: 147
            },
            {
              content: '-    </Breadcrumb>',
              type: 'delete',
              oldNumber: 148
            },
            {
              content: '+      </Breadcrumb.List>',
              type: 'insert',
              newNumber: 138
            },
            {
              content: '+    </Breadcrumb.Root>',
              type: 'insert',
              newNumber: 139
            },
            {
              content: '   )',
              type: 'context',
              oldNumber: 149,
              newNumber: 140
            },
            {
              content: ' }',
              type: 'context',
              oldNumber: 150,
              newNumber: 141
            }
          ],
          oldStartLine: 113,
          oldStartLine2: null,
          newStartLine: 104,
          header:
            '@@ -113,38 +104,38 @@ export const PathBreadcrumbs = ({ items, isEdit, isNew, ...props }: PathBreadcru'
        }
      ],
      deletedLines: 24,
      addedLines: 15,
      isGitDiff: true,
      checksumBefore: '77c3a3c32b739cf09935dc9f475d618bc97b5afc',
      checksumAfter: '0fa3cc01a986d5c85615b0daf9d1a3e055b59a29',
      mode: '100644',
      oldName: 'packages/ui/src/components/path-breadcrumbs.tsx',
      language: 'tsx',
      newName: 'packages/ui/src/components/path-breadcrumbs.tsx',
      isCombined: false,
      containerId:
        'container-packages/ui/src/components/path-breadcrumbs.tsx::::packages/ui/src/components/path-breadcrumbs.tsx',
      contentId:
        'content-packages/ui/src/components/path-breadcrumbs.tsx::::packages/ui/src/components/path-breadcrumbs.tsx',
      fileId: 'packages/ui/src/components/path-breadcrumbs.tsx::::packages/ui/src/components/path-breadcrumbs.tsx',
      filePath: 'packages/ui/src/components/path-breadcrumbs.tsx',
      raw: "diff --git a/packages/ui/src/components/path-breadcrumbs.tsx b/packages/ui/src/components/path-breadcrumbs.tsx\nindex 77c3a3c32b739cf09935dc9f475d618bc97b5afc..0fa3cc01a986d5c85615b0daf9d1a3e055b59a29 100644\n--- a/packages/ui/src/components/path-breadcrumbs.tsx\n+++ b/packages/ui/src/components/path-breadcrumbs.tsx\n@@ -1,16 +1,7 @@\n import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react'\n import { Link } from 'react-router-dom'\n \n-import {\n-  Breadcrumb,\n-  BreadcrumbItem,\n-  BreadcrumbLink,\n-  BreadcrumbList,\n-  BreadcrumbPage,\n-  BreadcrumbSeparator,\n-  Icon,\n-  Input\n-} from '@/components'\n+import { Breadcrumb, Icon, Input } from '@/components'\n import { debounce } from 'lodash-es'\n \n interface InputPathBreadcrumbItemProps {\n@@ -113,38 +104,38 @@ export const PathBreadcrumbs = ({ items, isEdit, isNew, ...props }: PathBreadcru\n   }\n \n   return (\n-    <Breadcrumb>\n-      <BreadcrumbList>\n+    <Breadcrumb.Root>\n+      <Breadcrumb.List>\n         {items.map(({ parentPath, path }, idx) => {\n           const isLast = length === idx + 1\n \n           if (isLast) {\n             return (\n-              <BreadcrumbItem key={idx}>\n-                {isEdit ? renderInput() : <BreadcrumbPage>{path}</BreadcrumbPage>}\n-              </BreadcrumbItem>\n+              <Breadcrumb.Item key={idx}>\n+                {isEdit ? renderInput() : <Breadcrumb.Page>{path}</Breadcrumb.Page>}\n+              </Breadcrumb.Item>\n             )\n           }\n \n           return (\n             <Fragment key={idx}>\n-              <BreadcrumbItem>\n-                <BreadcrumbLink asChild>\n+              <Breadcrumb.Item>\n+                <Breadcrumb.Link asChild>\n                   <Link to={parentPath}>{path}</Link>\n-                </BreadcrumbLink>\n-              </BreadcrumbItem>\n-              <BreadcrumbSeparator />\n+                </Breadcrumb.Link>\n+              </Breadcrumb.Item>\n+              <Breadcrumb.Separator />\n             </Fragment>\n           )\n         })}\n \n         {isNew && (\n           <>\n-            {!!items.length && <BreadcrumbSeparator />}\n-            <BreadcrumbItem>{renderInput()}</BreadcrumbItem>\n+            {!!items.length && <Breadcrumb.Separator />}\n+            <Breadcrumb.Item>{renderInput()}</Breadcrumb.Item>\n           </>\n         )}\n-      </BreadcrumbList>\n-    </Breadcrumb>\n+      </Breadcrumb.List>\n+    </Breadcrumb.Root>\n   )\n }\n"
    },
    {
      blocks: [
        {
          lines: [
            {
              content: "       underline: 'h-11 justify-center gap-4',",
              type: 'context',
              oldNumber: 11,
              newNumber: 11
            },
            {
              content: "       navigation: 'h-11 w-full justify-start gap-6 border-b border-borders-5 px-6',",
              type: 'context',
              oldNumber: 12,
              newNumber: 12
            },
            {
              content: '       tabnav:',
              type: 'context',
              oldNumber: 13,
              newNumber: 13
            },
            {
              content:
                "-        'relative flex w-full before:absolute before:left-0 before:h-px before:w-full before:bg-borders-1 before:bottom-0'",
              type: 'delete',
              oldNumber: 14
            },
            {
              content:
                "+        'relative flex w-full before:absolute before:bottom-0 before:left-0 before:h-px before:w-full before:bg-borders-1'",
              type: 'insert',
              newNumber: 14
            },
            {
              content: '     }',
              type: 'context',
              oldNumber: 15,
              newNumber: 15
            },
            {
              content: '   },',
              type: 'context',
              oldNumber: 16,
              newNumber: 16
            },
            {
              content: '   defaultVariants: {',
              type: 'context',
              oldNumber: 17,
              newNumber: 17
            }
          ],
          oldStartLine: 11,
          oldStartLine2: null,
          newStartLine: 11,
          header: "@@ -11,7 +11,7 @@ const tabsListVariants = cva('inline-flex items-center text-foreground-4', {"
        },
        {
          lines: [
            {
              content: '         navigation:',
              type: 'context',
              oldNumber: 30,
              newNumber: 30
            },
            {
              content:
                "           'm-0 -mb-px h-11 border-b border-solid border-b-transparent px-0 text-xs font-normal text-foreground-2 duration-150 ease-in-out hover:text-foreground-1 data-[state=active]:border-borders-9',",
              type: 'context',
              oldNumber: 31,
              newNumber: 31
            },
            {
              content: '         tabnav:',
              type: 'context',
              oldNumber: 32,
              newNumber: 32
            },
            {
              content:
                "-          'h-[36px] rounded-t-md border-x border-t border-transparent px-3.5 font-normal text-foreground-2 hover:text-foreground-1 data-[state=active]:border-borders-1 data-[state=active]:text-foreground-1 data-[state=active]:bg-background-1'",
              type: 'delete',
              oldNumber: 33
            },
            {
              content:
                "+          'h-[36px] rounded-t-md border-x border-t border-transparent px-3.5 font-normal text-foreground-2 hover:text-foreground-1 data-[state=active]:border-borders-1 data-[state=active]:bg-background-1 data-[state=active]:text-foreground-1'",
              type: 'insert',
              newNumber: 33
            },
            {
              content: '       }',
              type: 'context',
              oldNumber: 34,
              newNumber: 34
            },
            {
              content: '     },',
              type: 'context',
              oldNumber: 35,
              newNumber: 35
            },
            {
              content: '     defaultVariants: {',
              type: 'context',
              oldNumber: 36,
              newNumber: 36
            }
          ],
          oldStartLine: 30,
          oldStartLine2: null,
          newStartLine: 30,
          header: '@@ -30,7 +30,7 @@ const tabsTriggerVariants = cva('
        }
      ],
      deletedLines: 2,
      addedLines: 2,
      isGitDiff: true,
      checksumBefore: '5cbae7da53b01c1fdcd7d7e940e0c2c6c10dfce4',
      checksumAfter: '631a8515f53931f3a9ec94f17fb4c3499bef513d',
      mode: '100644',
      oldName: 'packages/ui/src/components/tabs.tsx',
      language: 'tsx',
      newName: 'packages/ui/src/components/tabs.tsx',
      isCombined: false,
      containerId: 'container-packages/ui/src/components/tabs.tsx::::packages/ui/src/components/tabs.tsx',
      contentId: 'content-packages/ui/src/components/tabs.tsx::::packages/ui/src/components/tabs.tsx',
      fileId: 'packages/ui/src/components/tabs.tsx::::packages/ui/src/components/tabs.tsx',
      filePath: 'packages/ui/src/components/tabs.tsx',
      raw: "diff --git a/packages/ui/src/components/tabs.tsx b/packages/ui/src/components/tabs.tsx\nindex 5cbae7da53b01c1fdcd7d7e940e0c2c6c10dfce4..631a8515f53931f3a9ec94f17fb4c3499bef513d 100644\n--- a/packages/ui/src/components/tabs.tsx\n+++ b/packages/ui/src/components/tabs.tsx\n@@ -11,7 +11,7 @@ const tabsListVariants = cva('inline-flex items-center text-foreground-4', {\n       underline: 'h-11 justify-center gap-4',\n       navigation: 'h-11 w-full justify-start gap-6 border-b border-borders-5 px-6',\n       tabnav:\n-        'relative flex w-full before:absolute before:left-0 before:h-px before:w-full before:bg-borders-1 before:bottom-0'\n+        'relative flex w-full before:absolute before:bottom-0 before:left-0 before:h-px before:w-full before:bg-borders-1'\n     }\n   },\n   defaultVariants: {\n@@ -30,7 +30,7 @@ const tabsTriggerVariants = cva(\n         navigation:\n           'm-0 -mb-px h-11 border-b border-solid border-b-transparent px-0 text-xs font-normal text-foreground-2 duration-150 ease-in-out hover:text-foreground-1 data-[state=active]:border-borders-9',\n         tabnav:\n-          'h-[36px] rounded-t-md border-x border-t border-transparent px-3.5 font-normal text-foreground-2 hover:text-foreground-1 data-[state=active]:border-borders-1 data-[state=active]:text-foreground-1 data-[state=active]:bg-background-1'\n+          'h-[36px] rounded-t-md border-x border-t border-transparent px-3.5 font-normal text-foreground-2 hover:text-foreground-1 data-[state=active]:border-borders-1 data-[state=active]:bg-background-1 data-[state=active]:text-foreground-1'\n       }\n     },\n     defaultVariants: {\n"
    },
    {
      blocks: [
        {
          lines: [
            {
              content: '           </Fieldset>',
              type: 'context',
              oldNumber: 166,
              newNumber: 166
            },
            {
              content: '         </FormWrapper>',
              type: 'context',
              oldNumber: 167,
              newNumber: 167
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 168,
              newNumber: 168
            },
            {
              content:
                '-        <Button size="sm" theme="error" className="self-start mt-7" onClick={setOpenDeleteDialog}>',
              type: 'delete',
              oldNumber: 169
            },
            {
              content:
                '+        <Button size="sm" theme="error" className="mt-7 self-start" onClick={setOpenDeleteDialog}>',
              type: 'insert',
              newNumber: 169
            },
            {
              content: '           Delete project',
              type: 'context',
              oldNumber: 170,
              newNumber: 170
            },
            {
              content: '         </Button>',
              type: 'context',
              oldNumber: 171,
              newNumber: 171
            },
            {
              content: '       </SandboxLayout.Content>',
              type: 'context',
              oldNumber: 172,
              newNumber: 172
            }
          ],
          oldStartLine: 166,
          oldStartLine2: null,
          newStartLine: 166,
          header: '@@ -166,7 +166,7 @@ export const ProjectSettingsGeneralPage = ({'
        }
      ],
      deletedLines: 1,
      addedLines: 1,
      isGitDiff: true,
      checksumBefore: '36baed560712faa1490360f38d0c32527e220b84',
      checksumAfter: '6e1a559823540f17dc001ec539639c3f4b6ed25c',
      mode: '100644',
      oldName: 'packages/ui/src/views/project/project-general/project-general-page.tsx',
      language: 'tsx',
      newName: 'packages/ui/src/views/project/project-general/project-general-page.tsx',
      isCombined: false,
      containerId:
        'container-packages/ui/src/views/project/project-general/project-general-page.tsx::::packages/ui/src/views/project/project-general/project-general-page.tsx',
      contentId:
        'content-packages/ui/src/views/project/project-general/project-general-page.tsx::::packages/ui/src/views/project/project-general/project-general-page.tsx',
      fileId:
        'packages/ui/src/views/project/project-general/project-general-page.tsx::::packages/ui/src/views/project/project-general/project-general-page.tsx',
      filePath: 'packages/ui/src/views/project/project-general/project-general-page.tsx',
      raw: 'diff --git a/packages/ui/src/views/project/project-general/project-general-page.tsx b/packages/ui/src/views/project/project-general/project-general-page.tsx\nindex 36baed560712faa1490360f38d0c32527e220b84..6e1a559823540f17dc001ec539639c3f4b6ed25c 100644\n--- a/packages/ui/src/views/project/project-general/project-general-page.tsx\n+++ b/packages/ui/src/views/project/project-general/project-general-page.tsx\n@@ -166,7 +166,7 @@ export const ProjectSettingsGeneralPage = ({\n           </Fieldset>\n         </FormWrapper>\n \n-        <Button size="sm" theme="error" className="self-start mt-7" onClick={setOpenDeleteDialog}>\n+        <Button size="sm" theme="error" className="mt-7 self-start" onClick={setOpenDeleteDialog}>\n           Delete project\n         </Button>\n       </SandboxLayout.Content>\n'
    },
    {
      blocks: [
        {
          lines: [
            {
              content: '   return (',
              type: 'context',
              oldNumber: 50,
              newNumber: 50
            },
            {
              content: '     <div className="flex flex-col gap-y-4">',
              type: 'context',
              oldNumber: 51,
              newNumber: 51
            },
            {
              content: '       <div className="flex items-center">',
              type: 'context',
              oldNumber: 52,
              newNumber: 52
            },
            {
              content: '-        <h1 className="text-foreground-1 font-medium text-24 flex gap-x-2.5">',
              type: 'delete',
              oldNumber: 53
            },
            {
              content: '+        <h1 className="flex gap-x-2.5 text-24 font-medium text-foreground-1">',
              type: 'insert',
              newNumber: 53
            },
            {
              content: '           {original}',
              type: 'context',
              oldNumber: 54,
              newNumber: 54
            },
            {
              content: '           <span className="font-normal text-foreground-4">#{number}</span>',
              type: 'context',
              oldNumber: 55,
              newNumber: 55
            },
            {
              content: '         </h1>',
              type: 'context',
              oldNumber: 56,
              newNumber: 56
            }
          ],
          oldStartLine: 50,
          oldStartLine2: null,
          newStartLine: 50,
          header: '@@ -50,7 +50,7 @@ export const PullRequestHeader: React.FC<PullRequestTitleProps> = ({'
        },
        {
          lines: [
            {
              content: '               {source_branch}',
              type: 'context',
              oldNumber: 82,
              newNumber: 82
            },
            {
              content: '             </Link>',
              type: 'context',
              oldNumber: 83,
              newNumber: 83
            },
            {
              content: '           </Badge>',
              type: 'context',
              oldNumber: 84,
              newNumber: 84
            },
            {
              content: '-          <span className="w-px h-4 mx-1.5 bg-borders-2" />',
              type: 'delete',
              oldNumber: 85
            },
            {
              content: '+          <span className="mx-1.5 h-4 w-px bg-borders-2" />',
              type: 'insert',
              newNumber: 85
            },
            {
              content: '           <span className="text-foreground-4">{formattedTime}</span>',
              type: 'context',
              oldNumber: 86,
              newNumber: 86
            },
            {
              content: '         </div>',
              type: 'context',
              oldNumber: 87,
              newNumber: 87
            },
            {
              content: '       </div>',
              type: 'context',
              oldNumber: 88,
              newNumber: 88
            }
          ],
          oldStartLine: 82,
          oldStartLine2: null,
          newStartLine: 82,
          header: '@@ -82,7 +82,7 @@ export const PullRequestHeader: React.FC<PullRequestTitleProps> = ({'
        }
      ],
      deletedLines: 2,
      addedLines: 2,
      isGitDiff: true,
      checksumBefore: '0e0a22511ef8f94379e3d1aa907cf82ef0d385ff',
      checksumAfter: '8cfd0819eb80a4a70596c94ef0a37f7f9b55c747',
      mode: '100644',
      oldName: 'packages/ui/src/views/repo/pull-request/components/pull-request-header.tsx',
      language: 'tsx',
      newName: 'packages/ui/src/views/repo/pull-request/components/pull-request-header.tsx',
      isCombined: false,
      containerId:
        'container-packages/ui/src/views/repo/pull-request/components/pull-request-header.tsx::::packages/ui/src/views/repo/pull-request/components/pull-request-header.tsx',
      contentId:
        'content-packages/ui/src/views/repo/pull-request/components/pull-request-header.tsx::::packages/ui/src/views/repo/pull-request/components/pull-request-header.tsx',
      fileId:
        'packages/ui/src/views/repo/pull-request/components/pull-request-header.tsx::::packages/ui/src/views/repo/pull-request/components/pull-request-header.tsx',
      filePath: 'packages/ui/src/views/repo/pull-request/components/pull-request-header.tsx',
      raw: 'diff --git a/packages/ui/src/views/repo/pull-request/components/pull-request-header.tsx b/packages/ui/src/views/repo/pull-request/components/pull-request-header.tsx\nindex 0e0a22511ef8f94379e3d1aa907cf82ef0d385ff..8cfd0819eb80a4a70596c94ef0a37f7f9b55c747 100644\n--- a/packages/ui/src/views/repo/pull-request/components/pull-request-header.tsx\n+++ b/packages/ui/src/views/repo/pull-request/components/pull-request-header.tsx\n@@ -50,7 +50,7 @@ export const PullRequestHeader: React.FC<PullRequestTitleProps> = ({\n   return (\n     <div className="flex flex-col gap-y-4">\n       <div className="flex items-center">\n-        <h1 className="text-foreground-1 font-medium text-24 flex gap-x-2.5">\n+        <h1 className="flex gap-x-2.5 text-24 font-medium text-foreground-1">\n           {original}\n           <span className="font-normal text-foreground-4">#{number}</span>\n         </h1>\n@@ -82,7 +82,7 @@ export const PullRequestHeader: React.FC<PullRequestTitleProps> = ({\n               {source_branch}\n             </Link>\n           </Badge>\n-          <span className="w-px h-4 mx-1.5 bg-borders-2" />\n+          <span className="mx-1.5 h-4 w-px bg-borders-2" />\n           <span className="text-foreground-4">{formattedTime}</span>\n         </div>\n       </div>\n'
    },
    {
      blocks: [
        {
          lines: [
            {
              content: '         </div>',
              type: 'context',
              oldNumber: 111,
              newNumber: 111
            },
            {
              content: '         {props.headerMsg && (',
              type: 'context',
              oldNumber: 112,
              newNumber: 112
            },
            {
              content: '           <div className="flex w-full justify-end">',
              type: 'context',
              oldNumber: 113,
              newNumber: 113
            },
            {
              content: '-            <span className="text-destructive text-12">{props.headerMsg}</span>',
              type: 'delete',
              oldNumber: 114
            },
            {
              content: '+            <span className="text-12 text-destructive">{props.headerMsg}</span>',
              type: 'insert',
              newNumber: 114
            },
            {
              content: '           </div>',
              type: 'context',
              oldNumber: 115,
              newNumber: 115
            },
            {
              content: '         )}',
              type: 'context',
              oldNumber: 116,
              newNumber: 116
            },
            {
              content: '       </>',
              type: 'context',
              oldNumber: 117,
              newNumber: 117
            }
          ],
          oldStartLine: 111,
          oldStartLine2: null,
          newStartLine: 111,
          header: '@@ -111,7 +111,7 @@ const HeaderTitle = ({ ...props }: HeaderProps) => {'
        },
        {
          lines: [
            {
              content: '                           }',
              type: 'context',
              oldNumber: 231,
              newNumber: 231
            },
            {
              content: '                         }}',
              type: 'context',
              oldNumber: 232,
              newNumber: 232
            },
            {
              content: '                       />',
              type: 'context',
              oldNumber: 233,
              newNumber: 233
            },
            {
              content: '-                      <span className="text-primary text-12">Bypass and merge anyway</span>',
              type: 'delete',
              oldNumber: 234
            },
            {
              content: '+                      <span className="text-12 text-primary">Bypass and merge anyway</span>',
              type: 'insert',
              newNumber: 234
            },
            {
              content: '                     </Layout.Horizontal>',
              type: 'context',
              oldNumber: 235,
              newNumber: 235
            },
            {
              content: '                   )}',
              type: 'context',
              oldNumber: 236,
              newNumber: 236
            },
            {
              content: '                   <Button',
              type: 'context',
              oldNumber: 237,
              newNumber: 237
            }
          ],
          oldStartLine: 231,
          oldStartLine2: null,
          newStartLine: 231,
          header: '@@ -231,7 +231,7 @@ const PullRequestPanel = ({'
        },
        {
          lines: [
            {
              content: '                                     key={action_idx}',
              type: 'context',
              oldNumber: 264,
              newNumber: 264
            },
            {
              content: '                                   >',
              type: 'context',
              oldNumber: 265,
              newNumber: 265
            },
            {
              content: '                                     <div className="flex flex-col">',
              type: 'context',
              oldNumber: 266,
              newNumber: 266
            },
            {
              content:
                '-                                      <span className="text-foreground-8 leading-none">{action.title}</span>',
              type: 'delete',
              oldNumber: 267
            },
            {
              content:
                '-                                      <span className="text-foreground-4 mt-1.5">{action.description}</span>',
              type: 'delete',
              oldNumber: 268
            },
            {
              content:
                '+                                      <span className="leading-none text-foreground-8">{action.title}</span>',
              type: 'insert',
              newNumber: 267
            },
            {
              content:
                '+                                      <span className="mt-1.5 text-foreground-4">{action.description}</span>',
              type: 'insert',
              newNumber: 268
            },
            {
              content: '                                     </div>',
              type: 'context',
              oldNumber: 269,
              newNumber: 269
            },
            {
              content: '                                   </DropdownMenuRadioItem>',
              type: 'context',
              oldNumber: 270,
              newNumber: 270
            },
            {
              content: '                                 )',
              type: 'context',
              oldNumber: 271,
              newNumber: 271
            }
          ],
          oldStartLine: 264,
          oldStartLine2: null,
          newStartLine: 264,
          header: '@@ -264,8 +264,8 @@ const PullRequestPanel = ({'
        }
      ],
      deletedLines: 4,
      addedLines: 4,
      isGitDiff: true,
      checksumBefore: '71db8359c70f7f01f8b9a71e0a9827a2d1537884',
      checksumAfter: '1229655a5a738429418d70498245284f33b197b7',
      mode: '100644',
      oldName: 'packages/ui/src/views/repo/pull-request/details/components/conversation/pull-request-panel.tsx',
      language: 'tsx',
      newName: 'packages/ui/src/views/repo/pull-request/details/components/conversation/pull-request-panel.tsx',
      isCombined: false,
      containerId:
        'container-packages/ui/src/views/repo/pull-request/details/components/conversation/pull-request-panel.tsx::::packages/ui/src/views/repo/pull-request/details/components/conversation/pull-request-panel.tsx',
      contentId:
        'content-packages/ui/src/views/repo/pull-request/details/components/conversation/pull-request-panel.tsx::::packages/ui/src/views/repo/pull-request/details/components/conversation/pull-request-panel.tsx',
      fileId:
        'packages/ui/src/views/repo/pull-request/details/components/conversation/pull-request-panel.tsx::::packages/ui/src/views/repo/pull-request/details/components/conversation/pull-request-panel.tsx',
      filePath: 'packages/ui/src/views/repo/pull-request/details/components/conversation/pull-request-panel.tsx',
      raw: 'diff --git a/packages/ui/src/views/repo/pull-request/details/components/conversation/pull-request-panel.tsx b/packages/ui/src/views/repo/pull-request/details/components/conversation/pull-request-panel.tsx\nindex 71db8359c70f7f01f8b9a71e0a9827a2d1537884..1229655a5a738429418d70498245284f33b197b7 100644\n--- a/packages/ui/src/views/repo/pull-request/details/components/conversation/pull-request-panel.tsx\n+++ b/packages/ui/src/views/repo/pull-request/details/components/conversation/pull-request-panel.tsx\n@@ -111,7 +111,7 @@ const HeaderTitle = ({ ...props }: HeaderProps) => {\n         </div>\n         {props.headerMsg && (\n           <div className="flex w-full justify-end">\n-            <span className="text-destructive text-12">{props.headerMsg}</span>\n+            <span className="text-12 text-destructive">{props.headerMsg}</span>\n           </div>\n         )}\n       </>\n@@ -231,7 +231,7 @@ const PullRequestPanel = ({\n                           }\n                         }}\n                       />\n-                      <span className="text-primary text-12">Bypass and merge anyway</span>\n+                      <span className="text-12 text-primary">Bypass and merge anyway</span>\n                     </Layout.Horizontal>\n                   )}\n                   <Button\n@@ -264,8 +264,8 @@ const PullRequestPanel = ({\n                                     key={action_idx}\n                                   >\n                                     <div className="flex flex-col">\n-                                      <span className="text-foreground-8 leading-none">{action.title}</span>\n-                                      <span className="text-foreground-4 mt-1.5">{action.description}</span>\n+                                      <span className="leading-none text-foreground-8">{action.title}</span>\n+                                      <span className="mt-1.5 text-foreground-4">{action.description}</span>\n                                     </div>\n                                   </DropdownMenuRadioItem>\n                                 )\n'
    },
    {
      blocks: [
        {
          lines: [
            {
              content: '   header: string',
              type: 'context',
              oldNumber: 67,
              newNumber: 67
            },
            {
              content: ' }',
              type: 'context',
              oldNumber: 68,
              newNumber: 68
            },
            {
              content: ' const HeaderItem: React.FC<HeaderItemProps> = ({ header }: HeaderItemProps) => {',
              type: 'context',
              oldNumber: 69,
              newNumber: 69
            },
            {
              content: '-  return <span className="text-foreground-3 text-12">{header}</span>',
              type: 'delete',
              oldNumber: 70
            },
            {
              content: '+  return <span className="text-12 text-foreground-3">{header}</span>',
              type: 'insert',
              newNumber: 70
            },
            {
              content: ' }',
              type: 'context',
              oldNumber: 71,
              newNumber: 71
            },
            {
              content: ' ',
              type: 'context',
              oldNumber: 72,
              newNumber: 72
            },
            {
              content: ' const AvatarItem: React.FC<AvatarItemProps> = ({ evaluations }: AvatarItemProps) => {',
              type: 'context',
              oldNumber: 73,
              newNumber: 73
            }
          ],
          oldStartLine: 67,
          oldStartLine2: null,
          newStartLine: 67,
          header: '@@ -67,7 +67,7 @@ interface HeaderItemProps {'
        },
        {
          lines: [
            {
              content: '             ((minApproval ?? 0) > 0 && minReqLatestApproval === undefined)) && (',
              type: 'context',
              oldNumber: 244,
              newNumber: 244
            },
            {
              content: '             <div className="ml-6 flex items-center justify-between">',
              type: 'context',
              oldNumber: 245,
              newNumber: 245
            },
            {
              content:
                '               {approvedEvaluations && minApproval && minApproval <= approvedEvaluations?.length ? (',
              type: 'context',
              oldNumber: 246,
              newNumber: 246
            },
            {
              content: '-                <div className="flex gap-x-2 items-center">',
              type: 'delete',
              oldNumber: 247
            },
            {
              content: '+                <div className="flex items-center gap-x-2">',
              type: 'insert',
              newNumber: 247
            },
            {
              content: '                   <Icon name="success" className="text-icons-success" />',
              type: 'context',
              oldNumber: 248,
              newNumber: 248
            },
            {
              content: '                   <span className="text-14 text-foreground-1">',
              type: 'context',
              oldNumber: 249,
              newNumber: 249
            },
            {
              content:
                "                     {`Changes were approved by ${approvedEvaluations?.length} ${easyPluralize(approvedEvaluations?.length, 'reviewer', 'reviewers')}`}",
              type: 'context',
              oldNumber: 250,
              newNumber: 250
            },
            {
              content: '                   </span>',
              type: 'context',
              oldNumber: 251,
              newNumber: 251
            },
            {
              content: '                 </div>',
              type: 'context',
              oldNumber: 252,
              newNumber: 252
            },
            {
              content: '               ) : (',
              type: 'context',
              oldNumber: 253,
              newNumber: 253
            },
            {
              content: '-                <div className="flex gap-x-2 items-center">',
              type: 'delete',
              oldNumber: 254
            },
            {
              content: '-                  <Icon name="circle" className="text-icons-7 fill-transparent" />',
              type: 'delete',
              oldNumber: 255
            },
            {
              content: '+                <div className="flex items-center gap-x-2">',
              type: 'insert',
              newNumber: 254
            },
            {
              content: '+                  <Icon name="circle" className="fill-transparent text-icons-7" />',
              type: 'insert',
              newNumber: 255
            },
            {
              content: '                   <span className="text-14 text-foreground-1">',
              type: 'context',
              oldNumber: 256,
              newNumber: 256
            },
            {
              content:
                "                     {`${(approvedEvaluations && approvedEvaluations.length) || ''}/${minApproval} approvals completed`}",
              type: 'context',
              oldNumber: 257,
              newNumber: 257
            },
            {
              content: '                   </span>',
              type: 'context',
              oldNumber: 258,
              newNumber: 258
            }
          ],
          oldStartLine: 244,
          oldStartLine2: null,
          newStartLine: 244,
          header: '@@ -244,15 +244,15 @@ const PullRequestChangesSection = ({'
        },
        {
          lines: [
            {
              content: '               {latestApprovalArr !== undefined &&',
              type: 'context',
              oldNumber: 269,
              newNumber: 269
            },
            {
              content: '               minReqLatestApproval !== undefined &&',
              type: 'context',
              oldNumber: 270,
              newNumber: 270
            },
            {
              content: '               minReqLatestApproval <= latestApprovalArr?.length ? (',
              type: 'context',
              oldNumber: 271,
              newNumber: 271
            },
            {
              content: '-                <div className="flex gap-x-2 items-center">',
              type: 'delete',
              oldNumber: 272
            },
            {
              content: '+                <div className="flex items-center gap-x-2">',
              type: 'insert',
              newNumber: 272
            },
            {
              content: '                   <Icon name="success" className="text-icons-success" />',
              type: 'context',
              oldNumber: 273,
              newNumber: 273
            },
            {
              content:
                "                   <span className=\"text-14 text-foreground-1\">{`Latest changes were approved by ${latestApprovalArr?.length || minReqLatestApproval || ''} ${easyPluralize(latestApprovalArr?.length || minReqLatestApproval, 'reviewer', 'reviewers')}`}</span>",
              type: 'context',
              oldNumber: 274,
              newNumber: 274
            },
            {
              content: '                 </div>',
              type: 'context',
              oldNumber: 275,
              newNumber: 275
            },
            {
              content: '               ) : (',
              type: 'context',
              oldNumber: 276,
              newNumber: 276
            },
            {
              content: '-                <div className="flex gap-x-2 items-center">',
              type: 'delete',
              oldNumber: 277
            },
            {
              content: '-                  <Icon name="circle" className="text-icons-7 fill-transparent" />',
              type: 'delete',
              oldNumber: 278
            },
            {
              content: '+                <div className="flex items-center gap-x-2">',
              type: 'insert',
              newNumber: 277
            },
            {
              content: '+                  <Icon name="circle" className="fill-transparent text-icons-7" />',
              type: 'insert',
              newNumber: 278
            },
            {
              content: '                   <span className="text-14 text-foreground-1">',
              type: 'context',
              oldNumber: 279,
              newNumber: 279
            },
            {
              content:
                "                     {`${latestApprovalArr?.length || minReqLatestApproval || ''} ${easyPluralize(latestApprovalArr?.length || minReqLatestApproval || 0, 'approval', 'approvals')} pending on latest changes`}",
              type: 'context',
              oldNumber: 280,
              newNumber: 280
            },
            {
              content: '                   </span>',
              type: 'context',
              oldNumber: 281,
              newNumber: 281
            }
          ],
          oldStartLine: 269,
          oldStartLine2: null,
          newStartLine: 269,
          header: '@@ -269,13 +269,13 @@ const PullRequestChangesSection = ({'
        },
        {
          lines: [
            {
              content: ' ',
              type: 'context',
              oldNumber: 289,
              newNumber: 289
            },
            {
              content: '           {!isEmpty(changeReqEvaluations) && (',
              type: 'context',
              oldNumber: 290,
              newNumber: 290
            },
            {
              content: '             <div className="ml-6 flex items-center justify-between">',
              type: 'context',
              oldNumber: 291,
              newNumber: 291
            },
            {
              content: '-              <div className="flex gap-x-2 items-center">',
              type: 'delete',
              oldNumber: 292
            },
            {
              content: '+              <div className="flex items-center gap-x-2">',
              type: 'insert',
              newNumber: 292
            },
            {
              content: '                 <Icon',
              type: 'context',
              oldNumber: 293,
              newNumber: 293
            },
            {
              content: '                   name="triangle-warning"',
              type: 'context',
              oldNumber: 294,
              newNumber: 294
            },
            {
              content: '                   className={cn({',
              type: 'context',
              oldNumber: 295,
              newNumber: 295
            }
          ],
          oldStartLine: 289,
          oldStartLine2: null,
          newStartLine: 289,
          header: '@@ -289,7 +289,7 @@ const PullRequestChangesSection = ({'
        },
        {
          lines: [
            {
              content: '           {!isEmpty(codeOwners) && !isEmpty(codeOwners.evaluation_entries) && (',
              type: 'context',
              oldNumber: 310,
              newNumber: 310
            },
            {
              content: '             <div className="ml-6 flex items-center justify-between">',
              type: 'context',
              oldNumber: 311,
              newNumber: 311
            },
            {
              content: '               {codeOwnerChangeReqEntries && codeOwnerChangeReqEntries?.length > 0 ? (',
              type: 'context',
              oldNumber: 312,
              newNumber: 312
            },
            {
              content: '-                <div className="flex gap-x-2 items-center">',
              type: 'delete',
              oldNumber: 313
            },
            {
              content: '+                <div className="flex items-center gap-x-2">',
              type: 'insert',
              newNumber: 313
            },
            {
              content: '                   <Icon',
              type: 'context',
              oldNumber: 314,
              newNumber: 314
            },
            {
              content: '                     name="triangle-warning"',
              type: 'context',
              oldNumber: 315,
              newNumber: 315
            },
            {
              content: '                     className={cn({',
              type: 'context',
              oldNumber: 316,
              newNumber: 316
            }
          ],
          oldStartLine: 310,
          oldStartLine2: null,
          newStartLine: 310,
          header: '@@ -310,7 +310,7 @@ const PullRequestChangesSection = ({'
        }
      ],
      deletedLines: 9,
      addedLines: 9,
      isGitDiff: true,
      checksumBefore: 'e06b76dd1b69885e022ce9188ee8d813dda07075',
      checksumAfter: '37284116f49710e2be9669ca7e65a6a4c7c54d0a',
      mode: '100644',
      oldName:
        'packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-changes-section.tsx',
      language: 'tsx',
      newName:
        'packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-changes-section.tsx',
      isCombined: false,
      containerId:
        'container-packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-changes-section.tsx::::packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-changes-section.tsx',
      contentId:
        'content-packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-changes-section.tsx::::packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-changes-section.tsx',
      fileId:
        'packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-changes-section.tsx::::packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-changes-section.tsx',
      filePath:
        'packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-changes-section.tsx',
      raw: 'diff --git a/packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-changes-section.tsx b/packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-changes-section.tsx\nindex e06b76dd1b69885e022ce9188ee8d813dda07075..37284116f49710e2be9669ca7e65a6a4c7c54d0a 100644\n--- a/packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-changes-section.tsx\n+++ b/packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-changes-section.tsx\n@@ -67,7 +67,7 @@ interface HeaderItemProps {\n   header: string\n }\n const HeaderItem: React.FC<HeaderItemProps> = ({ header }: HeaderItemProps) => {\n-  return <span className="text-foreground-3 text-12">{header}</span>\n+  return <span className="text-12 text-foreground-3">{header}</span>\n }\n \n const AvatarItem: React.FC<AvatarItemProps> = ({ evaluations }: AvatarItemProps) => {\n@@ -244,15 +244,15 @@ const PullRequestChangesSection = ({\n             ((minApproval ?? 0) > 0 && minReqLatestApproval === undefined)) && (\n             <div className="ml-6 flex items-center justify-between">\n               {approvedEvaluations && minApproval && minApproval <= approvedEvaluations?.length ? (\n-                <div className="flex gap-x-2 items-center">\n+                <div className="flex items-center gap-x-2">\n                   <Icon name="success" className="text-icons-success" />\n                   <span className="text-14 text-foreground-1">\n                     {`Changes were approved by ${approvedEvaluations?.length} ${easyPluralize(approvedEvaluations?.length, \'reviewer\', \'reviewers\')}`}\n                   </span>\n                 </div>\n               ) : (\n-                <div className="flex gap-x-2 items-center">\n-                  <Icon name="circle" className="text-icons-7 fill-transparent" />\n+                <div className="flex items-center gap-x-2">\n+                  <Icon name="circle" className="fill-transparent text-icons-7" />\n                   <span className="text-14 text-foreground-1">\n                     {`${(approvedEvaluations && approvedEvaluations.length) || \'\'}/${minApproval} approvals completed`}\n                   </span>\n@@ -269,13 +269,13 @@ const PullRequestChangesSection = ({\n               {latestApprovalArr !== undefined &&\n               minReqLatestApproval !== undefined &&\n               minReqLatestApproval <= latestApprovalArr?.length ? (\n-                <div className="flex gap-x-2 items-center">\n+                <div className="flex items-center gap-x-2">\n                   <Icon name="success" className="text-icons-success" />\n                   <span className="text-14 text-foreground-1">{`Latest changes were approved by ${latestApprovalArr?.length || minReqLatestApproval || \'\'} ${easyPluralize(latestApprovalArr?.length || minReqLatestApproval, \'reviewer\', \'reviewers\')}`}</span>\n                 </div>\n               ) : (\n-                <div className="flex gap-x-2 items-center">\n-                  <Icon name="circle" className="text-icons-7 fill-transparent" />\n+                <div className="flex items-center gap-x-2">\n+                  <Icon name="circle" className="fill-transparent text-icons-7" />\n                   <span className="text-14 text-foreground-1">\n                     {`${latestApprovalArr?.length || minReqLatestApproval || \'\'} ${easyPluralize(latestApprovalArr?.length || minReqLatestApproval || 0, \'approval\', \'approvals\')} pending on latest changes`}\n                   </span>\n@@ -289,7 +289,7 @@ const PullRequestChangesSection = ({\n \n           {!isEmpty(changeReqEvaluations) && (\n             <div className="ml-6 flex items-center justify-between">\n-              <div className="flex gap-x-2 items-center">\n+              <div className="flex items-center gap-x-2">\n                 <Icon\n                   name="triangle-warning"\n                   className={cn({\n@@ -310,7 +310,7 @@ const PullRequestChangesSection = ({\n           {!isEmpty(codeOwners) && !isEmpty(codeOwners.evaluation_entries) && (\n             <div className="ml-6 flex items-center justify-between">\n               {codeOwnerChangeReqEntries && codeOwnerChangeReqEntries?.length > 0 ? (\n-                <div className="flex gap-x-2 items-center">\n+                <div className="flex items-center gap-x-2">\n                   <Icon\n                     name="triangle-warning"\n                     className={cn({\n'
    },
    {
      blocks: [
        {
          lines: [
            {
              content: '   return (',
              type: 'context',
              oldNumber: 11,
              newNumber: 11
            },
            {
              content: '     <div className="inline-flex items-center gap-2">',
              type: 'context',
              oldNumber: 12,
              newNumber: 12
            },
            {
              content: '       {props.icon}',
              type: 'context',
              oldNumber: 13,
              newNumber: 13
            },
            {
              content: '-      <h3 className="font-medium text-14">{props.text}</h3>',
              type: 'delete',
              oldNumber: 14
            },
            {
              content: '+      <h3 className="text-14 font-medium">{props.text}</h3>',
              type: 'insert',
              newNumber: 14
            },
            {
              content: '     </div>',
              type: 'context',
              oldNumber: 15,
              newNumber: 15
            },
            {
              content: '   )',
              type: 'context',
              oldNumber: 16,
              newNumber: 16
            },
            {
              content: ' }',
              type: 'context',
              oldNumber: 17,
              newNumber: 17
            }
          ],
          oldStartLine: 11,
          oldStartLine2: null,
          newStartLine: 11,
          header: '@@ -11,7 +11,7 @@ export const LineTitle = ({ ...props }: LineTitleProps) => {'
        },
        {
          lines: [
            {
              content: ' export const LineDescription = ({ ...props }: LineDescriptionProps) => {',
              type: 'context',
              oldNumber: 19,
              newNumber: 19
            },
            {
              content: '   return (',
              type: 'context',
              oldNumber: 20,
              newNumber: 20
            },
            {
              content: '     <div className="ml-6 inline-flex items-center gap-2">',
              type: 'context',
              oldNumber: 21,
              newNumber: 21
            },
            {
              content: '-      <p className="text-foreground-4 text-14 font-normal">{props.text}</p>',
              type: 'delete',
              oldNumber: 22
            },
            {
              content: '+      <p className="text-14 font-normal text-foreground-4">{props.text}</p>',
              type: 'insert',
              newNumber: 22
            },
            {
              content: '     </div>',
              type: 'context',
              oldNumber: 23,
              newNumber: 23
            },
            {
              content: '   )',
              type: 'context',
              oldNumber: 24,
              newNumber: 24
            },
            {
              content: ' }',
              type: 'context',
              oldNumber: 25,
              newNumber: 25
            }
          ],
          oldStartLine: 19,
          oldStartLine2: null,
          newStartLine: 19,
          header: '@@ -19,7 +19,7 @@ export const LineTitle = ({ ...props }: LineTitleProps) => {'
        }
      ],
      deletedLines: 2,
      addedLines: 2,
      isGitDiff: true,
      checksumBefore: '28933260b802c33ecfb573c3b9830a5eced38bec',
      checksumAfter: '56cbf4bb612386ac59b554a71b1b7d2bfd1c67fe',
      mode: '100644',
      oldName:
        'packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-line-title.tsx',
      language: 'tsx',
      newName:
        'packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-line-title.tsx',
      isCombined: false,
      containerId:
        'container-packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-line-title.tsx::::packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-line-title.tsx',
      contentId:
        'content-packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-line-title.tsx::::packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-line-title.tsx',
      fileId:
        'packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-line-title.tsx::::packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-line-title.tsx',
      filePath:
        'packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-line-title.tsx',
      raw: 'diff --git a/packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-line-title.tsx b/packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-line-title.tsx\nindex 28933260b802c33ecfb573c3b9830a5eced38bec..56cbf4bb612386ac59b554a71b1b7d2bfd1c67fe 100644\n--- a/packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-line-title.tsx\n+++ b/packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-line-title.tsx\n@@ -11,7 +11,7 @@ export const LineTitle = ({ ...props }: LineTitleProps) => {\n   return (\n     <div className="inline-flex items-center gap-2">\n       {props.icon}\n-      <h3 className="font-medium text-14">{props.text}</h3>\n+      <h3 className="text-14 font-medium">{props.text}</h3>\n     </div>\n   )\n }\n@@ -19,7 +19,7 @@ export const LineTitle = ({ ...props }: LineTitleProps) => {\n export const LineDescription = ({ ...props }: LineDescriptionProps) => {\n   return (\n     <div className="ml-6 inline-flex items-center gap-2">\n-      <p className="text-foreground-4 text-14 font-normal">{props.text}</p>\n+      <p className="text-14 font-normal text-foreground-4">{props.text}</p>\n     </div>\n   )\n }\n'
    },
    {
      blocks: [
        {
          lines: [
            {
              content: "               <LineDescription text={'Checking for ability to merge automatically...'} />",
              type: 'context',
              oldNumber: 49,
              newNumber: 49
            },
            {
              content: '             ) : !mergeable ? (',
              type: 'context',
              oldNumber: 50,
              newNumber: 50
            },
            {
              content: '               <div className="ml-6 inline-flex items-center gap-2">',
              type: 'context',
              oldNumber: 51,
              newNumber: 51
            },
            {
              content: '-                <p className="text-foreground-4 text-14 font-normal">',
              type: 'delete',
              oldNumber: 52
            },
            {
              content: '+                <p className="text-14 font-normal text-foreground-4">',
              type: 'insert',
              newNumber: 52
            },
            {
              content: '                   Use the',
              type: 'context',
              oldNumber: 53,
              newNumber: 53
            },
            {
              content: '                   <span',
              type: 'context',
              oldNumber: 54,
              newNumber: 54
            },
            {
              content: '                     // onClick={() => {',
              type: 'context',
              oldNumber: 55,
              newNumber: 55
            }
          ],
          oldStartLine: 49,
          oldStartLine2: null,
          newStartLine: 49,
          header: '@@ -49,7 +49,7 @@ const PullRequestMergeSection = ({'
        },
        {
          lines: [
            {
              content: '             {!isEmpty(conflictingFiles) && (',
              type: 'context',
              oldNumber: 84,
              newNumber: 84
            },
            {
              content: '               <div className="mt-2">',
              type: 'context',
              oldNumber: 85,
              newNumber: 85
            },
            {
              content: '                 {conflictingFiles?.map((file, idx) => (',
              type: 'context',
              oldNumber: 86,
              newNumber: 86
            },
            {
              content: '-                  <div className="py-1.5 flex items-center gap-x-2" key={`${file}-${idx}`}>',
              type: 'delete',
              oldNumber: 87
            },
            {
              content: '+                  <div className="flex items-center gap-x-2 py-1.5" key={`${file}-${idx}`}>',
              type: 'insert',
              newNumber: 87
            },
            {
              content: '                     <Icon className="text-icons-1" size={16} name="file" />',
              type: 'context',
              oldNumber: 88,
              newNumber: 88
            },
            {
              content: '                     <span className="text-14 text-foreground-1">{file}</span>',
              type: 'context',
              oldNumber: 89,
              newNumber: 89
            },
            {
              content: '                   </div>',
              type: 'context',
              oldNumber: 90,
              newNumber: 90
            }
          ],
          oldStartLine: 84,
          oldStartLine2: null,
          newStartLine: 84,
          header: '@@ -84,7 +84,7 @@ const PullRequestMergeSection = ({'
        }
      ],
      deletedLines: 2,
      addedLines: 2,
      isGitDiff: true,
      checksumBefore: '2078a8fdb8f70cdb4548232c33a4fe548aa33bdd',
      checksumAfter: '8fee0e7e1c8c4581117f8866e01086a715161a7c',
      mode: '100644',
      oldName:
        'packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-merge-section.tsx',
      language: 'tsx',
      newName:
        'packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-merge-section.tsx',
      isCombined: false,
      containerId:
        'container-packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-merge-section.tsx::::packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-merge-section.tsx',
      contentId:
        'content-packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-merge-section.tsx::::packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-merge-section.tsx',
      fileId:
        'packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-merge-section.tsx::::packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-merge-section.tsx',
      filePath:
        'packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-merge-section.tsx',
      raw: 'diff --git a/packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-merge-section.tsx b/packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-merge-section.tsx\nindex 2078a8fdb8f70cdb4548232c33a4fe548aa33bdd..8fee0e7e1c8c4581117f8866e01086a715161a7c 100644\n--- a/packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-merge-section.tsx\n+++ b/packages/ui/src/views/repo/pull-request/details/components/conversation/sections/pull-request-merge-section.tsx\n@@ -49,7 +49,7 @@ const PullRequestMergeSection = ({\n               <LineDescription text={\'Checking for ability to merge automatically...\'} />\n             ) : !mergeable ? (\n               <div className="ml-6 inline-flex items-center gap-2">\n-                <p className="text-foreground-4 text-14 font-normal">\n+                <p className="text-14 font-normal text-foreground-4">\n                   Use the\n                   <span\n                     // onClick={() => {\n@@ -84,7 +84,7 @@ const PullRequestMergeSection = ({\n             {!isEmpty(conflictingFiles) && (\n               <div className="mt-2">\n                 {conflictingFiles?.map((file, idx) => (\n-                  <div className="py-1.5 flex items-center gap-x-2" key={`${file}-${idx}`}>\n+                  <div className="flex items-center gap-x-2 py-1.5" key={`${file}-${idx}`}>\n                     <Icon className="text-icons-1" size={16} name="file" />\n                     <span className="text-14 text-foreground-1">{file}</span>\n                   </div>\n'
    }
  ] as unknown as DiffFileEntry[],
  commitData: {
    sha: 'b65133014b3090fa088628283aa4b309cc68b8fd',
    parent_shas: ['c300928664cff17732a30b88448be944987e42ed'],
    title: 'feat: [XD-56]: Initial breadcrumb component docs and change from BreadcrumbPART to Breadcrumb.PART (#650)',
    message:
      'feat: [XD-56]: Initial breadcrumb component docs and change from BreadcrumbPART to Breadcrumb.PART (#650)',
    author: {
      identity: {
        name: 'Kevin Nagurski',
        email: 'Kevin.nagurski@harness.io'
      },
      when: '2025-01-13T14:17:52Z'
    },
    committer: {
      identity: {
        name: 'GitHub',
        email: 'noreply@github.com'
      },
      when: '2025-01-13T14:17:52Z'
    }
  },
  diffStats: {
    commits: 1,
    files_changed: 22,
    additions: 359,
    deletions: 123
  },
  isVerified: true,
  setCommitData: noop,
  setDiffStats: noop,
  setDiffs: noop,
  setIsVerified: noop
}
