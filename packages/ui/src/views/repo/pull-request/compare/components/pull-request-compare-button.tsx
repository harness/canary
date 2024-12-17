import { FC, RefObject, useCallback, useState } from 'react'

import {
  Button,
  ButtonGroup,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Option,
  RadioButton,
  RadioGroup
} from '@/components'
import { Icon } from '@components/icon'

import { CompareFormFields } from '../pull-request-compare-page'

interface PullRequestCompareButtonProps {
  isSubmitted: boolean
  isValid: boolean
  isLoading: boolean
  formRef: RefObject<HTMLFormElement>
  onFormSubmit: (data: CompareFormFields) => void
  onFormDraftSubmit: (data: CompareFormFields) => void
}

enum PULL_REQUEST_ACTION_TYPE {
  DRAFT = 'Draft',
  CREATE = 'Create'
}

const PullRequestCompareButton: FC<PullRequestCompareButtonProps> = ({
  isSubmitted,
  isLoading,
  formRef,
  onFormDraftSubmit,
  onFormSubmit
}) => {
  const [pullRequestActionType, setPullRequestActionType] = useState<PULL_REQUEST_ACTION_TYPE>(
    PULL_REQUEST_ACTION_TYPE.CREATE
  )

  const handleButtonClick = useCallback(() => {
    if (formRef.current) {
      const formData = new FormData(formRef.current)
      const data = {
        title: formData.get('title'),
        description: formData.get('description')
      }

      if (pullRequestActionType === PULL_REQUEST_ACTION_TYPE.CREATE) {
        onFormSubmit(data as CompareFormFields) // Call the default submit function
      }

      if (pullRequestActionType === PULL_REQUEST_ACTION_TYPE.DRAFT) {
        onFormDraftSubmit(data as CompareFormFields) // Call the draft submit function
      }
    }
  }, [pullRequestActionType, formRef, onFormSubmit, onFormDraftSubmit])

  const handleChangeActionType = (actionType: PULL_REQUEST_ACTION_TYPE) => () => {
    setPullRequestActionType(actionType)
  }

  return (
    <>
      {!isSubmitted ? (
        <>
          <ButtonGroup className="bg-background-5 text-foreground-6 flex h-8 min-w-[185px] items-center justify-between rounded font-medium leading-none">
            <button className="pl-5" onClick={handleButtonClick} type="button" disabled={isLoading}>
              {pullRequestActionType} pull request
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="after:bg-borders-7 hover:bg-background-10 relative h-full w-8 rounded border-none after:absolute after:inset-y-0 after:left-0 after:my-auto after:h-6 after:w-px"
                insideSplitButton
              >
                <Icon name="chevron-down" size={11} className="chevron-down" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-w-[326px]">
                <DropdownMenuGroup>
                  <RadioGroup className="gap-0" value={pullRequestActionType}>
                    <DropdownMenuItem
                      onClick={handleChangeActionType(PULL_REQUEST_ACTION_TYPE.CREATE)}
                      disabled={isLoading}
                    >
                      <Option
                        control={<RadioButton value={PULL_REQUEST_ACTION_TYPE.CREATE} />}
                        id={PULL_REQUEST_ACTION_TYPE.CREATE}
                        label="Create pull request"
                        description="Open pull request that is ready for review."
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleChangeActionType(PULL_REQUEST_ACTION_TYPE.DRAFT)}
                      disabled={isLoading}
                    >
                      <Option
                        control={<RadioButton value={PULL_REQUEST_ACTION_TYPE.DRAFT} />}
                        id={PULL_REQUEST_ACTION_TYPE.DRAFT}
                        label="Create draft pull request"
                        description="Does not request code reviews and cannot be merged."
                      />
                    </DropdownMenuItem>
                  </RadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        </>
      ) : (
        <Button variant="ghost" type="button" size="sm" theme="success" className="pointer-events-none">
          Pull request created&nbsp;&nbsp;
          <Icon name="tick" size={14} />
        </Button>
      )}
    </>
  )
}

export default PullRequestCompareButton
