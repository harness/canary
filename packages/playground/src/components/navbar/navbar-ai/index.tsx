import { Button, Icon, Text } from '@harnessio/canary'

export const NavbarAi = () => {
  return (
    <div className="mx-auto mb-11 mt-auto flex max-w-[160px] flex-col items-center gap-2.5 text-center">
      <div className="flex flex-col items-center gap-1">
        <div className="relative mb-2">
          <div className="absolute bottom-2 left-2 z-[-1] size-[42px]">
            <Icon
              className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 mix-blend-plus-lighter blur-[15px]"
              name="harness-gradient-ellipse"
              size={102}
            />
          </div>
          <Icon name="harness-gradient" size={44} />
        </div>
        <Text className="leading-none" size={1} weight="medium">
          AI Assistant
        </Text>
        <Text className="leading-[1.0625rem] text-foreground-5" size={0}>
          Create, analyze or debug your pipelines faster.
        </Text>
      </div>
      <Button
        className="bg-background-7 text-12 font-medium"
        borderRadius="full"
        size="sm"
        padding="sm"
        variant="gradient-border"
        gradientType="ai-button"
      >
        <Icon className="mr-1.5" name="sparks" size={12} />
        Make with AI
      </Button>
    </div>
  )
}
