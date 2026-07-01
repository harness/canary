import type { DrawerComponentProps } from "@harnessio/ui/components";
import { Drawer, Button, Text, Layout } from "@harnessio/ui/components";

export function MockConfigDrawer({
  open,
  onClose,
  props,
}: DrawerComponentProps) {
  const title = (props?.title as string) || "Configure";
  const description =
    (props?.description as string) || "Complete the configuration below";

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose({ success: false });
      }}
    >
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>{title}</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <Layout.Vertical gap="md">
            <Text variant="body-normal" color="foreground-2">
              {description}
            </Text>
            <Layout.Horizontal gap="sm">
              <Button
                onClick={() => onClose({ success: true })}
                variant="primary"
              >
                Successful Config
              </Button>
              <Button
                onClick={() => onClose({ success: false })}
                variant="outline"
              >
                Error Config
              </Button>
            </Layout.Horizontal>
          </Layout.Vertical>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}
