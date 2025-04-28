import { DelegateConnectivityWrapper as DelegateConnectivityWrapperComponent } from '@harnessio/ui/views'
import { useTranslationStore } from '@utils/viewUtils.ts'
import { useDelegateData } from '@subjects/views/delegates/hooks'
import { isDelegateSelected } from '@subjects/views/delegates/utils.ts'

const DelegateConnectivityWrapper = (): JSX.Element => {
  const delegates = useDelegateData();

  return (
    <DelegateConnectivityWrapperComponent
      useTranslationStore={useTranslationStore}
      delegates={delegates}
      isDelegateSelected={isDelegateSelected}
    />
  );
};

export { DelegateConnectivityWrapper }
