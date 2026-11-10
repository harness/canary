#!/usr/bin/env bash
# Runs each prompt in prompts.json headlessly with Claude Code, in a throwaway app,
# under one condition, then lints what Claude wrote.
#
#   DS_PACKAGE_DIR=/path/to/built/@harnessio/ui DS_ESLINT_ROOT=/path/with/eslint/node_modules \
#     ./run.sh <kit|baseline> [prompt-id ...]
#
# kit      = the kit files are copied in and CLAUDE.md imports AGENTS.md
# baseline = the installed package only (what a prototyper has today)
#
# Same lint config scores both conditions. Results: results/<condition>/<id>/{lint.json,run.json,src/}
set -euo pipefail

condition="${1:?usage: run.sh <kit|hint|baseline> [prompt-id ...]}"
shift
: "${DS_PACKAGE_DIR:?path to a built @harnessio/ui package}"
: "${DS_ESLINT_ROOT:?directory whose node_modules has eslint and plugins}"

here="$(cd "$(dirname "$0")" && pwd)"
kit="$(dirname "$here")"
out="${EVAL_OUT:-$here/results}/$condition"

if [ "$#" -gt 0 ]; then ids=("$@"); else ids=($(node -e "for (const p of require('$here/prompts.json')) console.log(p.id)")); fi

for id in "${ids[@]}"; do
  prompt="$(node -e "console.log(require('$here/prompts.json').find(p => p.id === '$id').prompt)")"
  work="$(mktemp -d)"
  mkdir -p "$work/node_modules/@harnessio" "$work/src" "$out/$id"
  ln -s "$DS_PACKAGE_DIR" "$work/node_modules/@harnessio/ui"
  echo '{ "name": "proto", "private": true, "type": "module" }' > "$work/package.json"
  cat > "$work/tailwind.config.js" <<TW
const preset = require('@harnessio/ui/tailwind-design-system')
module.exports = { presets: [preset.default ?? preset], content: ['./src/**/*.tsx'] }
TW
  if [ "$condition" = "kit" ]; then
    cp -R "$kit/.claude" "$kit/docs" "$kit/AGENTS.md" "$kit/DESIGN.md" "$kit/eslint" "$work/"
    printf '@AGENTS.md\nBefore writing or editing any UI, read `.claude/skills/design-system/SKILL.md`.\nUse only components and props that exist in the installed @harnessio/ui types.\nNo hard-coded colours, no className/style overrides on design-system components.\n' > "$work/CLAUDE.md"
    # The hook reports its own failures to the user, not the agent, so a broken hook looks like a
    # working one. Prove it blocks a known-bad file in this exact layout before spending a run.
    echo "{\"tool_input\":{\"file_path\":\"$kit/eval/fixtures/bad.tsx\"}}" \
      | CLAUDE_PROJECT_DIR="$work" node "$work/eslint/post-edit-lint.js" 2>/dev/null | grep -q '"decision":"block"' \
      || { echo "hook preflight failed: post-edit-lint.js did not block bad.tsx"; exit 1; }
  fi

  if [ "$condition" = "hint" ]; then
    echo 'Build UI with components from @harnessio/ui/components.' > "$work/CLAUDE.md"
  fi

  echo "[$condition] $id"
  (cd "$work" && claude -p "$prompt Write a single React component to src/App.tsx. Do not ask questions." \
      --permission-mode acceptEdits --allowedTools "Read Write Edit Glob Grep" \
      --setting-sources project,local --strict-mcp-config --max-budget-usd "${EVAL_BUDGET_USD:-1}" --output-format json > "$out/$id/run.json" 2> "$out/$id/stderr.txt") || echo "  claude exited non-zero"

  cp -R "$work/src" "$out/$id/" 2>/dev/null || true
  node "$here/lint.js" "$work/src" "$work/tailwind.config.js" > "$out/$id/lint.json" 2> "$out/$id/lint-stderr.txt" \
    || echo '{"error":"lint failed"}' > "$out/$id/lint.json"
  rm -rf "$work"
done
