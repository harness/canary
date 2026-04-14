import { Component, type FC, type ReactNode } from "react";
import {
  TooltipProvider,
  Button,
  ButtonGroup,
  TextInput,
  NumberInput,
  Select,
  Checkbox,
  Radio,
  Switch,
  Textarea,
  SearchInput,
  StatusBadge,
  Alert,
  Accordion,
  Tabs,
  Avatar,
  StackedList,
  Breadcrumb,
  Link,
  Tag,
  Progress,
  Skeleton,
  Slider,
  IconV2,
  Text,
  CounterBadge,
  ToggleGroup,
  Pagination,
  CopyButton,
  Calendar,
  Card,
  DataTable,
  DropdownMenu,
  Tooltip,
  MessageBubble,
} from "@harnessio/ui/components";

class PreviewErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError)
      return <div style={{ color: "red", fontSize: 12 }}>Preview error</div>;
    return this.props.children;
  }
}

interface ComponentEntry {
  name: string;
  category: string;
  href: string;
  preview: React.ReactNode;
  scale?: number;
}

const components: ComponentEntry[] = [
  {
    name: "Button",
    category: "Actions",
    href: "/components/actions/button",
    preview: (
      <div className="flex items-center gap-cn-sm">
        <Button variant="primary" size="sm">
          Primary
        </Button>
        <Button variant="secondary" size="sm">
          Secondary
        </Button>
        <Button variant="outline" size="sm">
          Outline
        </Button>
      </div>
    ),
  },
  {
    name: "Button Group",
    category: "Actions",
    href: "/components/actions/button-group",
    preview: (
      <ButtonGroup
        size="sm"
        buttonsProps={[
          { children: "Left", variant: "outline" },
          { children: "Center", variant: "outline" },
          { children: "Right", variant: "outline" },
        ]}
      />
    ),
  },
  {
    name: "Toggle Group",
    category: "Actions",
    href: "/components/actions/toggle-group",
    preview: (
      <ToggleGroup.Root type="single" value="left" size="sm">
        <ToggleGroup.Item value="left" text="Left" />
        <ToggleGroup.Item value="center" text="Center" />
        <ToggleGroup.Item value="right" text="Right" />
      </ToggleGroup.Root>
    ),
  },
  {
    name: "Copy Button",
    category: "Actions",
    href: "/components/actions/copy-button",
    preview: (
      <div className="flex items-center gap-cn-sm">
        <Text variant="caption-normal" className="font-mono">
          @harnessio/ui
        </Text>
        <CopyButton name="@harnessio/ui" />
      </div>
    ),
  },
  {
    name: "Text Input",
    category: "Form & Inputs",
    href: "/components/form/text-input",
    preview: (
      <div className="w-[220px]">
        <TextInput
          id="p-name"
          label="Full name"
          placeholder="Enter your name"
        />
      </div>
    ),
  },
  {
    name: "Number Input",
    category: "Form & Inputs",
    href: "/components/form/number-input",
    preview: (
      <div className="w-[220px]">
        <NumberInput id="p-qty" label="Quantity" defaultValue={8} />
      </div>
    ),
  },
  {
    name: "Textarea",
    category: "Form & Inputs",
    href: "/components/form/textarea",
    preview: (
      <div className="w-[220px]">
        <Textarea
          id="p-desc"
          label="Description"
          placeholder="Write something…"
          rows={2}
        />
      </div>
    ),
  },
  {
    name: "Select",
    category: "Form & Inputs",
    href: "/components/form/select",
    preview: (
      <div className="w-[220px]">
        <Select
          label="Region"
          placeholder="Select region"
          options={[
            { label: "US East", value: "us-east" },
            { label: "EU West", value: "eu-west" },
          ]}
        />
      </div>
    ),
  },
  {
    name: "Search Input",
    category: "Form & Inputs",
    href: "/components/form/search-input",
    preview: (
      <div className="w-[240px]">
        <SearchInput placeholder="Search components…" onChange={() => {}} />
      </div>
    ),
  },
  {
    name: "Checkbox",
    category: "Form & Inputs",
    href: "/components/form/checkbox",
    preview: (
      <div className="flex flex-col gap-cn-sm">
        <Checkbox id="p-c1" checked>
          Enable notifications
        </Checkbox>
        <Checkbox id="p-c2">Send weekly digest</Checkbox>
      </div>
    ),
  },
  {
    name: "Radio",
    category: "Form & Inputs",
    href: "/components/form/radio",
    preview: (
      <Radio.Root defaultValue="email">
        <Radio.Item id="p-r1" value="email" label="Email" />
        <Radio.Item id="p-r2" value="sms" label="SMS" />
        <Radio.Item id="p-r3" value="push" label="Push" />
      </Radio.Root>
    ),
  },
  {
    name: "Switch",
    category: "Form & Inputs",
    href: "/components/form/switch",
    preview: (
      <div className="flex flex-col gap-cn-sm">
        <Switch label="Dark mode" checked />
        <Switch label="Notifications" />
      </div>
    ),
  },
  {
    name: "Slider",
    category: "Form & Inputs",
    href: "/components/form/slider",
    preview: (
      <div className="w-[200px]">
        <Slider defaultValue={[65]} max={100} step={1} />
      </div>
    ),
  },
  {
    name: "Calendar",
    category: "Form & Inputs",
    href: "/components/form/calendar",
    preview: <Calendar mode="single" />,
    scale: 0.48,
  },
  {
    name: "Tabs",
    category: "Navigation",
    href: "/components/navigation/tabs",
    preview: (
      <Tabs.Root defaultValue="overview">
        <Tabs.List>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
          <Tabs.Trigger value="logs">Logs</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
    ),
  },
  {
    name: "Breadcrumb",
    category: "Navigation",
    href: "/components/navigation/breadcrumb",
    preview: (
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Projects</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>Settings</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    ),
  },
  {
    name: "Pagination",
    category: "Navigation",
    href: "/components/navigation/pagination",
    preview: (
      <Pagination
        currentPage={3}
        totalItems={50}
        pageSize={10}
        goToPage={() => {}}
      />
    ),
  },
  {
    name: "Link",
    category: "Navigation",
    href: "/components/navigation/link",
    preview: (
      <div className="flex flex-col gap-cn-xs">
        <Link to="#">View documentation</Link>
        <Link to="#">Getting started guide</Link>
      </div>
    ),
  },
  {
    name: "Alert",
    category: "Feedback",
    href: "/components/feedback/alert",
    preview: (
      <div className="w-[260px]">
        <Alert.Root theme="success">
          <Alert.Title>Changes saved</Alert.Title>
          <Alert.Description>
            Your settings have been updated.
          </Alert.Description>
        </Alert.Root>
      </div>
    ),
  },
  {
    name: "Status Badge",
    category: "Feedback",
    href: "/components/feedback/status-badge",
    preview: (
      <div className="flex flex-wrap gap-cn-sm">
        <StatusBadge variant="status" theme="success">
          Active
        </StatusBadge>
        <StatusBadge variant="status" theme="warning">
          Pending
        </StatusBadge>
        <StatusBadge variant="status" theme="danger">
          Failed
        </StatusBadge>
        <StatusBadge variant="status" theme="info">
          Syncing
        </StatusBadge>
      </div>
    ),
  },
  {
    name: "Tag",
    category: "Feedback",
    href: "/components/feedback/tag",
    preview: (
      <div className="flex flex-wrap gap-cn-xs">
        <Tag theme="blue" value="Frontend" />
        <Tag theme="purple" value="Design" />
        <Tag theme="green" value="Approved" />
      </div>
    ),
  },
  {
    name: "Counter Badge",
    category: "Feedback",
    href: "/components/feedback/counter-badge",
    preview: (
      <div className="flex items-center gap-cn-md">
        <div className="flex items-center gap-cn-xs">
          <Text variant="caption-normal">Issues</Text>
          <CounterBadge>12</CounterBadge>
        </div>
        <div className="flex items-center gap-cn-xs">
          <Text variant="caption-normal">PRs</Text>
          <CounterBadge theme="success">3</CounterBadge>
        </div>
      </div>
    ),
  },
  {
    name: "Progress",
    category: "Feedback",
    href: "/components/feedback/progress",
    preview: (
      <div className="w-[200px]">
        <Progress value={0.72} hideIcon />
      </div>
    ),
  },
  {
    name: "Skeleton",
    category: "Feedback",
    href: "/components/feedback/skeleton",
    preview: (
      <div className="flex flex-col gap-cn-sm w-[200px]">
        <Skeleton.Box className="h-cn-sm w-3/4 rounded-cn-2" />
        <Skeleton.Box className="h-cn-xs w-full rounded-cn-2" />
        <Skeleton.Box className="h-cn-xs w-5/6 rounded-cn-2" />
      </div>
    ),
  },
  {
    name: "Avatar",
    category: "Visual",
    href: "/components/visual/avatar",
    preview: (
      <div className="flex items-center gap-cn-sm">
        <Avatar name="Sarah Chen" size="md" />
        <Avatar name="Mike Johnson" size="md" />
        <Avatar name="Alex Rodriguez" size="md" />
      </div>
    ),
  },
  {
    name: "Icon",
    category: "Visual",
    href: "/components/visual/icon",
    preview: (
      <div className="flex items-center gap-cn-md">
        <IconV2 name="settings" />
        <IconV2 name="account" />
        <IconV2 name="sparks" />
        <IconV2 name="check-circle" className="text-cn-success" />
        <IconV2 name="warning-triangle" className="text-cn-warning" />
      </div>
    ),
  },
  {
    name: "Accordion",
    category: "Data Display",
    href: "/components/data-display/accordion",
    preview: (
      <div className="w-[240px]">
        <Accordion.Root type="single" collapsible defaultValue="item-1">
          <Accordion.Item value="item-1">
            <Accordion.Trigger>What is this?</Accordion.Trigger>
            <Accordion.Content>
              <Text variant="caption-normal">A design system for Harness.</Text>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Trigger>How to use?</Accordion.Trigger>
            <Accordion.Content>
              <Text variant="caption-normal">
                Install and import components.
              </Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    ),
    scale: 0.7,
  },
  {
    name: "Card",
    category: "Data Display",
    href: "/components/data-display/card",
    preview: (
      <Card.Root className="p-cn-md w-[220px]" interactive={false}>
        <Text variant="body-strong" className="mb-cn-xs">
          Project Alpha
        </Text>
        <Text variant="caption-normal" className="text-cn-muted">
          Last updated 2h ago
        </Text>
      </Card.Root>
    ),
  },
  {
    name: "Stacked List",
    category: "Data Display",
    href: "/components/data-display/stacked-list",
    preview: (
      <div className="w-[220px]">
        <StackedList.Root>
          <StackedList.Item>
            <Text variant="body-normal">Administrators</Text>
          </StackedList.Item>
          <StackedList.Item>
            <Text variant="body-normal">Developers</Text>
          </StackedList.Item>
          <StackedList.Item>
            <Text variant="body-normal">Viewers</Text>
          </StackedList.Item>
        </StackedList.Root>
      </div>
    ),
    scale: 0.7,
  },
  {
    name: "Data Table",
    category: "Data Display",
    href: "/components/data-display/data-table",
    preview: (
      <div className="w-[280px]">
        <DataTable
          columns={[
            { accessorKey: "name", header: "Name" },
            { accessorKey: "role", header: "Role" },
          ]}
          data={[
            { id: "1", name: "Sarah", role: "Admin" },
            { id: "2", name: "Mike", role: "Dev" },
          ]}
          getRowId={(row: any) => row.id}
        />
      </div>
    ),
    scale: 0.65,
  },
  {
    name: "Dropdown Menu",
    category: "Overlays",
    href: "/components/overlays/dropdown-menu",
    preview: (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="outline" size="sm">
            Actions <IconV2 name="nav-arrow-down" size="xs" />
          </Button>
        </DropdownMenu.Trigger>
      </DropdownMenu.Root>
    ),
  },
  {
    name: "Tooltip",
    category: "Overlays",
    href: "/components/overlays/tooltip",
    preview: (
      <Tooltip content="Helpful information">
        <Button variant="ghost" size="sm" iconOnly>
          <IconV2 name="info-circle" />
        </Button>
      </Tooltip>
    ),
  },
  {
    name: "Message Bubble",
    category: "AI & Chat",
    href: "/components/chat/message-bubble",
    preview: (
      <div className="w-[240px] flex flex-col gap-cn-sm">
        <MessageBubble.Root>
          <MessageBubble.Content>
            <MessageBubble.Text>How do I deploy?</MessageBubble.Text>
          </MessageBubble.Content>
        </MessageBubble.Root>
        <MessageBubble.Root>
          <MessageBubble.Content>
            <MessageBubble.Text>Use the deploy pipeline.</MessageBubble.Text>
          </MessageBubble.Content>
        </MessageBubble.Root>
      </div>
    ),
    scale: 0.7,
  },
  {
    name: "Text",
    category: "Foundations",
    href: "/components/foundations/text",
    preview: (
      <div className="flex flex-col gap-cn-xs">
        <Text variant="heading-subsection">Heading</Text>
        <Text variant="body-normal">Body text for content.</Text>
        <Text variant="caption-normal" className="text-cn-muted">
          Caption text
        </Text>
      </div>
    ),
  },
];

const categoryOrder = [
  "Actions",
  "Form & Inputs",
  "Navigation",
  "Feedback",
  "Visual",
  "Data Display",
  "Overlays",
  "AI & Chat",
  "Foundations",
];

function groupByCategory(items: ComponentEntry[]) {
  const groups: Record<string, ComponentEntry[]> = {};
  for (const item of items) {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  }
  return categoryOrder
    .filter((cat) => groups[cat])
    .map((cat) => ({ category: cat, items: groups[cat] }));
}

const ComponentGrid: FC = () => {
  const groups = groupByCategory(components);

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-cn-2xl">
        {groups.map((group) => (
          <div key={group.category}>
            <h3 className="cn-component-grid-category-title">
              {group.category}
            </h3>
            <div className="cn-component-grid">
              {group.items.map((comp) => (
                <a
                  key={comp.name}
                  href={comp.href}
                  className="cn-component-card"
                >
                  <div className="cn-component-card-preview">
                    <div
                      className="cn-component-card-preview-inner"
                      style={{ transform: `scale(${comp.scale || 0.75})` }}
                    >
                      <PreviewErrorBoundary>
                        {comp.preview}
                      </PreviewErrorBoundary>
                    </div>
                  </div>
                  <div className="cn-component-card-label">
                    <span className="cn-component-card-name">{comp.name}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default ComponentGrid;
