import { FC, MouseEvent, RefObject, useCallback, useState } from 'react'
import { UseFormGetValues } from 'react-hook-form'

import { Button, Icon, SplitButton } from '@/components'
import { useTranslation } from '@/context'
import { CompareFormFields } from '@/views'

interface PullRequestCompareButtonProps {
  isSubmitted: boolean
  isValid: boolean
  isLoading: boolean
  formRef: RefObject<HTMLFormElement>
  getFormValues: UseFormGetValues<CompareFormFields>
  onFormSubmit: (data: CompareFormFields) => void
  onFormDraftSubmit: (data: CompareFormFields) => void
}

enum PR_TYPE {
  CREATE = 'Create',
  DRAFT = 'Draft'
}

const PullRequestCompareButton: FC<PullRequestCompareButtonProps> = ({
  isSubmitted,
  isLoading,
  getFormValues,
  onFormDraftSubmit,
  onFormSubmit
}) => {
  const [prType, setPrType] = useState<PR_TYPE>(PR_TYPE.CREATE)
  const { t } = useTranslation()

  const handleButtonClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      const data = getFormValues()

      switch (prType) {
        case PR_TYPE.DRAFT:
          onFormDraftSubmit(data)
          break
        case PR_TYPE.CREATE:
          onFormSubmit(data)
          break
      }
    },
    [getFormValues, onFormDraftSubmit, onFormSubmit, prType]
  )

  const handlePrTypeChange = (value: PR_TYPE) => {
    setPrType(value)
  }

  return (
    <>
      {!isSubmitted ? (
        <SplitButton<PR_TYPE>
          id="pr-type"
          handleButtonClick={handleButtonClick}
          loading={isLoading}
          selectedValue={prType}
          handleOptionChange={handlePrTypeChange}
          options={[
            {
              value: PR_TYPE.CREATE,
              label: t(`views:pullRequests.compareChangesCreateTitle`, 'Create pull request'),
              description: t(
                `views:pullRequests.compareChangesCreateDescription`,
                'Open pull request that is ready for review.'
              )
            },
            {
              value: PR_TYPE.DRAFT,
              label: t(`views:pullRequests.compareChangesDraftTitle`, 'Create draft pull request'),
              description: t(
                `views:pullRequests.compareChangesDraftDescription`,
                'Does not request code reviews and cannot be merged.'
              )
            }
          ]}
        >
          {t(
            `views:pullRequests.compareChanges${prType}Button${isLoading ? 'Loading' : ''}`,
            `${prType}${isLoading ? 'ing' : ''} pull request${isLoading ? '...' : ''}`
          )}
        </SplitButton>
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
