import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { stringify } from 'yaml'
import cx from 'classnames'
import { noop } from 'lodash-es'
import {
  Badge,
  Button,
  Input,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Sheet,
  SheetContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@harnessio/canary'
import { type InlineAction } from '@harnessio/yaml-editor'
import { ArrowLeft, Box, Search, Xmark } from '@harnessio/icons-noir'
import { YamlEditor, MonacoGlobals } from '@harnessio/yaml-editor'
import { PipelineStudio, getNodesFromPipelineYaml } from '@harnessio/unified-pipeline'
import { ILanguageFeaturesService } from 'monaco-editor/esm/vs/editor/common/services/languageFeatures.js'
import { OutlineModel } from 'monaco-editor/esm/vs/editor/contrib/documentSymbols/browser/outlineModel.js'
import { StandaloneServices } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices.js'
import { Container } from '../components/layout/container'
import { Topbar } from '../components/layout/topbar'
import { VisualYamlToggle, VisualYamlValue } from '../components/pipeline-studio/visual-yaml-toggle'
import { PipelineStudioToolbarActions } from '../components/pipeline-studio/pipeline-studio-toolbar-actions'
import { FooterBar } from '../components/pipeline-studio/footer-bar/footer-bar'
import pipeline from '../assets/pipeline.yaml'
import { themes } from '../assets/monacoTheme'
import { Problems } from '../components/pipeline-studio/problems'
import { problemsMock } from '../assets/problemsMock'
import { InlineActionArgsType, getInlineActions } from '../assets/inlineActions'
import unifiedSchema from '../assets/unifiedSchema.json'
import { StepForm } from '../components/pipeline-studio/step-form/step-form'
import { StepFormSection } from '../components/pipeline-studio/step-form/step-form-section'
import { StepsPalette } from '../components/pipeline-studio/step-palette/step-palette'
import { StepPaletteFilters } from '../components/pipeline-studio/step-palette/step-palette-filters'
import { StepsPaletteContent } from '../components/pipeline-studio/step-palette/step-palette-content'
import { StepsPaletteItem } from '../components/pipeline-studio/step-palette/step-palette-item'
import { stepPaletteItems } from '../assets/stepPaletteItems'

MonacoGlobals.set({
  ILanguageFeaturesService,
  OutlineModel,
  StandaloneServices
})

function GraphView() {
  const nodes = useMemo(() => getNodesFromPipelineYaml(pipeline), [])
  return <PipelineStudio nodes={nodes} onAddNode={noop} onDeleteNode={noop} onSelectNode={noop} />
}

const YamlView = (props: { setDrawerOpen: (open: 'stepform' | 'palette' | undefined) => void }): JSX.Element => {
  const themeConfig = useMemo(
    () => ({
      defaultTheme: 'dark',
      themes
    }),
    []
  )

  const yamlRevision = {
    yaml: stringify(pipeline),
    revision: 1
  }

  const handleInlineActionClick: InlineAction<InlineActionArgsType>['onClick'] = args => {
    props.setDrawerOpen(args.data.action)
  }

  const inlineAction = getInlineActions(handleInlineActionClick)

  const schemaConfig = useMemo(
    () => ({
      schema: unifiedSchema,
      uri: 'https://raw.githubusercontent.com/bradrydzewski/spec/master/dist/schema.json'
    }),
    []
  )

  return useMemo(
    () => (
      <div className="flex h-full w-full">
        <YamlEditor
          onYamlRevisionChange={() => {}}
          yamlRevision={yamlRevision}
          themeConfig={themeConfig}
          inlineActions={inlineAction}
          schemaConfig={schemaConfig}
        />
      </div>
    ),
    []
  )
}

const PipelineStudioToolbar = ({
  view,
  setView
}: {
  view: VisualYamlValue
  setView: (view: VisualYamlValue) => void
}) => {
  return (
    <Topbar.Root className={cx({ ['border-b-0 px-8 bg-transparent']: view === 'visual' })}>
      <Topbar.Left>
        <VisualYamlToggle view={view} setView={setView} isYamlValid={true} />
      </Topbar.Left>
      {/* <Topbar.Center>AITextEditor placeholder</Topbar.Center> */}
      {view === 'yaml' && (
        <Topbar.Right>
          <PipelineStudioToolbarActions
            onCopyClick={() => undefined}
            onDownloadClick={() => undefined}
            onEditClick={() => undefined}
          />
        </Topbar.Right>
      )}
    </Topbar.Root>
  )
}

const PipelineStudioPanel = (): JSX.Element => {
  return (
    <Tabs defaultValue="problems" variant="underline" className="h-full">
      <div className="flex flex-row justify-between border-b">
        <TabsList className="bg-transparent ml-4">
          <TabsTrigger value="problems">
            Problems
            <Badge className="rounded-full font-normal text-xs p-2 h-5 ml-2 bg-red-950 text-red-400">8</Badge>
          </TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>
        <div>
          <Button onClick={() => {}} variant="ghost" size="sm" className="m-1 px-2">
            <Xmark />
          </Button>
        </div>
      </div>
      <TabsContent value="problems" className="overflow-scroll h-full py-2">
        <Problems onClick={() => {}} problems={problemsMock} />
      </TabsContent>
      <TabsContent value="suggestions">Suggestions placeholder</TabsContent>
    </Tabs>
  )
}

const StepFormPanel = (): JSX.Element => {
  return (
    <StepForm.Root>
      <StepForm.Header>
        {/* {<StepBreadcrumb title="Deploy to Dev" subTitle="Run" />} */}
        <StepForm.Title>
          <Button className="px-2 mr-2" size="sm" variant="ghost" onClick={() => {}}>
            <ArrowLeft />
          </Button>
          Run Step
        </StepForm.Title>
        <StepForm.Description>Step description. This can be multiline description.</StepForm.Description>
        <StepForm.Actions>
          AI Button placeholder
          {/* <AIButton label="AI Autofill" /> */}
        </StepForm.Actions>
      </StepForm.Header>

      <StepFormSection.Root>
        <StepFormSection.Header>
          <StepFormSection.Title>General</StepFormSection.Title>
          {<StepFormSection.Description>Read documentation to learn more.</StepFormSection.Description>}
        </StepFormSection.Header>
        <StepFormSection.Form>
          Form placeholder
          {/* <RenderForm factory={inputComponentFactory} inputs={formDefinition} /> */}
        </StepFormSection.Form>
      </StepFormSection.Root>
      <StepForm.Footer>
        <Button onClick={() => {}}>Submit</Button>
        <Button variant="secondary" onClick={() => {}}>
          Cancel
        </Button>
      </StepForm.Footer>
    </StepForm.Root>
  )
}

const StepPalettePanel = (): JSX.Element => {
  return (
    <StepsPalette.Root>
      <StepsPalette.Header>
        {/* <StepBreadcrumb title="Deploy to Dev" subTitle="Add Step" /> */}
        <StepsPalette.Title>Add Step</StepsPalette.Title>
        <Input placeholder="Search" left={<Search />} />
        <StepPaletteFilters />
      </StepsPalette.Header>
      <StepsPaletteContent.Root>
        {['Buld', 'Deploy'].map(section => (
          <StepsPaletteContent.Section>
            <StepsPaletteContent.SectionHeader>
              <div>{section}</div>
              <div>See all &gt; </div>
            </StepsPaletteContent.SectionHeader>
            {stepPaletteItems.map(item => (
              <StepsPaletteContent.SectionItem key={item.identifier}>
                <StepsPaletteItem.Root onClick={() => {}}>
                  <StepsPaletteItem.Left>
                    <Box size="36" />
                  </StepsPaletteItem.Left>
                  <StepsPaletteItem.Right>
                    <StepsPaletteItem.Header>
                      <StepsPaletteItem.Title>{item.identifier}</StepsPaletteItem.Title>
                      <StepsPaletteItem.BadgeWrapper>verified</StepsPaletteItem.BadgeWrapper>
                    </StepsPaletteItem.Header>
                    <StepsPaletteItem.Description>{item.description}</StepsPaletteItem.Description>
                  </StepsPaletteItem.Right>
                </StepsPaletteItem.Root>
              </StepsPaletteContent.SectionItem>
            ))}
          </StepsPaletteContent.Section>
        ))}
      </StepsPaletteContent.Root>
    </StepsPalette.Root>
  )
}

export default function PipelineEditPage() {
  const [view, setView] = useState<'visual' | 'yaml'>('visual')
  const [panelOpen, setPanelOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState<'palette' | 'stepform'>()

  useEffect(() => {
    setPanelOpen(view === 'yaml')
  }, [view])

  const main = useMemo(() => {
    return (
      <>
        <ResizablePanelGroup direction="vertical" className="border-5">
          <ResizablePanel order={1}>
            {view === 'visual' ? <GraphView /> : <YamlView setDrawerOpen={setDrawerOpen} />}
          </ResizablePanel>
          {panelOpen && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={30} id="panel" minSize={10} maxSize={90} order={2} className="h-full">
                <PipelineStudioPanel />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </>
    )
  }, [panelOpen, view])

  const renderSheetContent = useCallback(() => {
    switch (drawerOpen) {
      case 'palette':
        return <StepPalettePanel />
      case 'stepform':
        return <StepFormPanel />
      default:
        return null
    }
  }, [drawerOpen])

  const drawer = useMemo(
    () => (
      <Sheet
        open={!!drawerOpen}
        onOpenChange={open => {
          if (!open) setDrawerOpen(undefined)
        }}>
        <SheetContent className="p-0">{renderSheetContent()}</SheetContent>
      </Sheet>
    ),
    [drawerOpen, setDrawerOpen]
  )

  return (
    <Container.Root wFull={true} hFull={true} className="h-[calc(100vh-100px)]">
      <Container.Main>
        <PipelineStudioToolbar view={view} setView={setView} />
        {drawer}
        {main}
        <FooterBar
          commitHistory={{ lastCommittedAt: Date.now(), lastCommittedBy: 'harness.io' }}
          problems={{ error: 2, info: 5, warning: 12 }}
          togglePane={() => setPanelOpen(!panelOpen)}
        />
      </Container.Main>
    </Container.Root>
  )
}
