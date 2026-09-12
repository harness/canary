import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { parse } from 'yaml'

const parser = unified().use(remarkParse).use(remarkMdx)
const fail = message => {
  throw new Error(`Unsupported component documentation: ${message}`)
}

function literal(node) {
  if (node?.type === 'Literal') return node.value
  if (node?.type === 'TemplateLiteral' && node.expressions.length === 0 && node.quasis[0].value.cooked !== null)
    return node.quasis[0].value.cooked
  if (node?.type === 'ArrayExpression') return node.elements.map(literal)
  if (node?.type === 'ObjectExpression') {
    const result = {}
    for (const property of node.properties) {
      if (
        property.type !== 'Property' ||
        property.computed ||
        property.method ||
        property.shorthand ||
        property.kind !== 'init'
      )
        fail('props must use static properties')
      const key = property.key.name ?? property.key.value
      if (Object.hasOwn(result, key)) fail(`duplicate property ${key}`)
      Object.defineProperty(result, key, { value: literal(property.value), enumerable: true })
    }
    return result
  }
  return fail('expected a static literal; dynamic expressions are not executed')
}

function attributes(node, allowed) {
  const result = {}
  for (const attr of node.attributes) {
    if (attr.type !== 'mdxJsxAttribute' || !allowed.includes(attr.name) || Object.hasOwn(result, attr.name))
      fail(`attribute on ${node.name}`)
    result[attr.name] =
      attr.value?.type === 'mdxJsxAttributeValueExpression'
        ? literal(attr.value.data.estree.body[0]?.expression)
        : attr.value
  }
  return result
}

function fence(code) {
  const length = Math.max(3, ...[...code.matchAll(/`+/g)].map(match => match[0].length + 1))
  const ticks = '`'.repeat(length)
  return `${ticks}tsx\n${code.trim()}\n${ticks}`
}

const cell = value =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('|', '&#124;')
    .replaceAll('`', '&#96;')
    .replaceAll('\n', '<br>')

export function exportComponentMarkdown(document, exampleSection) {
  const frontmatter = document.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!frontmatter) fail('missing frontmatter')
  const metadata = parse(frontmatter[1])
  if (typeof metadata.title !== 'string' || typeof metadata.description !== 'string') fail('missing title/description')
  const source = document.slice(frontmatter[0].length)
  const tree = parser.parse(source)
  const examples = []
  let section = ''
  let propCount = 0
  const slice = node => source.slice(node.position.start.offset, node.position.end.offset)

  function render(node) {
    if (node.type === 'mdxjsEsm') {
      for (const statement of node.data.estree.body) {
        const expected = { '@/components/docs-page': 'DocsPage', '@astrojs/starlight/components': 'Aside' }[
          statement.source?.value
        ]
        if (
          statement.type !== 'ImportDeclaration' ||
          !expected ||
          statement.specifiers.length !== 1 ||
          statement.specifiers[0].type !== 'ImportSpecifier' ||
          statement.specifiers[0].imported.name !== expected ||
          statement.specifiers[0].local.name !== expected
        )
          fail('unrecognized documentation import/export')
      }
      return ''
    }
    if (node.type === 'mdxFlowExpression' || node.type === 'mdxTextExpression') fail('MDX expression')
    if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
      if (node.name === 'DocsPage.ComponentExample') {
        const { code } = attributes(node, ['code', 'client:only'])
        if (typeof code !== 'string' || node.children.length) fail('ComponentExample must contain literal code only')
        examples.push({ section, code: code.trim() })
        return fence(code)
      }
      if (node.name === 'DocsPage.PropsTable') {
        const { props } = attributes(node, ['props'])
        const keys = ['name', 'value', 'required', 'defaultValue', 'description']
        if (!Array.isArray(props) || node.children.length) fail('PropsTable requires a static array')
        for (const prop of props) {
          if (
            !prop ||
            typeof prop.name !== 'string' ||
            Object.keys(prop).some(key => !keys.includes(key)) ||
            Object.values(prop).some(value => !['string', 'boolean', 'number'].includes(typeof value))
          )
            fail('unsupported prop row')
        }
        propCount += props.length
        return [
          '| Prop | Type | Required | Default | Description |',
          '| --- | --- | --- | --- | --- |',
          ...props.map(prop => `| ${keys.map(key => cell(prop[key])).join(' | ')} |`)
        ].join('\n')
      }
      if (node.name === 'Aside') {
        const { title, type } = attributes(node, ['title', 'type'])
        if ((title != null && typeof title !== 'string') || (type != null && typeof type !== 'string'))
          fail('Aside title/type')
        return `> **${title ?? type ?? 'Note'}**\n>\n${node.children
          .map(render)
          .join('\n\n')
          .split('\n')
          .map(line => `> ${line}`)
          .join('\n')}`
      }
      fail(`MDX element ${node.name}`)
    }
    let result = slice(node)
    for (const child of [...(node.children ?? [])].reverse()) {
      const start = child.position.start.offset - node.position.start.offset
      const end = child.position.end.offset - node.position.start.offset
      result = result.slice(0, start) + render(child) + result.slice(end)
    }
    return result
  }

  const parts = tree.children.map(node => {
    if (node.type === 'heading')
      section = slice(node)
        .replace(/^#+\s*/, '')
        .trim()
    return render(node)
  })
  const selected = examples.filter(example => example.section === exampleSection)
  if (selected.length !== 1) fail(`expected exactly one example in section ${JSON.stringify(exampleSection)}`)
  return {
    title: metadata.title,
    description: metadata.description,
    markdown: parts.join('\n\n').trim(),
    example: selected[0].code,
    exampleCount: examples.length,
    propCount
  }
}
