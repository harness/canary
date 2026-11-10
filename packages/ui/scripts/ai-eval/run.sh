#!/usr/bin/env bash
# Runs each prompt in prompts.json headlessly with Claude Code, in a throwaway app,
# under one condition, then lints what Claude wrote.
#
#   DS_PACKAGE_DIR=/path/to/built/@harnessio/ui DS_ESLINT_ROOT=/path/with/eslint/node_modules \
#     ./run.sh <kit|baseline> [prompt-id ...]
#
# kit      = `harnessio-ui init-ai` is run in the throwaway app, exactly as a consumer would
# hint     = a one-line note in CLAUDE.md
# baseline = the installed package only (what a prototyper has today)
#
# DS_PACKAGE_DIR only has to supply a built dist/. Everything else the kit ships (bin, eslint,
# docs, skill) is taken from this checkout, so the eval measures the files in this PR.
#
# Same lint config scores both conditions. Results: results/<condition>/<id>/{lint.json,run.json,src/}
set -euo pipefail

condition="${1:?usage: run.sh <kit|hint|baseline> [prompt-id ...]}"
shift
: "${DS_PACKAGE_DIR:?path to a built @harnessio/ui package}"
: "${DS_ESLINT_ROOT:?directory whose node_modules has eslint and plugins}"

here="$(cd "$(dirname "$0")" && pwd)"
pkg="$(cd "$here/../.." && pwd)"
out="${EVAL_OUT:-$here/results}/$condition"

if [ "$#" -gt 0 ]; then ids=("$@"); else ids=($(node -e "for (const p of require('$here/prompts.json')) console.log(p.id)")); fi

for id in "${ids[@]}"; do
  prompt="$(node -e "console.log(require('$here/prompts.json').find(p => p.id === '$id').prompt)")"
  work="$(mktemp -d)"
  mkdir -p "$work/node_modules/@harnessio" "$work/src" "$out/$id"
  # Staged package: this checkout's shipped files plus a built dist/.
  stage="$work/node_modules/@harnessio/ui"
  mkdir -p "$stage/.claude"
  ln -s "$DS_PACKAGE_DIR/dist" "$stage/dist"
  for f in package.json bin eslint docs; do ln -s "$pkg/$f" "$stage/$f"; done
  ln -s "$pkg/.claude/skills" "$stage/.claude/skills"
  echo '{ "name": "proto", "private": true, "type": "module" }' > "$work/package.json"
  cat > "$work/tailwind.config.js" <<TW
const preset = require('@harnessio/ui/tailwind-design-system')
module.exports = { presets: [preset.default ?? preset], content: ['./src/**/*.tsx'] }
TW
  if [ "$condition" = "kit" ]; then
    (cd "$work" && node "$stage/bin/harnessio-ui.cjs" init-ai > "$out/$id/init.log")
    # The hook reports its own failures to the user, not the agent, so a broken hook looks like a
    # working one. Prove it blocks a known-bad file in this exact layout before spending a run.
    probe="$(echo "{\"tool_input\":{\"file_path\":\"$here/fixtures/bad.tsx\"}}" \
      | CLAUDE_PROJECT_DIR="$work" node "$work/node_modules/@harnessio/ui/eslint/post-edit-lint.js" 2>/dev/null || true)"
    case "$probe" in
      *'"decision":"block"'*) ;;
      *) echo "hook preflight failed: post-edit-lint.js did not block bad.tsx: ${probe:0:200}"; exit 1 ;;
    esac
  fi

  if [ "$condition" = "hint" ]; then
    echo 'Build UI with components from @harnessio/ui/components.' > "$work/CLAUDE.md"
  fi

  echo "[$condition] $id"
  (cd "$work" && claude -p "$prompt Write a single React component to src/App.tsx. Do not ask questions." \
      --permission-mode acceptEdits --allowedTools "Read Write Edit Glob Grep" \
      --setting-sources project,local --strict-mcp-config --max-budget-usd "${EVAL_BUDGET_USD:-1}" --output-format json > "$out/$id/run.json" 2> "$out/$id/stderr.txt") || echo "  claude exited non-zero"

  cp -R "$work/src" "$out/$id/" 2>/dev/null || true
  node "$here/lint.cjs" "$work/src" "$work/tailwind.config.js" > "$out/$id/lint.json" 2> "$out/$id/lint-stderr.txt" \
    || echo '{"error":"lint failed"}' > "$out/$id/lint.json"
  rm -rf "$work"
done
