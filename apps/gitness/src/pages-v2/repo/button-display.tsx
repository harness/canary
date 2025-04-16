import { useState } from 'react'
import { Link } from 'react-router-dom'

import { t } from 'i18next'

import {
  Badge,
  Button,
  ButtonWithOptions,
  ChatEmptyPreviewWrapper,
  ChatPreviewWrapper,
  DropdownMenu,
  Icon
} from '@harnessio/ui/components'
import { useRouterContext } from '@harnessio/ui/context'
import { cn } from '@harnessio/ui/utils'
import { InputReference, LabelMarker } from '@harnessio/ui/views'

import { LinkComponent } from '../../components/LinkComponent'

export default function ButtonDisplay() {
  const variants = ['solid', 'soft', 'surface'] as const
  const themes = ['success', 'danger', 'muted', 'primary', 'ai'] as const
  const sizes = [null, 'sm', 'lg'] as const

  const { Link } = useRouterContext()

  return (
    <div className="p-4">
      {/* <div className="flex">
        <LabelMarker color="green" label="Label" onDelete={() => {}} />
        <LabelMarker counter={10} color="green" label="Label" onDelete={() => {}} />
        <LabelMarker value="10" color="green" label="Label" onDelete={() => {}} />
      </div> */}

      <Button
        variant="ghost"
        className="flex items-center gap-x-1.5 px-0 text-14 text-cn-foreground-2 transition-colors duration-200 hover:text-cn-foreground-1"
      >
        <Icon name="bookmark-icon" size={12} />
        <span>Manage view</span>
      </Button>
      <div>
        {/* <Button variant="ghost" onClick={() => {}}>
          <Icon name="star-filled" size={12} className="fill-icons-alert" />
        </Button> */}

        {/* <Button
          className={cn(
            `right-1 top-0.5 max-h-4 min-h-4 min-w-4 max-w-4 px-0 text-label-foreground-green hover:opacity-60`
          )}
          variant="ghost"
          onClick={() => {}}
        >
          <Icon name="cross" size={10} />
        </Button> */}

        {/* <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button className="gap-x-3 bg-cn-background-3 pl-2.5 pr-2 hover:bg-cn-background-8">
              <div className="flex items-center gap-x-1.5 text-13">
                <span className="text-cn-foreground-1">test:</span>
                <span className="text-cn-foreground-2">2</span>
              </div>
              <Icon className="chevron-down text-icons-1" name="chevron-down" size={10} />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            <DropdownMenu.Item onSelect={() => {}}>
              <span className="truncate text-sm">View Raw</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={() => {}}>
              <span className="truncate text-sm text-cn-foreground-danger">Delete</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root> */}
      </div>

      {/* <ChatPreviewWrapper />
      <ChatEmptyPreviewWrapper /> */}

      {/* <Button variant="surface" theme="danger" size="md">
        Destructive
      </Button>
      <Button variant="surface" theme="danger" size="lg">
        Destructive
      </Button>
      <Button variant="surface" theme="danger">
        Destructive
      </Button>
      <Button variant="surface" theme="danger" size="sm">
        Destructive
      </Button> */}

      {/* <Button variant="soft" size="sm" theme="muted">
        <Icon name="repo-icon" size={12} />
        main
      </Button> */}

      {/* <Button asChild>
        <Link onClick={() => console.log('test')} to={''}>
          Link
        </Link>
      </Button> */}
      {/* <Button loading spinner={<Icon name="settings-1" />}>
        test
      </Button> */}

      {/* <Button size="icon" variant="surface" theme="muted">
        <Icon name="play" />
      </Button>
      <Button iconOnly variant="surface" theme="muted">
        <Icon name="play" />
      </Button>

      <Button
        className="flex h-6 gap-x-1 rounded bg-cn-background-8 px-2.5 text-cn-foreground-1 hover:bg-cn-background-9 hover:text-cn-foreground-1"
        size="sm"
        variant="custom"
      >
        <Icon className="shrink-0 text-icons-9" name="repo-icon" size={12} />
        main
      </Button> */}

      <h1 className="text-2xl font-bold mb-6">Button Variant Showcase</h1>

      {/* Special case for AI theme which doesn't allow variant prop */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">AI Theme (No Variant)</h2>
        <div className="flex flex-wrap gap-4 items-center">
          {sizes.map(size => (
            <Button key={`ai-${size || 'default'}`} theme="ai" {...(size !== null && { size })}>
              {size === null ? 'AI Button' : `AI ${size}`}
            </Button>
          ))}
        </div>
      </div>

      {/* All other theme and variant combinations */}
      {variants.map(variant => (
        <div key={variant} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 capitalize">{variant} Variant</h2>

          {/* Default theme (no theme prop) */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Default Theme</h3>
            <div className="flex flex-wrap gap-4 items-center">
              {sizes.map(size => (
                <Button
                  key={`default-${variant}-${size || 'default'}`}
                  variant={variant}
                  {...(size !== null && { size })}
                >
                  {size === null ? variant : `${variant} ${size}`}
                </Button>
              ))}
            </div>
          </div>

          {/* All other themes except AI */}
          {themes
            .filter(theme => theme !== 'ai')
            // Skip solid variant for success and danger themes
            .filter(theme => !(variant === 'solid' && (theme === 'success' || theme === 'danger')))
            .map(theme => (
              <div key={`${variant}-${theme}`} className="mb-6">
                <h3 className="text-lg font-medium mb-2 capitalize">{theme} Theme</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  {sizes.map(size => (
                    <Button
                      key={`${theme}-${variant}-${size || 'default'}`}
                      variant={variant}
                      theme={theme}
                      {...(size !== null && { size })}
                    >
                      {size === null ? `${theme} ${variant}` : `${theme} ${variant} ${size}`}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          <hr />
        </div>
      ))}

      {/* Ghost variant (not in variants array but used in original code) */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Ghost Variant</h2>
        <div className="flex flex-wrap gap-4 items-center">
          {sizes.map(size => (
            <Button key={`ghost-${size || 'default'}`} variant="ghost" {...(size !== null && { size })}>
              {size === null ? 'Ghost' : `Ghost ${size}`}
            </Button>
          ))}

          {themes
            .filter(theme => theme !== 'ai')
            .map(theme => (
              <Button key={`ghost-${theme}`} variant="ghost" theme={theme}>
                Ghost {theme}
              </Button>
            ))}
        </div>
      </div>

      {/* Rounded Button Showcase */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Rounded Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          {/* Default rounded button */}
          <Button rounded variant="solid">
            Rounded
          </Button>
          <Button rounded variant="soft">
            Rounded Soft
          </Button>
          <Button rounded variant="surface">
            Rounded Surface
          </Button>
          <Button rounded variant="ghost">
            Rounded Ghost
          </Button>

          {/* Rounded buttons with different themes - skip solid for success/danger */}
          <Button rounded variant="soft" theme="success">
            Success
          </Button>
          <Button rounded variant="soft" theme="danger">
            Danger
          </Button>
          <Button rounded variant="solid" theme="primary">
            Primary
          </Button>
          <Button rounded variant="solid" theme="muted">
            Muted
          </Button>

          {/* Rounded button with AI theme */}
          <Button rounded theme="ai">
            AI Rounded
          </Button>
        </div>
      </div>

      {/* Disabled Buttons Showcase */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Disabled Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          {/* Basic variants */}
          <Button disabled variant="solid">
            Disabled Solid
          </Button>
          <Button disabled variant="soft">
            Disabled Soft
          </Button>
          <Button disabled variant="surface">
            Disabled Surface
          </Button>
          <Button disabled variant="ghost">
            Disabled Ghost
          </Button>

          {/* With themes */}
          <Button disabled variant="soft" theme="primary">
            Disabled Primary
          </Button>
          <Button disabled variant="soft" theme="success">
            Disabled Success
          </Button>
          <Button disabled variant="soft" theme="danger">
            Disabled Danger
          </Button>

          <Button disabled variant="soft" size="sm" theme="danger">
            Disabled Danger sm
          </Button>

          {/* Rounded disabled buttons */}
          <Button disabled rounded variant="solid">
            Disabled Rounded
          </Button>

          {/* Disabled AI button */}
          <Button disabled theme="ai">
            Disabled AI
          </Button>
        </div>
      </div>

      {/* ButtonWithOptions Showcase */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Button With Options</h2>
        <div className="flex flex-col gap-4">
          <ButtonWithOptionsSection />
        </div>
      </div>
    </div>
  )
}

// Separate component for ButtonWithOptions to manage its state
function ButtonWithOptionsSection() {
  // Define options for the dropdown
  const options = [
    {
      value: 'option1',
      label: 'Option 1',
      description: 'Description for option 1'
    },
    {
      value: 'option2',
      label: 'Option 2',
      description: 'Description for option 2'
    },
    {
      value: 'option3',
      label: 'Option 3',
      description: 'Description for option 3'
    }
  ]

  // State to track selected option for radio variant
  const [selectedOption, setSelectedOption] = useState('option1')

  // State to track which option was clicked for regular variant
  const [clickedOption, setClickedOption] = useState('')

  // Track button clicks
  const [buttonClicked, setButtonClicked] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {/* Basic ButtonWithOptions with different themes */}
      <div>
        <h3 className="text-lg font-medium mb-2">Different Themes</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <ButtonWithOptions
            id="basic-primary"
            handleButtonClick={() => setButtonClicked('primary')}
            options={options}
            handleOptionChange={val => setClickedOption(val)}
            theme="primary"
            variant="solid"
          >
            Primary
          </ButtonWithOptions>

          {/* Success and danger themes (using soft variant since solid doesn't support these themes) */}
          <ButtonWithOptions
            id="basic-success"
            handleButtonClick={() => setButtonClicked('success')}
            options={options}
            handleOptionChange={val => setClickedOption(val)}
            theme="success"
            variant="surface"
          >
            Success
          </ButtonWithOptions>

          <ButtonWithOptions
            id="basic-danger"
            handleButtonClick={() => setButtonClicked('danger')}
            options={options}
            handleOptionChange={val => setClickedOption(val)}
            theme="danger"
            variant="surface"
          >
            Danger
          </ButtonWithOptions>
        </div>
      </div>

      {/* With Radio Selection */}
      <div>
        <h3 className="text-lg font-medium mb-2">With Radio Selection</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <ButtonWithOptions
            id="radio-selection"
            handleButtonClick={() => setButtonClicked('radio')}
            options={options}
            selectedValue={selectedOption}
            handleOptionChange={val => setSelectedOption(val)}
            theme="primary"
            variant="solid"
          >
            {options.find(opt => opt.value === selectedOption)?.label || 'Select an option'}
          </ButtonWithOptions>
        </div>
      </div>

      {/* Disabled state */}
      <div>
        <h3 className="text-lg font-medium mb-2">Disabled</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <ButtonWithOptions
            id="disabled"
            handleButtonClick={() => setButtonClicked('disabled')}
            options={options}
            handleOptionChange={val => setClickedOption(val)}
            theme="primary"
            variant="solid"
            disabled={true}
          >
            Disabled
          </ButtonWithOptions>
        </div>
      </div>

      {/* Loading state */}
      <div>
        <h3 className="text-lg font-medium mb-2">Loading</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <ButtonWithOptions
            id="loading"
            handleButtonClick={() => setButtonClicked('loading')}
            options={options}
            handleOptionChange={val => setClickedOption(val)}
            theme="primary"
            variant="solid"
            loading={true}
          >
            Loading
          </ButtonWithOptions>
        </div>
      </div>

      {/* Interaction feedback display */}
      {(buttonClicked || clickedOption) && (
        <div className="p-4 rounded bg-gray-100 dark:bg-gray-800">
          <p>
            <strong>Last interaction:</strong>
          </p>
          {buttonClicked && <p>Button clicked: {buttonClicked}</p>}
          {clickedOption && <p>Option selected: {clickedOption}</p>}
        </div>
      )}

      {/* Buttons with icons */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2">Buttons with Icons</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="surface" theme="success">
            <Icon name="plus" /> Create
          </Button>
          <Button variant="surface" theme="danger">
            <Icon name="trash" /> Delete
          </Button>
          <Button variant="surface" theme="primary">
            <Icon name="git-branch" /> Branch
          </Button>
        </div>
      </div>

      {/* Icon-only buttons */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2">Icon-only Buttons</h3>
        <div className="flex flex-wrap gap-4 items-center">
          {/* Basic icon-only buttons with different variants */}
          <Button variant="solid" iconOnly>
            <Icon name="plus" />
          </Button>
          <Button variant="soft" iconOnly>
            <Icon name="search" />
          </Button>
          <Button variant="surface" iconOnly>
            <Icon name="git-branch" />
          </Button>
          <Button variant="ghost" iconOnly>
            <Icon name="circle" />
          </Button>

          {/* With themes */}
          <Button variant="surface" theme="primary" iconOnly>
            <Icon name="chevron-right" />
          </Button>
          <Button variant="surface" theme="success" iconOnly>
            <Icon name="success" />
          </Button>
          <Button variant="surface" theme="danger" iconOnly>
            <Icon name="stop" />
          </Button>

          {/* Icon-only buttons with different icon sizes */}
          <Button variant="solid" iconOnly>
            <Icon name="plus" />
          </Button>
          <Button variant="solid" iconOnly>
            <Icon name="plus" />
          </Button>
          <Button variant="solid" iconOnly>
            <Icon name="plus" />
          </Button>

          {/* Icon buttons with different variants */}
          <div className="flex gap-2 p-3 border border-dashed border-gray-300 rounded dark:border-gray-600 w-full mt-2">
            <Button size="sm" variant="solid" iconOnly>
              <Icon size={12} name="plus" />
            </Button>
            <Button size="sm" variant="soft" iconOnly>
              <Icon size={12} name="search" />
            </Button>
            <Button size="sm" variant="surface" iconOnly>
              <Icon size={12} name="git-branch" />
            </Button>
            <Button size="sm" variant="ghost" iconOnly>
              <Icon size={12} name="circle" />
            </Button>
            <Button size="sm" variant="surface" theme="primary" iconOnly>
              <Icon size={12} name="chevron-right" />
            </Button>
            <Button size="sm" variant="surface" theme="success" iconOnly>
              <Icon size={12} name="success" />
            </Button>
            <Button size="sm" variant="surface" theme="danger" iconOnly>
              <Icon size={12} name="stop" />
            </Button>
            <Button size="sm" variant="surface" theme="primary" rounded iconOnly>
              <Icon size={12} name="chevron-right" />
            </Button>
          </div>

          {/* With rounded */}
          <Button variant="surface" theme="primary" rounded iconOnly>
            <Icon name="chevron-right" />
          </Button>

          {/* Disabled */}
          <Button variant="surface" theme="primary" disabled iconOnly>
            <Icon name="plus" />
          </Button>
        </div>
      </div>
    </div>
  )
}
