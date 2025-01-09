import { FC, RefObject, useCallback, useState } from 'react'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  Option,
  RadioButton,
  RadioGroup
} from '@/components'
import { TranslationStore } from '@/views'

import { CompareFormFields } from '../pull-request-compare-page'

interface PullRequestCompareButtonProps {
  isSubmitted: boolean
  isValid: boolean
  isLoading: boolean
  formRef: RefObject<HTMLFormElement>
  onFormSubmit: (data: CompareFormFields) => void
  onFormDraftSubmit: (data: CompareFormFields) => void
  useTranslationStore: () => TranslationStore
}

enum PR_TYPE {
  CREATE = 'Create',
  DRAFT = 'Draft'
}

const PullRequestCompareButton: FC<PullRequestCompareButtonProps> = ({
  isSubmitted,
  isLoading,
  formRef,
  onFormDraftSubmit,
  onFormSubmit,
  useTranslationStore
}) => {
  const [prType, setPrType] = useState<PR_TYPE>(PR_TYPE.CREATE)
  const { t } = useTranslationStore()

  const handleButtonClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      if (formRef.current) {
        const formData = new FormData(formRef.current)
        const data = {
          title: formData.get('title'),
          description: formData.get('description')
        }
        switch (prType) {
          case PR_TYPE.DRAFT:
            onFormDraftSubmit(data as CompareFormFields)
            break
          case PR_TYPE.CREATE:
            onFormSubmit(data as CompareFormFields)
            break
        }
      }
    },
    [formRef, onFormDraftSubmit, onFormSubmit, prType]
  )

  const handlePrTypeChange = (value: PR_TYPE) => () => {
    setPrType(value)
  }

  return (
    <>
      {!isSubmitted ? (
        <div className="flex rounded bg-background-5">
          <Button
            className="rounded-r-none pr-2.5"
            theme="primary"
            onClick={handleButtonClick}
            type="button"
            disabled={isLoading}
          >
            {t(
              `views:pullRequests.compareChanges${prType}Button${isLoading ? 'Loading' : ''}`,
              `${prType}${isLoading ? 'ing' : ''} pull request${isLoading ? '...' : ''}`
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="relative flex size-8 items-center justify-center rounded-r after:absolute after:inset-y-0 after:left-0 after:my-auto after:h-6 after:w-px after:bg-borders-7 hover:bg-background-10">
              <Icon name="chevron-down" size={12} className="text-icons-10" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mt-1 max-w-80">
              <RadioGroup value={prType} id="pr-type">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handlePrTypeChange(PR_TYPE.CREATE)} disabled={isLoading}>
                    <Option
                      control={<RadioButton className="mt-px" value={PR_TYPE.CREATE} id={PR_TYPE.CREATE} />}
                      id={PR_TYPE.CREATE}
                      label={t(`views:pullRequests.compareChangesCreateTitle`, 'Create pull request')}
                      ariaSelected={prType === PR_TYPE.CREATE}
                      description={t(
                        `views:pullRequests.compareChangesCreateDescription`,
                        'Open pull request that is ready for review.'
                      )}
                    />
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handlePrTypeChange(PR_TYPE.DRAFT)} disabled={isLoading}>
                    <Option
                      control={<RadioButton className="mt-px" value={PR_TYPE.DRAFT} id={PR_TYPE.DRAFT} />}
                      id={PR_TYPE.DRAFT}
                      label={t(`views:pullRequests.compareChangesDraftTitle`, 'Create draft pull request')}
                      ariaSelected={prType === PR_TYPE.DRAFT}
                      description={t(
                        `views:pullRequests.compareChangesDraftDescription`,
                        'Does not request code reviews and cannot be merged.'
                      )}
                    />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </RadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Button variant="ghost" type="button" size="sm" theme="success" className="pointer-events-none">
          {t(`views:pullRequests.compareChangesCreatedButton`)}&nbsp;&nbsp;
          <Icon name="tick" size={12} />
        </Button>
      )}
    </>
  )
}

export default PullRequestCompareButton
