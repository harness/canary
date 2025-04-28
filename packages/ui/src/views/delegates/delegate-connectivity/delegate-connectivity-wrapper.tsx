import { DelegateItem, SandboxLayout, TranslationStore } from '@/views'
import { DelegateConnectivityList } from './delegate-connectivity-list';

interface DelegateConnectivityWrapperProps {
  useTranslationStore: () => TranslationStore;
  delegates: DelegateItem[];
  isDelegateSelected: (selectors: string[], tags: string[]) => boolean;
}

const DelegateConnectivityWrapper = ({ delegates, useTranslationStore, isDelegateSelected }: DelegateConnectivityWrapperProps): JSX.Element => {
  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        <DelegateConnectivityList
          delegates={delegates}
          useTranslationStore={useTranslationStore}
          isLoading={false}
          selectedTags={[]}
          isDelegateSelected={isDelegateSelected}
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  );
}

export { DelegateConnectivityWrapper }
