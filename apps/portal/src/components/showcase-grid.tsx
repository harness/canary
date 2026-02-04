import { type FC, useState } from "react";
import {
  TooltipProvider,
  Button,
  ButtonGroup,
  CopyButton,
  TextInput,
  NumberInput,
  Select,
  Checkbox,
  Radio,
  Switch,
  Textarea,
  Calendar,
  SearchInput,
  StatusBadge,
  Alert,
  Card,
  CardSelect,
  DataTable,
  Pagination,
  Breadcrumb,
  Link,
  Tabs,
  Avatar,
  StackedList,
  Accordion,
  Dialog,
  AlertDialog,
  Popover,
  DropdownMenu,
  Tooltip,
  DiffViewer,
  MarkdownViewer,
  MessageBubble,
  ScrollArea,
  PromptInput,
  TypingAnimation,
  Shimmer,
  Reasoning,
  Carousel,
  Widgets,
  TimeAgoCard,
  ViewOnly,
  DraggableCard,
  IconV2,
  Text,
  NoData,
  Layout
} from "@harnessio/ui/components";

const ShowcaseGrid: FC = () => {
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [enableTwoFactor, setEnableTwoFactor] = useState(false);
  const [notificationMethod, setNotificationMethod] = useState("email");
  const [surveyAnswer, setSurveyAnswer] = useState("social-media");

  // Sample data for user activity table
  const activityData = [
    {
      id: "1",
      user: "Sarah Chen",
      action: "Updated profile",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      user: "Mike Johnson",
      action: "Invited user",
      timestamp: "4 hours ago",
    },
    {
      id: "3",
      user: "Alex Rodriguez",
      action: "Changed settings",
      timestamp: "1 day ago",
    },
  ];

  const tableColumns = [
    {
      accessorKey: "user",
      header: "User",
    },
    {
      accessorKey: "action",
      header: "Action",
    },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
    },
  ];

  return (
    <TooltipProvider>
      <div className="columns-1 md:columns-2 gap-cn-xl">
        {/* Card 1: Payment Method Form */}
        <Card.Root className="p-cn-xl break-inside-avoid mb-cn-xl">
          <Text variant="heading-subsection" className="mb-cn-lg">
            Payment Method
          </Text>
          <Text variant="caption-normal" className="mb-cn-md text-cn-muted">
            All transactions are secure and encrypted
          </Text>
          <div className="flex flex-col gap-cn-md">
            <TextInput
              id="name-on-card"
              label="Name on Card"
              placeholder="John Doe"
            />

            <div className="grid grid-cols-2 gap-cn-sm">
              <TextInput
                id="card-number"
                label="Card Number"
                placeholder="1234 5678 9012 3456"
              />
              <TextInput
                id="cvv"
                label="CVV"
                placeholder="123"
              />
            </div>

            <Text variant="caption-normal" className="mb-cn-xs text-cn-muted">
              Enter your 16-digit number.
            </Text>

            <div className="grid grid-cols-2 gap-cn-sm">
              <Select
                label="Month"
                options={[
                  { label: "01", value: "01" },
                  { label: "02", value: "02" },
                  { label: "03", value: "03" },
                  { label: "04", value: "04" },
                  { label: "05", value: "05" },
                  { label: "06", value: "06" },
                  { label: "07", value: "07" },
                  { label: "08", value: "08" },
                  { label: "09", value: "09" },
                  { label: "10", value: "10" },
                  { label: "11", value: "11" },
                  { label: "12", value: "12" },
                ]}
                placeholder="MM"
              />
              <Select
                label="Year"
                options={[
                  { label: "2024", value: "2024" },
                  { label: "2025", value: "2025" },
                  { label: "2026", value: "2026" },
                  { label: "2027", value: "2027" },
                  { label: "2028", value: "2028" },
                  { label: "2029", value: "2029" },
                ]}
                placeholder="YYYY"
              />
            </div>

            <div className="flex flex-col gap-cn-sm mt-cn-sm">
              <Text variant="caption-strong">Billing Address</Text>
              <Text variant="caption-normal" className="text-cn-muted">
                The billing address associated with your payment method
              </Text>
              <Checkbox
                id="same-as-shipping"
                checked={sameAsShipping}
                onCheckedChange={(checked) => setSameAsShipping(checked as boolean)}
              >
                Same as shipping address
              </Checkbox>
            </div>

            <Textarea
              id="comments"
              label="Comments"
              placeholder="Add any additional comments"
              rows={3}
            />

            <div className="flex gap-cn-sm mt-cn-sm">
              <Button variant="primary">Submit</Button>
              <Button variant="secondary">Cancel</Button>
            </div>
          </div>
        </Card.Root>

        {/* Card 2: Team Collaboration */}
        <Card.Root className="p-cn-xl break-inside-avoid mb-cn-xl">
          <NoData
            title="No Team Members"
            description={["Invite your team to collaborate on this project."]}
            primaryButton={{
              label: "Invite Members",
              icon: "plus",
              variant: "primary",
              onClick: () => console.log("Invite clicked")
            }}
          />
          <div className="flex flex-col gap-cn-lg w-full mt-cn-lg">
            <div className="flex flex-col gap-cn-sm">
              <Text variant="caption-strong">Status Updates</Text>
              <div className="flex flex-wrap gap-cn-sm">
                <StatusBadge variant="status" theme="info">Syncing</StatusBadge>
                <StatusBadge variant="status" theme="warning">Updating</StatusBadge>
                <StatusBadge variant="status" theme="muted">Loading</StatusBadge>
              </div>
            </div>
          </div>
        </Card.Root>

        {/* Card 3: Settings & Authentication */}
        <Card.Root className="p-cn-xl break-inside-avoid mb-cn-xl">
          <Text variant="heading-subsection" className="mb-cn-lg">
            Settings & Authentication
          </Text>
          <div className="flex flex-col gap-cn-lg">
            <div className="flex items-start justify-between gap-cn-md p-cn-md border border-cn-3 rounded-cn-2">
              <div className="flex-1">
                <Text variant="body-strong" className="mb-cn-xs">
                  Two-factor authentication
                </Text>
                <Text variant="caption-normal" className="text-cn-muted">
                  Verify via email or phone number.
                </Text>
              </div>
              <Button variant="primary" size="sm">Enable</Button>
            </div>

            <div className="flex items-center gap-cn-sm p-cn-md border border-cn-3 rounded-cn-2">
              <IconV2 name="check-circle" className="text-cn-success" />
              <Text variant="body-normal">Your profile has been verified.</Text>
              <IconV2 name="nav-arrow-right" size="xs" className="ml-auto" />
            </div>

            <div className="flex flex-col gap-cn-sm">
              <Text variant="heading-subsection">Appearance Settings</Text>
              <Alert.Root theme="success">
                <Alert.Title>Settings saved successfully</Alert.Title>
                <Alert.Description>
                  Your preferences have been updated.
                </Alert.Description>
              </Alert.Root>
            </div>
          </div>
        </Card.Root>

        {/* Card 4: Compute Environment Selection */}
        <Card.Root className="p-cn-xl break-inside-avoid mb-cn-xl">
          <Text variant="heading-subsection" className="mb-cn-lg">
            Compute Environment
          </Text>
          <Text variant="caption-normal" className="mb-cn-md text-cn-muted">
            Select the compute environment for your cluster.
          </Text>
          <div className="flex flex-col gap-cn-lg">
            <CardSelect.Root type="single" layout="vertical">
              <CardSelect.Item value="kubernetes">
                <div className="flex items-start gap-cn-sm">
                  <IconV2 name="circle" className="text-cn-info mt-cn-3xs" />
                  <div>
                    <Text variant="body-strong">Kubernetes</Text>
                    <Text variant="caption-normal" className="text-cn-muted">
                      Run GPU workloads on a K8s configured cluster. This is the default.
                    </Text>
                  </div>
                </div>
              </CardSelect.Item>
              <CardSelect.Item value="vm" disabled>
                <div className="flex items-start gap-cn-sm">
                  <IconV2 name="circle" className="text-cn-muted mt-cn-3xs" />
                  <div>
                    <Text variant="body-strong">Virtual Machine</Text>
                    <Text variant="caption-normal" className="text-cn-muted">
                      Access a VM configured cluster to run workloads. (Coming soon)
                    </Text>
                  </div>
                </div>
              </CardSelect.Item>
            </CardSelect.Root>

            <div className="flex items-center justify-between gap-cn-md">
              <Text variant="caption-strong">Number of GPUs</Text>
              <div className="flex items-center gap-cn-sm">
                <Button variant="ghost" size="sm" iconOnly>
                  <IconV2 name="minus" size="xs" />
                </Button>
                <Text variant="body-normal">8</Text>
                <Button variant="ghost" size="sm" iconOnly>
                  <IconV2 name="plus" size="xs" />
                </Button>
              </div>
            </div>

            <Text variant="caption-normal" className="text-cn-muted">
              You can add more later.
            </Text>

            <div className="flex items-center justify-between">

              <Switch
                label="Enable Two-factor authentication"
                checked={enableTwoFactor}
                onCheckedChange={setEnableTwoFactor}
              />
            </div>
          </div>
        </Card.Root>

        {/* Card 5: Search & Navigation */}
        <Card.Root className="p-cn-xl break-inside-avoid mb-cn-xl">
          <Text variant="heading-subsection" className="mb-cn-lg">
            Search & Navigation
          </Text>
          <div className="flex flex-col gap-cn-lg">
            <div className="flex flex-col gap-cn-sm">
              <div className="flex items-center justify-between mb-cn-xs">
                <SearchInput
                  placeholder="Search..."
                  onChange={(value) => console.log(value)}
                />
              </div>
              <Text variant="caption-normal" className="text-cn-muted">
                12 results
              </Text>
            </div>

            <div className="flex flex-col gap-cn-sm">
              <Text variant="caption-strong">Breadcrumb Navigation</Text>
              <Breadcrumb.Root>
                <Breadcrumb.List>
                  <Breadcrumb.Item>
                    <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Separator />
                  <Breadcrumb.Item>
                    <Breadcrumb.Link href="#">Settings</Breadcrumb.Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Separator />
                  <Breadcrumb.Item>
                    <Breadcrumb.Page>Profile</Breadcrumb.Page>
                  </Breadcrumb.Item>
                </Breadcrumb.List>
              </Breadcrumb.Root>
            </div>

            <div className="flex flex-col gap-cn-sm">
              <Text variant="caption-strong">Actions</Text>
              <div className="flex items-center gap-cn-sm">
                <Button variant="ghost" size="sm">
                  <IconV2 name="arrow-left" size="xs" />
                </Button>
                <ButtonGroup
                  size="sm"
                  buttonsProps={[
                    {
                      children: "Archive",
                      variant: "outline",
                      onClick: () => console.log("Archive"),
                    },
                    {
                      children: "Report",
                      variant: "outline",
                      onClick: () => console.log("Report"),
                    },
                    {
                      children: "Snooze",
                      variant: "outline",
                      onClick: () => console.log("Snooze"),
                    },
                  ]}
                />
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <Button variant="outline" size="sm" iconOnly>
                      <IconV2 name="more-horizontal" />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item title="More Options" />
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </div>
            </div>

            <div className="flex flex-col gap-cn-sm">
              <Text variant="caption-strong">Links</Text>
              <div className="flex flex-col gap-cn-xs">
                <Link to="#">View Documentation</Link>
                <Link to="#">Getting Started Guide</Link>
              </div>
            </div>
          </div>
        </Card.Root>

        {/* Card 6: Account Settings Form */}
        <Card.Root className="p-cn-xl break-inside-avoid mb-cn-xl">
          <Text variant="heading-subsection" className="mb-cn-lg">
            Account Settings
          </Text>
          <div className="flex flex-col gap-cn-md">
            <TextInput
              id="account-name"
              label="Account Name"
              placeholder="Enter your account name"
            />

            <NumberInput
              id="timeout"
              label="Session Timeout"
              defaultValue={30}
              prefix="Minutes"

            />

            <Select
              label="Account Type"
              options={[
                { label: "Personal", value: "personal" },
                { label: "Business", value: "business" },
                { label: "Enterprise", value: "enterprise" },
              ]}
              placeholder="Select account type"
            />

            <div className="flex flex-col gap-cn-sm">
              <Text variant="caption-strong">Notification Preferences</Text>
              <Radio.Root
                value={notificationMethod}
                onValueChange={setNotificationMethod}
              >
                <Radio.Item
                  id="email"
                  value="email"
                  label="Email notifications"
                />
                <Radio.Item
                  id="sms"
                  value="sms"
                  label="SMS notifications"
                />
                <Radio.Item
                  id="push"
                  value="push"
                  label="Push notifications"
                />
                <Radio.Item
                  id="none"
                  value="none"
                  label="No notifications"
                />
              </Radio.Root>
            </div>

            <div className="flex flex-col gap-cn-sm">
              <Text variant="caption-strong">Schedule</Text>
              <Calendar mode="single" />
            </div>

            <TextInput
              id="website"
              label="Website URL"
              placeholder="https://example.com"
            />
          </div>
        </Card.Root>

        {/* Card 7: User Management */}
        <Card.Root className="p-cn-xl break-inside-avoid mb-cn-xl">
          <Text variant="heading-subsection" className="mb-cn-lg">
            User Management
          </Text>
          <div className="flex flex-col gap-cn-lg">
            <div className="flex flex-col gap-cn-sm">
              <Text variant="caption-strong">Team Members</Text>
              <div className="flex gap-cn-md">
                <div className="flex flex-col items-center gap-cn-xs">
                  <Avatar
                    name="Sarah Chen"
                    size="md"
                  />
                  <Text variant="caption-normal">Sarah</Text>
                </div>
                <div className="flex flex-col items-center gap-cn-xs">
                  <Avatar
                    name="Mike Johnson"
                    size="md"
                  />
                  <Text variant="caption-normal">Mike</Text>
                </div>
                <div className="flex flex-col items-center gap-cn-xs">
                  <Avatar
                    name="Alex Rodriguez"
                    size="md"
                  />
                  <Text variant="caption-normal">Alex</Text>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-cn-sm">
              <Text variant="caption-strong">Roles</Text>
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

            <div className="flex flex-col gap-cn-sm">
              <Text variant="caption-strong">Teams</Text>
              <Accordion.Root type="single" collapsible>
                <Accordion.Item value="frontend">
                  <Accordion.Trigger>Frontend Team</Accordion.Trigger>
                  <Accordion.Content>
                    <div className="flex flex-col gap-cn-xs">
                      <Text variant="caption-normal">Sarah Chen - Lead</Text>
                      <Text variant="caption-normal">Mike Johnson - Developer</Text>
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="backend">
                  <Accordion.Trigger>Backend Team</Accordion.Trigger>
                  <Accordion.Content>
                    <div className="flex flex-col gap-cn-xs">
                      <Text variant="caption-normal">Alex Rodriguez - Lead</Text>
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            </div>

            <div className="flex flex-col gap-cn-sm">
              <Text variant="caption-strong">Recent Activity</Text>
              <DataTable
                columns={tableColumns}
                data={activityData}
                getRowId={(row) => row.id}
              />
            </div>
          </div>
        </Card.Root>

        {/* Card 8: Modal Dialogs */}
        <Card.Root className="p-cn-xl break-inside-avoid mb-cn-xl">
          <Text variant="heading-subsection" className="mb-cn-lg">
            Dialogs & Overlays
          </Text>
          <div className="flex flex-col gap-cn-lg">
            <div className="flex flex-col gap-cn-sm">
              <Text variant="caption-strong">Confirmation Dialog</Text>
              <Dialog.Root>
                <Dialog.Trigger>
                  <Button variant="primary" size="sm">Confirm Changes</Button>
                </Dialog.Trigger>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>Confirm Changes</Dialog.Title>
                    <Dialog.Description>
                      Are you sure you want to save these changes? This action will update your profile settings.
                    </Dialog.Description>
                  </Dialog.Header>
                  <Dialog.Footer className="flex gap-cn-sm justify-end">
                    <Dialog.Close>
                      Cancel
                    </Dialog.Close>
                    <Button variant="primary">Confirm</Button>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog.Root>
            </div>

            <div className="flex flex-col gap-cn-sm">
              <Text variant="caption-strong">Alert Dialog</Text>
              <AlertDialog.Root onConfirm={() => console.log("Deleted")} theme="danger">
                <AlertDialog.Trigger>
                  <Button variant="outline" theme="danger" size="sm">
                    Delete Account
                  </Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content title="Delete Account">
                  <Text variant="body-normal">
                    This will permanently delete your account and all associated data. This action cannot be undone.
                  </Text>
                </AlertDialog.Content>
              </AlertDialog.Root>
            </div>

            <div className="flex flex-col gap-cn-sm">
              <Text variant="caption-strong">Dropdown Menu</Text>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button variant="outline" size="sm">
                    Actions
                    <IconV2 name="nav-arrow-down" size="xs" />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item title="View Profile" />
                  <DropdownMenu.Item title="Edit Settings" />
                  <DropdownMenu.Item title="Download Data" />
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item
                    title="Delete Account"
                    className="text-cn-destructive"
                  />
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </div>

            <div className="flex flex-col gap-cn-sm">
              <Text variant="caption-strong">Popover</Text>
              <Popover
                content={
                  <div className="flex flex-col gap-cn-sm p-cn-xs">
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edit Settings
                    </Button>
                    <Button variant="ghost" size="sm">
                      Share
                    </Button>
                  </div>
                }
              >
                <Button variant="secondary" size="sm">
                  Quick Actions
                </Button>
              </Popover>
            </div>

            <div className="flex flex-col gap-cn-sm">
              <Text variant="caption-strong">Tooltip</Text>
              <Tooltip content="This indicates account verification status">
                <IconV2 name="info-circle" className="text-cn-info" />
              </Tooltip>
            </div>
          </div>
        </Card.Root>

        {/* Card 9: Content Editor */}
        <Card.Root className="p-cn-xl break-inside-avoid mb-cn-xl">
          <Text variant="heading-subsection" className="mb-cn-lg">
            Content Editor
          </Text>
          <div className="flex flex-col gap-cn-lg">
            <Tabs.Root defaultValue="preview">
              <Tabs.List className="mb-cn-md">
                <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
                <Tabs.Trigger value="edit">Edit</Tabs.Trigger>
                <Tabs.Trigger value="history">History</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="preview">
                <div className="border rounded-cn-2 p-cn-md">
                  <MarkdownViewer
                    source="## Welcome\n\nThis is a preview of your content.\n\n- Easy to read\n- Well formatted\n- Beautiful display"
                  />
                </div>
              </Tabs.Content>
              <Tabs.Content value="edit">
                <Textarea
                  id="content-editor"
                  placeholder="Write your content here..."
                  rows={6}
                />
              </Tabs.Content>
              <Tabs.Content value="history">
                <div className="border rounded-cn-2">
                  <DiffViewer
                    oldCode={`const theme = 'light';
const primaryColor = '#ffffff';
const backgroundColor = '#f5f5f5';

export const config = {
  theme,
  primaryColor,
  backgroundColor
};`}
                    newCode={`const theme = 'dark';
const primaryColor = '#000000';
const backgroundColor = '#1a1a1a';

export const config = {
  theme,
  primaryColor,
  backgroundColor,
  isDarkMode: true
};`}
                    lang="typescript"
                  />
                </div>
              </Tabs.Content>
            </Tabs.Root>

            <div className="flex flex-col gap-cn-sm">
              <Text variant="caption-strong">Comments</Text>
              <MessageBubble.Root>
                <MessageBubble.Content>
                  <MessageBubble.Text>
                    LGTM! Looks good to me.
                  </MessageBubble.Text>
                </MessageBubble.Content>
                <MessageBubble.Footer>
                  <Text variant="caption-normal" className="text-cn-muted">
                    Sarah Chen · 2 hours ago
                  </Text>
                </MessageBubble.Footer>
              </MessageBubble.Root>
            </div>
          </div>
        </Card.Root>



        {/* Card 11: AI Assistant */}
        <Card.Root className="p-cn-xl break-inside-avoid mb-cn-xl">
          <Text variant="heading-subsection" className="mb-cn-lg">
            AI Assistant
          </Text>
          <div className="flex flex-col gap-cn-lg">
            <div className="flex flex-col gap-cn-sm">
              <PromptInput.Root
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("Submitted");
                }}
              >
                <PromptInput.Textarea placeholder="Ask, search, or make anything..." />
                <PromptInput.Toolbar>
                  <PromptInput.Tools />
                  <PromptInput.Submit />
                </PromptInput.Toolbar>
              </PromptInput.Root>
            </div>

            <div className="flex flex-col gap-cn-md">
              <MessageBubble.Root>
                <MessageBubble.Content>
                  <MessageBubble.Text>How do I update my profile?</MessageBubble.Text>
                </MessageBubble.Content>
              </MessageBubble.Root>

              <MessageBubble.Root>
                <MessageBubble.Content>
                  <MessageBubble.Text>
                    You can update your profile by going to Settings and clicking on Profile. From there, you can edit your information and save changes.
                  </MessageBubble.Text>
                </MessageBubble.Content>
              </MessageBubble.Root>

              <div className="flex items-center gap-cn-sm">
                <TypingAnimation text="AI is thinking..." variant="caption-normal" className="text-cn-muted" />
              </div>

              <Shimmer className="h-cn-2xl w-full">Loading response...</Shimmer>

              <Reasoning.Root>
                <Reasoning.Content>
                  <div className="flex flex-col gap-cn-sm">
                    <Text variant="caption-normal">• Analyzing your question</Text>
                    <Text variant="caption-normal">• Searching knowledge base</Text>
                    <Text variant="caption-normal">• Generating response</Text>
                  </div>
                </Reasoning.Content>
              </Reasoning.Root>
            </div>
          </div>
        </Card.Root>

        {/* Card 12: Survey & Additional Components */}
        <Card.Root className="p-cn-xl break-inside-avoid mb-cn-xl">
          <Text variant="heading-subsection" className="mb-cn-lg">
            Survey & More
          </Text>
          <div className="flex flex-col gap-cn-lg">
            <div className="flex flex-col gap-cn-sm">
              <Text variant="caption-strong">How did you hear about us?</Text>
              <Text variant="caption-normal" className="text-cn-muted mb-cn-xs">
                Select the option that best describes how you found us.
              </Text>
              <Radio.Root
                value={surveyAnswer}
                onValueChange={setSurveyAnswer}
              >
                <Radio.Item
                  id="social-media"
                  value="social-media"
                  label="Social Media"
                />
                <Radio.Item
                  id="search-engine"
                  value="search-engine"
                  label="Search Engine"
                />
                <Radio.Item
                  id="referral"
                  value="referral"
                  label="Referral"
                />
                <Radio.Item
                  id="other"
                  value="other"
                  label="Other"
                />
              </Radio.Root>
            </div>

            <Checkbox id="terms">
              I agree to the terms and conditions
            </Checkbox>

            <div className="flex flex-col gap-cn-sm">
              <Text variant="caption-strong">Navigation</Text>
              <div className="flex items-center justify-between">
                <Pagination
                  currentPage={1}
                  totalItems={30}
                  pageSize={10}
                  goToPage={() => { }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-cn-sm">
              <Text variant="caption-strong">Metrics</Text>
              <Widgets.Root>
                <Widgets.Item title="Active Users">
                  <div className="flex items-center gap-cn-sm">
                    <IconV2 name="account" />
                    <Text variant="heading-subsection">1,234</Text>
                  </div>
                </Widgets.Item>
                <Widgets.Item title="Avg. Response Time">
                  <div className="flex items-center gap-cn-sm">
                    <IconV2 name="clock" />
                    <Text variant="heading-subsection">2.5s</Text>
                  </div>
                </Widgets.Item>
              </Widgets.Root>
            </div>

            <div className="flex flex-col gap-cn-sm">
              <Text variant="caption-strong">Configuration</Text>
              <ViewOnly
                title="Settings"
                data={[
                  { label: "Environment", value: "Production" },
                  { label: "Region", value: "US-East" },
                ]}
              />
            </div>

            <div className="flex flex-col gap-cn-sm">
              <Text variant="caption-strong">Preferences</Text>
              <DraggableCard
                id="pref-1"
                title={<Text variant="body-strong">Display Settings</Text>}
                description={<Text variant="caption-normal" className="text-cn-muted">Drag to reorder</Text>}
              />
            </div>

            <div className="flex flex-col gap-cn-sm">
              <Text variant="caption-strong">Gallery</Text>
              <Carousel.Root>
                <Carousel.Content>
                  <Carousel.Item>
                    <div className="bg-cn-3 rounded-cn-2 h-[120px] flex items-center justify-center">
                      <Text variant="body-strong">Image 1</Text>
                    </div>
                  </Carousel.Item>
                  <Carousel.Item>
                    <div className="bg-cn-3 rounded-cn-2 h-[120px] flex items-center justify-center">
                      <Text variant="body-strong">Image 2</Text>
                    </div>
                  </Carousel.Item>
                  <Carousel.Item>
                    <div className="bg-cn-3 rounded-cn-2 h-[120px] flex items-center justify-center">
                      <Text variant="body-strong">Image 3</Text>
                    </div>
                  </Carousel.Item>
                </Carousel.Content>
                <Carousel.Previous />
                <Carousel.Next />
              </Carousel.Root>
            </div>
          </div>
        </Card.Root>
      </div>
    </TooltipProvider>
  );
};

export default ShowcaseGrid;
