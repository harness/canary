import { DocsPage } from '@components/docs-page/docs-page'

const BreadcrumbComponent = () => (
  <DocsPage.Root>
    <DocsPage.Summary title="Breadcrumb">
      <p>
        A breadcrumbs is a list of links that help visualize the location of a page within the hierarchical structure of
        a site, it allows navigation up to any of the ancestors.
      </p>
    </DocsPage.Summary>

    <DocsPage.ComponentExample
      code={`
  <Breadcrumb.Root className="select-none">
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="#">Lorem</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Ellipsis />
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link href="#">Ipsum</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Page>Dolor</Breadcrumb.Page>
    </Breadcrumb.List>
  </Breadcrumb.Root>
    `}
    />

    <DocsPage.Section title="Anatomy">
      <p>All parts of the breadcrumb can be imported and composed as required.</p>

      <DocsPage.CodeBlock
        code={`<Breadcrumb.Root className="select-none">
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="#">Lorem</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Ellipsis />
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="#">Ipsum</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Page>Dolor</Breadcrumb.Page>
  </Breadcrumb.List>
</Breadcrumb.Root>`}
      />
    </DocsPage.Section>

    <DocsPage.Section title="API Reference">
      <DocsPage.SubSection title="Root">
        <p>The `Root` component wraps the breadcrumb with a `nav` tag for use as page navigation.</p>
        <DocsPage.PropsTable
          props={[
            { name: 'children', description: 'You can pass in your `Breadcrumb.List` as a child', required: true },
            { name: 'className', required: false }
          ]}
        />
      </DocsPage.SubSection>

      <DocsPage.SubSection title="List">
        <p>The `List` component adds styling to ensure the breadcrumb is displayed inline as a list.</p>
        <DocsPage.CodeBlock
          code={`<Breadcrumb.List>
  {/* Pass Breadcrumb.Item, Breadcrumb.Separator and Breadcrumb.Page elements as children */}
</Breadcrumb.List>`}
        />
        <DocsPage.PropsTable
          props={[
            { name: 'children', description: 'You can pass in your `Breadcrumb.Item`s as children', required: true },
            { name: 'className', required: false }
          ]}
        />
      </DocsPage.SubSection>

      <DocsPage.SubSection title="Item">
        <p>The `Item` component displays its contents as a node within the breadcrumb.</p>
        <DocsPage.CodeBlock
          code={`<Breadcrumb.Item>
  {/* Pass text, JSX elements or Breadcrumb.Link elements as children */}
</Breadcrumb.Item>`}
        />
        <DocsPage.PropsTable
          props={[
            { name: 'children', description: 'Content to display', required: true },
            { name: 'className', required: false }
          ]}
        />
      </DocsPage.SubSection>

      <DocsPage.SubSection title="Link">
        <p>
          The `Link` component can be passed as a child to an `Item` component to display a clickable breadcrumb item.
        </p>
        <DocsPage.CodeBlock
          code={`<Breadcrumb.Item>
  <Breadcrumb.Link href="#">
    Lorem
  </Breadcrumb.Link>
</Breadcrumb.Item>

<Breadcrumb.Item>
  <Breadcrumb.Link asChild>
    <button onClick={handleLinkClick}>Click me</button>
  </Breadcrumb.Link>
</Breadcrumb.Item>`}
        />
        <DocsPage.PropsTable
          props={[
            { name: 'href', description: 'Where to link to' },
            { name: 'children', description: 'Content to display in the link', required: true },
            {
              name: 'asChild',
              description: 'Render using the passed child element instead of as an anchor element',
              defaultValue: 'false'
            },
            { name: 'className' }
          ]}
        />
      </DocsPage.SubSection>

      <DocsPage.SubSection title="Page">
        <p>
          The `Page` component displays its contents as a node within the breadcrumb with styling to denote that it is
          the current page.
        </p>
        <DocsPage.CodeBlock code={`<Breadcrumb.Page>Lorem ipsum</Breadcrumb.Page>`} />
        <DocsPage.PropsTable
          props={[
            { name: 'children', description: 'Content to display', required: true },
            { name: 'className', required: false }
          ]}
        />
      </DocsPage.SubSection>

      <DocsPage.SubSection title="Separator">
        <p>The `Separator` component displays a separator between the items of the breadcrumb.</p>
        <DocsPage.CodeBlock
          code={`<Breadcrumb.Separator />

<Breadcrumb.Item>
  Lorem ipsum
</Breadcrumb.Item>

<Breadcrumb.Separator>
  &gt;
</Breadcrumb.Separator>`}
        />
        <DocsPage.PropsTable
          props={[
            { name: 'children', description: 'Content to display', defaultValue: '/' },
            { name: 'className', required: false }
          ]}
        />
      </DocsPage.SubSection>

      <DocsPage.SubSection title="Ellipsis">
        <p>The `Ellipsis` component displays an ellipsis for use when there are too many items to display.</p>
        <DocsPage.CodeBlock code={`<Breadcrumb.Ellipsis />`} />
        <DocsPage.PropsTable props={[{ name: 'className', required: false }]} />
      </DocsPage.SubSection>
    </DocsPage.Section>
  </DocsPage.Root>
)

export default BreadcrumbComponent
