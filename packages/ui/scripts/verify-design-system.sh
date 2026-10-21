#!/bin/bash
#
# Manual verification of the @harnessio/ui design-system contracts.
#
# The same ds-check gates run automatically on every commit (see the `pre-commit`
# script in packages/ui/package.json) — this is the by-hand equivalent, for when
# you want to confirm the state of things yourself or the commit hook is not
# running. It is a convenience wrapper: it adds no checks of its own.
#
# Runs: all five ds-check gates, spec regeneration, the ds-check unit tests,
# typecheck, lint, build, and unknown-flag rejection.
#
# Not covered (these mutate files — run them by hand): inducing spec drift,
# scaffolding a new component manifest, and the registry file-existence sweep.
#
# Usage — works from any directory:
#   ./packages/ui/scripts/verify-design-system.sh
#
# Exits 0 if everything passes, 1 if any step fails. Originally written for
# UUI-2100.
set -euo pipefail

# Resolve relative to this script, not the caller's cwd.
cd "$(dirname "$0")/.."

failures=0

# Assert that a command succeeds. Runs under `set +e` so a failure is reported
# and counted rather than aborting the whole suite at the first problem.
expect_ok() {
  local label="$1"
  shift
  set +e
  "$@" > /tmp/uui-2100-step.log 2>&1
  local status=$?
  set -e
  if [ "$status" -eq 0 ]; then
    echo "✅ $label"
  else
    echo "❌ $label (exit $status)"
    sed 's/^/    /' /tmp/uui-2100-step.log | tail -20
    failures=$((failures + 1))
  fi
}

# Assert that a command fails AND prints an expected message. Both halves matter:
# a crash for the wrong reason should not count as correct rejection.
expect_fail_matching() {
  local label="$1"
  local pattern="$2"
  shift 2
  set +e
  "$@" > /tmp/uui-2100-step.log 2>&1
  local status=$?
  set -e
  if [ "$status" -eq 0 ]; then
    echo "❌ $label (expected non-zero exit, got 0)"
    failures=$((failures + 1))
  elif ! grep -q "$pattern" /tmp/uui-2100-step.log; then
    echo "❌ $label (exit $status, but output missing \"$pattern\")"
    sed 's/^/    /' /tmp/uui-2100-step.log | tail -20
    failures=$((failures + 1))
  else
    echo "✅ $label"
  fi
}

echo "🧪 Design System Verification (@harnessio/ui)"
echo "============================================="

echo -e "\n1️⃣  Running all validation checks..."
expect_ok "all validation checks" pnpm ds-check --schema --refs --code --source --generated

echo -e "\n2️⃣  Running individual validation checks..."
for flag in schema refs code source generated; do
  expect_ok "--${flag} check" pnpm ds-check "--${flag}"
done

echo -e "\n3️⃣  Testing spec generation..."
expect_ok "spec generation (--write)" pnpm ds-check --write
if [ -f schemas/status-badge.openapi.json ]; then
  echo "✅ spec file present"
else
  echo "❌ Spec missing: schemas/status-badge.openapi.json"
  failures=$((failures + 1))
fi
# Regeneration must be a no-op; a diff here means a stale spec was committed.
if git diff --quiet -- schemas/; then
  echo "✅ regeneration left schemas/ unchanged"
else
  echo "❌ Regeneration modified schemas/ — the committed spec was stale:"
  git diff --stat -- schemas/ | sed 's/^/    /'
  failures=$((failures + 1))
fi

echo -e "\n4️⃣  Running ds-check tests..."
expect_ok "ds-check unit tests" pnpm test scripts/__tests__/ds-check.test.ts

echo -e "\n5️⃣  Running type checking..."
expect_ok "type checking" pnpm typecheck

echo -e "\n6️⃣  Running linting..."
expect_ok "linting" pnpm assist lint

echo -e "\n7️⃣  Building package..."
expect_ok "build" pnpm build

echo -e "\n8️⃣  Testing unknown flag handling..."
expect_fail_matching "unknown flag rejection" "Unknown flag" pnpm ds-check --invalid-flag

if [ "$failures" -eq 0 ]; then
  echo -e "\n✅ All tests passed!"
else
  echo -e "\n❌ $failures check(s) failed."
  exit 1
fi
