#!/usr/bin/env node
// Claude Code PostToolUse hook (matcher: Write|Edit). Lints the file Claude just wrote with
// eslint/ds-prototyping.js and hands any violations back to Claude so it fixes them in the
// same turn.
//
// stdin : hook JSON ({ tool_input: { file_path }, tool_response: { filePath }, cwd })
// stdout: {"decision":"block","reason":"..."} when there are violations, nothing otherwise.
//         {"systemMessage":"..."} (shown to the user, does not block) when the linter itself
//         cannot run, so a broken setup is visible instead of silently unchecked.
// Env   : DS_ESLINT_ROOT = directory whose node_modules has eslint and its plugins.
//         Defaults to the project directory.
const fs = require('fs')
const path = require('path')

const MAX_LINES = 15
const LINTED = /\.(ts|tsx)$/
const TAILWIND_CONFIGS = ['tailwind.config.js', 'tailwind.config.cjs', 'tailwind.config.mjs', 'tailwind.config.ts']

const say = obj => process.stdout.write(JSON.stringify(obj))

const readStdin = () => {
  try {
    return JSON.parse(fs.readFileSync(0, 'utf8'))
  } catch {
    return {}
  }
}

const formatMessage = (m, file) => `${path.basename(file)}:${m.line}:${m.column}  ${m.ruleId}  ${m.message}`

async function main() {
  const payload = readStdin()
  const file = payload.tool_response?.filePath ?? payload.tool_input?.file_path
  if (!file || !LINTED.test(file) || !fs.existsSync(file)) return

  const projectDir = process.env.CLAUDE_PROJECT_DIR ?? payload.cwd ?? process.cwd()
  const eslintRoot = process.env.DS_ESLINT_ROOT ?? projectDir

  let ESLint
  try {
    ;({ ESLint } = require(require.resolve('eslint', { paths: [eslintRoot] })))
  } catch {
    say({
      systemMessage: `Design-system lint hook: eslint not found from ${eslintRoot}. Edits are NOT being checked. Install eslint, eslint-plugin-react, eslint-plugin-tailwindcss and @typescript-eslint/parser, or set DS_ESLINT_ROOT.`
    })
    return
  }

  const tailwindConfig = TAILWIND_CONFIGS.map(f => path.join(projectDir, f)).find(fs.existsSync)
  const eslint = new ESLint({
    useEslintrc: false,
    ignore: false,
    cwd: projectDir,
    resolvePluginsRelativeTo: eslintRoot,
    overrideConfigFile: path.join(__dirname, 'ds-prototyping.js'),
    overrideConfig: tailwindConfig ? { settings: { tailwindcss: { config: tailwindConfig } } } : {}
  })

  let results
  try {
    results = await eslint.lintFiles([file])
  } catch (e) {
    say({ systemMessage: `Design-system lint hook failed to run: ${e.message.split('\n')[0]}. Edits are NOT being checked.` })
    return
  }

  // A file that does not parse yet (mid-edit) is tsc's problem, not a design-system violation.
  const messages = results.flatMap(r => r.messages).filter(m => m.ruleId)
  if (messages.length === 0) return

  const shown = messages.slice(0, MAX_LINES).map(m => formatMessage(m, file))
  const more = messages.length > MAX_LINES ? [`... and ${messages.length - MAX_LINES} more`] : []
  say({
    decision: 'block',
    reason: [
      `Design-system lint: ${messages.length} violation(s) in ${path.basename(file)}. Fix them now by using design-system components, props and token classes. Do not suppress the rules or restyle with className/style.`,
      ...shown,
      ...more
    ].join('\n')
  })
}

main().catch(e => {
  say({ systemMessage: `Design-system lint hook crashed: ${e.message}. Edits are NOT being checked.` })
})
