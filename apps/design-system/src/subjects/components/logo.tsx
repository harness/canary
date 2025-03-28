import { FC, useState } from 'react'

import { DocsPage } from '@components/docs-page/docs-page'

import { Logo, LogoNameMap, Text } from '@harnessio/ui/components'

const LogoComponent: FC = () => {
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = (name: string) => {
    navigator.clipboard.writeText(name).then(() => {
      setCopied(name)
      setTimeout(() => setCopied(null), 1000) // Reset after 1 second
    })
  }

  return (
    <DocsPage.Root>
      <DocsPage.Summary title="Logo">
        <Text as="p">
          The <code>Logo</code> component renders brand icons from the <code>simple-icons</code> package. Click an icon
          to copy its name.
        </Text>
      </DocsPage.Summary>

      <DocsPage.ComponentExample code={`<Logo name="github" size={40} />`} />

      <DocsPage.Section title="Original Brand Color">
        <Text as="p">
          By default, the <code>Logo</code> component inherits the text color using <code>currentColor</code>. Use the{' '}
          <code>original</code> prop to render the logo in its official brand color.
        </Text>
        <DocsPage.ComponentExample code={`<Logo name="gitlab" size={48} original />`} />
      </DocsPage.Section>

      <DocsPage.Section title="Size">
        <Text as="p">
          Customize the size using the <code>size</code> prop.
        </Text>
        <DocsPage.ComponentExample code={`<Logo name="gitlab" size={48} />`} />
      </DocsPage.Section>

      <DocsPage.Section title="Available Icons">
        <Text as="p">Click an icon to copy its name.</Text>
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left p-2 w-1/2">Icon</th>
                <th className="text-left p-2 w-1/2">Name</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(LogoNameMap).map(name => (
                <tr key={name} className="border-b border-gray-200">
                  <td
                    className="p-2 cursor-pointer flex items-center gap-2 hover:bg-gray-100 transition w-1/2"
                    onClick={() => handleCopy(name)}
                    title="Click to copy"
                  >
                    <Logo name={name as keyof typeof LogoNameMap} size={24} />
                    {copied === name && <span className="text-sm text-green-600 animate-pulse w-1/2">Copied!</span>}
                  </td>
                  <td className="p-2">
                    <code>{name}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocsPage.Section>
    </DocsPage.Root>
  )
}

export default LogoComponent
