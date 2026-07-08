import { useRef, type FC } from 'react'

import { useMonacoTheme } from '@hooks/use-monaco-theme'
import { cn } from '@utils/cn'

import { YamlEditor } from '@harnessio/yaml-editor'

import { Button } from '../button'
import { Layout } from '../layout'
import { Text } from '../text'
import { ToggleGroup } from '../toggle-group'
import { type YamlOutputProps } from './yaml-output-types'

// The host app provides monaco globals via MonacoGlobals.set at the app entry point.
// We don't call MonacoGlobals.set here to avoid redundant initialization.
export const YamlOutput: FC<YamlOutputProps> = ({
  value,
  onChange,
  title,
  icon,
  onRun,
  runLabel = 'Run',
  runDisabled,
  runLoading,
  readOnly
}) => {
  const themeConfig = useMonacoTheme()

  // YamlEditor holds its own monaco model and only reliably re-syncs from `value` on mount
  // (its revisionId compare is against monaco's internal versionId, which our external counter
  // can't safely track). Its fallback "always sync" path (revisionId falsy) re-applies the
  // value every render and stomps the user's cursor. So instead we remount the editor (via key)
  // only when `value` changes from OUTSIDE — i.e. differs from the text the user last produced,
  // which we track via the value we echo out through onChange. User keystrokes don't remount.
  const lastEmittedRef = useRef(value)
  const remountKeyRef = useRef(0)
  if (value !== lastEmittedRef.current) {
    lastEmittedRef.current = value
    remountKeyRef.current += 1
  }

  return (
    <div className={cn('cn-yaml-output-panel')}>
      <Layout.Horizontal className={cn('cn-yaml-output-header')} align="center" justify="between">
        <Layout.Horizontal align="center" gap="md">
          {icon}
          {title && (
            <Text as="span" variant="body-normal" color="foreground-1">
              {title}
            </Text>
          )}
        </Layout.Horizontal>

        <Layout.Horizontal align="center" gap="md">
          <ToggleGroup.Root type="single" value="yaml" unselectable>
            <ToggleGroup.Item value="yaml" text="YAML" />
            <ToggleGroup.Item value="visual" text="Visual" disabled />
          </ToggleGroup.Root>

          {onRun && (
            <Button onClick={() => onRun(value)} disabled={runDisabled} loading={runLoading}>
              {runLabel}
            </Button>
          )}
        </Layout.Horizontal>
      </Layout.Horizontal>

      <div className={cn('cn-yaml-output-editor')}>
        <YamlEditor
          key={remountKeyRef.current}
          yamlRevision={{ yaml: value, revisionId: 0 }}
          onYamlRevisionChange={rev => {
            if (rev) {
              // Record what the user produced so an external `value` change (something other
              // than this echoed text) is detected and remounts the editor.
              lastEmittedRef.current = rev.yaml
              onChange?.(rev.yaml)
            }
          }}
          themeConfig={themeConfig}
          options={{ readOnly: readOnly || !onChange }}
          instanceId="yaml-output"
        />
      </div>
    </div>
  )
}
