import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button, Icon, Input, Text } from '@harnessio/canary'
import { CopyButton } from '@harnessio/ui/components'

import { FormFieldSet } from '../../index'

const cloneRepoFormSchema = z.object({
  httpsUrl: z.string(),
  sshUrl: z.string()
})

export type CloneRepoFormType = z.infer<typeof cloneRepoFormSchema>

export interface CloneRepoFormProps {
  httpsUrl: string
  sshUrl: string
  handleCreateToken: () => void
  currentTab: string
}

export const CloneRepoForm: React.FC<CloneRepoFormProps> = ({ httpsUrl, sshUrl, currentTab, handleCreateToken }) => {
  const {
    register,
    formState: { errors }
  } = useForm<CloneRepoFormType>({
    resolver: zodResolver(cloneRepoFormSchema),
    mode: 'onChange',
    defaultValues: {
      httpsUrl: httpsUrl,
      sshUrl: sshUrl
    }
  })

  return (
    <>
      <form>
        {/* NAME */}
        <FormFieldSet.Root className="mb-0">
          <FormFieldSet.ControlGroup>
            {currentTab === 'https' ? (
              <>
                <Input
                  id="httpsUrl"
                  {...register('httpsUrl')}
                  readOnly
                  value={httpsUrl}
                  className="text-tertiary-background"
                  right={<CopyButton name={httpsUrl} />}
                />
                <Button variant="default" type="button" onClick={handleCreateToken}>
                  Generate Clone Credential
                </Button>
                <div className="flex items-center">
                  <Icon name="info-circle" size={15} className="text-tertiary-background" />
                  <Text size={1} className="text-tertiary-background ml-1">
                    Please generate a clone credential if its your first time.
                  </Text>
                </div>
              </>
            ) : (
              <Input
                id="sshUrl"
                {...register('sshUrl')}
                readOnly
                value={sshUrl}
                className="text-tertiary-background"
                right={<CopyButton name={sshUrl} />}
              />
            )}

            {currentTab === 'https' && errors.httpsUrl && (
              <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
                {errors.httpsUrl.message?.toString()}
              </FormFieldSet.Message>
            )}
            {currentTab === 'ssh' && errors.sshUrl && (
              <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
                {errors.sshUrl.message?.toString()}
              </FormFieldSet.Message>
            )}
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>
      </form>
    </>
  )
}
