import React from 'react'
import { Button, ListActions, SearchBox, Icon, Text, StackedList } from '@harnessio/canary'

const Title = ({ title, iconName }: { title: string; iconName: 'green-tick' | 'cancel-grey' }) => {
  return (
    <div className="flex gap-2 items-center">
      {<Icon name={iconName} />}
      <Text truncate>{title}</Text>
    </div>
  )
}

export const RepoSettingsGeneralRules = () => {
  return (
    <>
      <Text size={4} weight="medium">
        Rules
      </Text>
      {/* <Spacer size={6} /> */}
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
        <StackedList.Item>
          <StackedList.Field
            title={<Title title="testtt" iconName="green-tick" />}
            description={
              <div className="pl-[24px]">
                3 target patterns | 2 rules applied | <Icon name="tick" className="text-success inline" size={15} />{' '}
                bypass allowed
              </div>
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
        <StackedList.Item>
          <StackedList.Field
            title={<Title title="test" iconName="cancel-grey" />}
            description={<div className="pl-[24px]">0 target patterns | 1 rules applied</div>}
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
      </StackedList.Root>
    </>
  )
}
