import { FC, useCallback, useState } from 'react'
import { FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form'

import {
  Button,
  ButtonLayout,
  Checkbox,
  ControlGroup,
  Drawer,
  FormInput,
  IconV2,
  Label,
  Layout,
  ResetTag,
  ScopeTag,
  SearchInput,
  Skeleton,
  SplitButton,
  Table,
  Text
} from '@/components'
import { determineScope, getScopedPath } from '@/components/scope/utils'
import { useTranslation } from '@/context'
import {
  PatternsButtonType,
  RepoBranchSettingsFormFields,
  RepoRepositoryOutput,
  ScopeType,
  TargetReposButtonType
} from '@/views'
import { RepoTagSettingsFormFields } from '@/views/repo/repo-tag-rules/types'
import { RepoQueryObject } from '@views/repo/utils'

// Base interface with fields that TargetRepoSelector uses
export interface TargetRepoSelectorFormFields {
  repoPattern: string
  repoPatterns: { pattern: string; option: PatternsButtonType }[]
  targetRepos?: { type: TargetReposButtonType; id: number; info?: RuleRepoInfo }[]
}

export interface RuleRepoInfo {
  id?: number
  parent_id?: number
  identifier?: string
  path?: string
  default_branch?: string
}

export interface SelectedRepo {
  id: number
  type: TargetReposButtonType
  info: RuleRepoInfo
}

interface TargetRepoSelectorBaseProps {
  patterns: { pattern: string; option: PatternsButtonType }[]
  targetRepos: { type: TargetReposButtonType; id: number; info?: RuleRepoInfo }[]
  repoPattern: string
  onAddPattern: (pattern: string, option: PatternsButtonType) => void
  onRemovePattern: (pattern: string) => void
  onSaveRepos: (repos: SelectedRepo[]) => void
  onRemoveRepo: (repoId: number) => void
  onRepoPatternChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  repoQueryObj?: RepoQueryObject
}

interface RepoListProps {
  repositories: RepoRepositoryOutput[]
  selectedRepos: SelectedRepo[]
  selectedRepoOption: TargetReposButtonType
  onRepoToggle: (repo: RepoRepositoryOutput, type: TargetReposButtonType) => void
}

const RepoList: FC<RepoListProps> = ({ repositories, selectedRepos, selectedRepoOption, onRepoToggle }) => {
  return (
    <Table.Body>
      {repositories.map(repo => {
        const repoScopeParams = {
          accountId: repo.path?.split('/')[0] || '',
          repoIdentifier: repo.identifier || '',
          repoPath: repo.path || ''
        }
        const scopeType = determineScope(repoScopeParams) || ScopeType.Account
        const scopedPath = getScopedPath(repoScopeParams)
        const checked = selectedRepos.some(sr => sr.id === repo.id && sr.type === selectedRepoOption)
        const disabled = selectedRepos.some(sr => sr.id === repo.id && sr.type !== selectedRepoOption)
        return (
          <Table.Row key={repo.id} onClick={() => !disabled && onRepoToggle(repo, selectedRepoOption)}>
            <Table.Cell>
              <Checkbox
                id={String(repo.id)}
                checked={checked || (disabled && 'indeterminate')}
                disabled={disabled}
                onCheckedChange={() => onRepoToggle(repo, selectedRepoOption)}
              />
            </Table.Cell>
            <Table.Cell>
              <Layout.Horizontal gap="xs" align="center" justify="between">
                <Text variant="body-normal" truncate>
                  {repo.identifier}
                </Text>
                <ScopeTag scopeType={scopeType} scopedPath={scopedPath} size="md" />
              </Layout.Horizontal>
            </Table.Cell>
          </Table.Row>
        )
      })}
    </Table.Body>
  )
}

// ============================================================================
// BASE COMPONENT (Generic Implementation)
// ============================================================================
const TargetRepoSelectorBase: FC<TargetRepoSelectorBaseProps> = ({
  patterns,
  targetRepos,
  repoPattern,
  onAddPattern,
  onRemovePattern,
  onSaveRepos,
  onRemoveRepo,
  onRepoPatternChange,
  repoQueryObj
}) => {
  const { t } = useTranslation()
  const { repositories, isFetching, query, setQuery } = repoQueryObj || {}
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedRepos, setSelectedRepos] = useState<SelectedRepo[]>([])
  const [selectedRepoOption, setSelectedRepoOption] = useState<TargetReposButtonType>(
    TargetReposButtonType.SELECT_INCLUDED
  )
  const [selectPatternOption, setSelectPatternOption] = useState<PatternsButtonType>(PatternsButtonType.INCLUDE)

  const handleAddPattern = () => {
    if (repoPattern && !patterns.some(p => p.pattern === repoPattern)) {
      onAddPattern(repoPattern, selectPatternOption)
    }
  }

  const handleRepoSelection = () => {
    setIsDrawerOpen(true)
    setSelectedRepos(targetRepos.map(repo => ({ id: repo.id, type: repo.type, info: repo.info || {} })))
  }

  const handleRepoToggle = (repoData: RepoRepositoryOutput, type: TargetReposButtonType) => {
    setSelectedRepos(prev => {
      const exists = prev.find(r => r.id === repoData.id)
      if (exists) {
        return prev.filter(r => r.id !== repoData.id)
      } else {
        return [...prev, { id: repoData.id || -1, type, info: repoData }]
      }
    })
  }

  const handleSaveRepos = () => {
    onSaveRepos(selectedRepos)
    setIsDrawerOpen(false)
  }

  const handleSearch = useCallback(
    (query: string) => {
      setQuery?.(query.length ? query : null)
    },
    [setQuery]
  )

  return (
    <Layout.Grid gapY="md">
      <ControlGroup>
        <Label htmlFor="target-repos">{t('views:repos.targetRepositories', 'Target Repositories')}</Label>
        <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <Text variant="caption-light" className="text-cn-text-secondary pt-cn-sm">
            {t('views:repos.repositories', 'Repositories')}
          </Text>
          <Drawer.Trigger>
            <SplitButton<TargetReposButtonType>
              handleButtonClick={handleRepoSelection}
              selectedValue={selectedRepoOption}
              handleOptionChange={setSelectedRepoOption}
              options={[
                {
                  value: TargetReposButtonType.SELECT_INCLUDED,
                  label: t(`views:repos.selectIncluded`, 'Select included')
                },
                {
                  value: TargetReposButtonType.SELECT_EXCLUDED,
                  label: t(`views:repos.selectExcluded`, 'Select excluded')
                }
              ]}
            >
              <IconV2
                name={selectedRepoOption === TargetReposButtonType.SELECT_INCLUDED ? 'plus-circle' : 'xmark-circle'}
              />
              {selectedRepoOption === TargetReposButtonType.SELECT_INCLUDED
                ? t('views:repos.selectIncluded', 'Select included')
                : t('views:repos.selectExcluded', 'Select excluded')}
            </SplitButton>
          </Drawer.Trigger>

          <Drawer.Content size="md">
            <Drawer.Header icon="repository">
              <Drawer.Title>
                {t('views:repos.selectReposTitle', '{{type}} repositories', {
                  type: selectedRepoOption === TargetReposButtonType.SELECT_INCLUDED ? 'Included' : 'Excluded'
                })}
              </Drawer.Title>
              <Drawer.Description>
                {t('views:repos.selectReposDescription', 'Choose repositories to {{action}} from this rule', {
                  action: selectedRepoOption === TargetReposButtonType.SELECT_INCLUDED ? 'include' : 'exclude'
                })}
              </Drawer.Description>
              <SearchInput placeholder="Search repositories..." defaultValue={query || ''} onChange={handleSearch} />
            </Drawer.Header>

            <Drawer.Body>
              {isFetching ? (
                <Skeleton.List linesCount={8} hasActions />
              ) : repositories && repositories.length > 0 ? (
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.Head></Table.Head>
                      <Table.Head>{t('views:repos.repository', 'Repository')}</Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <RepoList
                    repositories={repositories}
                    selectedRepos={selectedRepos}
                    selectedRepoOption={selectedRepoOption}
                    onRepoToggle={handleRepoToggle}
                  />
                </Table.Root>
              ) : (
                <Text className="text-cn-text-secondary">
                  {t('views:repos.noRepositoriesAvailable', 'No repositories available')}
                </Text>
              )}
            </Drawer.Body>

            <Drawer.Footer>
              <ButtonLayout.Root>
                <ButtonLayout.Primary>
                  <Button onClick={handleSaveRepos}>{t('views:repos.saveSelection', 'Save Selection')}</Button>
                </ButtonLayout.Primary>
                <ButtonLayout.Secondary>
                  <Drawer.Close asChild>
                    <Button variant="outline">{t('views:repos.cancel', 'Cancel')}</Button>
                  </Drawer.Close>
                </ButtonLayout.Secondary>
              </ButtonLayout.Root>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Root>

        <Text variant="caption-light" className="text-cn-text-secondary">
          {t('views:repos.noReposSelectedAppliesAll', 'If no repositories are selected, the rule applies to all')}
        </Text>

        {!!targetRepos.length && (
          <Layout.Flex wrap="wrap" gap="xs">
            {targetRepos.map(({ id, type, info }) => (
              <ResetTag
                key={id}
                value={info?.identifier || ''}
                onReset={() => onRemoveRepo(id)}
                icon={type === TargetReposButtonType.SELECT_INCLUDED ? 'plus-circle' : 'xmark-circle'}
                iconProps={{
                  className: type === TargetReposButtonType.SELECT_INCLUDED ? '!text-cn-success' : '!text-cn-danger'
                }}
              />
            ))}
          </Layout.Flex>
        )}

        <Text variant="caption-light" className="text-cn-text-secondary pt-cn-sm">
          {t('views:repos.patterns', 'Patterns')}
        </Text>
        <Layout.Grid columns="1fr auto" className="grid grid-cols-[1fr_126px] items-start gap-x-3.5">
          <FormInput.Text
            id="repoPattern"
            name="repoPattern"
            value={repoPattern}
            onChange={onRepoPatternChange}
            caption={t(
              'views:repos.targetReposCaption',
              'Match repositories using globstar patterns (e.g."repo-*", "prod/**")'
            )}
            placeholder={t('views:repos.targetReposPlaceholder', 'Enter the target repository patterns')}
          />
          <SplitButton<PatternsButtonType>
            handleButtonClick={handleAddPattern}
            selectedValue={selectPatternOption}
            handleOptionChange={setSelectPatternOption}
            options={[
              {
                value: PatternsButtonType.INCLUDE,
                label: t(`views:repos.include`, 'Include')
              },
              {
                value: PatternsButtonType.EXCLUDE,
                label: t(`views:repos.exclude`, 'Exclude')
              }
            ]}
          >
            <IconV2 name={selectPatternOption === PatternsButtonType.INCLUDE ? 'plus-circle' : 'xmark-circle'} />
            {t(`views:repos.${selectPatternOption.toLowerCase()}`, `${selectPatternOption}`)}
          </SplitButton>
        </Layout.Grid>
      </ControlGroup>

      {!!patterns.length && (
        <Layout.Flex wrap="wrap" gap="xs">
          {patterns.map(({ pattern, option }) => (
            <ResetTag
              key={pattern}
              value={pattern}
              onReset={() => onRemovePattern(pattern)}
              icon={option === PatternsButtonType.INCLUDE ? 'plus-circle' : 'xmark-circle'}
              iconProps={{
                className: option === PatternsButtonType.INCLUDE ? '!text-cn-success' : '!text-cn-danger'
              }}
            />
          ))}
        </Layout.Flex>
      )}
    </Layout.Grid>
  )
}

// ============================================================================
// BRANCH RULES WRAPPER
// ============================================================================
interface TargetRepoSelectorForBranchProps {
  errors?: FieldErrors<RepoBranchSettingsFormFields>
  watch: UseFormWatch<RepoBranchSettingsFormFields>
  setValue: UseFormSetValue<RepoBranchSettingsFormFields>
  repoQueryObj?: RepoQueryObject
}

export const TargetRepoSelectorForBranch: FC<TargetRepoSelectorForBranchProps> = ({
  watch,
  setValue,
  repoQueryObj
}) => {
  const patterns = watch('repoPatterns') || []
  const targetRepos = watch('targetRepos') || []
  const repoPattern = watch('repoPattern') || ''

  const handleAddPattern = (pattern: string, option: PatternsButtonType) => {
    setValue('repoPatterns', [...patterns, { pattern, option }])
    setValue('repoPattern', '')
  }

  const handleRemovePattern = (patternVal: string) => {
    const updatedPatterns = patterns.filter(({ pattern }) => pattern !== patternVal)
    setValue('repoPatterns', updatedPatterns)
  }

  const handleSaveRepos = (selectedRepos: SelectedRepo[]) => {
    setValue('targetRepos', selectedRepos)
  }

  const handleRemoveRepo = (repoId: number) => {
    const updated = targetRepos.filter(repo => repo.id !== repoId)
    setValue('targetRepos', updated)
  }

  return (
    <TargetRepoSelectorBase
      patterns={patterns}
      targetRepos={targetRepos}
      repoPattern={repoPattern}
      onAddPattern={handleAddPattern}
      onRemovePattern={handleRemovePattern}
      onSaveRepos={handleSaveRepos}
      onRemoveRepo={handleRemoveRepo}
      onRepoPatternChange={e => setValue('repoPattern', e.target.value)}
      repoQueryObj={repoQueryObj}
    />
  )
}

// ============================================================================
// TAG RULES WRAPPER
// ============================================================================
interface TargetRepoSelectorForTagProps {
  errors?: FieldErrors<RepoTagSettingsFormFields>
  watch: UseFormWatch<RepoTagSettingsFormFields>
  setValue: UseFormSetValue<RepoTagSettingsFormFields>
  repoQueryObj?: RepoQueryObject
}

export const TargetRepoSelectorForTag: FC<TargetRepoSelectorForTagProps> = ({ watch, setValue, repoQueryObj }) => {
  const patterns = watch('repoPatterns') || []
  const targetRepos = watch('targetRepos') || []
  const repoPattern = watch('repoPattern') || ''

  const handleAddPattern = (pattern: string, option: PatternsButtonType) => {
    setValue('repoPatterns', [...patterns, { pattern, option }])
    setValue('repoPattern', '')
  }

  const handleRemovePattern = (patternVal: string) => {
    const updatedPatterns = patterns.filter(({ pattern }) => pattern !== patternVal)
    setValue('repoPatterns', updatedPatterns)
  }

  const handleSaveRepos = (selectedRepos: SelectedRepo[]) => {
    setValue('targetRepos', selectedRepos)
  }

  const handleRemoveRepo = (repoId: number) => {
    const updated = targetRepos.filter(repo => repo.id !== repoId)
    setValue('targetRepos', updated)
  }

  return (
    <TargetRepoSelectorBase
      patterns={patterns}
      targetRepos={targetRepos}
      repoPattern={repoPattern}
      onAddPattern={handleAddPattern}
      onRemovePattern={handleRemovePattern}
      onSaveRepos={handleSaveRepos}
      onRemoveRepo={handleRemoveRepo}
      onRepoPatternChange={e => setValue('repoPattern', e.target.value)}
      repoQueryObj={repoQueryObj}
    />
  )
}

// ============================================================================
// BACKWARD COMPATIBILITY (Default Export)
// ============================================================================
// Export the tag version as default for backward compatibility
export const TargetRepoSelector = TargetRepoSelectorForTag
