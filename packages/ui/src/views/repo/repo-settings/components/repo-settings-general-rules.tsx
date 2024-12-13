import { NavLink } from 'react-router-dom'

import { Button, Icon, ListActions, NoData, SearchBox, Spacer, StackedList, Text } from '@/components'

import { ErrorTypes, RuleDataType } from '../types'
import { RepoSettingsToolTip } from './repo-settings-general-tooltip'

const Title = ({ title, iconName }: { title?: string; iconName: 'green-tick' | 'cancel-grey' }) => {
  return (
    <div className="flex items-center gap-2">
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
    <Text color="tertiaryBackground" as="div" className="flex items-center gap-1 pl-[24px]">
      {targetPatternsCount} target patterns <span className="text-2xl text-tertiary">|</span> {rulesAppliedCount} rules
      applied <span className="text-2xl text-tertiary">|</span>
      {bypassAllowed ? (
        <div>
          <Icon name="tick" className="inline text-success" size={12} />
          <span> bypass allowed</span>
        </div>
      ) : (
        <div>
          <Icon name="x-mark" className="inline text-destructive" size={12} />
          <span> bypass not allowed</span>
        </div>
      )}
    </Text>
  )
}

export const RepoSettingsGeneralRules = ({
  rules,
  apiError,
  handleRuleClick,
  openRulesAlertDeleteDialog
}: {
  rules: RuleDataType[] | null
  apiError: { type: ErrorTypes; message: string } | null
  handleRuleClick: (identifier: string) => void
  openRulesAlertDeleteDialog: (identifier: string) => void
}) => {
  return (
    <>
      {rules && rules.length > 0 ? (
        <>
          <Text size={4} weight="medium">
            Rules
          </Text>
          <Spacer size={6} />

          <ListActions.Root>
            <ListActions.Left>
              <SearchBox.Root placeholder="Search" />
            </ListActions.Left>
            <ListActions.Right>
              <NavLink to="../rules/create">
                <Button variant="outline">New branch rule</Button>
              </NavLink>
            </ListActions.Right>
          </ListActions.Root>

          <Spacer size={6} />

          <StackedList.Root>
            {rules.map(rule => (
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
                  className="gap-0"
                />
                <StackedList.Field
                  label
                  secondary
                  title={
                    <RepoSettingsToolTip
                      onEdit={handleRuleClick}
                      onDelete={openRulesAlertDeleteDialog}
                      identifier={rule.identifier ?? ''}
                    />
                  }
                  right
                />
              </StackedList.Item>
            ))}

            {apiError && (apiError.type === ErrorTypes.FETCH_RULES || apiError.type === ErrorTypes.DELETE_RULE) && (
              <>
                <Spacer size={2} />
                <Text size={1} className="text-destructive">
                  {apiError.message}
                </Text>
              </>
            )}
          </StackedList.Root>
        </>
      ) : (
        <NoData
          iconName="no-data-folder"
          title="No rules yet"
          description={['There are no rules in this repository yet.']}
          primaryButton={{ label: 'Create rule', to: '../rules/create' }}
        />
      )}
    </>
  )
}
