import React from 'react'
import { RuleDataType, ErrorTypes } from './types'
import { Button, ListActions, SearchBox, Icon, Text, StackedList, Spacer } from '@harnessio/canary'

const Title = ({ title, iconName }: { title: string | undefined; iconName: 'green-tick' | 'cancel-grey' }) => {
  return (
    <div className="flex gap-2 items-center">
      {<Icon name={iconName} />}
      <Text truncate>{title}</Text>
    </div>
  )
}

const Description = ({
  targetPatternsCount,
  rulesAppliedCount,
  bypassAllowed
}: {
  targetPatternsCount: number
  rulesAppliedCount: number
  bypassAllowed: boolean
}) => {
  return (
    // <div className="pl-[24px]">
    <Text color="tertiaryBackground" as="div" className="pl-[24px] gap-1 flex items-center">
      {targetPatternsCount} target patterns <span className="text-2xl text-tertiary">|</span> {rulesAppliedCount} rules
      applied <span className="text-2xl text-tertiary">|</span>
      {bypassAllowed ? (
        <div>
          <Icon name="tick" className="text-success inline" size={12} />
          <span> bypass allowed</span>
        </div>
      ) : (
        <div>
          <Icon name="x-mark" className="text-destructive inline" size={12} />
          <span> bypass not allowed</span>
        </div>
      )}
    </Text>
    // </div>
  )
}

export const RepoSettingsGeneralRules = ({
  rules,
  apiError,
  handleRuleClick
}: {
  rules: RuleDataType[] | null
  apiError: { type: ErrorTypes; message: string } | null
  handleRuleClick: (identifier: string) => void
}) => {
  return (
    <>
      <Text size={4} weight="medium">
        Rules
      </Text>
      <ListActions.Root>
        <ListActions.Left>
          <SearchBox.Root placeholder="Search" />
        </ListActions.Left>
        <ListActions.Right>
          <Button variant="outline" onClick={() => {}}>
            New branch rule
          </Button>
        </ListActions.Right>
      </ListActions.Root>
      {/* <Spacer size={6} /> */}

      <StackedList.Root>
        {rules &&
          rules.map(rule => {
            return (
              <StackedList.Item key={rule.identifier} onClick={() => handleRuleClick(rule.identifier ?? '')}>
                <StackedList.Field
                  title={
                    <Title title={rule.identifier} iconName={rule.state === 'active' ? 'green-tick' : 'cancel-grey'} />
                  }
                  description={
                    <Description
                      targetPatternsCount={rule.targetPatternsCount ?? 0}
                      rulesAppliedCount={rule.rulesAppliedCount ?? 0}
                      bypassAllowed={rule.bypassAllowed ?? false}
                    />
                  }
                />
                <StackedList.Field
                  label
                  secondary
                  title={
                    <div className="flex gap-1.5 items-center justify-end">
                      <Icon name="vertical-ellipsis" size={14} className="text-tertiary-background" />
                    </div>
                  }
                  right
                />
              </StackedList.Item>
            )
          })}

        {apiError && apiError.type === ErrorTypes.FETCH_RULES && (
          <>
            <Spacer size={2} />
            <Text size={1} className="text-destructive">
              {apiError.message}
            </Text>
          </>
        )}
      </StackedList.Root>
    </>
  )
}
